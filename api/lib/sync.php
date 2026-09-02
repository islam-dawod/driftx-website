<?php
/** DRIFTX AI Marketing — sync orchestration and upserts. */
declare(strict_types=1);

function dx_upsert_account(string $provider, array $acc, ?int $projectId = null): int {
  dx_q(
    'INSERT INTO ad_accounts (provider, external_id, name, currency, country, project_id, enabled, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), currency = VALUES(currency),
       country = IF(VALUES(country) = \'\', country, VALUES(country)),
       project_id = IFNULL(VALUES(project_id), project_id), updated_at = VALUES(updated_at)',
    [$provider, (string) $acc['external_id'], (string) ($acc['name'] ?? ''), (string) ($acc['currency'] ?? ''),
     (string) ($acc['country'] ?? ''), $projectId, dx_now()]
  );
  $r = dx_one('SELECT id FROM ad_accounts WHERE provider = ? AND external_id = ?', [$provider, (string) $acc['external_id']]);
  return (int) ($r['id'] ?? 0);
}

function dx_upsert_campaign(int $accountId, string $provider, array $c): int {
  dx_q(
    'INSERT INTO campaigns (account_id, provider, external_id, name, status, objective, channel, daily_budget, budget_capped, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE account_id = VALUES(account_id), name = VALUES(name), status = VALUES(status),
       objective = VALUES(objective), channel = VALUES(channel), daily_budget = VALUES(daily_budget),
       budget_capped = VALUES(budget_capped), updated_at = VALUES(updated_at)',
    [$accountId, $provider, (string) $c['external_id'], (string) ($c['name'] ?? ''), (string) ($c['status'] ?? ''),
     (string) ($c['objective'] ?? ''), (string) ($c['channel'] ?? $provider),
     $c['daily_budget'] !== null ? (float) $c['daily_budget'] : null, (int) ($c['budget_capped'] ?? 0), dx_now()]
  );
  $r = dx_one('SELECT id FROM campaigns WHERE provider = ? AND external_id = ?', [$provider, (string) $c['external_id']]);
  return (int) ($r['id'] ?? 0);
}

function dx_upsert_daily(int $campaignId, array $d): void {
  $day = (string) ($d['day'] ?? '');
  if ($day === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $day)) return;
  dx_q(
    'INSERT INTO campaign_daily (campaign_id, day, spend, impressions, clicks, conversions, leads, reach, frequency, currency, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE spend = VALUES(spend), impressions = VALUES(impressions), clicks = VALUES(clicks),
       conversions = VALUES(conversions), leads = VALUES(leads), reach = VALUES(reach), frequency = VALUES(frequency),
       currency = VALUES(currency), synced_at = VALUES(synced_at)',
    [$campaignId, $day, (float) ($d['spend'] ?? 0), (int) ($d['impressions'] ?? 0), (int) ($d['clicks'] ?? 0),
     (float) ($d['conversions'] ?? 0), (float) ($d['leads'] ?? 0), (int) ($d['reach'] ?? 0),
     (float) ($d['frequency'] ?? 0), (string) ($d['currency'] ?? ''), dx_now()]
  );
}

function dx_sync_window(string $provider, ?int $projectId = null): array {
  $r = $projectId
    ? dx_one(
        'SELECT MAX(cd.day) AS last_day FROM campaign_daily cd
         JOIN campaigns c ON c.id = cd.campaign_id
         JOIN ad_accounts a ON a.id = c.account_id
         WHERE c.provider = ? AND a.project_id = ?',
        [$provider, $projectId]
      )
    : dx_one(
        'SELECT MAX(cd.day) AS last_day FROM campaign_daily cd
         JOIN campaigns c ON c.id = cd.campaign_id WHERE c.provider = ?',
        [$provider]
      );
  $lookback = max(1, (int) dx_cfg('sync.lookback_days', 14));
  $backfill = max(7, (int) dx_cfg('sync.backfill_days', 90));
  $until = gmdate('Y-m-d');
  if (empty($r['last_day'])) {
    $since = gmdate('Y-m-d', time() - $backfill * 86400);
  } else {
    $since = gmdate('Y-m-d', max(strtotime((string) $r['last_day']) - $lookback * 86400, time() - $backfill * 86400));
  }
  return [$since, $until];
}

/** Runs one provider end to end. Returns a report array. */
function dx_sync_provider(string $provider, ?int $projectId = null): array {
  $stats = ['calls' => 0];
  $logId = dx_log_sync_start($provider);
  if ($projectId) dx_q('UPDATE sync_log SET project_id = ? WHERE id = ?', [$projectId, $logId]);
  [$since, $until] = dx_sync_window($provider, $projectId);
  $project = $projectId ? dx_project($projectId) : null;
  $label = $project ? (string) $project['name'] : 'all';
  $read = 0; $written = 0;

  try {
    if ($provider === 'meta') {
      if (!dx_cfg('meta.enabled', false)) throw new RuntimeException('meta_disabled_in_config');
      /* a project lists its own ad accounts; the config list is the fallback */
      $accounts = $projectId ? dx_project_meta_accounts($projectId) : (array) dx_cfg('meta.ad_accounts', []);
      if (!is_array($accounts) || !count($accounts)) throw new RuntimeException('meta_no_ad_accounts_for_project');
      foreach ($accounts as $acc) {
        $pull = dx_meta_pull_account((array) $acc, $since, $until, $stats);
        if (!$pull['ok']) throw new RuntimeException((string) $pull['error']);
        $accountId = dx_upsert_account('meta', $pull['account'], $projectId);
        $map = [];
        foreach ($pull['campaigns'] as $c) $map[(string) $c['external_id']] = dx_upsert_campaign($accountId, 'meta', $c);
        foreach ($pull['daily'] as $d) {
          $read++;
          $cid = $map[(string) $d['campaign_external_id']] ?? 0;
          if ($cid) { dx_upsert_daily($cid, $d); $written++; }
        }
      }
    } elseif ($provider === 'google') {
      if (!dx_cfg('google.enabled', false)) throw new RuntimeException('google_disabled_in_config');
      $g = $projectId ? dx_project_google($projectId) : ['customer' => '', 'login' => ''];
      if ($projectId && $g['customer'] === '') throw new RuntimeException('google_customer_id_missing_for_project');
      $pull = dx_google_pull($since, $until, $stats, $g['customer'] ?: null, $g['login'] ?: null);
      if (!$pull['ok']) throw new RuntimeException((string) $pull['error']);
      $accountId = dx_upsert_account('google', $pull['account'], $projectId);
      $map = [];
      foreach ($pull['campaigns'] as $c) $map[(string) $c['external_id']] = dx_upsert_campaign($accountId, 'google', $c);
      foreach ($pull['daily'] as $d) {
        $read++;
        $cid = $map[(string) $d['campaign_external_id']] ?? 0;
        if ($cid) { dx_upsert_daily($cid, $d); $written++; }
      }
    } else {
      throw new RuntimeException('unknown_provider');
    }

    dx_conn_set($provider, ['status' => 'on', 'last_sync_at' => dx_now(), 'last_error' => null]);
    dx_log_sync_end($logId, true, $stats['calls'], $read, $written, null);
    return ['ok' => true, 'provider' => $provider, 'project' => $label, 'projectId' => $projectId,
      'since' => $since, 'until' => $until,
      'calls' => $stats['calls'], 'rows_read' => $read, 'rows_written' => $written];
  } catch (Throwable $e) {
    $msg = $e->getMessage();
    dx_conn_set($provider, ['status' => 'err', 'last_error' => $msg]);
    dx_log_sync_end($logId, false, $stats['calls'], $read, $written, $msg);
    return ['ok' => false, 'provider' => $provider, 'project' => $label, 'projectId' => $projectId,
      'error' => $msg, 'calls' => $stats['calls'], 'rows_read' => $read, 'rows_written' => $written];
  }
}

/** Syncs every enabled project, or the config accounts when no project exists yet. */
function dx_sync_all(?string $onlyProvider = null, ?int $onlyProject = null): array {
  $providers = ($onlyProvider && $onlyProvider !== 'all') ? [$onlyProvider] : ['meta', 'google'];
  $projects = dx_projects(true);
  if ($onlyProject) {
    $projects = array_values(array_filter($projects, function ($p) use ($onlyProject) {
      return (int) $p['id'] === $onlyProject;
    }));
  }
  $reports = [];
  if (!count($projects)) {
    foreach ($providers as $p) {
      if (!dx_cfg($p . '.enabled', false)) { $reports[] = ['ok' => false, 'provider' => $p, 'error' => 'disabled_in_config']; continue; }
      $reports[] = dx_sync_provider($p, null);
    }
    return $reports;
  }
  foreach ($projects as $proj) {
    $pid = (int) $proj['id'];
    foreach ($providers as $p) {
      if (!dx_cfg($p . '.enabled', false)) {
        $reports[] = ['ok' => false, 'provider' => $p, 'project' => $proj['name'], 'error' => 'disabled_in_config'];
        continue;
      }
      if ($p === 'meta' && !count(dx_project_meta_accounts($pid))) continue;
      if ($p === 'google' && dx_project_google($pid)['customer'] === '') continue;
      $reports[] = dx_sync_provider($p, $pid);
    }
  }
  return $reports;
}

/** Campaign rows + daily series for the UI. */
function dx_data_payload(int $range, ?int $projectId = null): array {
  $range = max(1, min(365, $range));
  $since = gmdate('Y-m-d', time() - ($range - 1) * 86400);
  $prevSince = gmdate('Y-m-d', time() - (2 * $range - 1) * 86400);

  $accounts = $projectId
    ? dx_all('SELECT id, provider, external_id, name, currency, country FROM ad_accounts WHERE enabled = 1 AND project_id = ?', [$projectId])
    : dx_all('SELECT id, provider, external_id, name, currency, country FROM ad_accounts WHERE enabled = 1');
  $sqlCamps = 'SELECT c.id, c.provider, c.external_id, c.name, c.status, c.objective, c.channel, c.daily_budget,
            c.budget_capped, c.account_id, a.currency, a.country, a.name AS account_name
     FROM campaigns c JOIN ad_accounts a ON a.id = c.account_id';
  $camps = $projectId
    ? dx_all($sqlCamps . ' WHERE a.project_id = ? ORDER BY c.provider, c.name', [$projectId])
    : dx_all($sqlCamps . ' ORDER BY c.provider, c.name');
  $days = $projectId
    ? dx_all(
        'SELECT cd.campaign_id, cd.day, cd.spend, cd.impressions, cd.clicks, cd.conversions, cd.leads,
                cd.reach, cd.frequency, cd.currency
         FROM campaign_daily cd
         JOIN campaigns c ON c.id = cd.campaign_id
         JOIN ad_accounts a ON a.id = c.account_id
         WHERE cd.day >= ? AND a.project_id = ? ORDER BY cd.day',
        [$prevSince, $projectId]
      )
    : dx_all(
        'SELECT cd.campaign_id, cd.day, cd.spend, cd.impressions, cd.clicks, cd.conversions, cd.leads,
                cd.reach, cd.frequency, cd.currency
         FROM campaign_daily cd WHERE cd.day >= ? ORDER BY cd.day',
        [$prevSince]
      );
  $byCamp = [];
  foreach ($days as $d) {
    $cid = (int) $d['campaign_id'];
    $byCamp[$cid] = $byCamp[$cid] ?? [];
    $byCamp[$cid][] = [
      'day' => (string) $d['day'],
      'spend' => (float) $d['spend'],
      'impressions' => (int) $d['impressions'],
      'clicks' => (int) $d['clicks'],
      'conversions' => (float) $d['conversions'],
      'leads' => (float) $d['leads'],
      'reach' => (int) $d['reach'],
      'frequency' => (float) $d['frequency'],
    ];
  }
  $out = [];
  $currencies = [];
  foreach ($camps as $c) {
    $cid = (int) $c['id'];
    if (empty($byCamp[$cid])) continue;
    if (!empty($c['currency'])) $currencies[(string) $c['currency']] = true;
    $out[] = [
      'id' => 'db' . $cid,
      'provider' => (string) $c['provider'],
      'name' => (string) $c['name'],
      'status' => (string) $c['status'],
      'objective' => (string) $c['objective'],
      'account' => (string) $c['account_name'],
      'country' => (string) ($c['country'] ?: ''),
      'currency' => (string) ($c['currency'] ?: ''),
      'dailyBudget' => $c['daily_budget'] !== null ? (float) $c['daily_budget'] : null,
      'capped' => (int) $c['budget_capped'] === 1,
      'days' => $byCamp[$cid],
    ];
  }
  $conns = [];
  foreach (['meta', 'google'] as $p) {
    $c = dx_conn_get($p);
    $conns[$p] = [
      'status' => (string) $c['status'],
      'lastSync' => $c['last_sync_at'],
      'error' => $c['last_error'],
      'apiVersion' => $c['api_version'],
      'configured' => (bool) dx_cfg($p . '.enabled', false),
    ];
  }
  $syncs = $projectId
    ? dx_all('SELECT provider, started_at, finished_at, ok, rows_written, error FROM sync_log WHERE project_id = ? ORDER BY id DESC LIMIT 8', [$projectId])
    : dx_all('SELECT provider, started_at, finished_at, ok, rows_written, error FROM sync_log ORDER BY id DESC LIMIT 8');

  $project = $projectId ? dx_project($projectId) : null;
  return [
    'ok' => true,
    'range' => $range,
    'since' => $since,
    'projectId' => $projectId,
    'projectName' => $project ? (string) $project['name'] : null,
    'projectCurrency' => $project ? $project['currency'] : null,
    'capabilities' => [
      'ads' => count($out) > 0,
      'leads' => false,     /* no lead-level source connected */
      'sales' => false,     /* no CRM / payments source connected */
      'reason' => 'ads_only',
    ],
    'currencies' => array_keys($currencies),
    'mixedCurrency' => count($currencies) > 1,
    'baseCurrency' => (string) dx_cfg('app.base_currency', 'ILS'),
    'rates' => (array) dx_cfg('app.rates', []),
    'accounts' => $accounts,
    'campaigns' => $out,
    'connections' => $conns,
    'syncs' => $syncs,
  ];
}
