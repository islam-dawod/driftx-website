<?php
/**
 * DRIFTX AI Marketing — one-time setup.
 *   1. checks the environment
 *   2. creates the tables from schema.sql
 *   3. creates the first admin user (you type the password here; it is stored
 *      only as a bcrypt hash and is never logged)
 *
 * Set 'setup_enabled' => false in the config when you are done.
 */
declare(strict_types=1);
require __DIR__ . '/lib/boot.php';
require __DIR__ . '/lib/auth.php';

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

$enabled = (bool) dx_cfg('app.setup_enabled', false);
$msgs = [];
$err = [];

function h(?string $s): string { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

/* environment */
$env = [
  'PHP ' . PHP_VERSION => version_compare(PHP_VERSION, '7.4', '>='),
  'pdo_mysql' => extension_loaded('pdo_mysql'),
  'curl' => extension_loaded('curl'),
  'openssl' => extension_loaded('openssl'),
  'config file found' => dx_configured(),
  'setup enabled' => $enabled,
];
$dbOk = false;
$tablesOk = false;
$userCount = 0;
if (dx_configured() && extension_loaded('pdo_mysql')) {
  try {
    dx_db();
    $dbOk = true;
    $t = dx_one("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'");
    $tablesOk = ((int) ($t['n'] ?? 0)) > 0;
    if ($tablesOk) {
      $u = dx_one('SELECT COUNT(*) AS n FROM users');
      $userCount = (int) ($u['n'] ?? 0);
    }
  } catch (Throwable $e) {
    $err[] = 'Database connection failed: ' . $e->getMessage();
  }
}
$env['database reachable'] = $dbOk;

/* actions */
$action = $_POST['action'] ?? '';
if ($action !== '' && !$enabled) {
  $err[] = 'Setup is disabled in the configuration.';
} elseif ($action === 'migrate' && $dbOk) {
  try {
    $sql = (string) file_get_contents(__DIR__ . '/schema.sql');
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
      if ($stmt === '' || str_starts_with($stmt, '--')) continue;
      dx_db()->exec($stmt);
    }
    /* columns added after the first release — MySQL has no ADD COLUMN IF NOT EXISTS */
    $addCol = function (string $table, string $col, string $ddl) use (&$msgs) {
      $r = dx_one(
        'SELECT COUNT(*) AS n FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?',
        [$table, $col]
      );
      if ((int) ($r['n'] ?? 0) === 0) {
        dx_db()->exec('ALTER TABLE `' . $table . '` ADD COLUMN ' . $ddl);
        $msgs[] = 'Added column ' . $table . '.' . $col;
      }
    };
    $addCol('ad_accounts', 'project_id', '`project_id` INT UNSIGNED NULL, ADD KEY `k_acc_proj` (`project_id`)');
    $addCol('sync_log', 'project_id', '`project_id` INT UNSIGNED NULL');
    $msgs[] = 'Tables created or already present.';
    $tablesOk = true;
  } catch (Throwable $e) {
    $err[] = 'Migration failed: ' . $e->getMessage();
  }
} elseif ($action === 'admin' && $dbOk && $tablesOk) {
  $email = strtolower(trim((string) ($_POST['email'] ?? '')));
  $pass = (string) ($_POST['password'] ?? '');
  $pass2 = (string) ($_POST['password2'] ?? '');
  $name = trim((string) ($_POST['name'] ?? ''));
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $err[] = 'Enter a valid email address.';
  elseif (strlen($pass) < 10) $err[] = 'Use a password of at least 10 characters.';
  elseif ($pass !== $pass2) $err[] = 'The two passwords do not match.';
  else {
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    dx_q(
      'INSERT INTO users (email, pass_hash, name, role, created_at) VALUES (?, ?, ?, \'admin\', ?)
       ON DUPLICATE KEY UPDATE pass_hash = VALUES(pass_hash), name = VALUES(name)',
      [$email, $hash, $name !== '' ? $name : null, dx_now()]
    );
    $msgs[] = 'Admin user saved: ' . $email . '. Sign in at /ai-marketing/app/';
    $u = dx_one('SELECT COUNT(*) AS n FROM users');
    $userCount = (int) ($u['n'] ?? 0);
  }
}
?><!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DriftX AI Marketing — setup</title>
<style>
  body { font: 15px/1.6 -apple-system, "Segoe UI", Roboto, sans-serif; background: #0A0E1A; color: #EEF2FA; margin: 0; padding: 30px 18px; }
  .box { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 4px; } h2 { font-size: 16px; margin: 26px 0 10px; }
  .card { background: #121829; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
  table { width: 100%; border-collapse: collapse; } td { padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,.07); font-size: 14px; }
  .ok { color: #A3E635; } .bad { color: #FF6B5B; }
  label { display: block; font-size: 12px; color: #7C87A1; margin: 10px 0 4px; }
  input { width: 100%; padding: 9px 11px; border-radius: 9px; border: 1px solid rgba(255,255,255,.14); background: #0F1422; color: #EEF2FA; font: inherit; box-sizing: border-box; }
  button { margin-top: 14px; padding: 9px 16px; border-radius: 9px; border: 0; background: linear-gradient(100deg,#8B5CF6,#6D3EE8); color: #fff; font-weight: 700; cursor: pointer; }
  .msg { border-radius: 10px; padding: 10px 13px; margin-bottom: 10px; font-size: 14px; }
  .msg.g { background: rgba(163,230,53,.12); color: #A3E635; } .msg.r { background: rgba(255,107,91,.12); color: #FF6B5B; }
  code { background: rgba(255,255,255,.07); padding: 1px 5px; border-radius: 4px; font-size: 13px; }
  a { color: #22D3EE; }
</style></head><body><div class="box">
<h1>DriftX AI Marketing — setup</h1>
<p style="color:#7C87A1;margin:0 0 18px">Environment check, database migration, first admin user.</p>

<?php foreach ($msgs as $m): ?><div class="msg g"><?= h($m) ?></div><?php endforeach; ?>
<?php foreach ($err as $m): ?><div class="msg r"><?= h($m) ?></div><?php endforeach; ?>

<div class="card"><h2 style="margin-top:0">1 · Environment</h2><table>
<?php foreach ($env as $k => $v): ?>
  <tr><td><?= h((string) $k) ?></td><td style="text-align:right" class="<?= $v ? 'ok' : 'bad' ?>"><?= $v ? 'OK' : 'missing' ?></td></tr>
<?php endforeach; ?>
</table>
<?php if (!dx_configured()): ?>
  <p class="bad" style="font-size:14px">Copy <code>api/config.sample.php</code> to <code>api/config.php</code> on the server and fill in the database section.</p>
<?php endif; ?>
</div>

<div class="card"><h2 style="margin-top:0">2 · Database</h2>
<p style="font-size:14px;color:#7C87A1">Tables: <span class="<?= $tablesOk ? 'ok' : 'bad' ?>"><?= $tablesOk ? 'present' : 'not created' ?></span> · users: <?= (int) $userCount ?></p>
<?php if ($dbOk && $enabled): ?>
  <form method="post"><input type="hidden" name="action" value="migrate"><button type="submit">Create / update tables</button></form>
<?php endif; ?>
</div>

<div class="card"><h2 style="margin-top:0">3 · Admin user</h2>
<?php if ($tablesOk && $enabled): ?>
  <p style="font-size:14px;color:#7C87A1">The password is stored as a bcrypt hash. Nobody — including whoever built this — can read it back.</p>
  <form method="post" autocomplete="off">
    <input type="hidden" name="action" value="admin">
    <label>Name</label><input name="name" autocomplete="off">
    <label>Email</label><input name="email" type="email" required autocomplete="off">
    <label>Password (10+ characters)</label><input name="password" type="password" required autocomplete="new-password">
    <label>Repeat password</label><input name="password2" type="password" required autocomplete="new-password">
    <button type="submit">Save admin user</button>
  </form>
<?php elseif (!$tablesOk): ?>
  <p style="font-size:14px">Create the tables first.</p>
<?php endif; ?>
</div>

<div class="card"><h2 style="margin-top:0">4 · When finished</h2>
<ol style="font-size:14px;color:#AEB8CE;padding-inline-start:20px">
  <li>Set <code>'setup_enabled' =&gt; false</code> in the config.</li>
  <li>Connect Google Ads: open <a href="/api/oauth/google/start">/api/oauth/google/start</a> while signed in.</li>
  <li>Run a first sync: <code>/api/sync?provider=all</code> (signed in), or via the scheduled task.</li>
  <li>Open the system: <a href="/ai-marketing/app/">/ai-marketing/app/</a></li>
</ol>
</div>
</div></body></html>
