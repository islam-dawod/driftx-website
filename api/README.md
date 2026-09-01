# DriftX AI Marketing — server (Plesk + PHP 8.2 + MySQL)

Read-only connectors for **Google Ads** and **Meta Ads**, a shared database for the
system state, session auth, and a scheduled sync. No framework, no build step —
the same `git pull` that deploys the site deploys this.

```
api/
  index.php            router: /api/health, auth, state, data, sync, oauth
  setup.php            one-time: env check → tables → first admin user
  cron.php             scheduled sync + daily KPI snapshot
  schema.sql           tables (re-runnable)
  config.sample.php    copy to config.php ON THE SERVER and fill in
  lib/boot.php         config, PDO, JSON, curl, sync log
  lib/auth.php         sessions (HttpOnly cookie), bcrypt, login throttle
  lib/meta.php         Meta Marketing API (campaign insights, daily)
  lib/google.php       Google Ads API (GAQL via searchStream) + OAuth
  lib/sync.php         upserts, sync window, /data payload
```

`config.php` is git-ignored. **Never commit tokens, and never send them by chat or email.**

---

## 1 · Database (Plesk)

Databases → **Add Database**. Note the database name, user and password.

## 2 · Configuration

Copy `api/config.sample.php` → `api/config.php` (Plesk File Manager), then fill in:

* `db` — the values from step 1
* `app.secret` and `app.cron_token` — two random strings (Plesk terminal: `openssl rand -hex 32`)
* leave `meta.enabled` / `google.enabled` as `false` until their credentials exist

**More secure option:** put the file outside the document root, e.g.
`/var/www/vhosts/driftx.co/private/driftx-config.php`. `boot.php` looks there first.

## 3 · Tables and the first user

Open `https://driftx.co/api/setup.php`:

1. every environment row should read **OK**
2. **Create / update tables**
3. create the admin user — you type the password, it is stored as a bcrypt hash

Then set `'setup_enabled' => false` in the config.

Check: `https://driftx.co/api/health` → `db: true, tables: true, users: 1`.

## 4 · Meta Ads

1. developers.facebook.com → an App of type **Business**
2. Business Settings → **System Users** → add one → assign the ad accounts with
   **View performance** → **Generate token** with `ads_read` (+ `ads_management` only
   if you later want write actions — this build never writes)
3. put the token in `meta.access_token`, list the ad account ids in
   `meta.ad_accounts` (without `act_`), set `meta.enabled => true`

Production access to `ads_read` requires **Business Verification** and App Review.
A development-mode token works for accounts you own, which is enough to start.

## 5 · Google Ads

1. Google Cloud → OAuth client (**Web application**), authorised redirect URI
   exactly `https://driftx.co/api/oauth/google/callback` → `client_id`, `client_secret`
2. Google Ads → Tools → **API Center** → developer token → `developer_token`
3. `customer_id` = the account id without dashes; `login_customer_id` = the manager
   (MCC) id if the account sits under one
4. `google.enabled => true`, then open `https://driftx.co/api/oauth/google/start`
   while signed in — the refresh token is stored in the database

A new developer token starts in **test mode** and only reads test accounts until
Google approves basic access. Apply early; it is usually the longest step.

## 6 · Scheduled sync

Plesk → **Scheduled Tasks** → *Run a PHP script*:

| | |
|---|---|
| script | `httpdocs/api/cron.php` |
| interval | every 30 minutes |

Or *Fetch a URL*: `https://driftx.co/api/sync?provider=all&token=<cron_token>`

Each run refreshes `sync.lookback_days` (the platforms restate recent days), the
first run backfills `sync.backfill_days`, and `sync.max_calls` caps the HTTP calls
per run so a bad configuration cannot hammer the API.

## 7 · Verify

```
/api/health                     environment + database
/api/sync?provider=meta         signed in: one provider
/api/data?range=30              what the app consumes
/ai-marketing/app/              sign in with the admin user
```

Settings → **Live platform connections** shows status, API version, last sync and
the last error per provider; `sync_log` keeps the history.

---

## What ads data can and cannot answer

**Can:** spend, impressions, clicks, CTR, CPC, frequency, platform-reported leads,
cost per lead, creative fatigue, budget-capped campaigns.

**Cannot:** response time, follow-up, qualification, close rate, revenue, ROAS,
per-rep performance, or the platform-to-CRM capture gap. Those are lead-level facts
and need a CRM or a lead-forms connection.

The API states this in `capabilities` on `/api/data`, and the UI shows *"this screen
needs a lead-level source"* instead of inventing numbers. The overall business score
stays withheld while `capabilities.leads` is false, and reliability is capped at 80
because ads-only data cannot be cross-checked.

## Security notes

* `config.php` is git-ignored and denied by `api/.htaccess`; `lib/` denies direct access
* sessions are HttpOnly, SameSite=Lax, Secure on HTTPS; 8 failed logins per 15 minutes
  per email/IP are throttled
* the API is same-origin only
* both connectors are read-only — nothing in this code changes a budget or stops a campaign
