-- DRIFTX AI Marketing — MySQL / MariaDB schema
-- Created by api/setup.php. Safe to re-run: every statement is IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(190) NOT NULL,
  pass_hash     VARCHAR(255) NOT NULL,
  name          VARCHAR(120) DEFAULT NULL,
  role          VARCHAR(32)  NOT NULL DEFAULT 'admin',
  created_at    DATETIME     NOT NULL,
  last_login_at DATETIME     DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token      CHAR(64)     NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  created_at DATETIME     NOT NULL,
  expires_at DATETIME     NOT NULL,
  ip         VARCHAR(45)  DEFAULT NULL,
  ua         VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (token),
  KEY k_sessions_user (user_id),
  KEY k_sessions_exp (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email      VARCHAR(190) NOT NULL,
  ip         VARCHAR(45)  DEFAULT NULL,
  ok         TINYINT(1)   NOT NULL DEFAULT 0,
  at         DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY k_att (email, at),
  KEY k_att_ip (ip, at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- one row per provider: 'meta' | 'google'
CREATE TABLE IF NOT EXISTS connections (
  provider     VARCHAR(32)  NOT NULL,
  status       VARCHAR(16)  NOT NULL DEFAULT 'off',   -- off | on | auth | err
  refresh_tok  TEXT         DEFAULT NULL,             -- google only
  access_tok   TEXT         DEFAULT NULL,
  tok_expires  DATETIME     DEFAULT NULL,
  api_version  VARCHAR(8)   DEFAULT NULL,             -- probed and remembered
  last_sync_at DATETIME     DEFAULT NULL,
  last_error   TEXT         DEFAULT NULL,
  updated_at   DATETIME     NOT NULL,
  PRIMARY KEY (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ad_accounts (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider    VARCHAR(32)  NOT NULL,
  external_id VARCHAR(64)  NOT NULL,
  name        VARCHAR(190) DEFAULT NULL,
  currency    VARCHAR(8)   DEFAULT NULL,
  country     VARCHAR(8)   DEFAULT NULL,
  enabled     TINYINT(1)   NOT NULL DEFAULT 1,
  updated_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_acc (provider, external_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaigns (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  account_id   INT UNSIGNED NOT NULL,
  provider     VARCHAR(32)  NOT NULL,
  external_id  VARCHAR(64)  NOT NULL,
  name         VARCHAR(255) DEFAULT NULL,
  status       VARCHAR(32)  DEFAULT NULL,
  objective    VARCHAR(64)  DEFAULT NULL,
  channel      VARCHAR(64)  DEFAULT NULL,
  daily_budget DECIMAL(14,2) DEFAULT NULL,
  budget_capped TINYINT(1)  NOT NULL DEFAULT 0,
  updated_at   DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_camp (provider, external_id),
  KEY k_camp_acc (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaign_daily (
  campaign_id INT UNSIGNED NOT NULL,
  day         DATE         NOT NULL,
  spend       DECIMAL(14,2) NOT NULL DEFAULT 0,
  impressions BIGINT       NOT NULL DEFAULT 0,
  clicks      BIGINT       NOT NULL DEFAULT 0,
  conversions DECIMAL(14,2) NOT NULL DEFAULT 0,
  leads       DECIMAL(14,2) NOT NULL DEFAULT 0,
  reach       BIGINT       NOT NULL DEFAULT 0,
  frequency   DECIMAL(8,2) NOT NULL DEFAULT 0,
  currency    VARCHAR(8)   DEFAULT NULL,
  synced_at   DATETIME     NOT NULL,
  PRIMARY KEY (campaign_id, day),
  KEY k_cd_day (day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sync_log (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider     VARCHAR(32)  NOT NULL,
  started_at   DATETIME     NOT NULL,
  finished_at  DATETIME     DEFAULT NULL,
  ok           TINYINT(1)   NOT NULL DEFAULT 0,
  http_calls   INT          NOT NULL DEFAULT 0,
  rows_read    INT          NOT NULL DEFAULT 0,
  rows_written INT          NOT NULL DEFAULT 0,
  error        TEXT         DEFAULT NULL,
  PRIMARY KEY (id),
  KEY k_sl (provider, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- shared application state (replaces per-browser localStorage)
CREATE TABLE IF NOT EXISTS app_state (
  k          VARCHAR(64) NOT NULL,
  v          LONGTEXT    NOT NULL,
  updated_at DATETIME    NOT NULL,
  updated_by INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (k)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- daily KPI snapshot so trends and baselines survive
CREATE TABLE IF NOT EXISTS snapshots (
  day        DATE     NOT NULL,
  payload    LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- one project = one client / market, with its own ad accounts and state
CREATE TABLE IF NOT EXISTS projects (
  id                       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name                     VARCHAR(120) NOT NULL,
  slug                     VARCHAR(64)  NOT NULL,
  currency                 VARCHAR(8)   DEFAULT NULL,
  google_customer_id       VARCHAR(32)  DEFAULT NULL,
  google_login_customer_id VARCHAR(32)  DEFAULT NULL,
  enabled                  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at               DATETIME     NOT NULL,
  updated_at               DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_accounts (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id  INT UNSIGNED NOT NULL,
  provider    VARCHAR(32)  NOT NULL,
  external_id VARCHAR(64)  NOT NULL,
  name        VARCHAR(190) DEFAULT NULL,
  country     VARCHAR(8)   DEFAULT NULL,
  enabled     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pa (project_id, provider, external_id),
  KEY k_pa_proj (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
