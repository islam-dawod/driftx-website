<?php
/** DRIFTX AI Marketing — config loading, DB, JSON output, HTTP client. */
declare(strict_types=1);

const DX_ROOT = __DIR__ . '/..';

/* ---------------- config ---------------- */
function dx_config(): array {
  static $cfg = null;
  if ($cfg !== null) return $cfg;
  $candidates = [
    getenv('DRIFTX_CONFIG') ?: '',
    DX_ROOT . '/../../private/driftx-config.php',   /* outside the document root */
    DX_ROOT . '/config.php',
  ];
  foreach ($candidates as $p) {
    if ($p !== '' && is_file($p)) {
      $c = require $p;
      if (is_array($c)) { $cfg = $c; return $cfg; }
    }
  }
  $cfg = [];
  return $cfg;
}
function dx_cfg(string $path, $default = null) {
  $node = dx_config();
  foreach (explode('.', $path) as $k) {
    if (!is_array($node) || !array_key_exists($k, $node)) return $default;
    $node = $node[$k];
  }
  return $node;
}
function dx_configured(): bool {
  return dx_cfg('db.name', 'CHANGE_ME_db') !== 'CHANGE_ME_db' && dx_cfg('db.name') !== null;
}

/* ---------------- database ---------------- */
function dx_db(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;
  $host = (string) dx_cfg('db.host', 'localhost');
  $name = (string) dx_cfg('db.name', '');
  $user = (string) dx_cfg('db.user', '');
  $pass = (string) dx_cfg('db.pass', '');
  $cs   = (string) dx_cfg('db.charset', 'utf8mb4');
  $dsn = "mysql:host={$host};dbname={$name};charset={$cs}";
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  return $pdo;
}
function dx_q(string $sql, array $args = []): PDOStatement {
  $st = dx_db()->prepare($sql);
  $st->execute($args);
  return $st;
}
function dx_one(string $sql, array $args = []) {
  $r = dx_q($sql, $args)->fetch();
  return $r === false ? null : $r;
}
function dx_all(string $sql, array $args = []): array {
  return dx_q($sql, $args)->fetchAll();
}
function dx_now(): string { return gmdate('Y-m-d H:i:s'); }

/* app_state helpers */
function dx_state_get(string $k, $default = null) {
  $r = dx_one('SELECT v FROM app_state WHERE k = ?', [$k]);
  if (!$r) return $default;
  $v = json_decode((string) $r['v'], true);
  return $v === null ? $default : $v;
}
function dx_state_set(string $k, $v, ?int $userId = null): void {
  dx_q(
    'INSERT INTO app_state (k, v, updated_at, updated_by) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE v = VALUES(v), updated_at = VALUES(updated_at), updated_by = VALUES(updated_by)',
    [$k, json_encode($v, JSON_UNESCAPED_UNICODE), dx_now(), $userId]
  );
}

/* ---------------- output ---------------- */
function dx_json($data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: same-origin');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function dx_fail(string $msg, int $code = 400, array $extra = []): void {
  dx_json(array_merge(['ok' => false, 'error' => $msg], $extra), $code);
}
function dx_body(): array {
  $raw = file_get_contents('php://input');
  if ($raw === false || $raw === '') return [];
  $j = json_decode($raw, true);
  return is_array($j) ? $j : [];
}

/* ---------------- HTTP client ---------------- */
function dx_http(string $method, string $url, array $opts = []): array {
  $ch = curl_init();
  $headers = $opts['headers'] ?? [];
  $body = $opts['body'] ?? null;
  if (is_array($body)) {
    $body = json_encode($body, JSON_UNESCAPED_UNICODE);
    $headers[] = 'Content-Type: application/json';
  }
  curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => (int) ($opts['timeout'] ?? 45),
    CURLOPT_CONNECTTIMEOUT => 12,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_USERAGENT => 'DriftX-AI-Marketing/1.0 (+https://driftx.co)',
    CURLOPT_HTTPHEADER => $headers,
  ]);
  if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  $raw = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($raw === false) return ['code' => 0, 'json' => null, 'raw' => '', 'error' => $err ?: 'curl failed'];
  $json = json_decode((string) $raw, true);
  return ['code' => $code, 'json' => is_array($json) ? $json : null, 'raw' => (string) $raw, 'error' => null];
}

/* pulls the human-readable message out of a Google/Meta error payload */
function dx_api_error(array $res): string {
  $j = $res['json'];
  if (is_array($j)) {
    if (isset($j['error']['message'])) return (string) $j['error']['message'];
    if (isset($j['error']['error_user_msg'])) return (string) $j['error']['error_user_msg'];
    if (isset($j[0]['error']['message'])) return (string) $j[0]['error']['message'];
    if (isset($j['error_description'])) return (string) $j['error_description'];
  }
  $raw = trim((string) ($res['raw'] ?? ''));
  if ($raw !== '') return mb_substr($raw, 0, 400);
  return $res['error'] ?? ('HTTP ' . $res['code']);
}

function dx_log_sync_start(string $provider): int {
  dx_q('INSERT INTO sync_log (provider, started_at) VALUES (?, ?)', [$provider, dx_now()]);
  return (int) dx_db()->lastInsertId();
}
function dx_log_sync_end(int $id, bool $ok, int $calls, int $read, int $written, ?string $error): void {
  dx_q(
    'UPDATE sync_log SET finished_at = ?, ok = ?, http_calls = ?, rows_read = ?, rows_written = ?, error = ? WHERE id = ?',
    [dx_now(), $ok ? 1 : 0, $calls, $read, $written, $error !== null ? mb_substr($error, 0, 2000) : null, $id]
  );
}
function dx_conn_get(string $provider): array {
  $r = dx_one('SELECT * FROM connections WHERE provider = ?', [$provider]);
  return $r ?: ['provider' => $provider, 'status' => 'off', 'refresh_tok' => null, 'access_tok' => null,
    'tok_expires' => null, 'api_version' => null, 'last_sync_at' => null, 'last_error' => null];
}
function dx_conn_set(string $provider, array $fields): void {
  $conn = dx_conn_get($provider);
  $merged = array_merge($conn, $fields);
  dx_q(
    'INSERT INTO connections (provider, status, refresh_tok, access_tok, tok_expires, api_version, last_sync_at, last_error, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), refresh_tok = VALUES(refresh_tok), access_tok = VALUES(access_tok),
       tok_expires = VALUES(tok_expires), api_version = VALUES(api_version), last_sync_at = VALUES(last_sync_at),
       last_error = VALUES(last_error), updated_at = VALUES(updated_at)',
    [$provider, $merged['status'], $merged['refresh_tok'], $merged['access_tok'], $merged['tok_expires'],
     $merged['api_version'], $merged['last_sync_at'], $merged['last_error'] !== null ? mb_substr((string) $merged['last_error'], 0, 2000) : null, dx_now()]
  );
}
