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
ai-marketing/index.html Marketing Control Tower — product page + live cockpit demo
css/control-tower.css   Control Tower page styles
js/control-tower.js     Control Tower content (EN/HE/AR triples) + cockpit demo logic
```

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
