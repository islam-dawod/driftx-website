<?php
/** DRIFTX AI Marketing — projects.
 *  One project = one client / market with its own ad accounts, targets and state.
 *  Platform credentials stay global (one Meta app, one Google OAuth client and
 *  developer token); a project only maps to the account ids under them. */
declare(strict_types=1);

function dx_slug(string $s): string {
  $s = mb_strtolower(trim($s));
  $s = preg_replace('/[^a-z0-9\x{0590}-\x{05FF}\x{0600}-\x{06FF}]+/u', '-', $s) ?? '';
  $s = trim((string) $s, '-');
  return $s === '' ? ('p' . substr((string) time(), -6)) : mb_substr($s, 0, 60);
}

function dx_projects(bool $onlyEnabled = false): array {
  $rows = dx_all('SELECT * FROM projects' . ($onlyEnabled ? ' WHERE enabled = 1' : '') . ' ORDER BY name');
  $out = [];
  foreach ($rows as $p) {
    $pid = (int) $p['id'];
    $accs = dx_all('SELECT id, provider, external_id, name, country, enabled FROM project_accounts WHERE project_id = ? ORDER BY provider, external_id', [$pid]);
    $stat = dx_one(
      'SELECT COUNT(DISTINCT c.id) AS campaigns, MAX(cd.day) AS last_day, MAX(cd.synced_at) AS synced_at
       FROM ad_accounts a
       LEFT JOIN campaigns c ON c.account_id = a.id
       LEFT JOIN campaign_daily cd ON cd.campaign_id = c.id
       WHERE a.project_id = ?',
      [$pid]
    );
    $out[] = [
      'id' => $pid,
      'name' => (string) $p['name'],
      'slug' => (string) $p['slug'],
      'currency' => $p['currency'],
      'googleCustomerId' => $p['google_customer_id'],
      'googleLoginCustomerId' => $p['google_login_customer_id'],
      'enabled' => (int) $p['enabled'] === 1,
      'accounts' => array_map(function ($a) {
        return ['id' => (int) $a['id'], 'provider' => $a['provider'], 'externalId' => $a['external_id'],
          'name' => $a['name'], 'country' => $a['country'], 'enabled' => (int) $a['enabled'] === 1];
      }, $accs),
      'campaigns' => (int) ($stat['campaigns'] ?? 0),
      'lastDay' => $stat['last_day'] ?? null,
      'syncedAt' => $stat['synced_at'] ?? null,
    ];
  }
  return $out;
}

function dx_project(int $id): ?array {
  $r = dx_one('SELECT * FROM projects WHERE id = ?', [$id]);
  return $r ?: null;
}

/** First enabled project, used when the client does not name one. */
function dx_default_project_id(): ?int {
  $r = dx_one('SELECT id FROM projects WHERE enabled = 1 ORDER BY id LIMIT 1');
  return $r ? (int) $r['id'] : null;
}

function dx_project_create(array $in): array {
  $name = trim((string) ($in['name'] ?? ''));
  if ($name === '') return ['ok' => false, 'error' => 'name_required'];
  $slug = dx_slug((string) ($in['slug'] ?? $name));
  $exists = dx_one('SELECT id FROM projects WHERE slug = ?', [$slug]);
  if ($exists) $slug .= '-' . substr(bin2hex(random_bytes(2)), 0, 4);
  dx_q(
    'INSERT INTO projects (name, slug, currency, google_customer_id, google_login_customer_id, enabled, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)',
    [$name, $slug, ($in['currency'] ?? null) ?: null,
     preg_replace('/[^0-9]/', '', (string) ($in['googleCustomerId'] ?? '')) ?: null,
     preg_replace('/[^0-9]/', '', (string) ($in['googleLoginCustomerId'] ?? '')) ?: null,
     dx_now(), dx_now()]
  );
  return ['ok' => true, 'id' => (int) dx_db()->lastInsertId()];
}

function dx_project_update(int $id, array $in): array {
  $p = dx_project($id);
  if (!$p) return ['ok' => false, 'error' => 'not_found'];
  $name = array_key_exists('name', $in) ? trim((string) $in['name']) : (string) $p['name'];
  if ($name === '') return ['ok' => false, 'error' => 'name_required'];
  dx_q(
    'UPDATE projects SET name = ?, currency = ?, google_customer_id = ?, google_login_customer_id = ?, enabled = ?, updated_at = ? WHERE id = ?',
    [
      $name,
      array_key_exists('currency', $in) ? (($in['currency'] ?: null)) : $p['currency'],
      array_key_exists('googleCustomerId', $in) ? (preg_replace('/[^0-9]/', '', (string) $in['googleCustomerId']) ?: null) : $p['google_customer_id'],
      array_key_exists('googleLoginCustomerId', $in) ? (preg_replace('/[^0-9]/', '', (string) $in['googleLoginCustomerId']) ?: null) : $p['google_login_customer_id'],
      array_key_exists('enabled', $in) ? ((int) !!$in['enabled']) : (int) $p['enabled'],
      dx_now(), $id
    ]
  );
  return ['ok' => true];
}

function dx_project_add_account(int $id, array $in): array {
  if (!dx_project($id)) return ['ok' => false, 'error' => 'not_found'];
  $provider = (string) ($in['provider'] ?? '');
  if (!in_array($provider, ['meta', 'google'], true)) return ['ok' => false, 'error' => 'bad_provider'];
  $ext = preg_replace('/[^0-9]/', '', (string) ($in['externalId'] ?? '')) ?? '';
  if ($ext === '') return ['ok' => false, 'error' => 'account_id_required'];
  dx_q(
    'INSERT INTO project_accounts (project_id, provider, external_id, name, country, enabled, created_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), country = VALUES(country), enabled = 1',
    [$id, $provider, $ext, ($in['name'] ?? null) ?: null, ($in['country'] ?? null) ?: null, dx_now()]
  );
  /* keep an already-synced ad account attached to this project */
  dx_q('UPDATE ad_accounts SET project_id = ? WHERE provider = ? AND external_id = ?', [$id, $provider, $ext]);
  return ['ok' => true];
}

function dx_project_remove_account(int $id, int $rowId): array {
  $row = dx_one('SELECT provider, external_id FROM project_accounts WHERE id = ? AND project_id = ?', [$rowId, $id]);
  if (!$row) return ['ok' => false, 'error' => 'not_found'];
  dx_q('DELETE FROM project_accounts WHERE id = ?', [$rowId]);
  return ['ok' => true];
}

/** Meta accounts of a project, in the shape the connector expects. */
function dx_project_meta_accounts(int $id): array {
  $rows = dx_all('SELECT external_id, name, country FROM project_accounts WHERE project_id = ? AND provider = ? AND enabled = 1', [$id, 'meta']);
  return array_map(function ($r) {
    return ['id' => (string) $r['external_id'], 'name' => (string) ($r['name'] ?? ''), 'country' => (string) ($r['country'] ?? '')];
  }, $rows);
}

/** Google customer id for a project: the project's own, else its google account row. */
function dx_project_google(int $id): array {
  $p = dx_project($id);
  if (!$p) return ['customer' => '', 'login' => ''];
  $cid = (string) ($p['google_customer_id'] ?? '');
  if ($cid === '') {
    $row = dx_one('SELECT external_id FROM project_accounts WHERE project_id = ? AND provider = ? AND enabled = 1 LIMIT 1', [$id, 'google']);
    $cid = $row ? (string) $row['external_id'] : '';
  }
  return ['customer' => $cid, 'login' => (string) ($p['google_login_customer_id'] ?? '')];
}

/** Per-project application state key. */
function dx_state_key(?int $projectId): string {
  return $projectId ? ('app:' . $projectId) : 'app';
}
