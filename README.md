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
```

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
