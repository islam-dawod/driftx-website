<?php
/**
 * DRIFTX AI Marketing — scheduled sync.
 *
 * Plesk → Scheduled Tasks → Run a PHP script:
 *   api/cron.php            every 30 minutes
 * Or as a URL fetch:
 *   https://driftx.co/api/sync?provider=all&token=<cron_token>
 *
 * Writing a daily KPI snapshot keeps trends and baselines available even if a
 * platform later restates its numbers.
 */
declare(strict_types=1);
require __DIR__ . '/lib/boot.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/meta.php';
require __DIR__ . '/lib/google.php';
require __DIR__ . '/lib/projects.php';
require __DIR__ . '/lib/sync.php';

$isCli = PHP_SAPI === 'cli';
if (!$isCli) {
  $given = (string) ($_GET['token'] ?? '');
  $want = (string) dx_cfg('app.cron_token', '');
  if ($want === '' || $want === 'CHANGE_ME_another_random_hex' || !hash_equals($want, $given)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "forbidden\n";
    exit;
  }
  header('Content-Type: text/plain; charset=utf-8');
}
if (!dx_configured()) { echo "not_configured\n"; exit(1); }

set_time_limit(900);
$reports = dx_sync_all('all', null);

/* daily snapshot of the headline numbers */
try {
  $payload = dx_data_payload(30, null);
  $totals = ['spend' => 0.0, 'clicks' => 0, 'impressions' => 0, 'leads' => 0.0];
  $since = $payload['since'];
  foreach ($payload['campaigns'] as $c) {
    foreach ($c['days'] as $d) {
      if ($d['day'] < $since) continue;
      $totals['spend'] += (float) $d['spend'];
      $totals['clicks'] += (int) $d['clicks'];
      $totals['impressions'] += (int) $d['impressions'];
      $totals['leads'] += (float) $d['leads'];
    }
  }
  dx_q(
    'INSERT INTO snapshots (day, payload, created_at) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE payload = VALUES(payload), created_at = VALUES(created_at)',
    [gmdate('Y-m-d'), json_encode($totals, JSON_UNESCAPED_UNICODE), dx_now()]
  );
} catch (Throwable $e) {
  $reports[] = ['snapshot_error' => $e->getMessage()];
}

dx_gc_sessions();

echo json_encode(['ok' => true, 'at' => dx_now(), 'reports' => $reports], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";
