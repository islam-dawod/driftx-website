<?php
/* DriftX contact form → delivers to info@driftx.co.
   Prefers authenticated SMTP (contact-config.php) so SPF/DKIM/DMARC pass on
   this split web/mail hosting; falls back to PHP mail() if not configured. */
header('Content-Type: application/json; charset=utf-8');

$cfg  = @include __DIR__ . '/contact-config.php';
$smtp = (is_array($cfg) && !empty($cfg['smtp']['host']) && !empty($cfg['smtp']['pass']) && $cfg['smtp']['pass'] !== 'CHANGE_ME')
        ? $cfg['smtp'] : null;
$to   = ($smtp && !empty($smtp['to'])) ? $smtp['to'] : 'info@driftx.co';

/* ---- token-gated diagnostics (no secrets revealed) ---- */
if (isset($_GET['diag']) && $_GET['diag'] === 'dx-check-9f3a') {
  echo json_encode(array(
    'php'            => PHP_VERSION,
    'config_present' => is_array($cfg),
    'smtp_ready'     => (bool)$smtp,
    'smtp_host'      => $smtp ? $smtp['host'] . ':' . $smtp['port'] . ' (' . $smtp['secure'] . ')' : null,
    'mail_fn'        => function_exists('mail') && !in_array('mail', array_map('trim', explode(',', (string)ini_get('disable_functions')))),
    'sendmail_path'  => ini_get('sendmail_path'),
    'openssl'        => extension_loaded('openssl'),
    'sockets'        => function_exists('stream_socket_client'),
  ));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405); echo json_encode(array('ok' => false, 'error' => 'method')); exit;
}
if (!empty($_POST['_gotcha'])) { echo json_encode(array('ok' => true)); exit; }

function clean($s) { return trim(str_replace(array("\r", "\n"), ' ', (string)$s)); }

$name      = clean(isset($_POST['name']) ? $_POST['name'] : '');
$email     = clean(isset($_POST['email']) ? $_POST['email'] : '');
$focus     = clean(isset($_POST['focus']) ? $_POST['focus'] : '');
$lang      = clean(isset($_POST['lang']) ? $_POST['lang'] : '');
$challenge = trim(isset($_POST['challenge']) ? $_POST['challenge'] : '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo json_encode(array('ok' => false, 'error' => 'invalid')); exit;
}

$subject = '=?UTF-8?B?' . base64_encode('DriftX enquiry — ' . $name) . '?=';
$body    = "New enquiry from the DriftX website\n"
         . "-----------------------------------\n"
         . "Name:      $name\n"
         . "Email:     $email\n"
         . "Focus:     $focus\n"
         . "Language:  $lang\n\n"
         . "Challenge:\n" . $challenge . "\n";

$err = '';
if ($smtp) {
  $ok = smtp_send($smtp, $to, $subject, $body, $name, $email, $err);
} else {
  $from    = 'info@driftx.co';
  $headers = "From: DriftX Website <$from>\r\nReply-To: $name <$email>\r\n"
           . "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  $ok = @mail($to, $subject, $body, $headers, '-f' . $from);
  if (!$ok) $err = 'php mail() returned false';
  else $err = 'sent via php mail() — deliverability not guaranteed (configure SMTP)';
}

if (!$ok) {
  @file_put_contents(__DIR__ . '/contact-error.log', date('c') . ' ' . $err . "\n", FILE_APPEND);
  http_response_code(500);
  echo json_encode(array('ok' => false, 'error' => 'send', 'detail' => mb_substr($err, 0, 180)));
} else {
  echo json_encode(array('ok' => true));
}

/* ---------------- minimal authenticated-SMTP sender ---------------- */
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
    if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { $err = 'tls handshake failed'; fclose($fp); return false; }
    $put("EHLO driftx.co"); $get();
  }
  $put("AUTH LOGIN"); $r = $get();
  if ($cd($r) !== '334') { $err = 'auth not offered: ' . trim($r); fclose($fp); return false; }
  $put(base64_encode($user)); $get();
  $put(base64_encode($pass)); $r = $get();
  if ($cd($r) !== '235') { $err = 'auth failed: ' . trim($r); fclose($fp); return false; }
  $put("MAIL FROM:<$from>"); $r = $get();
  if ($cd($r) !== '250') { $err = 'mail from: ' . trim($r); fclose($fp); return false; }
  $put("RCPT TO:<$to>"); $r = $get();
  $c1 = $cd($r); if ($c1 === '' || $c1[0] !== '2') { $err = 'rcpt: ' . trim($r); fclose($fp); return false; }
  $put("DATA"); $r = $get();
  if ($cd($r) !== '354') { $err = 'data: ' . trim($r); fclose($fp); return false; }
  $headers = "From: $fromName <$from>\r\n"
           . "Reply-To: " . str_replace(array("\r", "\n"), '', $rName) . " <" . str_replace(array("\r", "\n"), '', $rEmail) . ">\r\n"
           . "To: <$to>\r\nSubject: $subject\r\nMIME-Version: 1.0\r\n"
           . "Content-Type: text/plain; charset=UTF-8\r\nDate: " . date('r') . "\r\n"
           . "Message-ID: <" . bin2hex(random_bytes(8)) . "@driftx.co>";
  $bodyOut = preg_replace('/^\./m', '..', $body);
  fwrite($fp, $headers . "\r\n\r\n" . $bodyOut . "\r\n.\r\n");
  $r = $get(); $c2 = $cd($r);
  if ($c2 === '' || $c2[0] !== '2') { $err = 'send: ' . trim($r); fclose($fp); return false; }
  $put("QUIT"); fclose($fp);
  return true;
}
