<?php
/**
 * DRIFTX AI Marketing — configuration sample.
 *
 * DO NOT put real credentials in this file. Copy it on the SERVER to
 * api/config.php (or better, to a path outside the document root, see
 * CONFIG_OUTSIDE below) and fill it in there. api/config.php is git-ignored so
 * it can never be committed to the public repository.
 *
 * Never paste tokens or secrets into chat, email or a git commit.
 */

return [

  /* ---------------- database (Plesk → Databases → Add database) ---------- */
  'db' => [
    'host' => 'localhost',
    'name' => 'CHANGE_ME_db',
    'user' => 'CHANGE_ME_user',
    'pass' => 'CHANGE_ME_password',
    'charset' => 'utf8mb4',
  ],

  /* ---------------- app ------------------------------------------------- */
  'app' => [
    // Random 64-char string. Generate once: openssl rand -hex 32
    'secret' => 'CHANGE_ME_random_hex_32_bytes',
    // Token the Plesk scheduled task passes to run a sync without a login.
    'cron_token' => 'CHANGE_ME_another_random_hex',
    // Allow api/setup.php to run. Set to false once setup is finished.
    'setup_enabled' => true,
    // Session lifetime in days.
    'session_days' => 14,
    // Currency shown when accounts are mixed. Amounts are NOT converted unless
    // you fill 'rates' below — the UI states when it is showing mixed currency.
    'base_currency' => 'ILS',
    // Optional manual FX rates INTO base_currency, e.g. ['USD' => 3.7]
    'rates' => [],
  ],

  /* ---------------- Meta (Facebook / Instagram) Marketing API ----------- */
  'meta' => [
    'enabled' => false,
    // Graph API version. If a call fails with an unsupported-version error the
    // connector probes newer/older versions automatically and remembers one.
    'api_version' => 'v21.0',
    'app_id' => '',
    'app_secret' => '',
    // A long-lived System User token with ads_read on the ad accounts below.
    // Business Settings → Users → System Users → Generate token.
    'access_token' => '',
    // Ad account ids WITHOUT the "act_" prefix.
    'ad_accounts' => [
      // ['id' => '000000000000000', 'name' => 'Account name', 'country' => 'US'],
    ],
  ],

  /* ---------------- Google Ads API -------------------------------------- */
  'google' => [
    'enabled' => false,
    // Bumped automatically if the configured version is retired.
    'api_version' => 'v20',
    // Google Cloud → APIs & Services → Credentials → OAuth client (Web app).
    // Authorised redirect URI must be exactly:
    //   https://driftx.co/api/oauth/google/callback
    'client_id' => '',
    'client_secret' => '',
    // Google Ads API Center → developer token (starts in test mode until
    // Google approves basic access).
    'developer_token' => '',
    // Obtained by visiting /api/oauth/google/start once, signed in as admin.
    'refresh_token' => '',
    // Customer id WITHOUT dashes.
    'customer_id' => '',
    // If the customer sits under a manager (MCC) account, its id without dashes.
    'login_customer_id' => '',
  ],

  /* ---------------- sync ------------------------------------------------ */
  'sync' => [
    // How many days back each run refreshes (ad platforms restate recent days).
    'lookback_days' => 14,
    // First backfill depth, used when a provider has no data yet.
    'backfill_days' => 90,
    // Hard cap on HTTP calls per run, so a bad config cannot hammer the API.
    'max_calls' => 120,
  ],
];
