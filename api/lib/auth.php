<?php
/** DRIFTX AI Marketing — sessions. Cookie-based, hashed passwords, throttled. */
declare(strict_types=1);

const DX_COOKIE = 'dx_sess';

function dx_client_ip(): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? '';
  return is_string($ip) ? substr($ip, 0, 45) : '';
}
function dx_ua(): string {
  $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
  return is_string($ua) ? substr($ua, 0, 255) : '';
}

function dx_session_user(): ?array {
  $tok = $_COOKIE[DX_COOKIE] ?? '';
  if (!is_string($tok) || strlen($tok) !== 64) return null;
  $row = dx_one(
    'SELECT u.id, u.email, u.name, u.role FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > ?',
    [$tok, dx_now()]
  );
  return $row ?: null;
}

function dx_require_user(): array {
  $u = dx_session_user();
  if (!$u) dx_fail('not_authenticated', 401);
  return $u;
}

/** Cron and CLI may act without a session, using the configured token. */
function dx_require_user_or_cron(): ?array {
  if (PHP_SAPI === 'cli') return null;
  $given = $_GET['token'] ?? ($_SERVER['HTTP_X_DRIFTX_TOKEN'] ?? '');
  $want = (string) dx_cfg('app.cron_token', '');
  if (is_string($given) && $want !== '' && $want !== 'CHANGE_ME_another_random_hex' && hash_equals($want, $given)) {
    return null;
  }
  return dx_require_user();
}

function dx_recent_failures(string $email, string $ip): int {
  $since = gmdate('Y-m-d H:i:s', time() - 900);
  $r = dx_one(
    'SELECT COUNT(*) AS n FROM login_attempts WHERE ok = 0 AND at > ? AND (email = ? OR ip = ?)',
    [$since, $email, $ip]
  );
  return (int) ($r['n'] ?? 0);
}

function dx_login(string $email, string $password): array {
  $email = strtolower(trim($email));
  $ip = dx_client_ip();
  if ($email === '' || $password === '') return ['ok' => false, 'error' => 'missing_credentials'];
  if (dx_recent_failures($email, $ip) >= 8) return ['ok' => false, 'error' => 'too_many_attempts'];

  $u = dx_one('SELECT id, email, name, role, pass_hash FROM users WHERE email = ?', [$email]);
  $ok = $u !== null && password_verify($password, (string) $u['pass_hash']);
  dx_q('INSERT INTO login_attempts (email, ip, ok, at) VALUES (?, ?, ?, ?)', [$email, $ip, $ok ? 1 : 0, dx_now()]);
  if (!$ok) return ['ok' => false, 'error' => 'invalid_credentials'];

  $tok = bin2hex(random_bytes(32));
  $days = max(1, (int) dx_cfg('app.session_days', 14));
  $exp = gmdate('Y-m-d H:i:s', time() + $days * 86400);
  dx_q('INSERT INTO sessions (token, user_id, created_at, expires_at, ip, ua) VALUES (?, ?, ?, ?, ?, ?)',
    [$tok, (int) $u['id'], dx_now(), $exp, $ip, dx_ua()]);
  dx_q('UPDATE users SET last_login_at = ? WHERE id = ?', [dx_now(), (int) $u['id']]);

  $secure = (($_SERVER['HTTPS'] ?? '') !== '') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  setcookie(DX_COOKIE, $tok, [
    'expires' => time() + $days * 86400,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
  return ['ok' => true, 'user' => ['email' => $u['email'], 'name' => $u['name'], 'role' => $u['role']]];
}

function dx_logout(): void {
  $tok = $_COOKIE[DX_COOKIE] ?? '';
  if (is_string($tok) && $tok !== '') dx_q('DELETE FROM sessions WHERE token = ?', [$tok]);
  setcookie(DX_COOKIE, '', ['expires' => time() - 3600, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
}

function dx_gc_sessions(): void {
  dx_q('DELETE FROM sessions WHERE expires_at < ?', [dx_now()]);
  dx_q('DELETE FROM login_attempts WHERE at < ?', [gmdate('Y-m-d H:i:s', time() - 7 * 86400)]);
}
