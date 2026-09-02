<?php
/** DRIFTX AI Marketing — Google Ads API connector (read-only GAQL).
 *  Never mutates campaigns or budgets. */
declare(strict_types=1);

const DX_GADS_VERSIONS = ['v21', 'v20', 'v19', 'v18'];
const DX_GOOGLE_SCOPE = 'https://www.googleapis.com/auth/adwords';

function dx_google_version(): string {
  $conn = dx_conn_get('google');
  if (!empty($conn['api_version'])) return (string) $conn['api_version'];
  return (string) dx_cfg('google.api_version', 'v20');
}
function dx_digits(string $s): string { return preg_replace('/[^0-9]/', '', $s) ?? ''; }

/* ---------------- OAuth ---------------- */
function dx_google_auth_url(string $redirect, string $state): string {
  return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'client_id' => (string) dx_cfg('google.client_id', ''),
    'redirect_uri' => $redirect,
    'response_type' => 'code',
    'scope' => DX_GOOGLE_SCOPE,
    'access_type' => 'offline',
    'prompt' => 'consent',
    'include_granted_scopes' => 'true',
    'state' => $state,
  ]);
}

function dx_google_exchange_code(string $code, string $redirect): array {
  $res = dx_http('POST', 'https://oauth2.googleapis.com/token', [
    'headers' => ['Content-Type: application/x-www-form-urlencoded'],
    'body' => http_build_query([
      'code' => $code,
      'client_id' => (string) dx_cfg('google.client_id', ''),
      'client_secret' => (string) dx_cfg('google.client_secret', ''),
      'redirect_uri' => $redirect,
      'grant_type' => 'authorization_code',
    ]),
  ]);
  if ($res['code'] < 200 || $res['code'] >= 300 || !is_array($res['json'])) {
    return ['ok' => false, 'error' => dx_api_error($res)];
  }
  return ['ok' => true, 'data' => $res['json']];
}

/** Returns a usable access token, refreshing when needed. */
function dx_google_access_token(array &$stats): array {
  $conn = dx_conn_get('google');
  if (!empty($conn['access_tok']) && !empty($conn['tok_expires']) && strtotime((string) $conn['tok_expires']) > time() + 120) {
    return ['ok' => true, 'token' => (string) $conn['access_tok']];
  }
  $refresh = (string) ($conn['refresh_tok'] ?: dx_cfg('google.refresh_token', ''));
  if ($refresh === '') return ['ok' => false, 'error' => 'google_refresh_token_missing'];

  $stats['calls']++;
  $res = dx_http('POST', 'https://oauth2.googleapis.com/token', [
    'headers' => ['Content-Type: application/x-www-form-urlencoded'],
    'body' => http_build_query([
      'client_id' => (string) dx_cfg('google.client_id', ''),
      'client_secret' => (string) dx_cfg('google.client_secret', ''),
      'refresh_token' => $refresh,
      'grant_type' => 'refresh_token',
    ]),
  ]);
  if ($res['code'] < 200 || $res['code'] >= 300 || !is_array($res['json']) || empty($res['json']['access_token'])) {
    $err = dx_api_error($res);
    dx_conn_set('google', ['status' => 'auth', 'last_error' => $err]);
    return ['ok' => false, 'error' => $err];
  }
  $tok = (string) $res['json']['access_token'];
  $ttl = (int) ($res['json']['expires_in'] ?? 3300);
  dx_conn_set('google', [
    'access_tok' => $tok,
    'tok_expires' => gmdate('Y-m-d H:i:s', time() + max(60, $ttl - 60)),
    'refresh_tok' => $refresh,
  ]);
  return ['ok' => true, 'token' => $tok];
}

/* ---------------- GAQL ---------------- */
function dx_google_search(string $query, array &$stats, ?string $customerId = null, ?string $loginCustomerId = null): array {
  $tok = dx_google_access_token($stats);
  if (!$tok['ok']) return ['ok' => false, 'error' => $tok['error']];
  $dev = (string) dx_cfg('google.developer_token', '');
  if ($dev === '') return ['ok' => false, 'error' => 'google_developer_token_missing'];
  /* a project supplies its own customer id; the config value is the fallback */
  $cid = dx_digits((string) ($customerId !== null && $customerId !== '' ? $customerId : dx_cfg('google.customer_id', '')));
  if ($cid === '') return ['ok' => false, 'error' => 'google_customer_id_missing'];
  $login = dx_digits((string) ($loginCustomerId !== null && $loginCustomerId !== '' ? $loginCustomerId : dx_cfg('google.login_customer_id', '')));

  $headers = [
    'Authorization: Bearer ' . $tok['token'],
    'developer-token: ' . $dev,
  ];
  if ($login !== '' && $login !== $cid) $headers[] = 'login-customer-id: ' . $login;

  $versions = array_values(array_unique(array_merge([dx_google_version()], DX_GADS_VERSIONS)));
  $lastErr = 'unknown';
  foreach ($versions as $v) {
    $stats['calls']++;
    if ($stats['calls'] > (int) dx_cfg('sync.max_calls', 120)) return ['ok' => false, 'error' => 'call_budget_exhausted'];
    $url = "https://googleads.googleapis.com/{$v}/customers/{$cid}/googleAds:searchStream";
    $res = dx_http('POST', $url, ['headers' => $headers, 'body' => ['query' => $query], 'timeout' => 90]);
    if ($res['code'] >= 200 && $res['code'] < 300) {
      $j = $res['json'];
      $rows = [];
      if (is_array($j)) {
        /* searchStream returns an array of chunks, each with "results" */
        if (isset($j['results'])) $rows = $j['results'];
        else foreach ($j as $chunk) { if (is_array($chunk) && isset($chunk['results'])) $rows = array_merge($rows, $chunk['results']); }
      }
      if ($v !== dx_google_version()) dx_conn_set('google', ['api_version' => $v]);
      return ['ok' => true, 'rows' => $rows];
    }
    $lastErr = dx_api_error($res);
    $isVersionIssue = $res['code'] === 404 || stripos($lastErr, 'version') !== false || stripos($lastErr, 'not found') !== false;
    if (!$isVersionIssue) return ['ok' => false, 'error' => $lastErr, 'code' => $res['code']];
  }
  return ['ok' => false, 'error' => $lastErr];
}

function dx_google_pull(string $since, string $until, array &$stats, ?string $customerId = null, ?string $loginCustomerId = null): array {
  $cid = dx_digits((string) ($customerId !== null && $customerId !== '' ? $customerId : dx_cfg('google.customer_id', '')));

  /* account currency + name */
  $acc = dx_google_search(
    'SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone FROM customer LIMIT 1',
    $stats, $cid, $loginCustomerId
  );
  if (!$acc['ok']) return ['ok' => false, 'error' => $acc['error']];
  $c0 = $acc['rows'][0]['customer'] ?? [];
  $account = [
    'external_id' => $cid,
    'name' => (string) ($c0['descriptiveName'] ?? ('Google Ads ' . $cid)),
    'currency' => (string) ($c0['currencyCode'] ?? ''),
    'country' => '',
  ];

  /* daily campaign metrics */
  $q = "SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
        campaign_budget.amount_micros, metrics.cost_micros, metrics.impressions, metrics.clicks,
        metrics.conversions, segments.date
        FROM campaign
        WHERE segments.date BETWEEN '{$since}' AND '{$until}'
        ORDER BY segments.date";
  $r = dx_google_search($q, $stats, $cid, $loginCustomerId);
  if (!$r['ok']) return ['ok' => false, 'error' => $r['error']];

  $campaigns = [];
  $daily = [];
  foreach ($r['rows'] as $row) {
    $cmp = $row['campaign'] ?? [];
    $id = (string) ($cmp['id'] ?? '');
    if ($id === '') continue;
    if (!isset($campaigns[$id])) {
      $budgetMicros = $row['campaignBudget']['amountMicros'] ?? null;
      $campaigns[$id] = [
        'external_id' => $id,
        'name' => (string) ($cmp['name'] ?? $id),
        'status' => (string) ($cmp['status'] ?? ''),
        'objective' => (string) ($cmp['advertisingChannelType'] ?? ''),
        'channel' => 'google',
        'daily_budget' => $budgetMicros !== null ? ((float) $budgetMicros) / 1000000.0 : null,
        'budget_capped' => 0,
      ];
    }
    $m = $row['metrics'] ?? [];
    $daily[] = [
      'campaign_external_id' => $id,
      'day' => (string) ($row['segments']['date'] ?? ''),
      'spend' => ((float) ($m['costMicros'] ?? 0)) / 1000000.0,
      'impressions' => (int) ($m['impressions'] ?? 0),
      'clicks' => (int) ($m['clicks'] ?? 0),
      'conversions' => (float) ($m['conversions'] ?? 0),
      'leads' => (float) ($m['conversions'] ?? 0),
      'reach' => 0,
      'frequency' => 0.0,
      'currency' => $account['currency'],
    ];
  }

  /* budget-limited flag — optional field, tolerate older API versions */
  $cap = dx_google_search(
    'SELECT campaign.id, campaign.primary_status, campaign.primary_status_reasons FROM campaign WHERE campaign.status = \'ENABLED\'',
    $stats
  );
  if ($cap['ok']) {
    foreach ($cap['rows'] as $row) {
      $id = (string) ($row['campaign']['id'] ?? '');
      $reasons = $row['campaign']['primaryStatusReasons'] ?? [];
      if ($id !== '' && isset($campaigns[$id]) && is_array($reasons)) {
        foreach ($reasons as $reason) {
          if (stripos((string) $reason, 'BUDGET') !== false) $campaigns[$id]['budget_capped'] = 1;
        }
      }
    }
  }

  return ['ok' => true, 'account' => $account, 'campaigns' => array_values($campaigns), 'daily' => $daily];
}
