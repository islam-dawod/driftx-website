<?php
/** DRIFTX AI Marketing — API entry point. All endpoints live under /api/. */
declare(strict_types=1);

require __DIR__ . '/lib/boot.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/meta.php';
require __DIR__ . '/lib/google.php';
require __DIR__ . '/lib/projects.php';
require __DIR__ . '/lib/sync.php';

/* ---------------- routing ---------------- */
$uri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
$path = parse_url($uri, PHP_URL_PATH) ?: '/';
$route = preg_replace('#^.*?/api/?#', '', $path);
$route = trim((string) $route, '/');
if ($route === '' || $route === 'index.php') $route = 'health';
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

/* same-origin only: this API is consumed by /ai-marketing/app/ on this domain */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
  $host = $_SERVER['HTTP_HOST'] ?? '';
  $allowed = ['https://' . $host, 'http://' . $host];
  if (!in_array($origin, $allowed, true)) dx_fail('cross_origin_blocked', 403);
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Access-Control-Allow-Credentials: true');
}
if ($method === 'OPTIONS') { http_response_code(204); exit; }

/* ---------------- health (works before the DB exists) ---------------- */
if ($route === 'health') {
  $out = [
    'ok' => true,
    'php' => PHP_VERSION,
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'curl' => extension_loaded('curl'),
    'configured' => dx_configured(),
    'db' => false,
    'tables' => false,
    'users' => 0,
    'setup_enabled' => (bool) dx_cfg('app.setup_enabled', false),
    'projects' => 0,
    'providers' => [
      'meta' => ['configured' => (bool) dx_cfg('meta.enabled', false), 'accounts' => count((array) dx_cfg('meta.ad_accounts', []))],
      'google' => ['configured' => (bool) dx_cfg('google.enabled', false), 'customer' => dx_cfg('google.customer_id', '') !== ''],
    ],
  ];
  if ($out['configured'] && $out['pdo_mysql']) {
    try {
      dx_db();
      $out['db'] = true;
      $t = dx_one("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'");
      $out['tables'] = ((int) ($t['n'] ?? 0)) > 0;
      if ($out['tables']) {
        $u = dx_one('SELECT COUNT(*) AS n FROM users');
        $out['users'] = (int) ($u['n'] ?? 0);
        $out['authenticated'] = dx_session_user() !== null;
        $pr = dx_one("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'projects'");
        if ((int) ($pr['n'] ?? 0) > 0) {
          $pc = dx_one('SELECT COUNT(*) AS n FROM projects WHERE enabled = 1');
          $out['projects'] = (int) ($pc['n'] ?? 0);
        } else {
          $out['migration_needed'] = true;
        }
      }
    } catch (Throwable $e) {
      $out['db_error'] = $e->getMessage();
    }
  }
  dx_json($out);
}

/* everything past this point needs a working database */
if (!dx_configured()) dx_fail('not_configured', 503, ['hint' => 'copy api/config.sample.php to api/config.php on the server']);
try { dx_db(); } catch (Throwable $e) { dx_fail('db_unavailable', 503, ['detail' => $e->getMessage()]); }

/* which project the request is about: explicit, else the first enabled one */
function dx_req_project(): ?int {
  $q = $_GET['project'] ?? null;
  if ($q !== null && $q !== '' && ctype_digit((string) $q)) {
    $p = dx_project((int) $q);
    if ($p) return (int) $p['id'];
  }
  return dx_default_project_id();
}

/* ---------------- auth ---------------- */
if ($route === 'auth/login' && $method === 'POST') {
  $b = dx_body();
  $r = dx_login((string) ($b['email'] ?? ''), (string) ($b['password'] ?? ''));
  if (!$r['ok']) dx_fail((string) $r['error'], 401);
  dx_gc_sessions();
  dx_json(['ok' => true, 'user' => $r['user']]);
}
if ($route === 'auth/logout' && $method === 'POST') { dx_logout(); dx_json(['ok' => true]); }
if ($route === 'auth/me') {
  $u = dx_session_user();
  dx_json(['ok' => true, 'user' => $u]);
}

/* ---------------- shared application state ---------------- */
if ($route === 'state' && $method === 'GET') {
  dx_require_user();
  $pid = dx_req_project();
  dx_json(['ok' => true, 'projectId' => $pid, 'state' => dx_state_get(dx_state_key($pid), new stdClass())]);
}
if ($route === 'state' && ($method === 'PUT' || $method === 'POST')) {
  $u = dx_require_user();
  $b = dx_body();
  if (!isset($b['state']) || !is_array($b['state'])) dx_fail('state_required');
  $pid = dx_req_project();
  dx_state_set(dx_state_key($pid), $b['state'], (int) $u['id']);
  dx_json(['ok' => true, 'projectId' => $pid, 'savedAt' => dx_now()]);
}

/* ---------------- data ---------------- */
if ($route === 'data') {
  dx_require_user();
  $range = (int) ($_GET['range'] ?? 30);
  $pid = dx_req_project();
  $payload = dx_data_payload($range, $pid);
  $payload['projects'] = dx_projects(false);
  dx_json($payload);
}
if ($route === 'connections') {
  dx_require_user();
  $out = [];
  foreach (['meta', 'google'] as $p) {
    $c = dx_conn_get($p);
    $out[$p] = [
      'status' => $c['status'], 'lastSync' => $c['last_sync_at'], 'error' => $c['last_error'],
      'apiVersion' => $c['api_version'], 'configured' => (bool) dx_cfg($p . '.enabled', false),
    ];
  }
  dx_json(['ok' => true, 'connections' => $out]);
}

/* ---------------- projects ---------------- */
if ($route === 'projects' && $method === 'GET') {
  dx_require_user();
  dx_json(['ok' => true, 'projects' => dx_projects(false), 'defaultId' => dx_default_project_id()]);
}
if ($route === 'projects' && $method === 'POST') {
  dx_require_user();
  $r = dx_project_create(dx_body());
  if (!$r['ok']) dx_fail((string) $r['error']);
  dx_json(['ok' => true, 'id' => $r['id'], 'projects' => dx_projects(false)]);
}
if (preg_match('#^projects/(\d+)$#', $route, $mm) && ($method === 'PUT' || $method === 'POST')) {
  dx_require_user();
  $r = dx_project_update((int) $mm[1], dx_body());
  if (!$r['ok']) dx_fail((string) $r['error'], $r['error'] === 'not_found' ? 404 : 400);
  dx_json(['ok' => true, 'projects' => dx_projects(false)]);
}
if (preg_match('#^projects/(\d+)/accounts$#', $route, $mm) && $method === 'POST') {
  dx_require_user();
  $r = dx_project_add_account((int) $mm[1], dx_body());
  if (!$r['ok']) dx_fail((string) $r['error'], $r['error'] === 'not_found' ? 404 : 400);
  dx_json(['ok' => true, 'projects' => dx_projects(false)]);
}
if (preg_match('#^projects/(\d+)/accounts/(\d+)$#', $route, $mm) && ($method === 'DELETE' || $method === 'POST')) {
  dx_require_user();
  $r = dx_project_remove_account((int) $mm[1], (int) $mm[2]);
  if (!$r['ok']) dx_fail((string) $r['error'], 404);
  dx_json(['ok' => true, 'projects' => dx_projects(false)]);
}

/* ---------------- sync ---------------- */
if ($route === 'sync' && ($method === 'POST' || $method === 'GET')) {
  dx_require_user_or_cron();
  $provider = (string) ($_GET['provider'] ?? 'all');
  if (!in_array($provider, ['all', 'meta', 'google'], true)) dx_fail('bad_provider');
  $projectParam = $_GET['project'] ?? '';
  $onlyProject = ($projectParam !== '' && ctype_digit((string) $projectParam)) ? (int) $projectParam : null;
  set_time_limit(600);
  dx_json(['ok' => true, 'reports' => dx_sync_all($provider, $onlyProject)]);
}

/* ---------------- Google OAuth ---------------- */
function dx_google_redirect_uri(): string {
  $scheme = (($_SERVER['HTTPS'] ?? '') !== '' || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') ? 'https' : 'http';
  return $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'driftx.co') . '/api/oauth/google/callback';
}
if ($route === 'oauth/google/start') {
  dx_require_user();
  if (dx_cfg('google.client_id', '') === '') dx_fail('google_client_id_missing', 400);
  $state = bin2hex(random_bytes(16));
  dx_state_set('oauth_state_google', ['state' => $state, 'at' => dx_now()]);
  header('Location: ' . dx_google_auth_url(dx_google_redirect_uri(), $state));
  exit;
}
if ($route === 'oauth/google/callback') {
  $saved = dx_state_get('oauth_state_google', []);
  $given = (string) ($_GET['state'] ?? '');
  header('Content-Type: text/html; charset=utf-8');
  if (!is_array($saved) || empty($saved['state']) || !hash_equals((string) $saved['state'], $given)) {
    echo '<h1>State mismatch</h1><p>Start again from /api/oauth/google/start while signed in.</p>'; exit;
  }
  if (!empty($_GET['error'])) { echo '<h1>Google returned an error</h1><p>' . htmlspecialchars((string) $_GET['error']) . '</p>'; exit; }
  $code = (string) ($_GET['code'] ?? '');
  if ($code === '') { echo '<h1>No code returned</h1>'; exit; }
  $ex = dx_google_exchange_code($code, dx_google_redirect_uri());
  if (!$ex['ok']) { echo '<h1>Token exchange failed</h1><pre>' . htmlspecialchars((string) $ex['error']) . '</pre>'; exit; }
  $refresh = (string) ($ex['data']['refresh_token'] ?? '');
  if ($refresh === '') {
    echo '<h1>No refresh token</h1><p>Google only returns one on first consent. Remove the app at '
      . 'myaccount.google.com/permissions and try again.</p>'; exit;
  }
  dx_conn_set('google', ['status' => 'on', 'refresh_tok' => $refresh, 'last_error' => null]);
  dx_state_set('oauth_state_google', []);
  echo '<h1>Google Ads connected</h1><p>The refresh token is stored in the database. '
    . 'You can close this tab and run a sync from Settings.</p>'
    . '<p><a href="/ai-marketing/app/#/settings">Back to the system</a></p>';
  exit;
}

dx_fail('unknown_route: ' . $route, 404);
