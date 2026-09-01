# DRIFTX — Business, Evolved.

Marketing, sales, technology & AI growth-system website.
**Sales × Marketing × Business × Technology × AI**

Rebuilt from scratch as a fast, accessible, trilingual (EN / HE / AR) static site — no page builder, no framework, zero runtime dependencies.

## Structure

```
index.html          Single-page experience (all sections)
css/styles.css      Design system + sections (dark, gradient-mesh, glass)
js/i18n.js          Translations (EN source, HE + AR overrides, RTL)
js/universe.js      Interactive hero constellation (canvas)
js/app.js           Nav, cursor, scroll reveal, lead-journey, AI Business Scan, form
assets/brand/       Logo source assets
favicon.svg  robots.txt  sitemap.xml

x-ray/index.html        Business X-Ray™ — AI business diagnostic (js/xray.js, css/xray.css)
ai-marketing/index.html Marketing Control Tower — public product page + cockpit preview
ai-marketing/app/       THE SYSTEM — sign-in, onboarding, dashboard, diagnosis, issues, tasks
css/control-tower.css   Public page styles
css/mkt-app.css         System UI (app chrome, dense data, dark + light)
js/control-tower.js     Public page content (EN/HE/AR) + cockpit preview
js/mkt-i18n.js          System strings + catalogues (departments, connectors, trainings, assessment)
js/mkt-data.js          State (localStorage), dataset generator, analytics, scoring
js/mkt-engine.js        Rules engine, verification loop, tasks, diagnosis
js/mkt-views.js         Screens
js/mkt-app.js           Shell, router, sign-in, onboarding, wiring
```

## AI Marketing — public page vs system
`/ai-marketing/` sells the product. **`/ai-marketing/app/` is the product**: a working
front-end system, not a landing page.

- **Sign-in** — in server mode the password is verified server-side (bcrypt, HttpOnly
  session cookie, throttled). Without `/api` the app runs browser-only and the password
  field is never read, stored or sent; Google SSO, reset and 2FA state that they need a server.
- **Onboarding (5 steps)** — business profile, departments + owners, 12 data connections,
  11 targets, 18-question assessment. Saved to `localStorage` under `driftx_mkt_v1`.
- **14 screens** — dashboard, AI diagnosis, funnel, campaigns (+ drill-down), leads,
  sales & team (+ per-rep drill-down), site & tracking, content & reputation, issues,
  action plan, knowledge, implementation %, reports, settings.
- **Everything is computed.** A seeded generator builds campaign/lead/rep records scaled to
  the business profile you entered (declared monthly volume, budget and deal size), then the
  funnel, KPIs, scores, per-rep scorecards and issues are derived from those records. No
  headline number is hardcoded.
- **Rules engine** — 13 detectors (capture gap, SLA breach, no follow-up, CPL, quality drop,
  creative fatigue, budget allocation, UTM, unassigned, lost reason, duplicates, reviews SLA,
  site health), each scored `Impact × Urgency × Scope × Confidence`.
- **Closure requires verification.** Pressing "closed" is blocked until the metric is back
  inside range; the loop is issue → task → done → re-measure → close.
- **Honesty rules.** With no source connected every analytics screen shows the empty state
  ("connect your advertising platform or your CRM") — never demo numbers dressed as the
  business's own. Demo mode is opt-in and badged on every screen. Fact / estimate /
  recommendation are visually separated, and the final score is withheld when data
  reliability drops below 60.
- Full EN/HE/AR with RTL, dark + light theme, mobile drawer.

### Server mode — `/api/` (Plesk + PHP 8.2 + MySQL)
The system now has a backend. When `/api` answers, the app switches to **server mode**:
real sessions (bcrypt + HttpOnly cookie), state shared across the team in MySQL, and
live campaign data synced from **Google Ads** and **Meta Ads** every 30 minutes.
When `/api` is absent it falls back to the browser-only mode above, unchanged.

Setup, credentials and the scheduled task: see [api/README.md](api/README.md).

Ads platforms report campaign performance, not individual leads — so in server mode
the lead, team, site and reputation screens say *"this screen needs a lead-level
source"*, the overall business score stays withheld, and reliability is capped at 80.
Connecting a CRM later turns those back on.

### What still needs building
CRM / lead-forms connector (the one thing that unlocks the whole sales half of the
system), payments for revenue and ROAS, reviews and service sources, team invites with
per-role permissions, and email delivery of the weekly report.

## Marketing Control Tower — `/ai-marketing/`
The AI marketing performance control system (`DRIFTX_AI_Marketing_Control_System_Spec_HE.docx`)
turned into a product page. All copy lives in `js/control-tower.js` as `{en,he,ar}` triples and
re-renders on language switch, so each language is a native experience rather than a translation.

The **Executive Cockpit** section is an interactive demo with four real-world scenarios
(lead-quality collapse, CRM capture gap, creative fatigue / budget misallocation, and a sales drop
caused downstream of marketing). Each shows the scores, the funnel leaks, and an AI analysis that
separates fact from estimate from recommendation — including the Data Trust gate that refuses to
present a final score when reliability is below 60, and `Severity = Impact × Urgency × Scope ×
Confidence`. Numbers are demo data, labelled as such.

## Highlights
- Interactive **DRIFTX Universe** hero — the business core connected to Sales, Marketing, CRM, Web, AI, Automation, People, Data.
- **AI Business Scan** — an interactive lead-generation tool that scores the visitor's business.
- Visual **Lead Journey** funnel with leak detection.
- Full **RTL** support and a language switcher (EN / HE / AR).
- Built with performance (Core Web Vitals) and accessibility (WCAG 2.2) in mind; honors `prefers-reduced-motion`.

## Deployment
Deployed to `driftx.co/new/` via Plesk Git (auto-deploy on push to `main`).

## Local preview
```bash
python -m http.server 8123
# open http://127.0.0.1:8123
```
