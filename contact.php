<?php
/* DriftX contact form → emails info@driftx.co (Plesk mail(), no third party). */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array('ok' => false, 'error' => 'method'));
  exit;
}

// Honeypot: silently accept bots without emailing.
if (!empty($_POST['_gotcha'])) { echo json_encode(array('ok' => true)); exit; }

function clean($s) { return trim(str_replace(array("\r", "\n"), ' ', (string)$s)); }

$name      = clean(isset($_POST['name']) ? $_POST['name'] : '');
$email     = clean(isset($_POST['email']) ? $_POST['email'] : '');
$focus     = clean(isset($_POST['focus']) ? $_POST['focus'] : '');
$lang      = clean(isset($_POST['lang']) ? $_POST['lang'] : '');
$challenge = trim(isset($_POST['challenge']) ? $_POST['challenge'] : '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(array('ok' => false, 'error' => 'invalid'));
  exit;
}

$to      = 'info@driftx.co';
$subject = 'DriftX enquiry — ' . $name;
$body    = "New enquiry from the DriftX website\n"
         . "-----------------------------------\n"
         . "Name:      $name\n"
         . "Email:     $email\n"
         . "Focus:     $focus\n"
         . "Language:  $lang\n\n"
         . "Challenge:\n" . $challenge . "\n";

$headers  = "From: DriftX Website <info@driftx.co>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: DriftX-Web\r\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$ok = @mail($to, $encodedSubject, $body, $headers, '-finfo@driftx.co');

if ($ok) {
  echo json_encode(array('ok' => true));
} else {
  http_response_code(500);
  echo json_encode(array('ok' => false, 'error' => 'send'));
}
