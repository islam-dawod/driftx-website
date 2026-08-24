/* DRIFTX Business X-Ray™ — client-side AI business diagnostic engine.
   Deterministic, weighted scoring (a structured DriftX methodology encoded as
   data — not an LLM guessing scores). No backend required. */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Categories ---------------- */
  const CATS = {
    management: { name: "Management",          w: 1.2 },
    sales:      { name: "Sales",               w: 1.4 },
    employees:  { name: "Employees",           w: 1.0 },
    training:   { name: "Training",            w: 1.1 },
    marketing:  { name: "Marketing",           w: 1.1 },
    leadmgmt:   { name: "Lead Management",      w: 1.3 },
    cx:         { name: "Customer Experience", w: 1.0 },
    control:    { name: "Business Control",    w: 1.0 },
  };
  const CATKEYS = Object.keys(CATS);

  // per-category diagnosis lines by band + DriftX service list
  const CATINFO = {
    management: {
      low: "Roles, KPIs and performance tracking aren't structured — decisions rely on gut feeling more than data.",
      mid: "You have goals, but management control and systematic performance tracking are inconsistent.",
      high: "Management is structured with clear roles and KPIs — a real strength.",
      services: ["Management coaching", "KPI implementation", "Process design", "Reporting & dashboards"],
    },
    sales: {
      low: "There's no consistent sales process — response speed, objection handling and closing vary by person.",
      mid: "A sales motion exists but isn't fully documented or measured across the team.",
      high: "Your sales process is defined and measured — keep reinforcing it.",
      services: ["Sales process development", "Objection handling", "Sales scripts", "Call analysis", "KPI implementation"],
    },
    employees: {
      low: "People, roles and individual targets aren't aligned, and performance isn't compared.",
      mid: "Employees have some targets, but measurement and role-fit could be tighter.",
      high: "The right people are in the right roles with measured performance.",
      services: ["Role-fit assessment", "Individual targets", "Performance scoring", "Onboarding structure"],
    },
    training: {
      low: "The team isn't getting structured onboarding, ongoing training or call QA.",
      mid: "Some training happens, but it isn't consistent or reviewed systematically.",
      high: "You invest in structured training and QA — a strong foundation.",
      services: ["Structured onboarding", "Sales training program", "Role-play sessions", "Call QA & coaching"],
    },
    marketing: {
      low: "Marketing is measured by lead volume, not revenue — lead quality and cost per qualified lead are unclear.",
      mid: "You track some marketing metrics, but not revenue by source.",
      high: "Marketing is measured by revenue and quality, not just volume.",
      services: ["Lead-source revenue tracking", "Offer & audience refinement", "Channel strategy", "Landing-page optimization"],
    },
    leadmgmt: {
      low: "Leads aren't followed up consistently and aren't prioritized — opportunities leak in the middle of the funnel.",
      mid: "Leads are managed, but follow-up cadence and scoring aren't fully structured.",
      high: "Leads are tracked, prioritized and followed up with a clear cadence.",
      services: ["CRM setup & automation", "Follow-up cadence", "Lead scoring", "Pipeline management"],
    },
    cx: {
      low: "There's little structured follow-up after the sale and retention isn't measured.",
      mid: "Post-sale experience is decent but not systematic.",
      high: "Customers are followed up, satisfied and coming back — a strength.",
      services: ["Post-sale follow-up automation", "Retention program", "Customer feedback loop"],
    },
    control: {
      low: "There's no single source of truth and conversion isn't tracked across the funnel.",
      mid: "You track some numbers, but data is scattered across tools.",
      high: "You run on data with a single source of truth and funnel tracking.",
      services: ["Funnel tracking", "Single source of truth", "Data dashboards", "Decision KPIs"],
    },
  };

  const OPT4 = (a, b, c, d) => [{ t: a, s: 15 }, { t: b, s: 45 }, { t: c, s: 72 }, { t: d, s: 95 }];

  /* ---------------- Questions (adaptive) ---------------- */
  const Q = [
    // Management
    { cat: "management", t: "Are roles and responsibilities clearly defined across the business?", o: OPT4("Not really", "Somewhat", "Mostly", "Clearly documented") },
    { cat: "management", t: "Do managers track performance using defined KPIs?", o: OPT4("No KPIs", "Informal", "Some KPIs", "Full KPI system"), impl: "kpi" },
    { cat: "management", t: "Do you hold regular team meetings with a clear agenda?", o: OPT4("Rarely", "Sometimes", "Weekly", "Structured & tracked") },
    // Sales
    { cat: "sales", t: "Do your salespeople follow a defined sales process?", o: OPT4("No process", "Loosely", "Mostly", "Documented & trained"), impl: "process" },
    { cat: "sales", t: "How fast is your first response to a new lead?", o: OPT4("Hours or days", "Within an hour", "Within minutes", "Instant / automated") },
    { cat: "sales", t: "Do you handle objections with a consistent method?", o: OPT4("No", "Rarely", "Often", "Structured framework") },
    { cat: "sales", t: "Do you measure each salesperson's conversion rate?", o: OPT4("No", "Roughly", "Yes, monthly", "Real-time per agent"), impl: "agentconv", showIf: b => b.sellers !== "0" },
    // Employees
    { cat: "employees", t: "Are the right people in the right roles?", o: OPT4("Not really", "Partly", "Mostly", "Strong fit") },
    { cat: "employees", t: "Do employees have individual monthly targets?", o: OPT4("No", "Partially", "Yes", "Yes, and tracked"), impl: "targets" },
    { cat: "employees", t: "Is employee performance measured and compared?", o: OPT4("No", "Informal", "Yes", "Live dashboard"), impl: "perfscore" },
    // Training
    { cat: "training", t: "Does a new employee get a structured onboarding plan?", o: OPT4("No", "Basic", "Yes", "Yes, with a mentor"), impl: "onboarding" },
    { cat: "training", t: "Do you run ongoing sales training or role-plays?", o: OPT4("Never", "Rarely", "Monthly", "Weekly") },
    { cat: "training", t: "Are calls reviewed for quality (QA)?", o: OPT4("No", "Sometimes", "Regularly", "Systematic QA"), impl: "callmon" },
    // Marketing
    { cat: "marketing", t: "Do you know your cost per qualified lead?", o: OPT4("No idea", "Roughly", "Yes", "Tracked by channel") },
    { cat: "marketing", t: "Do you measure revenue by lead source (not just volume)?", o: OPT4("No", "A little", "Yes", "Fully attributed") },
    { cat: "marketing", t: "Is your incoming lead quality consistent and high?", o: OPT4("Low", "Mixed", "Good", "Excellent") },
    // Lead management
    { cat: "leadmgmt", t: "Are leads consistently followed up (multiple attempts)?", o: OPT4("No", "One attempt", "A few", "Structured cadence"), impl: "leadtrack" },
    { cat: "leadmgmt", t: "Do you use a CRM to manage leads & pipeline?", o: OPT4("No", "Spreadsheets", "Basic CRM", "CRM + automation"), impl: "crm" },
    { cat: "leadmgmt", t: "Are leads prioritized or scored?", o: OPT4("No", "Manually", "Yes", "AI-assisted") },
    // Customer experience
    { cat: "cx", t: "Do you have structured follow-up after the sale?", o: OPT4("No", "Sometimes", "Yes", "Automated") },
    { cat: "cx", t: "Do you measure customer satisfaction or retention?", o: OPT4("No", "Roughly", "Yes", "Tracked over time") },
    { cat: "cx", t: "Do customers come back and buy again?", o: OPT4("Rarely", "Sometimes", "Often", "Loyal base") },
    // Business control
    { cat: "control", t: "Do you track conversion rates across the funnel?", o: OPT4("No", "Roughly", "Monthly", "Real-time") },
    { cat: "control", t: "Are decisions based on data or gut feeling?", o: OPT4("Gut feeling", "Mostly gut", "Mixed", "Data-driven") },
    { cat: "control", t: "Do you have a single source of truth for business data?", o: OPT4("No", "Scattered", "Mostly", "Yes") },
  ];

  /* ---------------- State ---------------- */
  const S = { level: "full", step: "intro", qi: 0, basics: {}, answers: {}, queue: [] };
  const root = $("#xrayApp");
  if (!root) return;

  const RANGE = (id, label, opts) => ({ id, label, opts });
  const BASICS = [
    { id: "industry", label: "What does your business do?", type: "select",
      opts: ["Services", "E-commerce / Online", "Retail / Store", "Real estate", "Health / Clinic", "SaaS / Tech", "Education", "Other"] },
    { id: "team", label: "How many people work in the business?", type: "select", opts: ["1–3", "4–10", "11–30", "31–100", "100+"] },
    { id: "sellers", label: "How many salespeople?", type: "select", opts: ["0", "1–2", "3–5", "6–15", "16+"] },
    { id: "leads", label: "Monthly leads (approx.)", type: "select", opts: ["< 50", "50–200", "200–500", "500–2000", "2000+"] },
    { id: "deals", label: "Monthly deals / new customers", type: "select", opts: ["< 10", "10–30", "30–80", "80–300", "300+"] },
    { id: "crm", label: "Do you use a CRM?", type: "select", opts: ["No", "Spreadsheets", "Yes"] },
  ];
  const MID = { "< 50": 40, "50–200": 125, "200–500": 350, "500–2000": 1000, "2000+": 3000,
    "< 10": 6, "10–30": 20, "30–80": 55, "80–300": 180, "300+": 500 };

  /* ---------------- Flow ---------------- */
  function render() {
    if (S.step === "intro") return renderIntro();
    if (S.step === "basics") return renderBasics();
    if (S.step === "quiz") return renderQuiz();
    if (S.step === "scan") return renderScan();
    if (S.step === "result") return renderResult();
  }

  function renderIntro() {
    root.innerHTML = "";
    const w = el("div", "xr-hero");
    w.innerHTML = `
      <div class="eyebrow">DriftX Business X-Ray™</div>
      <div class="xr-kicker">How healthy is<br>your <span class="gradient-text">business?</span></div>
      <p class="lead muted">Answer a few questions about your team, sales, management and marketing — and DriftX AI will show you exactly what's holding your business back, and what to fix first.</p>
      <div class="xr-levels">
        <div class="xr-level" data-lvl="quick">
          <div class="tier">Quick Check</div><h3>3–5 minutes</h3><div class="time">~15 questions</div>
          <ul><li>Business Score</li><li>Top 3 problems</li><li>Where to start</li></ul>
        </div>
        <div class="xr-level is-featured" data-lvl="full">
          <div class="ribbon">Recommended</div>
          <div class="tier">Full Business X-Ray</div><h3>8–12 minutes</h3><div class="time">Adaptive questions</div>
          <ul><li>Full diagnosis + radar</li><li>Root-cause analysis</li><li>30-day action plan</li><li>Growth readiness</li></ul>
        </div>
        <div class="xr-level" data-lvl="pro">
          <div class="tier">DriftX Professional Audit</div><h3>With our team</h3><div class="time">Real data & calls</div>
          <ul><li>Deep operational audit</li><li>Employees · calls · CRM</li><li>Implementation plan</li></ul>
        </div>
      </div>
      <p class="xr-note">This is a diagnostic estimate based on your answers, not a guarantee of results. You choose ranges — no exact financials or trade secrets required. Your inputs stay in your browser for this assessment.</p>`;
    root.appendChild(w);
    w.querySelectorAll(".xr-level").forEach((c) => c.addEventListener("click", () => {
      const lvl = c.dataset.lvl;
      if (lvl === "pro") { window.location.href = "../#contact"; return; }
      S.level = lvl; S.step = "basics"; render();
    }));
  }

  function renderBasics() {
    root.innerHTML = "";
    const w = el("div", "xr-q");
    w.innerHTML = `<div class="xr-cat">Step 1 — Your business</div>
      <div class="xr-q__text">A few quick facts to tailor the diagnostic.</div>
      <div class="xr-basics" id="xrBasics"></div>
      <div class="xr-actions"><button class="btn btn--primary" id="xrGo">Start the X-Ray →</button>
      <button class="btn btn--ghost" id="xrBack2">Back</button></div>`;
    root.appendChild(w);
    const holder = $("#xrBasics", w);
    BASICS.forEach((f) => {
      const fld = el("div", "xr-field");
      fld.innerHTML = `<label>${f.label}</label><select data-id="${f.id}"><option value="">Select…</option>${f.opts.map(o => `<option>${o}</option>`).join("")}</select>`;
      holder.appendChild(fld);
    });
    $("#xrGo", w).addEventListener("click", () => {
      holder.querySelectorAll("select").forEach((s) => { if (s.value) S.basics[s.dataset.id] = s.value; });
      buildQueue(); S.step = "quiz"; S.qi = 0; render();
    });
    $("#xrBack2", w).addEventListener("click", () => { S.step = "intro"; render(); });
  }

  function buildQueue() {
    let qs = Q.filter((q) => !q.showIf || q.showIf(S.basics));
    if (S.level === "quick") {
      // one strongest question per category
      const seen = {}; qs = qs.filter((q) => (seen[q.cat] = (seen[q.cat] || 0) + 1) <= 2);
    }
    S.queue = qs;
  }

  function renderQuiz() {
    const q = S.queue[S.qi];
    root.innerHTML = "";
    const top = el("div", "xr-top");
    top.innerHTML = `<button class="back" id="xrBack">‹ Back</button>
      <span class="xr-cat">${CATS[q.cat].name}</span>
      <span class="xr-progress"><span style="width:${(S.qi / S.queue.length) * 100}%"></span></span>
      <span class="xr-count">${S.qi + 1} / ${S.queue.length}</span>`;
    const card = el("div", "xr-q");
    card.innerHTML = `<div class="xr-q__text">${q.t}</div><div class="xr-opts"></div>`;
    const opts = $(".xr-opts", card);
    q.o.forEach((o, i) => {
      const b = el("button", "xr-opt");
      if (S.answers[qkey(q)] && S.answers[qkey(q)].i === i) b.classList.add("sel");
      b.innerHTML = `<span class="dot"></span><span>${o.t}</span>`;
      b.addEventListener("click", () => {
        S.answers[qkey(q)] = { i, s: o.s, cat: q.cat, impl: q.impl };
        if (S.qi < S.queue.length - 1) { S.qi++; render(); } else { S.step = "scan"; render(); }
      });
      opts.appendChild(b);
    });
    root.appendChild(top); root.appendChild(card);
    $("#xrBack", top).addEventListener("click", () => {
      if (S.qi > 0) { S.qi--; render(); } else { S.step = "basics"; render(); }
    });
  }
  const qkey = (q) => q.cat + ":" + q.t.slice(0, 20);

  function renderScan() {
    root.innerHTML = "";
    const w = el("div", "xr-scan");
    w.innerHTML = `
      <div class="xr-scan__x"><svg viewBox="0 0 100 100"><path d="M50 2C52 30 70 48 98 50 70 52 52 70 50 98 48 70 30 52 2 50 30 48 48 30 50 2Z"/></svg></div>
      <h2>Scanning your business<span class="grad-accent">…</span></h2>
      <div style="font-size:clamp(24px,4vw,40px);font-weight:900;margin-top:6px"><span class="word grad-accent" id="xrWord">SALES</span></div>
      <div class="xr-scan__bar"><span id="xrScanBar"></span></div>
      <div class="xr-scan__list" id="xrScanList">${CATKEYS.map(k => `<span>${CATS[k].name}</span>`).join("")}</div>`;
    root.appendChild(w);
    const words = ["SALES", "PEOPLE", "MANAGEMENT", "MARKETING", "PROCESS", "AI"];
    const listSpans = w.querySelectorAll(".xr-scan__list span");
    if (reduce) { S.step = "result"; render(); return; }
    let i = 0, p = 0;
    const wordT = setInterval(() => { $("#xrWord", w).textContent = words[i % words.length]; i++; }, 380);
    const barT = setInterval(() => {
      p += 4 + Math.random() * 5; if (p > 100) p = 100;
      $("#xrScanBar", w).style.width = p + "%";
      const active = Math.floor((p / 100) * listSpans.length);
      listSpans.forEach((s, k) => s.classList.toggle("on", k <= active));
      if (p >= 100) { clearInterval(barT); clearInterval(wordT); setTimeout(() => { S.step = "result"; render(); }, 350); }
    }, 120);
  }

  /* ---------------- Scoring ---------------- */
  function scores() {
    const by = {}, cnt = {};
    CATKEYS.forEach((k) => { by[k] = 0; cnt[k] = 0; });
    Object.values(S.answers).forEach((a) => { by[a.cat] += a.s; cnt[a.cat]++; });
    const cat = {};
    CATKEYS.forEach((k) => { cat[k] = cnt[k] ? Math.round(by[k] / cnt[k]) : 60; });
    let num = 0, den = 0;
    CATKEYS.forEach((k) => { num += cat[k] * CATS[k].w; den += CATS[k].w; });
    const overall = Math.round(num / den);
    return { cat, overall };
  }
  const band = (s) => s >= 80 ? "high" : s >= 65 ? "ok" : s >= 50 ? "mid" : "low";
  const bandTag = (s) => s >= 65 ? { c: "ok", t: "Strong" } : s >= 50 ? { c: "warn", t: "Needs improvement" } : { c: "crit", t: "Critical" };

  function implementation() {
    const items = [
      { k: "crm", label: "CRM in place" }, { k: "targets", label: "Sales targets" },
      { k: "callmon", label: "Call monitoring / QA" }, { k: "leadtrack", label: "Lead follow-up tracking" },
      { k: "perfscore", label: "Performance scoring" }, { k: "onboarding", label: "Structured onboarding" },
      { k: "process", label: "Documented sales process" }, { k: "kpi", label: "Management KPIs" },
    ];
    let done = 0; const list = items.map((it) => {
      const a = Object.values(S.answers).find((x) => x.impl === it.k);
      const ok = a ? a.s >= 65 : false; if (ok) done++;
      return { label: it.label, ok };
    });
    return { pct: Math.round((done / items.length) * 100), list };
  }

  function renderResult() {
    root.innerHTML = "";
    const sc = scores();
    const impl = implementation();
    const ranked = CATKEYS.map((k) => ({ k, name: CATS[k].name, s: sc.cat[k] })).sort((a, b) => a.s - b.s);
    const weakest = ranked[0];
    const growth = clamp(Math.round(0.5 * sc.overall + 0.3 * impl.pct + 0.2 * ((sc.cat.sales + sc.cat.leadmgmt) / 2)), 0, 100);
    const ob = sc.overall >= 70 ? { cls: "good", t: "High Potential" } : sc.overall >= 55 ? { cls: "mid", t: "Improvement Required" } : { cls: "low", t: "Critical" };

    const w = el("div", "xr-result");
    // Score head
    const head = el("div", "xr-scorehead");
    head.innerHTML = `<div class="xr-bigscore" id="xrBig"><span class="n" id="xrN">0</span><span class="of">/ 100</span></div>
      <div><div class="label">Your Business X-Ray Score</div>
      <h2>${headline(sc.overall)}</h2>
      <span class="xr-band ${ob.cls}">${ob.t}</span></div>`;
    w.appendChild(head);

    // Radar
    const radar = block("The 8 dimensions of your business", radarHTML(sc.cat, ranked));
    w.appendChild(radar);

    // Diagnosis
    const diag = el("div", "xr-diag");
    const strong = ranked[ranked.length - 1];
    [ranked[0], ranked[1], ranked[2], strong].forEach((r) => {
      const bt = bandTag(r.s);
      const info = CATINFO[r.k]; const bnd = band(r.s);
      diag.appendChild(el("div", "item " + (bt.c === "ok" ? "ok" : bt.c === "warn" ? "warn" : "crit"),
        `<div class="head"><span class="name">${r.name}</span><span><span class="tag">${bt.t}</span> · <span class="pct">${r.s}%</span></span></div>
         <p>${bnd === "low" ? info.low : bnd === "high" || bnd === "ok" ? info.high : info.mid}</p>`));
    });
    w.appendChild(block(`We analyzed 8 areas — here's the diagnosis`, ""));
    w.lastChild.appendChild(diag);

    // Root cause of the weakest outcome
    const contrib = ranked.slice(0, 5).map((r) => ({ name: r.name, deficit: (100 - r.s) * CATS[r.k].w }));
    const tot = contrib.reduce((a, c) => a + c.deficit, 0) || 1;
    const rootRows = contrib.map((c) => `<div class="r"><span>${c.name}</span><span class="track"><i style="width:${Math.round(c.deficit / tot * 100)}%"></i></span><span class="p">${Math.round(c.deficit / tot * 100)}%</span></div>`).join("");
    const rootBlk = block(`Root-cause analysis — why "${weakest.name}" is your biggest gap`,
      `<div class="xr-root">${rootRows}</div><p class="muted" style="margin-top:14px;font-size:13.5px">More leads won't always fix this. Most of the gap comes from how existing opportunities are handled.</p>`);
    w.appendChild(rootBlk);

    // Priorities
    const prio = ranked.slice(0, 4).map((r, i) =>
      `<div class="p"><span class="num">#${i + 1}</span><div><h4>${priorityName(r.k)}</h4><p>${CATS[r.k].name} · currently ${r.s}%</p></div></div>`).join("");
    w.appendChild(block("What to fix first", `<div class="xr-prio">${prio}</div>`));

    // 30-day plan
    w.appendChild(block("Your 30-day improvement plan", planHTML(ranked)));

    // Implementation + growth readiness tiles
    const tiles = `<div class="xr-tiles">
      <div class="xr-tile"><div class="k">DriftX Implementation Score</div><div class="big" id="xrImpl">0%</div>
        <div class="meter"><i style="width:${impl.pct}%"></i></div>
        <p>You currently implement ${impl.pct}% of the recommended DriftX business framework.</p></div>
      <div class="xr-tile"><div class="k">Growth Readiness</div><div class="big" id="xrGrow">0</div>
        <div class="meter"><i style="width:${growth}%"></i></div>
        <p>How ready your business is to scale, based on the parameters assessed.</p></div>
    </div>`;
    w.appendChild(block("Implementation & readiness", tiles));

    // Simulator
    w.appendChild(block("What happens if you improve?", simHTML()));

    // Risks
    const risks = buildRisks(sc);
    if (risks.length) w.appendChild(block("What to be careful about", `<div class="xr-risks">${risks.map(r => `<div class="r">${r}</div>`).join("")}</div>`));

    // How DriftX helps
    const info = CATINFO[weakest.k];
    const help = `<div class="xr-help"><div class="prob">Your biggest opportunity</div>
      <h3>${priorityName(weakest.k)}</h3>
      <ul>${info.services.map(s => `<li>${s}</li>`).join("")}</ul>
      <div class="xr-actions" style="margin-top:0">
        <a class="btn btn--primary" href="../#contact" data-cursor="Let's Talk">Build my improvement plan with DriftX</a>
        <button class="btn btn--ghost" id="xrRestart">Start over</button>
      </div></div>`;
    w.appendChild(block("How DriftX can help", help));

    // honesty note
    w.appendChild(el("p", "xr-note", `The simulator and scores are calculated estimates based on your answers and the DriftX methodology — not a promise of results. ${sc.cat[strong.k] >= 70 ? `Note: your ${strong.name.toLowerCase()} looks strong — we wouldn't change it right now.` : ""}`));

    root.appendChild(w);

    // animations
    animateNumber($("#xrN"), sc.overall, () => { $("#xrBig").style.setProperty("--p", sc.overall); });
    $("#xrBig").style.setProperty("--p", reduce ? sc.overall : 0);
    if (!reduce) setTimeout(() => { $("#xrBig").style.transition = "none"; let p = 0; const t = setInterval(() => { p += 3; if (p >= sc.overall) { p = sc.overall; clearInterval(t); } $("#xrBig").style.setProperty("--p", p); }, 16); }, 100);
    animateNumber($("#xrImpl"), impl.pct, null, "%");
    animateNumber($("#xrGrow"), growth);
    const rst = $("#xrRestart"); if (rst) rst.addEventListener("click", () => { S.step = "intro"; S.answers = {}; S.basics = {}; render(); window.scrollTo(0, 0); });
    setupSim();
  }

  /* ---------- result helpers ---------- */
  function block(title, html) { const b = el("div", "xr-block"); b.innerHTML = `<h3>${title}</h3>${html}`; return b; }
  function headline(s) { return s >= 70 ? "Solid foundation, clear upside." : s >= 55 ? "Real potential — a few gaps are holding you back." : "Big opportunities are leaking right now."; }
  function priorityName(k) {
    return { management: "Management control & KPIs", sales: "Sales process & performance", employees: "People & individual targets",
      training: "Team training & call QA", marketing: "Marketing by revenue, not volume", leadmgmt: "Lead follow-up & CRM automation",
      cx: "Post-sale experience & retention", control: "Funnel tracking & data" }[k];
  }
  function radarHTML(cat, ranked) {
    const R = 120, cx = 150, cy = 150, n = CATKEYS.length;
    const pt = (i, r) => [cx + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n), cy + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n)];
    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => { grid += `<polygon points="${CATKEYS.map((k, i) => pt(i, R * f).join(",")).join(" ")}" fill="none" stroke="rgba(255,255,255,0.08)"/>`; });
    let axes = "", labels = "";
    CATKEYS.forEach((k, i) => { const [x, y] = pt(i, R); axes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.06)"/>`;
      const [lx, ly] = pt(i, R + 18); labels += `<text x="${lx}" y="${ly}" font-size="8.5" fill="#8B95AC" text-anchor="middle" dominant-baseline="middle">${CATS[k].name.split(" ")[0]}</text>`; });
    const poly = CATKEYS.map((k, i) => pt(i, R * cat[k] / 100).join(",")).join(" ");
    const dots = CATKEYS.map((k, i) => { const [x, y] = pt(i, R * cat[k] / 100); return `<circle cx="${x}" cy="${y}" r="3" fill="#F7A200"/>`; }).join("");
    const legend = ranked.slice().sort((a, b) => b.s - a.s).map((r) => {
      const col = r.s >= 65 ? "var(--lime)" : r.s >= 50 ? "var(--yellow)" : "var(--coral)";
      return `<div class="row"><span>${r.name}</span><span class="bar"><i style="width:${r.s}%;background:${col}"></i></span><span class="v">${r.s}</span></div>`;
    }).join("");
    return `<div class="xr-radar"><svg viewBox="0 0 300 300">${grid}${axes}
      <polygon points="${poly}" fill="rgba(247,162,0,0.18)" stroke="#F7A200" stroke-width="2"/>${dots}${labels}</svg>
      <div class="legend">${legend}</div></div>`;
  }
  function planHTML(ranked) {
    const top = ranked.slice(0, 3).map(r => CATS[r.k].name);
    const weeks = [
      { w: "Week 1 — Audit", li: ["Review recent sales calls", "Define KPIs & follow-up rules", "Map the current process"] },
      { w: "Week 2 — Train", li: ["Sales training & role-plays", "Objection handling", "Document scripts"] },
      { w: "Week 3 — Systemize", li: ["CRM automation", "Lead tracking & scoring", "Manager dashboard"] },
      { w: "Week 4 — Measure", li: ["Measure results", "Compare employees", "Adjust the process"] },
    ];
    return `<div class="xr-plan">${weeks.map(k => `<div class="xr-week"><div class="w">${k.w}</div><ul>${k.li.map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("")}</div>
      <p class="muted" style="margin-top:14px;font-size:13.5px">Focused on your weakest areas first: ${top.join(", ")}.</p>`;
  }
  function simHTML() {
    const leads = MID[S.basics.leads] || 500;
    const deals = MID[S.basics.deals] || Math.round(leads * 0.1);
    const conv = clamp(Math.round(deals / leads * 100), 1, 60);
    return `<div class="xr-sim" data-leads="${leads}" data-conv="${conv}">
      <div class="row">
        <div class="stat"><div class="n">${leads.toLocaleString()}</div><div class="l">Monthly leads</div></div>
        <div class="arrow">→</div>
        <div class="stat"><div class="n" id="simConv">${conv}%</div><div class="l">Conversion</div></div>
        <div class="arrow">→</div>
        <div class="stat"><div class="n up" id="simCust">${Math.round(leads * conv / 100)}</div><div class="l">Customers / mo</div></div>
      </div>
      <input type="range" id="simRange" min="0" max="15" value="0">
      <p class="cap">Improve conversion by <span class="delta" id="simDelta">+0</span> points → <span class="delta" id="simGain">+0</span> customers/month. Illustrative scenario, not a guarantee.</p>
    </div>`;
  }
  function setupSim() {
    const sim = $(".xr-sim", root); if (!sim) return;
    const leads = +sim.dataset.leads, base = +sim.dataset.conv;
    const range = $("#simRange", sim);
    range.addEventListener("input", () => {
      const d = +range.value, nc = base + d;
      $("#simConv", sim).textContent = nc + "%";
      $("#simCust", sim).textContent = Math.round(leads * nc / 100);
      $("#simDelta", sim).textContent = "+" + d;
      $("#simGain", sim).textContent = "+" + (Math.round(leads * nc / 100) - Math.round(leads * base / 100));
    });
  }
  function buildRisks(sc) {
    const r = [], a = S.answers, get = (impl) => Object.values(a).find(x => x.impl === impl);
    if (S.basics.sellers === "1–2") r.push("Over-dependence on one or two salespeople.");
    if (sc.cat.training < 55) r.push("No structured employee training or onboarding.");
    if (sc.cat.leadmgmt < 55) r.push("Leads aren't followed up consistently — opportunities leak.");
    if (get("callmon") && get("callmon").s < 55 && S.basics.sellers !== "0") r.push("No structured call monitoring or QA.");
    if (sc.cat.marketing < 60) r.push("Marketing decisions are based on lead volume rather than revenue.");
    if (sc.cat.control < 55) r.push("Decisions rely on gut feeling — no single source of truth.");
    if (get("perfscore") && get("perfscore").s < 55) r.push("No measurable employee / manager KPIs.");
    return r.slice(0, 6);
  }
  function animateNumber(node, target, done, suffix) {
    if (!node) return; suffix = suffix || "";
    if (reduce) { node.textContent = target + suffix; if (done) done(); return; }
    let cur = 0; const t = setInterval(() => { cur += Math.max(1, Math.ceil((target - cur) * 0.12)); if (cur >= target) { cur = target; clearInterval(t); if (done) done(); } node.textContent = cur + suffix; }, 24);
  }

  render();
})();
