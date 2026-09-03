<?php
/* DriftX contact form → delivers the enquiry to the inbox bound to the
   Web3Forms access key. Forwarded server-side so the key is not exposed in the
   live site's HTML/JS. Falls back to authenticated SMTP or PHP mail() if a
   contact-config.php is present. */
header('Content-Type: application/json; charset=utf-8');

$cfg   = @include __DIR__ . '/contact-config.php';
$cfg   = is_array($cfg) ? $cfg : array();

// Web3Forms key: from git-ignored config if present, else the embedded one.
$WEB3  = !empty($cfg['web3forms_key']) ? $cfg['web3forms_key'] : '477df105-458a-4096-a515-b7b62b763065';
$smtp  = (!empty($cfg['smtp']['host']) && !empty($cfg['smtp']['pass']) && $cfg['smtp']['pass'] !== 'CHANGE_ME') ? $cfg['smtp'] : null;
$to    = (!empty($cfg['smtp']['to'])) ? $cfg['smtp']['to'] : 'info@driftx.co';

/* ---- token-gated health check ---- */
if (isset($_GET['diag']) && $_GET['diag'] === 'dx-check-9f3a') {
  echo json_encode(array(
    'php'         => PHP_VERSION,
    'web3_ready'  => (bool)$WEB3,
    'smtp_ready'  => (bool)$smtp,
    'curl'        => function_exists('curl_init'),
    'allow_url'   => (bool)ini_get('allow_url_fopen'),
    'openssl'     => extension_loaded('openssl'),
  ));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(array('ok' => false, 'error' => 'method')); exit; }
if (!empty($_POST['_gotcha'])) { echo json_encode(array('ok' => true)); exit; }

function clean($s) { return trim(str_replace(array("\r", "\n"), ' ', (string)$s)); }

$name      = clean(isset($_POST['name']) ? $_POST['name'] : '');
$email     = clean(isset($_POST['email']) ? $_POST['email'] : '');
$focus     = clean(isset($_POST['focus']) ? $_POST['focus'] : '');
$lang      = clean(isset($_POST['lang']) ? $_POST['lang'] : '');
$challenge = trim(isset($_POST['challenge']) ? $_POST['challenge'] : '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(array('ok' => false, 'error' => 'invalid')); exit; }

$err = '';
$ok  = false;

if ($WEB3) {
  $ok = web3_send($WEB3, array(
    'subject'   => 'DriftX enquiry — ' . $name,
    'from_name' => 'DriftX Website',
    'name'      => $name,
    'email'     => $email,
    'focus'     => $focus !== '' ? $focus : '—',
    'language'  => $lang !== '' ? $lang : 'en',
    'message'   => $challenge !== '' ? $challenge : '(no message)',
  ), $err);
}

if (!$ok && $smtp) {
  $subject = '=?UTF-8?B?' . base64_encode('DriftX enquiry — ' . $name) . '?=';
  $body    = "Name: $name\nEmail: $email\nFocus: $focus\nLanguage: $lang\n\nChallenge:\n$challenge\n";
  $ok = smtp_send($smtp, $to, $subject, $body, $name, $email, $err);
}

if (!$ok) {
  @file_put_contents(__DIR__ . '/contact-error.log', date('c') . ' ' . $err . "\n", FILE_APPEND);
  http_response_code(502);
  echo json_encode(array('ok' => false, 'error' => 'send', 'detail' => mb_substr($err, 0, 180)));
} else {
  echo json_encode(array('ok' => true));
}

/* ---------------- Web3Forms forwarder ---------------- */
function web3_send($key, $fields, &$err) {
  $payload = json_encode(array_merge(array('access_key' => $key), $fields));
  $resp = false;
  if (function_exists('curl_init')) {
    $ch = curl_init('https://api.web3forms.com/submit');
    curl_setopt_array($ch, array(
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_HTTPHEADER => array('Content-Type: application/json', 'Accept: application/json'),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 20,
    ));
    $resp = curl_exec($ch);
    if ($resp === false) { $err = 'curl: ' . curl_error($ch); }
    curl_close($ch);
  } else {
    $ctx = stream_context_create(array('http' => array(
      'method' => 'POST',
      'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
      'content' => $payload, 'timeout' => 20, 'ignore_errors' => true,
    )));
    $resp = @file_get_contents('https://api.web3forms.com/submit', false, $ctx);
    if ($resp === false) { $err = 'http failed (allow_url_fopen off / no curl)'; }
  }
  if ($resp === false) return false;
  $d = json_decode($resp, true);
  if (is_array($d) && !empty($d['success'])) return true;
  $err = 'web3forms: ' . substr(is_string($resp) ? $resp : '', 0, 150);
  return false;
}

/* ---------------- authenticated SMTP (fallback if configured) ---------------- */
function smtp_send($c, $to, $subject, $body, $rName, $rEmail, &$err) {
  $host = $c['host']; $port = (int)(!empty($c['port']) ? $c['port'] : 587);
  $secure = strtolower(!empty($c['secure']) ? $c['secure'] : 'tls');
  $user = $c['user']; $pass = $c['pass'];
  $from = !empty($c['from']) ? $c['from'] : $user;
  $fromName = !empty($c['from_name']) ? $c['from_name'] : 'DriftX Website';
  $useSSL = ($secure === 'ssl' || $port === 465);
  $ctx = stream_context_create(array('ssl' => array('verify_peer' => false, 'verify_peer_name' => false)));
  $fp = @stream_socket_client(($useSSL ? 'ssl://' : 'tcp://') . $host . ':' . $port, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) { $err = "connect $host:$port — $errstr"; return false; }
  stream_set_timeout($fp, 20);
  $get = function () use ($fp) { $d = ''; while (($l = fgets($fp, 600)) !== false) { $d .= $l; if (strlen($l) >= 4 && $l[3] === ' ') break; } return $d; };
  $put = function ($s) use ($fp) { fwrite($fp, $s . "\r\n"); };
  $cd  = function ($r) { return substr(ltrim($r), 0, 3); };
  $r = $get(); if ($cd($r) !== '220') { $err = 'greeting: ' . trim($r); fclose($fp); return false; }
  $put("EHLO driftx.co"); $get();
  if (!$useSSL && $secure === 'tls') {
    $put("STARTTLS"); $r = $get();
    if ($cd($r) !== '220') { $err = 'starttls: ' . trim($r); fclose($fp); return false; }
    if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { $err = 'tls failed'; fclose($fp); return false; }
    $put("EHLO driftx.co"); $get();
  }
  $put("AUTH LOGIN"); $r = $get();
  if ($cd($r) !== '334') { $err = 'auth n/a: ' . trim($r); fclose($fp); return false; }
  $put(base64_encode($user)); $get();
  $put(base64_encode($pass)); $r = $get();
  if ($cd($r) !== '235') { $err = 'auth failed: ' . trim($r); fclose($fp); return false; }
  $put("MAIL FROM:<$from>"); $r = $get();
  if ($cd($r) !== '250') { $err = 'mail from: ' . trim($r); fclose($fp); return false; }
  $put("RCPT TO:<$to>"); $r = $get(); $c1 = $cd($r);
  if ($c1 === '' || $c1[0] !== '2') { $err = 'rcpt: ' . trim($r); fclose($fp); return false; }
  $put("DATA"); $r = $get();
  if ($cd($r) !== '354') { $err = 'data: ' . trim($r); fclose($fp); return false; }
  $headers = "From: $fromName <$from>\r\nReply-To: " . str_replace(array("\r", "\n"), '', $rName) . " <" . str_replace(array("\r", "\n"), '', $rEmail) . ">\r\n"
           . "To: <$to>\r\nSubject: $subject\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nDate: " . date('r') . "\r\n";
  fwrite($fp, $headers . "\r\n" . preg_replace('/^\./m', '..', $body) . "\r\n.\r\n");
  $r = $get(); $c2 = $cd($r);
  if ($c2 === '' || $c2[0] !== '2') { $err = 'send: ' . trim($r); fclose($fp); return false; }
  $put("QUIT"); fclose($fp);
  return true;
}
