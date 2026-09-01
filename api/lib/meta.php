<?php
/** DRIFTX AI Marketing — Meta (Facebook / Instagram) Marketing API connector.
 *  Reads campaign-level daily insights. Never writes to the ad account. */
declare(strict_types=1);

const DX_META_VERSIONS = ['v23.0', 'v22.0', 'v21.0', 'v20.0', 'v19.0'];
const DX_META_LEAD_ACTIONS = [
  'lead', 'onsite_conversion.lead_grouped', 'offsite_conversion.fb_pixel_lead',
  'onsite_web_lead', 'leadgen_grouped', 'onsite_conversion.messaging_conversation_started_7d',
];

function dx_meta_version(): string {
  $conn = dx_conn_get('meta');
  if (!empty($conn['api_version'])) return (string) $conn['api_version'];
  return (string) dx_cfg('meta.api_version', 'v21.0');
}

function dx_meta_get(string $path, array $params, array &$stats): array {
  $token = (string) dx_cfg('meta.access_token', '');
  if ($token === '') return ['ok' => false, 'error' => 'meta_token_missing'];
  $versions = array_values(array_unique(array_merge([dx_meta_version()], DX_META_VERSIONS)));
  $lastErr = 'unknown';
  foreach ($versions as $v) {
    $params['access_token'] = $token;
    $url = 'https://graph.facebook.com/' . $v . '/' . ltrim($path, '/') . '?' . http_build_query($params);
    $stats['calls']++;
    if ($stats['calls'] > (int) dx_cfg('sync.max_calls', 120)) return ['ok' => false, 'error' => 'call_budget_exhausted'];
    $res = dx_http('GET', $url);
    if ($res['code'] >= 200 && $res['code'] < 300 && is_array($res['json'])) {
      if ($v !== dx_meta_version()) dx_conn_set('meta', ['api_version' => $v]);
      return ['ok' => true, 'data' => $res['json']];
    }
    $lastErr = dx_api_error($res);
    /* only a version problem is worth retrying on another version */
    if (stripos($lastErr, 'version') === false && stripos($lastErr, 'Unsupported') === false) {
      return ['ok' => false, 'error' => $lastErr, 'code' => $res['code']];
    }
  }
  return ['ok' => false, 'error' => $lastErr];
}

/** Follows Graph paging up to a sane page limit. */
function dx_meta_paged(string $path, array $params, array &$stats, int $maxPages = 12): array {
  $out = [];
  $first = dx_meta_get($path, $params, $stats);
  if (!$first['ok']) return $first;
  $data = $first['data'];
  $out = array_merge($out, $data['data'] ?? []);
  $next = $data['paging']['next'] ?? null;
  $pages = 1;
  while (is_string($next) && $next !== '' && $pages < $maxPages) {
    $stats['calls']++;
    if ($stats['calls'] > (int) dx_cfg('sync.max_calls', 120)) break;
    $res = dx_http('GET', $next);
    if ($res['code'] < 200 || $res['code'] >= 300 || !is_array($res['json'])) break;
    $out = array_merge($out, $res['json']['data'] ?? []);
    $next = $res['json']['paging']['next'] ?? null;
    $pages++;
  }
  return ['ok' => true, 'rows' => $out];
}

function dx_meta_leads_from_actions($actions): float {
  if (!is_array($actions)) return 0.0;
  $sum = 0.0;
  foreach ($actions as $a) {
    $type = (string) ($a['action_type'] ?? '');
    if (in_array($type, DX_META_LEAD_ACTIONS, true)) $sum += (float) ($a['value'] ?? 0);
  }
  return $sum;
}

/**
 * Pulls one ad account: account info, campaign settings, daily insights.
 * Returns ['ok'=>bool,'account'=>[...],'campaigns'=>[...],'daily'=>[...]]
 */
function dx_meta_pull_account(array $acc, string $since, string $until, array &$stats): array {
  $id = preg_replace('/[^0-9]/', '', (string) ($acc['id'] ?? ''));
  if ($id === '') return ['ok' => false, 'error' => 'bad_account_id'];

  $info = dx_meta_get("act_{$id}", ['fields' => 'name,currency,account_status'], $stats);
  if (!$info['ok']) return ['ok' => false, 'error' => $info['error']];
  $account = [
    'external_id' => $id,
    'name' => (string) ($info['data']['name'] ?? ($acc['name'] ?? ('act_' . $id))),
    'currency' => (string) ($info['data']['currency'] ?? ''),
    'country' => (string) ($acc['country'] ?? ''),
  ];

  $camps = dx_meta_paged("act_{$id}/campaigns", [
    'fields' => 'id,name,status,objective,daily_budget,lifetime_budget,effective_status',
    'limit' => 200,
  ], $stats);
  if (!$camps['ok']) return ['ok' => false, 'error' => $camps['error']];
  $campaigns = [];
  foreach ($camps['rows'] as $c) {
    $daily = isset($c['daily_budget']) ? ((float) $c['daily_budget']) / 100.0 : null;
    $campaigns[(string) $c['id']] = [
      'external_id' => (string) $c['id'],
      'name' => (string) ($c['name'] ?? ''),
      'status' => (string) ($c['effective_status'] ?? ($c['status'] ?? '')),
      'objective' => (string) ($c['objective'] ?? ''),
      'channel' => 'meta',
      'daily_budget' => $daily,
      'budget_capped' => 0,
    ];
  }

  $ins = dx_meta_paged("act_{$id}/insights", [
    'level' => 'campaign',
    'time_increment' => 1,
    'time_range' => json_encode(['since' => $since, 'until' => $until]),
    'fields' => 'campaign_id,campaign_name,spend,impressions,clicks,reach,frequency,actions,date_start',
    'limit' => 400,
  ], $stats);
  if (!$ins['ok']) return ['ok' => false, 'error' => $ins['error']];

  $daily = [];
  foreach ($ins['rows'] as $r) {
    $cid = (string) ($r['campaign_id'] ?? '');
    if ($cid === '') continue;
    if (!isset($campaigns[$cid])) {
      $campaigns[$cid] = [
        'external_id' => $cid, 'name' => (string) ($r['campaign_name'] ?? $cid),
        'status' => '', 'objective' => '', 'channel' => 'meta', 'daily_budget' => null, 'budget_capped' => 0,
      ];
    }
    $daily[] = [
      'campaign_external_id' => $cid,
      'day' => (string) ($r['date_start'] ?? ''),
      'spend' => (float) ($r['spend'] ?? 0),
      'impressions' => (int) ($r['impressions'] ?? 0),
      'clicks' => (int) ($r['clicks'] ?? 0),
      'conversions' => dx_meta_leads_from_actions($r['actions'] ?? null),
      'leads' => dx_meta_leads_from_actions($r['actions'] ?? null),
      'reach' => (int) ($r['reach'] ?? 0),
      'frequency' => (float) ($r['frequency'] ?? 0),
      'currency' => $account['currency'],
    ];
  }
  return ['ok' => true, 'account' => $account, 'campaigns' => array_values($campaigns), 'daily' => $daily];
}
