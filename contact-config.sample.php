<?php
/**
 * DriftX contact form — mail delivery config (SAMPLE).
 *
 * Copy this file on the SERVER to  contact-config.php  and fill in the real
 * mailbox password there. contact-config.php is git-ignored so the password is
 * NEVER committed to the public repo. Do not paste the password into chat.
 *
 * Why SMTP: the web server (84.32.33.100) is not authorized in the domain's
 * SPF, and DMARC is strict (p=quarantine), so PHP mail() gets quarantined.
 * Sending through the real mail server (mail.driftx.co) with an authenticated
 * mailbox makes SPF + DKIM + DMARC pass, so the message is delivered.
 */
return [
  'smtp' => [
    'host'      => 'mail.driftx.co', // the domain's mail server (MX)
    'port'      => 587,              // 587 = STARTTLS (recommended). Use 465 for SSL.
    'secure'    => 'tls',            // 'tls' for 587, 'ssl' for 465
    'user'      => 'info@driftx.co', // a REAL mailbox that exists in Plesk (Mail)
    'pass'      => 'CHANGE_ME',      // that mailbox's password (set it here, on the server only)
    'from'      => 'info@driftx.co', // send as this (same domain → DKIM-signed)
    'from_name' => 'DriftX Website',
    'to'        => 'info@driftx.co', // where enquiries are delivered
  ],
];
