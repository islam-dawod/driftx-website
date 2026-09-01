/* DRIFTX AI Marketing — screens. Every view reads from MKT_DATA / MKT_ENGINE. */
window.MKT_VIEWS = (function () {
  "use strict";
  var D = window.MKT_DATA, E = window.MKT_ENGINE;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  /* ---------------- small builders ---------------- */
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleDateString(window.MKT_LANG(), { day: "2-digit", month: "short" }); }
    catch (e) { return new Date(ts).toISOString().slice(0, 10); }
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString(window.MKT_LANG(), { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return ""; }
  }
  function fmtDT(ts) { return fmtDate(ts) + " " + fmtTime(ts); }
  function ago(ts) {
    var h = Math.max(0, Math.round((Date.now() - ts) / 3600000));
    return h < 24 ? window.T("l.hours", { n: h }) : window.T("l.days", { n: Math.round(h / 24) });
  }
  function dirOf(now, prev, lowerIsBetter) {
    if (prev == null || !isFinite(prev) || prev === 0) return "flat";
    if (Math.abs(now - prev) / Math.abs(prev) < 0.02) return "flat";
    var up = now > prev;
    return (lowerIsBetter ? !up : up) ? "up" : "down";
  }
  function deltaPct(now, prev) {
    if (!prev) return "";
    var p = Math.round(((now - prev) / prev) * 100);
    return (p > 0 ? "+" : "") + p + "%";
  }
  function meterColor(p) { return p >= 70 ? "var(--ok)" : p >= 45 ? "var(--acc-3)" : "var(--bad)"; }

  function kpi(o) {
    return '<div class="mk-kpi"><div class="k">' + esc(o.k) + '</div>' +
      '<div class="v">' + esc(o.v) + '</div>' +
      (o.d ? '<div class="d ' + (o.dir || "flat") + '">' + esc(o.d) + '</div>' : '') +
      (o.tg ? '<div class="tg">' + esc(o.tg) + '</div>' : '') +
      (o.m != null ? '<div class="mk-meter"><i data-w="' + Math.max(2, Math.min(100, o.m)) + '" style="background:' + meterColor(o.m) + '"></i></div>' : '') +
      '</div>';
  }
  function ring(score, bandName, label, sub) {
    var C = 2 * Math.PI * 44;
    var off = C * (1 - Math.max(0, Math.min(100, score)) / 100);
    var col = { green: "var(--ok)", yellow: "var(--acc-3)", orange: "var(--warn)", red: "var(--bad)" }[bandName] || "var(--acc-2)";
    return '<div class="mk-score"><div class="mk-ring"><svg viewBox="0 0 104 104" aria-hidden="true">' +
      '<circle class="trk" cx="52" cy="52" r="44"></circle>' +
      '<circle class="val" cx="52" cy="52" r="44" stroke="' + col + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-off="' + off.toFixed(1) + '"></circle>' +
      '</svg><div><b>' + score + '</b><div class="pc">/100</div></div></div>' +
      '<div class="meta"><div class="st">' + esc(label) + '</div>' + (sub ? '<div class="li">' + sub + '</div>' : '') + '</div></div>';
  }
  function card(title, body, actions) {
    return '<div class="mk-card"><div class="mk-card__h"><h3>' + esc(title) + '</h3>' +
      (actions ? '<span class="sp"></span>' + actions : '') + '</div>' + body + '</div>';
  }
  function sevBox(s) {
    var w = { critical: ["CRITICAL", "קריטי", "حرج"], high: ["HIGH", "גבוה", "مرتفع"], medium: ["MED", "בינוני", "متوسط"], low: ["LOW", "נמוך", "منخفض"] }[s.band];
    return '<span class="sev ' + s.band + '">' + Math.round(s.score) + '<small>' + window.MKT_P(w) + '</small></span>';
  }
  function tbl(cols, rows, opts) {
    opts = opts || {};
    var h = cols.map(function (c) { return '<th class="' + (c.num ? "num " : "") + (c.wrap ? "wrap" : "") + '">' + esc(c.t) + '</th>'; }).join("");
    var b = rows.map(function (r) {
      return '<tr class="' + (opts.clickAttr ? "clk" : "") + '"' + (opts.clickAttr && r._id ? ' ' + opts.clickAttr + '="' + esc(r._id) + '"' : '') + '>' +
        cols.map(function (c) {
          var v = r[c.k];
          return '<td class="' + (c.num ? "num " : "") + (c.cls ? c.cls : "") + (c.wrap ? " wrap" : "") + '">' + (v == null ? "—" : v) + '</td>';
        }).join("") + '</tr>';
    }).join("");
    return '<div class="mk-tw"><table class="mk-tb"><thead><tr>' + h + '</tr></thead><tbody>' + b + '</tbody></table></div>';
  }
  function empty() {
    return '<div class="mk-empty"><div class="ico">⃝</div><h3>' + window.T("empty.title") + '</h3>' +
      '<p>' + window.T("empty.body") + '</p>' +
      '<div class="acts"><a class="mk-btn mk-btn--pri" href="#/settings">' + window.T("empty.connect") + '</a>' +
      '<button class="mk-btn" data-act="demo-on">' + window.T("empty.demo") + '</button></div>' +
      '<p class="mk-hint" style="max-width:46ch">' + window.T("empty.demoNote") + '</p></div>';
  }
  /* shown wherever the connected sources genuinely cannot answer the screen */
  function needsSource() {
    return '<div class="mk-empty"><div class="ico">◔</div><h3>' + window.T("src.needTitle") + '</h3>' +
      '<p>' + window.T("src.needBody") + '</p>' +
      '<div class="mk-note" style="max-width:62ch;text-align:start"><b>' + window.T("src.needCta") + ':</b> ' +
      window.T("src.adsCovers") + '</div>' +
      '<div class="acts"><a class="mk-btn mk-btn--pri" href="#/campaigns">' + window.T("nav.campaigns") + '</a>' +
      '<a class="mk-btn" href="#/settings">' + window.T("nav.settings") + '</a></div></div>';
  }
  function chart(series, labels) {
    var max = Math.max.apply(null, series.concat([1]));
    return '<div class="mk-chart">' + series.map(function (v, i) {
      return '<div class="b" style="height:' + Math.max(2, (v / max) * 100) + '%" title="' + esc((labels && labels[i]) || "") + ": " + D.num(v) + '"></div>';
    }).join("") + '</div>';
  }
  function pill(txt, cls) { return '<span class="mk-badge ' + (cls || "neutral") + '">' + esc(txt) + '</span>'; }
  function bandLabel(b) {
    return window.MKT_P({
      green: ["Stable", "יציב", "مستقر"], yellow: ["Needs attention", "דורש תשומת לב", "يحتاج انتباهاً"],
      orange: ["High risk", "סיכון גבוה", "خطر مرتفع"], red: ["Critical", "קריטי", "حرج"]
    }[b] || ["", "", ""]);
  }
  function statusPill(st) {
    var map = { new: "info", verify: "medium", assigned: "violet", progress: "violet", external: "medium", resolved: "low", pendingCheck: "medium", closed: "neutral", reopened: "critical" };
    return pill(window.T("is." + st), map[st] || "neutral");
  }

  /* ---------------- dashboard ---------------- */
  function dashboard() {
    if (D.mode() === "empty") return { html: empty() };
    if (!D.caps().leads) return dashboardAds();
    var s = D.state();
    var m = D.metrics(), sc = D.scores(), T = D.targets();
    var iss = E.openIssues();
    var name = (s.user && s.user.name) || (s.biz && s.biz.name) || "—";

    var head = '<div class="mk-h1">' + esc(window.T("dash.hi", { name: name })) + '</div>' +
      '<div class="mk-sub">' + esc(window.T("dash.updated", { t: fmtDT(Date.now()) })) + ' · ' + esc(window.T("dash.trust")) + ' ' + sc.trust + '/100</div>';

    var gate = sc.gated ? '<div class="mk-banner" style="margin-top:14px"><span>⚠</span><p>' + esc(window.T("dash.gate", { v: sc.trust })) + '</p></div>' : '';

    var scoreCards = '<div class="mk-grid4 mk-sec">' +
      '<div class="mk-card">' + ring(sc.overall, sc.gated ? "orange" : sc.band, window.T("dash.overall"),
        (sc.gated ? pill(window.T("dash.estimate"), "medium") : pill(bandLabel(sc.band), sc.band === "green" ? "low" : sc.band === "yellow" ? "medium" : sc.band === "orange" ? "high" : "critical")) +
        '<div style="margin-top:6px">' + esc(window.T("dash.trust")) + ': <b>' + sc.trust + '</b></div>') + '</div>' +
      '<div class="mk-card">' + ring(sc.marketing, sc.marketing >= 70 ? "green" : sc.marketing >= 50 ? "orange" : "red", window.T("dash.mkHealth"),
        'CPL ' + D.money(m.cpl) + ' · CPQL ' + D.money(m.cpql) + '<br>' + window.T("tm.qualRate") + ' ' + m.qualifiedRate + '%') + '</div>' +
      '<div class="mk-card">' + ring(sc.sales, sc.sales >= 70 ? "green" : sc.sales >= 50 ? "orange" : "red", window.T("dash.salesPerf"),
        window.T("ld.respTime") + ' ' + E.fmtMin(m.respMedian) + ' · ' + window.T("tm.avgAttempts") + ' ' + m.avgAttempts + '<br>' + window.T("tm.closeRate") + ' ' + m.closeRate + '%') + '</div>' +
      '<div class="mk-card">' + ring(sc.cx, sc.cx >= 70 ? "green" : sc.cx >= 50 ? "orange" : "red", window.T("dash.cx"),
        window.T("rep.rating") + ' ' + m.cx.rating + ' · ' + window.T("rep.complaints") + ' ' + m.cx.complaints + '<br>' + window.T("rep.refunds") + ' ' + m.cx.refunds) + '</div>' +
      '</div>';

    var kpis = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("cm.leads"), v: D.num(m.leads), d: deltaPct(m.leads, m.prevLeads), dir: dirOf(m.leads, m.prevLeads), tg: window.T("l.target") + " " + D.num(T.leads), m: D.pct(m.leads, T.leads) }) +
      kpi({ k: "CPQL", v: D.money(m.cpql), d: deltaPct(m.cpql, m.prevCpl), dir: dirOf(m.cpql, T.cpql, true), tg: window.T("l.target") + " " + D.money(T.cpql), m: D.clamp((T.cpql / Math.max(m.cpql, 1)) * 100) }) +
      kpi({ k: window.T("cm.deals"), v: D.num(m.won), d: window.T("tm.closeRate") + " " + m.closeRate + "% (" + deltaPct(m.closeRate, m.prevCloseRate) + ")", dir: dirOf(m.closeRate, m.prevCloseRate), tg: window.T("l.target") + " " + T.close + "%", m: D.pct(m.closeRate, T.close) }) +
      kpi({ k: window.T("cm.revenue"), v: D.money(m.revenue), d: deltaPct(m.revenue, m.prevRevenue), dir: dirOf(m.revenue, m.prevRevenue), tg: "ROAS " + m.roas + " · " + window.T("l.target") + " " + T.roas, m: D.pct(m.roas, T.roas) }) +
      '</div>';

    var issRows = iss.slice(0, 6).map(function (i) {
      return {
        _id: i.key,
        sev: sevBox(i.sev),
        issue: '<div class="ti">' + esc(i.title) + '</div><div class="me">' + esc(i.deptName) + ' · ' + esc(window.T("l.detected")) + ' ' + ago(i.detectedAt) + '</div>',
        impact: (i.money ? D.money(i.money) : "—") + (i.leads ? ' · ' + i.leads + ' ' + window.T("cm.leads") : ''),
        owner: esc(i.owner),
        due: i.dueH <= 4 ? window.T("l.hours", { n: i.dueH }) : i.dueH <= 24 ? window.T("l.today") : window.T("l.days", { n: Math.round(i.dueH / 24) })
      };
    });
    var needs = card(window.T("dash.needsNow"),
      iss.length ? tbl([
        { t: window.T("l.severity"), k: "sev" },
        { t: window.T("l.issue"), k: "issue", wrap: true },
        { t: window.T("l.impact"), k: "impact" },
        { t: window.T("l.owner"), k: "owner" },
        { t: window.T("l.due"), k: "due" }
      ], issRows, { clickAttr: "data-issue" })
        : '<p class="mk-hint">' + window.T("dash.noIssues") + '</p>',
      '<a class="mk-btn mk-btn--sm" href="#/issues">' + window.T("nav.issues") + ' →</a>');

    var fnl = D.funnel();
    var mini = card(window.T("fn.title"), funnelHTML(fnl.slice(3, 12)), '<a class="mk-btn mk-btn--sm" href="#/funnel">' + window.T("nav.funnel") + ' →</a>');

    var todayAI = card(window.T("dash.todayAI"),
      '<div class="mk-rows">' + iss.slice(0, 3).map(function (i) {
        return '<div class="mk-row" style="grid-template-columns:1fr auto"><div><div class="ti">' + esc(i.corr) + '</div>' +
          '<div class="me">' + esc(i.owner) + ' · ' + esc(i.deptName) + ' · ' + window.T("l.confidence") + ' ' + Math.round(i.sev.C * 100) + '%</div></div>' +
          '<button class="mk-btn mk-btn--sm" data-act="task" data-key="' + i.key + '">' + window.T("is.createTask") + '</button></div>';
      }).join("") + '</div>' +
      '<p class="mk-hint" style="margin-top:10px">' + window.T("demo.engine") + '</p>',
      '<a class="mk-btn mk-btn--sm" href="#/diagnosis">' + window.T("nav.diagnosis") + ' →</a>');

    var emps = D.employeeRows();
    var byDept = card(window.T("dash.byDept"),
      tbl([
        { t: window.T("tm.rep"), k: "n" }, { t: window.T("tm.leadsGot"), k: "l", num: true },
        { t: window.T("tm.avgQuality"), k: "q", num: true }, { t: window.T("ld.respTime"), k: "r", num: true },
        { t: window.T("tm.avgAttempts"), k: "a", num: true }, { t: window.T("tm.closeRate"), k: "c", num: true },
        { t: window.T("tm.fairScore"), k: "f", num: true }
      ], emps.map(function (e) {
        return {
          _id: e.id, n: '<span class="k">' + esc(e.name) + '</span>', l: e.leads, q: e.avgQuality,
          r: E.fmtMin(e.respMedian), a: e.avgAttempts, c: e.closeRate + "%",
          f: '<b style="color:' + meterColor(e.fair) + '">' + e.fair + '</b>'
        };
      }), { clickAttr: "data-emp" }),
      '<a class="mk-btn mk-btn--sm" href="#/team">' + window.T("nav.team") + ' →</a>');

    return {
      html: head + gate + scoreCards + kpis +
        '<div class="mk-sec">' + needs + '</div>' +
        '<div class="mk-grid2 mk-sec">' + mini + todayAI + '</div>' +
        '<div class="mk-sec">' + byDept + '</div>'
    };
  }

  /* ---------------- dashboard: ads-only (live platforms, no CRM) ---------- */
  function dashboardAds() {
    var s = D.state(), m = D.metrics(), sc = D.scores(), T = D.targets();
    var iss = E.openIssues();
    var rem = D.remote();
    var name = (s.user && s.user.name) || (s.biz && s.biz.name) || "—";
    var lastSync = "—";
    if (rem && rem.connections) {
      Object.keys(rem.connections).forEach(function (k) {
        var c = rem.connections[k];
        if (c && c.lastSync) lastSync = fmtDT(Date.parse(c.lastSync.replace(" ", "T") + "Z"));
      });
    }
    var head = '<div class="mk-h1">' + esc(window.T("dash.hi", { name: name })) + '</div>' +
      '<div class="mk-sub">' + pill(window.T("live.badge"), "low") + ' ' +
      esc(window.T("dash.updated", { t: lastSync })) + '</div>';

    var note = '<div class="mk-banner" style="margin-top:14px"><span>◔</span><p>' + window.T("src.noOverall") + '</p>' +
      '<a class="mk-btn mk-btn--sm" href="#/settings">' + window.T("nav.settings") + '</a></div>';
    var mixed = (rem && rem.mixedCurrency)
      ? '<div class="mk-banner"><span>⇄</span><p>' + esc(window.T("live.mixedCurrency", { c: (rem.currencies || []).join(", ") })) + '</p></div>'
      : "";

    var top = '<div class="mk-grid2 mk-sec">' +
      '<div class="mk-card">' + ring(sc.marketing, sc.band, window.T("src.adsScore"),
        'CPL ' + D.money(m.cpl) + ' · ' + window.T("l.target") + ' ' + D.money(T.cpl) + '<br>CTR ' + m.ctr + '%') + '</div>' +
      '<div class="mk-card"><div class="mk-card__h"><h3>' + window.T("dash.trust") + '</h3></div>' +
        '<div class="mk-kpi" style="border:0;padding:0"><div class="v">' + sc.trust + '/100</div>' +
        '<div class="tg">' + window.T("conn.lastSync", { t: lastSync }) + '</div>' +
        '<div class="mk-meter"><i data-w="' + sc.trust + '" style="background:' + meterColor(sc.trust) + '"></i></div></div>' +
        '<p class="mk-hint" style="margin-top:10px">' + window.T("demo.engine") + '</p></div>' +
      '</div>';

    var kpis = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("cm.spend"), v: D.money(m.spend), d: deltaPct(m.spend, m.prevSpend), dir: dirOf(m.spend, m.prevSpend) }) +
      kpi({ k: window.T("cm.leads"), v: D.num(m.leads), d: deltaPct(m.leads, m.prevLeads), dir: dirOf(m.leads, m.prevLeads), tg: window.T("l.target") + " " + D.num(T.leads) }) +
      kpi({ k: "CPL", v: D.money(m.cpl), d: deltaPct(m.cpl, m.prevCpl), dir: dirOf(m.cpl, m.prevCpl, true), tg: window.T("l.target") + " " + D.money(T.cpl), m: D.clamp((T.cpl / Math.max(m.cpl, 1)) * 100) }) +
      kpi({ k: "CTR", v: m.ctr + "%", tg: D.num(m.clicks) + " " + window.T("cm.clicks"), m: D.clamp(m.ctr * 22) }) +
      '</div>';

    var issBox = card(window.T("dash.needsNow"),
      iss.length ? '<div class="mk-rows">' + iss.map(function (i) {
        return '<button class="mk-row" data-issue="' + i.key + '">' + sevBox(i.sev) +
          '<span><span class="ti">' + esc(i.title) + '</span><span class="me"><span>' + esc(i.deptName) + '</span>' +
          '<span>· ' + esc(i.owner) + '</span></span></span><span class="go">→</span></button>';
      }).join("") + '</div>' : '<p class="mk-hint">' + window.T("dash.noIssues") + '</p>',
      '<a class="mk-btn mk-btn--sm" href="#/issues">' + window.T("nav.issues") + ' →</a>');

    var rows = D.campaignRows().sort(function (a, b) { return b.spend - a.spend; }).slice(0, 8);
    var camps = card(window.T("cm.title"), tbl([
      { t: window.T("cm.name"), k: "n" }, { t: window.T("cm.platform"), k: "p" },
      { t: window.T("cm.spend"), k: "s", num: true }, { t: window.T("cm.leads"), k: "l", num: true },
      { t: "CPL", k: "cpl", num: true }, { t: "CTR", k: "ctr", num: true },
      { t: window.T("cm.frequency"), k: "f", num: true }, { t: window.T("cm.alert"), k: "al" }
    ], rows.map(function (c) {
      return {
        _id: c.id, n: '<span class="k">' + esc(c.name) + '</span>', p: c.platform === "google" ? "Google" : "Meta",
        s: D.money(c.spend), l: D.num(c.leads), cpl: D.money(c.cpl), ctr: c.ctr + "%", f: c.freq || "—",
        al: c.capped ? pill(window.T("cm.limited"), "medium")
          : (c.freq >= 3.4 && c.ctrDelta <= -12) ? pill(window.T("cm.fatigue"), "high")
          : c.cpl > T.cpl ? pill("CPL > " + D.money(T.cpl), "high") : pill(window.T("cm.healthy"), "low")
      };
    }), { clickAttr: "data-camp" }),
      '<a class="mk-btn mk-btn--sm" href="#/campaigns">' + window.T("nav.campaigns") + ' →</a>');

    return { html: head + note + mixed + top + kpis + '<div class="mk-sec">' + issBox + '</div><div class="mk-sec">' + camps + '</div>' };
  }

  /* ---------------- funnel ---------------- */
  function funnelHTML(stages) {
    var max = Math.max.apply(null, stages.map(function (s) { return s.v; }).concat([1]));
    return '<div class="mk-funnel">' + stages.map(function (s, i) {
      return '<div class="mk-fs ' + (s.leak ? "leak" : "") + '">' +
        '<div class="nm">' + esc(window.T(s.k, s.vars || {})) + '<span>' + (s.dept ? esc(E.deptName(s.dept)) : "") + '</span></div>' +
        '<div class="trk"><i data-w="' + Math.max(1.5, (s.v / max) * 100).toFixed(1) + '"></i><b>' + D.num(s.v) + '</b></div>' +
        '<div class="rt"><div class="p">' + (i === 0 ? "—" : s.rate + "%") + '</div>' +
        '<div class="g">' + (s.target != null && i > 0 ? window.T("l.target") + " " + s.target + "%" : "") + '</div></div></div>';
    }).join("") + '</div>';
  }
  function funnel() {
    if (D.mode() === "empty") return { html: empty() };
    if (!D.caps().leads) {
      var ma = D.metrics();
      var st = [
        { k: "fn.ads", v: ma.impressions, target: null, dept: "marketing" },
        { k: "fn.clicks", v: ma.clicks, target: 4, dept: "marketing" },
        { k: "fn.landing", v: ma.landing, target: 90, dept: "it" },
        { k: "fn.leads", v: ma.leads, target: 3, dept: "marketing" }
      ];
      st.forEach(function (x, i) {
        x.rate = i === 0 ? 100 : D.pct(x.v, st[i - 1].v);
        x.lost = i === 0 ? 0 : Math.max(0, st[i - 1].v - x.v);
        x.leak = x.target != null && x.rate < x.target * 0.92;
      });
      return { html: '<div class="mk-h1">' + window.T("fn.title") + '</div><div class="mk-sub">' + window.T("fn.sub") + '</div>' +
        '<div class="mk-sec">' + card(window.T("fn.title"), funnelHTML(st)) + '</div>' +
        '<div class="mk-sec">' + needsSource() + '</div>' };
    }
    var f = D.funnel(), m = D.metrics();
    var leaks = f.filter(function (s) { return s.leak; });
    var head = '<div class="mk-h1">' + window.T("fn.title") + '</div><div class="mk-sub">' + window.T("fn.sub") + '</div>';
    var rows = f.map(function (s, i) {
      return {
        stage: '<span class="k">' + esc(window.T(s.k, s.vars || {})) + '</span>',
        entered: D.num(i === 0 ? s.v : f[i - 1].v),
        continued: D.num(s.v),
        rate: i === 0 ? "—" : '<span class="' + (s.leak ? "bad" : "ok") + '">' + s.rate + "%</span>",
        target: s.target != null && i > 0 ? s.target + "%" : "—",
        lost: i === 0 ? "—" : D.num(s.lost),
        dept: esc(E.deptName(s.dept))
      };
    });
    return {
      html: head +
        '<div class="mk-sec">' + card(window.T("fn.title"), funnelHTML(f)) + '</div>' +
        '<div class="mk-sec">' + card(window.T("fn.stageDetail"), tbl([
          { t: window.T("fn.stageDetail"), k: "stage" }, { t: window.T("cm.leads"), k: "entered", num: true },
          { t: window.T("fn.passRate"), k: "continued", num: true }, { t: window.T("fn.passRate") + " %", k: "rate", num: true },
          { t: window.T("l.target"), k: "target", num: true }, { t: window.T("l.gap"), k: "lost", num: true },
          { t: window.T("l.dept"), k: "dept" }
        ], rows)) + '</div>' +
        (leaks.length ? '<div class="mk-sec">' + card(window.T("dash.needsNow"),
          '<ul class="mk-ul">' + leaks.map(function (s) {
            return '<li>' + esc(window.T(s.k, s.vars || {})) + ': ' + s.rate + '% ' + window.T("l.of") + ' ' + s.target + '% ' + window.T("l.target").toLowerCase() +
              ' — ' + esc(window.T("fn.lostHere", { n: D.num(s.lost) })) + ' · ' + esc(E.deptName(s.dept)) + '</li>';
          }).join("") + '</ul>') + '</div>' : '')
    };
  }

  /* ---------------- AI diagnosis ---------------- */
  var lastDx = null;
  function diagnosis() {
    if (D.mode() === "empty") return { html: empty() };
    var DX = window.MKT_DX;
    var head = '<div class="mk-h1">' + window.T("nav.diagnosis") + '</div><div class="mk-sub">' + window.T("demo.engine") + '</div>';
    var ask = '<div class="mk-card mk-sec"><div class="mk-chat">' +
      '<div class="mk-ask"><input class="mk-in" id="dxq" placeholder="' + esc(window.MKT_P(DX.askPh)) + '" aria-label="' + esc(window.MKT_P(DX.ask)) + '">' +
      '<button class="mk-btn mk-btn--pri" data-act="dx-run">' + esc(window.MKT_P(DX.run)) + '</button></div>' +
      '<div class="mk-chips">' + DX.presets.map(function (p) {
        return '<button class="mk-chip" data-dx="' + p.k + '">' + esc(window.MKT_P(p.q)) + '</button>';
      }).join("") + '</div></div></div>';
    return { html: head + ask + '<div id="dxOut" class="mk-sec">' + (lastDx ? answerHTML(lastDx) : "") + '</div>' };
  }
  function answerHTML(a) {
    var DX = window.MKT_DX;
    return '<div class="mk-ans">' +
      '<div class="mk-ans__h">' +
        '<span class="who">DriftX AI</span>' +
        pill(window.T("l.fact"), "info") + pill(window.T("l.est"), "medium") + pill(window.T("l.reco"), "violet") +
        '<span class="sp" style="margin-inline-start:auto"></span>' +
        (a.confidence == null ? pill(window.T("l.noData"), "medium")
          : pill(window.T("l.confidence") + " " + a.confidence + "%", a.confidence >= 75 ? "low" : "medium")) +
      '</div>' +
      '<div class="mk-blk"><div class="h">1 · ' + esc(window.MKT_P(DX.conclusion)) + '</div><p class="concl">' + esc(a.conclusion) + '</p></div>' +
      (a.support && a.support.length ? '<div class="mk-blk"><div class="h">2 · ' + esc(window.MKT_P(DX.support)) + ' ' + pill(window.T("l.fact"), "info") + '</div>' +
        '<ul class="mk-ul">' + a.support.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>' : '') +
      (a.split && a.split.length ? '<div class="mk-blk"><div class="h">3 · ' + esc(window.MKT_P(DX.split)) + ' ' + pill(window.T("l.est"), "medium") + '</div>' +
        '<div class="mk-split">' + a.split.map(function (r) {
          return '<div class="r"><div class="t">' + esc(r.t) + '</div><div class="p">' + r.p + '%</div>' +
            '<div class="bar"><i data-w="' + r.p + '"></i></div></div>';
        }).join("") + '</div><p class="mk-hint">' + esc(window.MKT_P(DX.splitNote)) + '</p></div>' : '') +
      (a.actions && a.actions.length ? '<div class="mk-blk"><div class="h">4 · ' + esc(window.MKT_P(DX.actions)) + ' ' + pill(window.T("l.reco"), "violet") + '</div>' +
        '<ul class="mk-ul">' + a.actions.map(function (x) { return '<li>' + esc(x.t) + (x.owner ? ' <span class="mk-hint">· ' + esc(x.owner) + '</span>' : '') + '</li>'; }).join("") + '</ul>' +
        '<div style="margin-top:10px"><button class="mk-btn mk-btn--pri mk-btn--sm" data-act="dx-tasks">' + esc(window.MKT_P(DX.createTasks)) + '</button></div></div>' : '') +
      '<div class="mk-blk"><div class="h">5 · ' + esc(window.MKT_P(DX.sources)) + '</div>' +
        '<div class="mk-srcs">' + a.sources.map(function (s) { return pill(s, "neutral"); }).join("") + '</div></div>' +
      '</div>';
  }
  function runDx(key) {
    lastDx = E.diagnose(key);
    var out = $("#dxOut");
    if (out) { out.innerHTML = lastDx ? answerHTML(lastDx) : ""; grow(out); }
  }

  function grow(root) {
    $$("[data-w]", root || document).forEach(function (el) { el.style.width = el.getAttribute("data-w") + "%"; });
    $$(".mk-ring .val", root || document).forEach(function (el) { el.style.strokeDashoffset = el.getAttribute("data-off"); });
  }

  /* ---------------- campaigns ---------------- */
  function campaigns() {
    if (D.mode() === "empty") return { html: empty() };
    var rows = D.campaignRows(), T = D.targets();
    var head = '<div class="mk-h1">' + window.T("cm.title") + '</div><div class="mk-sub">' + window.T("cm.noAuto") + '</div>';
    var body = tbl([
      { t: window.T("cm.name"), k: "n" }, { t: window.T("cm.platform"), k: "p" }, { t: window.T("cm.country"), k: "c" },
      { t: window.T("cm.budget"), k: "b", num: true }, { t: window.T("cm.spend"), k: "s", num: true },
      { t: window.T("cm.impr"), k: "im", num: true }, { t: window.T("cm.clicks"), k: "cl", num: true },
      { t: "CTR", k: "ctr", num: true }, { t: "CPC", k: "cpc", num: true },
      { t: window.T("cm.leads"), k: "l", num: true }, { t: "CPL", k: "cpl", num: true },
      { t: window.T("cm.qleads"), k: "q", num: true }, { t: "CPQL", k: "cpql", num: true },
      { t: window.T("cm.deals"), k: "d", num: true }, { t: window.T("cm.revenue"), k: "rev", num: true },
      { t: "ROAS", k: "roas", num: true }, { t: window.T("cm.alert"), k: "al" },
      { t: window.T("cm.aiReco"), k: "ai", wrap: true }
    ], rows.map(function (c) {
      var alert = c.capped ? pill(window.T("cm.limited"), "medium")
        : (c.freq >= 3.4 && c.ctrDelta <= -12) ? pill(window.T("cm.fatigue"), "high")
        : c.cpql > T.cpql ? pill("CPQL > " + D.money(T.cpql), "high")
        : pill(window.T("cm.healthy"), "low");
      var reco = c.capped && c.roas >= T.roas ? window.MKT_P(["Raise budget — capped above target return", "להעלות תקציב — מוגבל מעל התשואה היעד", "ارفع الميزانية — مقيّدة فوق المردود المستهدف"])
        : (c.freq >= 3.4 && c.ctrDelta <= -12) ? window.MKT_P(["Rotate creative, cap frequency", "רוטציית קריאייטיב, הגבלת Frequency", "دوّر الإبداعات وحدّد سقف التكرار"])
        : c.roas < T.roas * 0.45 ? window.MKT_P(["Cut or restructure — return below half of target", "לצמצם או לשנות מבנה — תשואה מתחת לחצי מהיעד", "قلّص أو أعد الهيكلة — المردود أدنى من نصف الهدف"])
        : c.cpql > T.cpql ? window.MKT_P(["Tighten targeting — qualified-lead cost above limit", "להדק טירגוט — עלות ליד איכותי מעל התקרה", "شدّد الاستهداف — تكلفة العميل المؤهّل فوق الحد"])
        : window.MKT_P(["Hold", "להשאיר", "أبقِ كما هو"]);
      return {
        _id: c.id, n: '<span class="k">' + esc(c.name) + '</span>', p: c.platform === "google" ? "Google" : "Meta", c: c.country,
        b: D.money(c.budget), s: D.money(c.spend), im: D.num(c.impressions), cl: D.num(c.clicks),
        ctr: c.ctr + "%", cpc: D.money(c.cpc), l: c.leads, cpl: D.money(c.cpl), q: c.qleads,
        cpql: '<span class="' + (c.cpql > T.cpql ? "bad" : "ok") + '">' + D.money(c.cpql) + '</span>',
        d: c.deals, rev: D.money(c.revenue),
        roas: '<span class="' + (c.roas >= T.roas ? "ok" : "bad") + '">' + c.roas + '</span>',
        al: alert, ai: esc(reco)
      };
    }), { clickAttr: "data-camp" });
    return { html: head + '<div class="mk-sec">' + body + '</div>' };
  }

  function campaignDetail(id) {
    var rows = D.campaignRows(), c = rows.filter(function (x) { return x.id === id; })[0];
    if (!c) return { html: empty() };
    var T = D.targets();
    var back = '<a class="mk-back" href="#/campaigns"><span class="ar">←</span> ' + window.T("cm.title") + '</a>';
    var head = '<div class="mk-h1">' + esc(c.name) + '</div><div class="mk-sub">' +
      (c.platform === "google" ? "Google Ads" : "Meta Ads") + ' · ' + c.country + ' · ' + window.T("cm.frequency") + ' ' + c.freq + '</div>';
    var kp = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("cm.spend"), v: D.money(c.spend), tg: window.T("cm.budget") + " " + D.money(c.budget) }) +
      kpi({ k: "CPL", v: D.money(c.cpl), tg: window.T("l.target") + " " + D.money(T.cpl), m: D.clamp((T.cpl / Math.max(c.cpl, 1)) * 100) }) +
      kpi({ k: "CPQL", v: D.money(c.cpql), tg: window.T("l.target") + " " + D.money(T.cpql), m: D.clamp((T.cpql / Math.max(c.cpql, 1)) * 100) }) +
      kpi({ k: "ROAS", v: String(c.roas), tg: window.T("l.target") + " " + T.roas, m: D.clamp((c.roas / T.roas) * 100) }) +
      '</div>';
    var series = c.days.map(function (d) { return Math.round(d.leads); });
    var labels = c.days.map(function (d) { return fmtDate(d.ts); });
    var perf = card(window.T("cm.perf"), chart(series, labels) +
      '<div class="mk-xax">' + labels.map(function (l, i) { return '<span>' + (i % 5 === 0 ? esc(l) : "") + '</span>'; }).join("") + '</div>');
    var gap = card(window.T("cm.gapCrm"),
      '<dl class="mk-def"><dt>' + window.T("cm.leads") + ' (' + window.T("cm.platform") + ')</dt><dd>' + c.leads + '</dd>' +
      '<dt>CRM</dt><dd>' + c.crm + '</dd>' +
      '<dt>' + window.T("l.gap") + '</dt><dd class="' + (c.gap ? "bad" : "") + '">' + c.gap + ' (' + D.pct(c.gap, c.leads) + '%)</dd>' +
      '<dt>' + window.T("cm.realSales") + '</dt><dd>' + c.deals + ' · ' + D.money(c.revenue) + '</dd></dl>');
    var byHour = [];
    for (var h = 0; h < 24; h++) byHour.push(Math.round(c.leads * (h > 7 && h < 21 ? 0.07 : 0.012) * (1 + (h % 3) * 0.1)));
    var hours = card(window.T("cm.byHour"), chart(byHour, byHour.map(function (_, i) { return i + ":00"; })));
    var terms = card(window.T("cm.terms"),
      tbl([{ t: window.T("cm.terms"), k: "t" }, { t: window.T("cm.clicks"), k: "c", num: true }, { t: window.T("cm.leads"), k: "l", num: true }, { t: "CPL", k: "cpl", num: true }],
        [
          { t: c.name.split("—")[0].trim() + " " + window.MKT_P(["near me", "בסביבתי", "قريب مني"]), c: Math.round(c.clicks * 0.22), l: Math.round(c.leads * 0.3), cpl: D.money(c.cpl * 0.7) },
          { t: window.MKT_P(["cheap", "זול", "رخيص"]) + " " + c.country, c: Math.round(c.clicks * 0.14), l: Math.round(c.leads * 0.06), cpl: D.money(c.cpl * 2.4) },
          { t: window.MKT_P(["price", "מחיר", "سعر"]), c: Math.round(c.clicks * 0.11), l: Math.round(c.leads * 0.12), cpl: D.money(c.cpl * 1.1) },
          { t: window.MKT_P(["free", "חינם", "مجاناً"]), c: Math.round(c.clicks * 0.08), l: Math.round(c.leads * 0.01), cpl: D.money(c.cpl * 5.2) }
        ]) +
      '<p class="mk-hint" style="margin-top:10px">' + window.T("cm.negatives") + ': ' +
      pill(window.MKT_P(["free", "חינם", "مجاناً"]), "high") + ' ' + pill(window.MKT_P(["cheap", "זול", "رخيص"]), "high") + '</p>');
    var acts = card(window.T("cm.actions"),
      '<ul class="mk-ul">' +
      (c.capped ? '<li>' + window.MKT_P(["This campaign is limited by budget above your target return — raising it is a financial action and needs approval.", "הקמפיין מוגבל בתקציב מעל התשואה היעד — העלאה היא פעולה כספית ומחייבת אישור.", "الحملة مقيّدة بالميزانية فوق المردود المستهدف — رفعها إجراء مالي ويتطلب موافقة."]) + '</li>' : '') +
      (c.freq >= 3.4 && c.ctrDelta <= -12 ? '<li>' + window.MKT_P(["Frequency " + c.freq + " with CTR " + c.ctrDelta + "% — rotate creative this week.", "Frequency " + c.freq + " עם CTR " + c.ctrDelta + "% — רוטציית קריאייטיב השבוע.", "التكرار " + c.freq + " مع CTR " + c.ctrDelta + "% — دوّر الإبداعات هذا الأسبوع."]) + '</li>' : '') +
      (c.gap ? '<li>' + window.MKT_P([c.gap + " leads did not reach the CRM from this campaign — check the connector before judging performance.", c.gap + " לידים מהקמפיין לא הגיעו ל-CRM — לבדוק את ה-Connector לפני שיפוט ביצועים.", c.gap + " عميلاً من الحملة لم يصلوا إلى CRM — افحص الموصل قبل الحكم على الأداء."]) + '</li>' : '') +
      '<li>' + window.T("cm.noAuto") + '</li></ul>',
      '<button class="mk-btn mk-btn--sm" disabled>' + window.MKT_P(["Change budget (needs approval)", "שינוי תקציב (מחייב אישור)", "تغيير الميزانية (يتطلب موافقة)"]) + '</button>');
    return { html: back + head + kp + '<div class="mk-grid2 mk-sec">' + perf + gap + '</div>' + '<div class="mk-grid2 mk-sec">' + hours + terms + '</div>' + '<div class="mk-sec">' + acts + '</div>' };
  }

  /* ---------------- leads ---------------- */
  var leadFilter = "all";
  function leads() {
    if (D.mode() === "empty") return { html: empty() };
    if (!D.caps().leads) return { html: '<div class="mk-h1">' + window.T("ld.title") + '</div>' + needsSource() };
    var m = D.metrics();
    var all = m.rows.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var filtered = leadFilter === "all" ? all : all.filter(function (l) { return l.flags.indexOf(leadFilter) >= 0; });
    var shown = filtered.slice(0, 120);
    var FLAGS = ["noCrm", "slaBreach", "noFollowup", "noUtm", "noOwner", "dup", "noLostReason", "badPhone", "soldNotMarked", "paidNoCampaign"];
    var counts = {};
    FLAGS.forEach(function (f) { counts[f] = all.filter(function (l) { return l.flags.indexOf(f) >= 0; }).length; });
    var head = '<div class="mk-h1">' + window.T("ld.title") + '</div>' +
      '<div class="mk-sub">' + window.T("ld.showing", { n: shown.length, t: filtered.length }) + '</div>';
    var chips = '<div class="mk-tabs mk-sec"><button class="mk-tab ' + (leadFilter === "all" ? "on" : "") + '" data-flag="all">' + window.T("l.all") + ' (' + all.length + ')</button>' +
      FLAGS.filter(function (f) { return counts[f] > 0; }).map(function (f) {
        return '<button class="mk-tab ' + (leadFilter === f ? "on" : "") + '" data-flag="' + f + '">' + window.T("flag." + f) + ' (' + counts[f] + ')</button>';
      }).join("") + '</div>';
    var body = tbl([
      { t: window.T("ld.name"), k: "n" }, { t: window.T("ld.phone"), k: "ph" }, { t: window.T("cm.country"), k: "c" },
      { t: window.T("ld.source"), k: "s" }, { t: window.T("cm.name"), k: "cm" },
      { t: window.T("ld.created"), k: "cr" }, { t: window.T("ld.crmAt"), k: "crm" },
      { t: window.T("ld.rep"), k: "rep" }, { t: window.T("ld.respTime"), k: "rt", num: true },
      { t: window.T("ld.attempts"), k: "at", num: true }, { t: window.T("l.status"), k: "st" },
      { t: window.T("ld.quality"), k: "q", num: true }, { t: window.T("ld.lostReason"), k: "lr" },
      { t: window.T("ld.dealValue"), k: "dv", num: true }, { t: window.T("ld.flags"), k: "fl", wrap: true }
    ], shown.map(function (l) {
      return {
        n: '<span class="k">' + esc(l.name) + '</span>', ph: esc(l.phone), c: l.country,
        s: l.source, cm: esc(l.campaign), cr: fmtDT(l.createdAt),
        crm: l.crmAt ? fmtTime(l.crmAt) : '<span class="bad">' + window.T("l.none") + '</span>',
        rep: l.owner ? esc(l.owner) : '<span class="bad">' + window.T("ld.unassigned") + '</span>',
        rt: l.firstMin == null ? "—" : E.fmtMin(l.firstMin),
        at: l.attempts, st: window.T("st." + l.status),
        q: l.quality, lr: l.lostReason ? l.lostReason : (l.status === "lost" ? '<span class="bad">' + window.T("l.none") + '</span>' : "—"),
        dv: l.deal ? D.money(l.deal) : "—",
        fl: l.flags.map(function (f) { return pill(window.T("flag." + f), f === "noCrm" || f === "slaBreach" ? "critical" : "medium"); }).join(" ")
      };
    }));
    return { html: head + chips + body };
  }

  /* ---------------- team ---------------- */
  function team() {
    if (D.mode() === "empty") return { html: empty() };
    if (!D.caps().leads) return { html: '<div class="mk-h1">' + window.T("tm.title") + '</div>' + needsSource() };
    var emps = D.employeeRows(), T = D.targets();
    var head = '<div class="mk-h1">' + window.T("tm.title") + '</div><div class="mk-sub">' + window.T("tm.sub") + '</div>';
    var body = tbl([
      { t: window.T("tm.rep"), k: "n" }, { t: window.T("tm.tenure"), k: "tn", num: true },
      { t: window.T("tm.leadsGot"), k: "l", num: true }, { t: window.T("tm.avgQuality"), k: "q", num: true },
      { t: window.T("ld.respTime"), k: "r", num: true }, { t: window.T("tm.contactRate"), k: "cr", num: true },
      { t: window.T("tm.avgAttempts"), k: "at", num: true }, { t: window.T("tm.followRate"), k: "fr", num: true },
      { t: window.T("tm.qualRate"), k: "qr", num: true }, { t: window.T("tm.appts"), k: "ap", num: true },
      { t: window.T("tm.deals"), k: "d", num: true }, { t: window.T("cm.revenue"), k: "rev", num: true },
      { t: window.T("tm.closeRate"), k: "c", num: true }, { t: window.T("tm.crmHygiene"), k: "h", num: true },
      { t: window.T("tm.fairScore"), k: "f", num: true }
    ], emps.map(function (e) {
      return {
        _id: e.id, n: '<span class="k">' + esc(e.name) + '</span>', tn: e.tenure, l: e.leads, q: e.avgQuality,
        r: '<span class="' + (e.respMedian <= T.resp ? "ok" : "bad") + '">' + E.fmtMin(e.respMedian) + '</span>',
        cr: e.contactRate + "%", at: e.avgAttempts, fr: e.followRate + "%", qr: e.qualRate + "%",
        ap: e.appts, d: e.deals, rev: D.money(e.revenue),
        c: '<span class="' + (e.closeRate >= T.close ? "ok" : "bad") + '">' + e.closeRate + '%</span>',
        h: e.hygiene + "%", f: '<b style="color:' + meterColor(e.fair) + '">' + e.fair + '</b>'
      };
    }), { clickAttr: "data-emp" });
    return { html: head + '<div class="mk-sec">' + body + '</div>' };
  }

  function teamDetail(id) {
    if (!D.caps().leads) return { html: needsSource() };
    var emps = D.employeeRows(), e = emps.filter(function (x) { return x.id === id; })[0];
    if (!e) return { html: empty() };
    var T = D.targets(), best = emps[0];
    var back = '<a class="mk-back" href="#/team"><span class="ar">←</span> ' + window.T("tm.title") + '</a>';
    var weak = e.respMedian > T.resp * 2 ? "speed" : e.avgAttempts < T.attempts ? "followup" : e.closeRate < T.close ? "objections" : "leadmgmt";
    var trRow = (window.MKT_TRAININGS || []).filter(function (x) { return x.k === weak; })[0];
    var read = window.MKT_P([
      e.name + " receives leads with an average quality of " + e.avgQuality + "/100 and converts " + e.closeRate + "% of qualified leads, against " + best.closeRate + "% for the strongest rep on the same lead mix. Median first response is " + E.fmtMin(e.respMedian) + " against a " + E.fmtMin(T.resp) + " target and average attempts are " + e.avgAttempts + " against " + T.attempts + ". The limiting factor is " + (weak === "speed" ? "response speed" : weak === "followup" ? "follow-up depth" : weak === "objections" ? "price and objection handling" : "CRM discipline") + ", not lead supply.",
      e.name + " מקבל לידים באיכות ממוצעת " + e.avgQuality + "/100 וממיר " + e.closeRate + "% מהאיכותיים, מול " + best.closeRate + "% של הנציג החזק על תמהיל דומה. חציון התגובה הוא " + E.fmtMin(e.respMedian) + " מול יעד " + E.fmtMin(T.resp) + ", וממוצע הניסיונות " + e.avgAttempts + " מול " + T.attempts + ". הגורם המגביל הוא " + (weak === "speed" ? "מהירות התגובה" : weak === "followup" ? "עומק ה-Follow-up" : weak === "objections" ? "טיפול במחיר ובהתנגדויות" : "משמעת ה-CRM") + ", לא אספקת הלידים.",
      e.name + " يتلقّى عملاء بجودة متوسطة " + e.avgQuality + "/100 ويحوّل " + e.closeRate + "% من المؤهّلين، مقابل " + best.closeRate + "% لأقوى مندوب على المزيج ذاته. وسيط الاستجابة " + E.fmtMin(e.respMedian) + " مقابل هدف " + E.fmtMin(T.resp) + "، ومتوسط المحاولات " + e.avgAttempts + " مقابل " + T.attempts + ". العامل المُقيّد هو " + (weak === "speed" ? "سرعة الاستجابة" : weak === "followup" ? "عمق المتابعة" : weak === "objections" ? "معالجة السعر والاعتراضات" : "انتظام CRM") + "، لا توريد العملاء."
    ]);
    var kp = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("tm.fairScore"), v: String(e.fair), m: e.fair, tg: window.T("tm.avgQuality") + " " + e.avgQuality }) +
      kpi({ k: window.T("ld.respTime"), v: E.fmtMin(e.respMedian), tg: window.T("l.target") + " " + E.fmtMin(T.resp), m: D.clamp((T.resp / Math.max(e.respMedian, 1)) * 100) }) +
      kpi({ k: window.T("tm.avgAttempts"), v: String(e.avgAttempts), tg: window.T("l.target") + " " + T.attempts, m: D.clamp((e.avgAttempts / T.attempts) * 100) }) +
      kpi({ k: window.T("tm.closeRate"), v: e.closeRate + "%", tg: window.T("l.target") + " " + T.close + "%", m: D.clamp((e.closeRate / T.close) * 100) }) +
      '</div>';
    var ai = card(window.T("tm.aiForRep"),
      '<p>' + esc(read) + '</p>' +
      '<div class="mk-blk" style="margin-top:12px"><div class="h">' + window.T("tm.improve") + '</div><ul class="mk-ul">' +
      (e.respMedian > T.resp ? '<li>' + window.T("ld.respTime") + ': ' + E.fmtMin(e.respMedian) + ' → ' + E.fmtMin(T.resp) + '</li>' : '') +
      (e.avgAttempts < T.attempts ? '<li>' + window.T("tm.avgAttempts") + ': ' + e.avgAttempts + ' → ' + T.attempts + '</li>' : '') +
      (e.closeRate < T.close ? '<li>' + window.T("tm.closeRate") + ': ' + e.closeRate + '% → ' + T.close + '%</li>' : '') +
      (e.hygiene < 90 ? '<li>' + window.T("tm.crmHygiene") + ': ' + e.hygiene + '% → 95%</li>' : '') +
      '</ul></div>',
      trRow ? '<button class="mk-btn mk-btn--pri mk-btn--sm" data-act="assign-train" data-train="' + weak + '">' + window.T("tm.assignTraining") + ': ' + esc(window.MKT_P(trRow.n)) + '</button>' : '');
    var recent = card(window.T("ld.title"), tbl([
      { t: window.T("ld.name"), k: "n" }, { t: window.T("ld.created"), k: "cr" }, { t: window.T("ld.respTime"), k: "rt", num: true },
      { t: window.T("ld.attempts"), k: "at", num: true }, { t: window.T("l.status"), k: "st" }, { t: window.T("ld.quality"), k: "q", num: true },
      { t: window.T("ld.dealValue"), k: "dv", num: true }
    ], e.rows.slice(0, 18).map(function (l) {
      return {
        n: esc(l.name), cr: fmtDT(l.createdAt), rt: l.firstMin == null ? "—" : E.fmtMin(l.firstMin),
        at: l.attempts, st: window.T("st." + l.status), q: l.quality, dv: l.deal ? D.money(l.deal) : "—"
      };
    })));
    return { html: back + '<div class="mk-h1">' + esc(e.name) + '</div><div class="mk-sub">' + window.T("tm.tenure") + ': ' + e.tenure + '</div>' + kp + '<div class="mk-sec">' + ai + '</div><div class="mk-sec">' + recent + '</div>' };
  }

  /* ---------------- issues ---------------- */
  var issFilter = "all";
  function issues() {
    if (D.mode() === "empty") return { html: empty() };
    var all = E.issues();
    var list = issFilter === "all" ? all : all.filter(function (i) { return i.status === issFilter; });
    var head = '<div class="mk-h1">' + window.T("is.title") + '</div><div class="mk-sub">' + window.T("is.sub") + '</div>';
    var STATES = ["all", "new", "assigned", "progress", "pendingCheck", "closed"];
    var tabs = '<div class="mk-tabs mk-sec">' + STATES.map(function (st) {
      var n = st === "all" ? all.length : all.filter(function (i) { return i.status === st; }).length;
      return '<button class="mk-tab ' + (issFilter === st ? "on" : "") + '" data-istab="' + st + '">' +
        (st === "all" ? window.T("l.all") : window.T("is." + st)) + ' (' + n + ')</button>';
    }).join("") + '</div>';
    var body = list.length ? '<div class="mk-rows">' + list.map(function (i) {
      return '<button class="mk-row" data-issue="' + i.key + '">' + sevBox(i.sev) +
        '<span><span class="ti">' + esc(i.title) + '</span><span class="me">' +
        '<span>' + esc(i.id) + '</span><span>· ' + esc(i.deptName) + '</span><span>· ' + esc(i.owner) + '</span>' +
        '<span>· ' + window.T("l.detected") + ' ' + ago(i.detectedAt) + '</span>' +
        (i.money ? '<span>· ' + D.money(i.money) + '</span>' : '') +
        '</span></span>' +
        '<span style="display:grid;gap:6px;justify-items:end">' + statusPill(i.status) +
        (i.approval ? pill(window.T("l.needsApproval"), "critical") : '') + '</span></button>';
    }).join("") + '</div>' : '<div class="mk-empty"><h3>' + window.T("is.noneTitle") + '</h3><p>' + window.T("dash.noIssues") + '</p></div>';
    return { html: head + tabs + body };
  }

  function issueDetail(key) {
    var all = E.issues(), i = all.filter(function (x) { return x.key === key; })[0];
    if (!i) return { html: empty() };
    var v = E.verify(i);
    var s = D.state();
    var task = (s.tasks || []).filter(function (t) { return t.issueKey === key; })[0];
    var back = '<a class="mk-back" href="#/issues"><span class="ar">←</span> ' + window.T("is.title") + '</a>';
    var head = '<div class="mk-h1">' + esc(i.title) + '</div>' +
      '<div class="mk-sub">' + esc(i.id) + ' · ' + statusPill(i.status) + ' ' + sevBox(i.sev).replace("sev ", "mk-badge ").replace(/<small>.*<\/small>/, "") +
      ' ' + pill(window.T("l.confidence") + " " + Math.round(i.sev.C * 100) + "%", "info") +
      (i.approval ? ' ' + pill(window.T("l.needsApproval"), "critical") : '') + '</div>';
    var facts = card(window.T("l.issue"), '<dl class="mk-def">' +
      '<dt>' + window.T("l.detected") + '</dt><dd>' + fmtDT(i.detectedAt) + ' (' + ago(i.detectedAt) + ')</dd>' +
      '<dt>' + window.T("l.dept") + '</dt><dd>' + esc(i.deptName) + '</dd>' +
      '<dt>' + window.T("l.owner") + '</dt><dd>' + esc(i.owner) + '</dd>' +
      '<dt>' + window.T("l.due") + '</dt><dd>' + window.T("l.hours", { n: i.dueH }) + '</dd>' +
      '<dt>' + window.T("l.leadsAffected") + '</dt><dd>' + (i.leads || "—") + '</dd>' +
      '<dt>' + window.T("l.moneyAtRisk") + '</dt><dd>' + (i.money ? D.money(i.money) + ' ' + pill(window.T("l.est"), "medium") : "—") + '</dd>' +
      '<dt>' + window.T("l.severity") + '</dt><dd>' + i.sev.I + ' × ' + i.sev.U + ' × ' + i.sev.S + ' × ' + i.sev.C + ' = <b>' + i.sev.score + '</b></dd>' +
      '</dl>');
    var why = card(window.T("l.impact"), '<p>' + esc(i.why) + '</p>' +
      '<div class="mk-blk" style="margin-top:12px"><div class="h">' + window.T("l.evidence") + ' ' + pill(window.T("l.fact"), "info") + '</div>' +
      '<ul class="mk-ul">' + i.evidence.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join("") + '</ul></div>');
    var cause = card(window.T("l.cause") + ' ' , '<div class="mk-split">' + i.causes.map(function (c) {
      return '<div class="r"><div class="t">' + esc(c.t) + '</div><div class="p">' + c.p + '%</div><div class="bar"><i data-w="' + c.p + '"></i></div></div>';
    }).join("") + '</div><p class="mk-hint">' + window.MKT_P(window.MKT_DX.splitNote) + '</p>');
    var actions = card(window.T("l.whatToDo"),
      '<div class="mk-blk"><div class="h">' + window.T("l.whatToDo") + ' ' + pill(window.T("l.reco"), "violet") + '</div><p>' + esc(i.corr) + '</p></div>' +
      '<div class="mk-blk" style="margin-top:12px"><div class="h">' + window.T("tk.solves") + '</div><p>' + esc(i.prev) + '</p></div>' +
      '<div class="mk-blk" style="margin-top:12px"><div class="h">' + window.T("l.verify") + '</div><p>' + esc(i.ver) + '</p></div>',
      task ? pill(window.T("is.taskExists") + " " + task.id, "violet")
        : '<button class="mk-btn mk-btn--pri mk-btn--sm" data-act="task" data-key="' + i.key + '">' + window.T("is.createTask") + '</button>');
    var check = card(window.T("l.verify"),
      '<dl class="mk-def"><dt>' + window.T("l.actual") + '</dt><dd>' + (v.actual == null ? "—" : v.actual) + (v.simulated ? ' ' + pill(window.T("l.demoData"), "medium") : '') + '</dd>' +
      '<dt>' + window.T("l.target") + '</dt><dd>' + v.target + '</dd>' +
      '<dt>' + window.T("l.status") + '</dt><dd>' + (v.pass ? '<span class="mk-badge low">PASS</span>' : '<span class="mk-badge critical">FAIL</span>') + '</dd></dl>' +
      '<p class="mk-hint" style="margin-top:10px">' + window.T("is.cantClose") + '</p>',
      '<button class="mk-btn mk-btn--sm" data-act="verify" data-key="' + i.key + '">' + window.T("is.checkNow") + '</button>');
    var STATES = ["new", "verify", "assigned", "progress", "external", "resolved", "pendingCheck", "closed", "reopened"];
    var flow = card(window.T("is.setStatus"),
      '<div class="mk-tabs" style="margin:0">' + STATES.map(function (st) {
        return '<button class="mk-tab ' + (i.status === st ? "on" : "") + '" data-setst="' + st + '" data-key="' + i.key + '">' + window.T("is." + st) + '</button>';
      }).join("") + '</div>' +
      (i.history.length ? '<div class="mk-blk" style="margin-top:14px"><div class="h">' + window.T("l.history") + '</div><ul class="mk-ul">' +
        i.history.slice().reverse().map(function (h) { return '<li>' + fmtDT(h.at) + ' — ' + window.T("is." + h.status) + (h.note ? ' · ' + esc(h.note) : '') + '</li>'; }).join("") + '</ul></div>' : ''));
    return { html: back + head + '<div class="mk-grid2 mk-sec">' + facts + why + '</div>' + '<div class="mk-grid2 mk-sec">' + cause + actions + '</div>' + '<div class="mk-grid2 mk-sec">' + check + flow + '</div>' };
  }

  /* ---------------- tasks ---------------- */
  function tasks() {
    var s = D.state();
    var head = '<div class="mk-h1">' + window.T("tk.title") + '</div><div class="mk-sub">' + window.T("tk.sub") + '</div>';
    if (!s.tasks.length) return { html: head + '<div class="mk-empty mk-sec"><h3>' + window.T("tk.todo") + '</h3><p>' + window.T("tk.empty") + '</p>' +
      '<div class="acts"><a class="mk-btn mk-btn--pri" href="#/issues">' + window.T("nav.issues") + '</a><a class="mk-btn" href="#/diagnosis">' + window.T("nav.diagnosis") + '</a></div></div>' };
    var cols = ["todo", "doing", "done"];
    var body = '<div class="mk-grid3 mk-sec">' + cols.map(function (c) {
      var list = s.tasks.filter(function (t) { return t.status === c; });
      return '<div class="mk-card"><div class="mk-card__h"><h3>' + window.T("tk." + c) + ' (' + list.length + ')</h3></div>' +
        (list.length ? list.map(function (t) {
          var tr = (window.MKT_TRAININGS || []).filter(function (x) { return x.k === t.training; })[0];
          return '<div class="mk-card" style="margin-bottom:10px;background:var(--panel-2)">' +
            '<div style="font-weight:700;font-size:14px;line-height:1.4">' + esc(t.name) + '</div>' +
            '<div class="mk-hint" style="margin-top:6px">' + esc(t.id) + ' · ' + esc(t.owner) + ' · ' + esc(t.deptName) + '</div>' +
            '<div class="mk-hint">' + window.T("tk.deadline") + ': ' + fmtDate(t.due) + ' · ' + pill(window.T("l." + (t.priority === "critical" ? "severity" : "severity")).replace(window.T("l.severity"), window.T("l.severity")), t.priority) + '</div>' +
            (t.steps.length ? '<ul class="mk-ul" style="margin-top:8px">' + t.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '') +
            '<div class="mk-hint" style="margin-top:8px"><b>' + window.T("tk.kpi") + ':</b> ' + esc(t.kpi) + '</div>' +
            (tr ? '<div class="mk-hint"><b>' + window.T("tk.training") + ':</b> ' + esc(window.MKT_P(tr.n)) + '</div>' : '') +
            (t.before != null ? '<div class="mk-hint">' + window.T("tk.before") + ': ' + t.before + ' → ' + window.T("l.target") + ': ' + t.target + (t.after != null ? ' · ' + window.T("tk.after") + ': ' + t.after : '') + '</div>' : '') +
            '<div class="mk-fo" style="display:flex;gap:7px;margin-top:10px;flex-wrap:wrap">' +
              (c !== "doing" && c !== "done" ? '<button class="mk-btn mk-btn--sm" data-task="' + t.id + '" data-to="doing">' + window.T("tk.doing") + '</button>' : '') +
              (c !== "done" ? '<button class="mk-btn mk-btn--sm mk-btn--pri" data-task="' + t.id + '" data-to="done">' + window.T("tk.markDone") + '</button>' : '') +
              '<a class="mk-btn mk-btn--sm" href="#/issues/' + esc(t.issueKey) + '">' + window.T("l.issue") + '</a>' +
            '</div></div>';
        }).join("") : '<p class="mk-hint">—</p>') + '</div>';
    }).join("") + '</div>';
    return { html: head + body };
  }

  /* ---------------- site & tracking ---------------- */
  function web() {
    if (D.mode() === "empty") return { html: empty() };
    var m = D.metrics(), st = m.site;
    if (!st) return { html: '<div class="mk-h1">' + window.T("wb.title") + '</div>' + needsSource() };
    var head = '<div class="mk-h1">' + window.T("wb.title") + '</div>';
    var kp = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("wb.uptime"), v: st.uptime.toFixed(2) + "%", m: D.clamp(st.uptime), tg: window.T("l.target") + " 99.9%" }) +
      kpi({ k: window.T("wb.load"), v: st.loadMobile + "s", m: D.clamp(100 - st.loadMobile * 18), tg: window.T("l.target") + " < 2.5s" }) +
      kpi({ k: window.T("wb.utmCover"), v: m.utmCoverage + "%", m: m.utmCoverage, tg: window.T("l.target") + " 95%" }) +
      kpi({ k: window.T("wb.checks"), v: (st.checksTotal - st.checksFailing) + "/" + st.checksTotal, m: D.pct(st.checksTotal - st.checksFailing, st.checksTotal), tg: st.checksFailing ? st.checksFailing + " " + window.T("wb.fail") : window.T("wb.pass") }) +
      '</div>';
    var det = card(window.T("wb.title"), '<dl class="mk-def">' +
      '<dt>' + window.T("wb.forms") + '</dt><dd>' + D.num(st.forms) + '</dd>' +
      '<dt>' + window.T("wb.formErr") + '</dt><dd class="' + (st.formErrors > 5 ? "bad" : "") + '">' + st.formErrors + '</dd>' +
      '<dt>' + window.T("wb.evtDup") + '</dt><dd>' + st.dupEvents + '</dd>' +
      '<dt>' + window.T("wb.ssl") + '</dt><dd>' + (st.ssl ? '<span class="mk-badge low">OK</span>' : '<span class="mk-badge critical">!</span>') + '</dd>' +
      '<dt>' + window.T("fn.crm") + '</dt><dd>' + m.captureRate + '%</dd></dl>');
    var iss = E.openIssues().filter(function (i) { return ["siteHealth", "utmMissing", "captureGap"].indexOf(i.key) >= 0; });
    var rel = card(window.T("is.title"), iss.length ? '<div class="mk-rows">' + iss.map(function (i) {
      return '<button class="mk-row" data-issue="' + i.key + '">' + sevBox(i.sev) + '<span><span class="ti">' + esc(i.title) + '</span>' +
        '<span class="me"><span>' + esc(i.owner) + '</span></span></span><span class="go">→</span></button>';
    }).join("") + '</div>' : '<p class="mk-hint">' + window.T("dash.noIssues") + '</p>');
    return { html: head + kp + '<div class="mk-grid2 mk-sec">' + det + rel + '</div>' };
  }

  /* ---------------- content & reputation ---------------- */
  function reputation() {
    if (D.mode() === "empty") return { html: empty() };
    var m = D.metrics(), cx = m.cx, camps = D.campaignRows();
    if (!cx) return { html: '<div class="mk-h1">' + window.T("rep.title") + '</div>' + needsSource() };
    var oldest = camps.slice().sort(function (a, b) { return b.freq - a.freq; })[0];
    var head = '<div class="mk-h1">' + window.T("rep.title") + '</div>';
    var kp = '<div class="mk-grid4 mk-sec">' +
      kpi({ k: window.T("rep.rating"), v: String(cx.rating), d: (cx.rating - cx.ratingPrev).toFixed(1), dir: cx.rating >= cx.ratingPrev ? "up" : "down", m: D.clamp((cx.rating / 5) * 100) }) +
      kpi({ k: window.T("rep.negative"), v: String(cx.negUnanswered), tg: window.T("l.target") + " 0", m: D.clamp(100 - cx.negUnanswered * 12) }) +
      kpi({ k: window.T("rep.respSla"), v: cx.slaMet + "%", m: cx.slaMet, tg: window.T("l.target") + " 95%" }) +
      kpi({ k: window.T("rep.refunds"), v: String(cx.refunds), tg: window.T("rep.complaints") + " " + cx.complaints, m: D.clamp(100 - cx.refunds * 9) }) +
      '</div>';
    var causes = card(window.T("rep.rootCauses"), '<div class="mk-split">' + cx.causes.map(function (c) {
      var tot = cx.causes.reduce(function (a, b) { return a + b.n; }, 0);
      return '<div class="r"><div class="t">' + esc(window.MKT_P(c.k)) + '</div><div class="p">' + c.n + '</div>' +
        '<div class="bar"><i data-w="' + D.pct(c.n, tot) + '"></i></div></div>';
    }).join("") + '</div>');
    var content = card(window.T("rep.creativeAge"), '<dl class="mk-def">' +
      '<dt>' + window.T("cm.frequency") + '</dt><dd>' + (oldest ? oldest.name + ' — ' + oldest.freq : "—") + '</dd>' +
      '<dt>CTR</dt><dd>' + (oldest ? oldest.ctrDelta + '%' : "—") + '</dd>' +
      '<dt>' + window.T("rep.approval") + '</dt><dd>' + (D.state().assess[10] === 100 ? '<span class="mk-badge low">' + window.T("im.implemented") + '</span>' : '<span class="mk-badge medium">' + window.T("im.partial") + '</span>') + '</dd></dl>');
    return { html: head + kp + '<div class="mk-grid2 mk-sec">' + causes + content + '</div>' };
  }

  /* ---------------- knowledge ---------------- */
  function knowledge() {
    var s = D.state();
    var openKeys = D.mode() === "empty" ? [] : E.openIssues().map(function (i) { return i.train; });
    var head = '<div class="mk-h1">' + window.T("kb.title") + '</div><div class="mk-sub">' + window.T("kb.sub") + '</div>';
    var list = (window.MKT_TRAININGS || []).slice().sort(function (a, b) {
      return (openKeys.indexOf(b.k) >= 0 ? 1 : 0) - (openKeys.indexOf(a.k) >= 0 ? 1 : 0);
    });
    var body = '<div class="mk-kb mk-sec">' + list.map(function (t) {
      var st = s.training[t.k] || {};
      var matched = openKeys.indexOf(t.k) >= 0;
      return '<div class="mk-kbc ' + (matched ? "match" : "") + '">' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        pill(window.MKT_P(window.MKT_AREAS[t.area] || ["", "", ""]), "neutral") +
        (matched ? pill(window.T("kb.matched"), "violet") : "") +
        (st.completed ? pill(window.T("kb.completed"), "low") : st.opened ? pill(window.T("kb.opened"), "info") : pill(window.T("kb.notStarted"), "neutral")) +
        '</div>' +
        '<h4>' + esc(window.MKT_P(t.n)) + '</h4><p>' + esc(window.MKT_P(t.d)) + '</p>' +
        (st.completed ? '<p class="mk-hint">' + window.T("kb.effect") + ': ' + (st.after != null ? st.after : window.T("kb.effectPending")) + '</p>' : '') +
        '<div class="fo">' +
        '<button class="mk-btn mk-btn--sm" data-train-open="' + t.k + '">' + window.T("kb.open") + '</button>' +
        (st.completed ? '' : '<button class="mk-btn mk-btn--sm mk-btn--pri" data-train-done="' + t.k + '">' + window.T("kb.markDone") + '</button>') +
        '</div></div>';
    }).join("") + '</div>';
    return { html: head + body };
  }

  /* ---------------- implementation ---------------- */
  function implementation() {
    var impl = D.implementationScore();
    var head = '<div class="mk-h1">' + window.T("im.title") + '</div><div class="mk-sub">' + window.T("im.sub") + '</div>';
    if (impl == null) {
      return { html: head + '<div class="mk-empty mk-sec"><h3>' + window.T("ob.s5") + '</h3><p>' + window.T("ob.assessSub") + '</p>' +
        '<div class="acts"><a class="mk-btn mk-btn--pri" href="#/settings">' + window.T("im.answerIt") + '</a></div></div>' };
    }
    var areas = D.implementationByArea();
    var top = '<div class="mk-card mk-sec">' + ring(impl, impl >= 70 ? "green" : impl >= 50 ? "orange" : "red", window.T("dash.impl"),
      window.T("ob.answered", { n: Object.keys(D.state().assess).length, t: (window.MKT_ASSESS || []).length })) + '</div>';
    var bars = card(window.T("im.area"), '<div class="mk-imp">' + areas.map(function (a) {
      var word = a.score >= 75 ? window.T("im.good") : a.score >= 50 ? window.T("im.needs") : window.T("im.weak");
      return '<div class="mk-impr" data-area="' + a.area + '"><div class="nm">' + esc(window.MKT_P(window.MKT_AREAS[a.area])) + '</div>' +
        '<div class="trk"><i data-w="' + a.score + '" style="background:' + meterColor(a.score) + '"></i></div>' +
        '<div class="st">' + a.score + '% · ' + word + '</div></div>';
    }).join("") + '</div>');
    var detail = card(window.T("im.evidenceChecked"), '<div class="mk-rows">' + areas.map(function (a) {
      return a.items.map(function (it) {
        var word = it.v === 100 ? window.T("im.implemented") : it.v === 60 ? window.T("im.partial") : it.v === 30 ? window.T("im.planned") : window.T("im.not");
        var cls = it.v === 100 ? "low" : it.v === 60 ? "medium" : it.v === 30 ? "info" : "critical";
        var gain = it.v === 100 ? 0 : Math.round((100 - it.v) / (window.MKT_ASSESS || []).length);
        return '<div class="mk-row" style="grid-template-columns:1fr auto"><div>' +
          '<div class="ti">' + esc(window.MKT_P(it.q.q)) + '</div>' +
          '<div class="me"><span>' + esc(window.MKT_P(window.MKT_AREAS[a.area])) + '</span>' +
          '<span>· ' + window.T("im.evidenceChecked") + ': ' + esc(window.MKT_P(it.q.e)) + '</span>' +
          (gain ? '<span>· ' + window.T("im.points", { n: gain }) + '</span>' : '') + '</div></div>' +
          pill(word, cls) + '</div>';
      }).join("");
    }).join("") + '</div>');
    return { html: head + top + '<div class="mk-sec">' + bars + '</div><div class="mk-sec">' + detail + '</div>' };
  }

  /* ---------------- reports ---------------- */
  function reports() {
    if (D.mode() === "empty") return { html: empty() };
    if (!D.caps().leads) return reportsAds();
    var s = D.state(), m = D.metrics(), sc = D.scores(), T = D.targets();
    var iss = E.issues(), open = iss.filter(function (i) { return i.status !== "closed"; });
    var fixed = iss.filter(function (i) { return i.status === "closed" || i.status === "pendingCheck"; });
    var f = D.funnel();
    var head = '<div class="mk-h1">' + window.T("rp.title") + '</div>' +
      '<div class="mk-sub">' + window.T("rp.generated", { t: fmtDT(Date.now()), biz: (s.biz && s.biz.name) || "—", trust: sc.trust }) + '</div>' +
      '<div style="margin-top:12px"><button class="mk-btn mk-btn--pri mk-btn--sm" data-act="print">' + window.T("l.export") + '</button></div>';
    var bySrc = {};
    m.rows.forEach(function (l) {
      bySrc[l.source] = bySrc[l.source] || { s: l.source, n: 0, q: 0, w: 0, rev: 0 };
      bySrc[l.source].n++; if (l.qualified) bySrc[l.source].q++;
      if (l.status === "won") { bySrc[l.source].w++; bySrc[l.source].rev += l.deal; }
    });
    var rep = '<div class="mk-rep mk-sec">' +
      '<div><h2>' + window.T("rp.weekly") + '</h2><p class="mk-hint">' + window.T("rp.generated", { t: fmtDT(Date.now()), biz: (s.biz && s.biz.name) || "—", trust: sc.trust }) + '</p></div>' +
      '<div><h3>' + window.T("rp.summary") + '</h3><p>' + esc(window.MKT_P([
        "Overall score " + sc.overall + "/100 with data reliability " + sc.trust + ". " + open.length + " issues are open, " + open.filter(function (i) { return i.sev.band === "critical"; }).length + " of them critical. Revenue " + D.money(m.revenue) + " against a " + D.money(T.revenue) + " target.",
        "ציון כללי " + sc.overall + "/100 עם אמינות נתונים " + sc.trust + ". " + open.length + " בעיות פתוחות, " + open.filter(function (i) { return i.sev.band === "critical"; }).length + " מהן קריטיות. הכנסה " + D.money(m.revenue) + " מול יעד " + D.money(T.revenue) + ".",
        "النتيجة العامة " + sc.overall + "/100 وموثوقية البيانات " + sc.trust + ". " + open.length + " مشكلة مفتوحة، منها " + open.filter(function (i) { return i.sev.band === "critical"; }).length + " حرجة. الإيراد " + D.money(m.revenue) + " مقابل هدف " + D.money(T.revenue) + "."
      ])) + '</p></div>' +
      '<div><h3>' + window.T("rp.kpiVs") + '</h3>' + tbl([
        { t: "KPI", k: "k" }, { t: window.T("l.actual"), k: "a", num: true }, { t: window.T("l.target"), k: "t", num: true }, { t: window.T("dash.vsPrev"), k: "p", num: true }
      ], [
        { k: window.T("cm.leads"), a: D.num(m.leads), t: D.num(T.leads), p: deltaPct(m.leads, m.prevLeads) },
        { k: "CPL", a: D.money(m.cpl), t: D.money(T.cpl), p: deltaPct(m.cpl, m.prevCpl) },
        { k: "CPQL", a: D.money(m.cpql), t: D.money(T.cpql), p: "—" },
        { k: window.T("ld.respTime"), a: E.fmtMin(m.respMedian), t: E.fmtMin(T.resp), p: deltaPct(m.respMedian, m.prevRespMedian) },
        { k: window.T("tm.closeRate"), a: m.closeRate + "%", t: T.close + "%", p: deltaPct(m.closeRate, m.prevCloseRate) },
        { k: window.T("cm.revenue"), a: D.money(m.revenue), t: D.money(T.revenue), p: deltaPct(m.revenue, m.prevRevenue) },
        { k: "ROAS", a: String(m.roas), t: String(T.roas), p: "—" }
      ]) + '</div>' +
      '<div><h3>' + window.T("rp.quality") + '</h3>' + tbl([
        { t: window.T("ld.source"), k: "s" }, { t: window.T("cm.leads"), k: "n", num: true },
        { t: window.T("cm.qleads"), k: "q", num: true }, { t: window.T("cm.deals"), k: "w", num: true },
        { t: window.T("cm.revenue"), k: "rev", num: true }
      ], Object.keys(bySrc).map(function (k) {
        var x = bySrc[k];
        return { s: k, n: x.n, q: x.q + " (" + D.pct(x.q, x.n) + "%)", w: x.w, rev: D.money(x.rev) };
      })) + '</div>' +
      '<div><h3>' + window.T("rp.funnelGaps") + '</h3><ul class="mk-ul">' + f.filter(function (x) { return x.leak; }).map(function (x) {
        return '<li>' + esc(window.T(x.k, x.vars || {})) + ': ' + x.rate + '% (' + window.T("l.target") + ' ' + x.target + '%) — ' + E.deptName(x.dept) + '</li>';
      }).join("") + '</ul></div>' +
      '<div><h3>' + window.T("rp.openIssues") + '</h3><ul class="mk-ul">' + open.slice(0, 6).map(function (i) {
        return '<li>' + esc(i.title) + ' — ' + i.sev.band + ' · ' + esc(i.owner) + ' · ' + D.money(i.money) + '</li>';
      }).join("") + '</ul></div>' +
      (fixed.length ? '<div><h3>' + window.T("rp.fixed") + '</h3><ul class="mk-ul">' + fixed.map(function (i) {
        var v = E.verify(i);
        return '<li>' + esc(i.title) + ' — ' + (v.pass ? "PASS" : "FAIL") + ' (' + v.actual + ' / ' + v.target + ')</li>';
      }).join("") + '</ul></div>' : '') +
      '<div class="dec"><h3>' + window.T("rp.decisions") + '</h3><ul class="mk-ul">' + open.slice(0, 3).map(function (i) {
        return '<li>' + esc(i.corr) + ' — ' + esc(i.owner) + (i.approval ? ' · ' + window.T("l.needsApproval") : '') + '</li>';
      }).join("") + '</ul></div>' +
      '<div><h3>' + window.T("rp.nextWeek") + '</h3><ul class="mk-ul">' + open.slice(0, 3).map(function (i) {
        return '<li>' + esc(i.ver) + '</li>';
      }).join("") + '</ul></div>' +
      '</div>';
    return { html: head + rep };
  }

  /* ---------------- reports: ads-only ---------------- */
  function reportsAds() {
    var s = D.state(), m = D.metrics(), sc = D.scores(), T = D.targets();
    var iss = E.openIssues();
    var rows = D.campaignRows().sort(function (a, b) { return b.spend - a.spend; });
    var head = '<div class="mk-h1">' + window.T("rp.title") + '</div>' +
      '<div class="mk-sub">' + window.T("rp.generated", { t: fmtDT(Date.now()), biz: (s.biz && s.biz.name) || "—", trust: sc.trust }) + '</div>' +
      '<div style="margin-top:12px"><button class="mk-btn mk-btn--pri mk-btn--sm" data-act="print">' + window.T("l.export") + '</button></div>';
    var rep = '<div class="mk-rep mk-sec">' +
      '<div><h2>' + window.T("rp.weekly") + '</h2><p class="mk-hint">' + pill(window.T("live.badge"), "low") + ' ' + window.T("src.adsCovers") + '</p></div>' +
      '<div><h3>' + window.T("rp.kpiVs") + '</h3>' + tbl([
        { t: "KPI", k: "k" }, { t: window.T("l.actual"), k: "a", num: true },
        { t: window.T("l.target"), k: "t", num: true }, { t: window.T("dash.vsPrev"), k: "p", num: true }
      ], [
        { k: window.T("cm.spend"), a: D.money(m.spend), t: "—", p: deltaPct(m.spend, m.prevSpend) },
        { k: window.T("cm.leads"), a: D.num(m.leads), t: D.num(T.leads), p: deltaPct(m.leads, m.prevLeads) },
        { k: "CPL", a: D.money(m.cpl), t: D.money(T.cpl), p: deltaPct(m.cpl, m.prevCpl) },
        { k: "CTR", a: m.ctr + "%", t: "—", p: "—" },
        { k: window.T("cm.clicks"), a: D.num(m.clicks), t: "—", p: "—" }
      ]) + '</div>' +
      '<div><h3>' + window.T("cm.title") + '</h3>' + tbl([
        { t: window.T("cm.name"), k: "n" }, { t: window.T("cm.spend"), k: "s", num: true },
        { t: window.T("cm.leads"), k: "l", num: true }, { t: "CPL", k: "cpl", num: true },
        { t: "CTR", k: "ctr", num: true }, { t: window.T("cm.alert"), k: "al" }
      ], rows.map(function (c) {
        return { n: c.name, s: D.money(c.spend), l: D.num(c.leads), cpl: D.money(c.cpl), ctr: c.ctr + "%",
          al: c.capped ? window.T("cm.limited") : (c.freq >= 3.4 && c.ctrDelta <= -12) ? window.T("cm.fatigue") : window.T("cm.healthy") };
      })) + '</div>' +
      '<div><h3>' + window.T("rp.openIssues") + '</h3><ul class="mk-ul">' + (iss.length ? iss.map(function (i) {
        return '<li>' + esc(i.title) + ' — ' + i.sev.band + ' · ' + esc(i.owner) + '</li>';
      }).join("") : '<li>' + window.T("dash.noIssues") + '</li>') + '</ul></div>' +
      '<div class="dec"><h3>' + window.T("src.needTitle") + '</h3><p>' + window.T("src.needBody") + '</p></div>' +
      '</div>';
    return { html: head + rep };
  }

  /* ---------------- shared forms (onboarding + settings) ---------------- */
  var COUNTRIES = ["IL", "AE", "SA", "JO", "PS", "EG", "TR", "CY", "US", "UK", "DE", "FR"];
  var LANGS3 = [["Hebrew", "עברית", "العبرية"], ["Arabic", "ערבית", "العربية"], ["English", "אנגלית", "الإنجليزية"], ["Russian", "רוסית", "الروسية"], ["Turkish", "טורקית", "التركية"]];
  var CURR = ["₪", "$", "€", "£", "AED", "SAR"];

  function fld(label, inner) { return '<div class="mk-fld"><label class="mk-lbl">' + esc(label) + '</label>' + inner + '</div>'; }
  function inp(id, val, type, ph) {
    return '<input class="mk-in" id="' + id + '" type="' + (type || "text") + '" value="' + esc(val == null ? "" : val) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>';
  }
  function sel(id, opts, val) {
    return '<select class="mk-sel" id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + esc(o.v) + '"' + (String(o.v) === String(val) ? " selected" : "") + '>' + esc(o.t) + '</option>';
    }).join("") + '</select>';
  }
  function multi(name, items, chosen) {
    return '<div class="mk-tabs" style="margin:0">' + items.map(function (it) {
      var on = (chosen || []).indexOf(it.v) >= 0;
      return '<button type="button" class="mk-tab ' + (on ? "on" : "") + '" data-multi="' + name + '" data-v="' + esc(it.v) + '">' + esc(it.t) + '</button>';
    }).join("") + '</div>';
  }

  var forms = {
    biz: function () {
      var b = D.state().biz || {};
      return '<div class="mk-grid2">' +
        fld(window.T("ob.bizName"), inp("f_name", b.name)) +
        fld(window.T("ob.industry"), sel("f_industry", (window.MKT_INDUSTRIES || []).map(function (x, i) { return { v: i, t: window.MKT_P(x) }; }), b.industry)) +
        fld(window.T("ob.website"), inp("f_site", b.site, "text", "https://")) +
        fld(window.T("ob.currency"), sel("f_currency", CURR.map(function (c) { return { v: c, t: c }; }), b.currency || "₪")) +
        fld(window.T("ob.employees"), inp("f_employees", b.employees, "number")) +
        fld(window.T("ob.reps"), inp("f_reps", b.reps, "number")) +
        fld(window.T("ob.revenue"), inp("f_revenue", b.revenue, "number")) +
        fld(window.T("ob.budget"), inp("f_budget", b.budget, "number")) +
        fld(window.T("ob.avgDeal"), inp("f_avgDeal", b.avgDeal, "number")) +
        fld(window.T("ob.leadsMo"), inp("f_leadsMo", b.leadsMo, "number")) +
        fld(window.T("ob.dealsMo"), inp("f_dealsMo", b.dealsMo, "number")) +
        fld(window.T("ob.services"), inp("f_services", b.services)) +
        '</div>' +
        '<div class="mk-sec">' + fld(window.T("ob.countries"), multi("countries", COUNTRIES.map(function (c) { return { v: c, t: c }; }), b.countries || ["IL"])) + '</div>' +
        '<div class="mk-sec">' + fld(window.T("ob.langs"), multi("langs", LANGS3.map(function (l, i) { return { v: String(i), t: window.MKT_P(l) }; }), b.langs || ["0", "2"])) + '</div>' +
        '<div class="mk-sec">' + fld(window.T("ob.goals"), '<textarea class="mk-ta" id="f_goals">' + esc(b.goals || "") + '</textarea>') + '</div>';
    },
    collectBiz: function (multiState) {
      var g = function (id) { var el = $("#" + id); return el ? el.value : ""; };
      var b = D.state().biz || {};
      return {
        name: g("f_name") || b.name, industry: g("f_industry"), site: g("f_site"), currency: g("f_currency") || "₪",
        employees: g("f_employees"), reps: g("f_reps"), revenue: g("f_revenue"), budget: g("f_budget"),
        avgDeal: g("f_avgDeal"), leadsMo: g("f_leadsMo"), dealsMo: g("f_dealsMo"), services: g("f_services"),
        goals: g("f_goals"),
        countries: (multiState && multiState.countries) || b.countries || ["IL"],
        langs: (multiState && multiState.langs) || b.langs || ["0", "2"]
      };
    },
    depts: function () {
      var s = D.state();
      return '<p class="mk-hint" style="margin-bottom:14px">' + window.T("ob.deptsSub") + '</p>' +
        '<div class="mk-picks">' + (window.MKT_DEPTS || []).map(function (d) {
          var v = s.depts[d.k] || {};
          return '<div class="mk-pick ' + (v.on ? "on" : "") + '" data-dept="' + d.k + '">' +
            '<button type="button" class="nm" data-dept-toggle="' + d.k + '" style="width:100%;text-align:start"><span class="bx">' + (v.on ? "✓" : "") + '</span>' + esc(window.MKT_P(d.n)) + '</button>' +
            (v.on ? '<input class="mk-in" data-dept-owner="' + d.k + '" placeholder="' + esc(window.T("ob.deptOwner")) + '" value="' + esc(v.owner || "") + '">' +
              '<input class="mk-in" type="number" data-dept-people="' + d.k + '" placeholder="' + esc(window.T("ob.deptPeople")) + '" value="' + esc(v.people || "") + '">' : '') +
            '</div>';
        }).join("") + '</div>';
    },
    conns: function () {
      var s = D.state();
      return '<p class="mk-hint" style="margin-bottom:14px">' + window.T("ob.connSub") + '</p>' +
        '<div class="mk-conns">' + (window.MKT_CONNS || []).map(function (c) {
          var v = s.conns[c.k] || { status: "off" };
          var cls = v.status === "on" ? "on" : v.status === "err" ? "err" : "";
          var dot = v.status === "on" ? "ok" : v.status === "err" ? "bad" : v.status === "auth" ? "warn" : "off";
          var label = v.status === "on" ? window.T("conn.connected") : v.status === "err" ? window.T("conn.syncErr") : v.status === "auth" ? window.T("conn.needsAuth") : window.T("conn.off");
          return '<div class="mk-conn ' + cls + '">' +
            '<div class="hd"><span class="mk-dot ' + dot + '"></span><span class="nm">' + esc(window.MKT_P(c.n)) + '</span>' +
            '<span class="sp"></span>' + pill(label, v.status === "on" ? "low" : v.status === "err" ? "critical" : v.status === "auth" ? "medium" : "neutral") + '</div>' +
            '<div class="mt"><span>' + window.T("conn.lastSync", { t: v.lastSync ? fmtDT(v.lastSync) : window.T("conn.never") }) + '</span>' +
            '<span>' + window.T("conn.records", { n: D.num(v.status === "on" ? (v.records || c.rec) : 0) }) + '</span></div>' +
            '<div class="acts">' +
            (v.status === "on"
              ? '<button class="mk-btn mk-btn--sm" data-conn="' + c.k + '" data-to="off">' + window.T("se.disconnect") + '</button>' +
                '<button class="mk-btn mk-btn--sm" data-conn="' + c.k + '" data-to="on">' + window.T("se.retry") + '</button>'
              : '<button class="mk-btn mk-btn--sm mk-btn--pri" data-conn="' + c.k + '" data-to="on">' + window.T("se.connect") + '</button>') +
            '</div></div>';
        }).join("") + '</div>';
    },
    targets: function () {
      var t = D.state().targets || {};
      var d = D.DEFAULT_TARGETS;
      var keys = [["leads", "tg.leads"], ["qleads", "tg.qleads"], ["cpl", "tg.cpl"], ["cpql", "tg.cpql"],
        ["resp", "tg.resp"], ["attempts", "tg.attempts"], ["contact", "tg.contact"], ["appt", "tg.appt"],
        ["close", "tg.close"], ["revenue", "tg.revenue"], ["cac", "tg.cac"], ["roas", "tg.roas"]];
      return '<p class="mk-hint" style="margin-bottom:14px">' + window.T("ob.targetsSub") + '</p>' +
        '<div class="mk-grid3">' + keys.map(function (k) {
          return fld(window.T(k[1]), inp("t_" + k[0], t[k[0]] != null ? t[k[0]] : d[k[0]], "number"));
        }).join("") + '</div>';
    },
    collectTargets: function () {
      var out = {};
      Object.keys(D.DEFAULT_TARGETS).forEach(function (k) {
        var el = $("#t_" + k);
        if (el && el.value !== "") out[k] = parseFloat(el.value);
      });
      return out;
    },
    assess: function () {
      var s = D.state();
      var OPTS = [[100, "im.implemented"], [60, "im.partial"], [30, "im.planned"], [0, "im.not"], ["na", "im.na"]];
      var answered = Object.keys(s.assess).length;
      return '<p class="mk-hint">' + window.T("ob.assessSub") + '</p>' +
        '<p class="mk-hint" style="margin-bottom:14px"><b>' + window.T("ob.answered", { n: answered, t: (window.MKT_ASSESS || []).length }) + '</b></p>' +
        '<div class="mk-rows">' + (window.MKT_ASSESS || []).map(function (q, i) {
          return '<div class="mk-q"><div class="qt">' + esc(window.MKT_P(q.q)) + '</div>' +
            '<div class="qe">' + window.T("ob.evidence") + ': ' + esc(window.MKT_P(q.e)) + ' · ' + esc(window.MKT_P(window.MKT_AREAS[q.area] || ["", "", ""])) + '</div>' +
            '<div class="mk-opts">' + OPTS.map(function (o) {
              var on = String(s.assess[i]) === String(o[0]);
              return '<button type="button" class="mk-opt ' + (on ? "on" : "") + '" data-assess="' + i + '" data-v="' + o[0] + '">' + window.T(o[1]) + '</button>';
            }).join("") + '</div></div>';
        }).join("") + '</div>';
    }
  };

  /* ---------------- settings ---------------- */
  var setTab = "conns";
  function settings() {
    var s = D.state();
    var TABS = [["conns", "se.conns"], ["business", "se.business"], ["depts", "se.depts"], ["targets", "se.targets"], ["assessment", "se.assessment"], ["data", "se.data"]];
    var head = '<div class="mk-h1">' + window.T("se.title") + '</div>' +
      '<div class="mk-tabs mk-sec">' + TABS.map(function (t) {
        return '<button class="mk-tab ' + (setTab === t[0] ? "on" : "") + '" data-settab="' + t[0] + '">' + window.T(t[1]) + '</button>';
      }).join("") + '</div>';
    var body = "";
    if (setTab === "conns") {
      var srv = "";
      if (window.MKT_REMOTE && window.MKT_REMOTE.serverMode()) {
        var rem = D.remote();
        var conns = (rem && rem.connections) || null;
        srv = card(window.T("se.serverConns"),
          '<div class="mk-conns">' + ["meta", "google"].map(function (k) {
            var c = (conns && conns[k]) || { status: "off", configured: false };
            var dot = c.status === "on" ? "ok" : c.status === "err" ? "bad" : c.status === "auth" ? "warn" : "off";
            var label = c.status === "on" ? window.T("conn.connected") : c.status === "err" ? window.T("conn.syncErr")
              : c.status === "auth" ? window.T("conn.needsAuth") : window.T("conn.off");
            return '<div class="mk-conn ' + (c.status === "on" ? "on" : c.status === "err" ? "err" : "") + '">' +
              '<div class="hd"><span class="mk-dot ' + dot + '"></span><span class="nm">' +
              (k === "meta" ? "Meta Ads" : "Google Ads") + '</span><span class="sp"></span>' +
              pill(label, c.status === "on" ? "low" : c.status === "err" ? "critical" : "neutral") + '</div>' +
              '<div class="mt"><span>' + window.T("conn.lastSync", { t: c.lastSync ? fmtDT(Date.parse(String(c.lastSync).replace(" ", "T") + "Z")) : window.T("conn.never") }) + '</span>' +
              (c.apiVersion ? '<span>API ' + esc(c.apiVersion) + '</span>' : '') +
              (c.error ? '<span class="bad" style="color:var(--bad)">' + esc(String(c.error).slice(0, 140)) + '</span>' : '') +
              '</div><div class="acts">' +
              '<button class="mk-btn mk-btn--sm mk-btn--pri" data-act="sync-now" data-provider="' + k + '">' + window.T("live.syncNow") + '</button>' +
              (k === "google" ? '<a class="mk-btn mk-btn--sm" href="/api/oauth/google/start">' + window.T("se.connectGoogle") + '</a>' : '') +
              '</div></div>';
          }).join("") + '</div>' +
          '<p class="mk-hint" style="margin-top:12px">' + window.T("se.serverMode") + ' · ' + window.T("src.adsCovers") + '</p>',
          '<button class="mk-btn mk-btn--sm" data-act="sync-now" data-provider="all">' + window.T("live.syncNow") + '</button>');
      }
      body = srv + (srv ? '<div class="mk-sec">' : '') + card(window.T("se.conns"), forms.conns()) + (srv ? '</div>' : '');
    }
    else if (setTab === "business") body = card(window.T("se.business"), forms.biz(),
      '<button class="mk-btn mk-btn--pri mk-btn--sm" data-act="save-biz">' + window.T("l.save") + '</button>');
    else if (setTab === "depts") body = card(window.T("se.depts"), forms.depts());
    else if (setTab === "targets") body = card(window.T("se.targets"), forms.targets(),
      '<button class="mk-btn mk-btn--pri mk-btn--sm" data-act="save-targets">' + window.T("l.save") + '</button>');
    else if (setTab === "assessment") body = card(window.T("se.assessment"), forms.assess());
    else body = card(window.T("se.data"),
      '<dl class="mk-def"><dt>' + window.T("auth.email") + '</dt><dd>' + esc((s.user && s.user.email) || "—") + '</dd>' +
      '<dt>' + window.T("l.demoData") + '</dt><dd>' + (s.demo ? window.T("conn.connected") : window.T("conn.off")) + '</dd>' +
      '<dt>' + window.T("se.storage") + '</dt><dd>localStorage · ' + D.KEY + '</dd></dl>' +
      '<div style="display:flex;gap:9px;margin-top:14px;flex-wrap:wrap">' +
      '<button class="mk-btn mk-btn--sm" data-act="' + (s.demo ? "demo-off" : "demo-on") + '">' + (s.demo ? window.T("demo.turnOff") : window.T("empty.demo")) + '</button>' +
      '<button class="mk-btn mk-btn--sm" data-act="wipe">' + window.T("se.reset") + '</button></div>' +
      '<p class="mk-hint" style="margin-top:12px">' + window.T("auth.localOnly") + '</p>');
    return { html: head + '<div class="mk-sec">' + body + '</div>' };
  }
  function setSettingsTab(t) { setTab = t; }
  function setLeadFilter(f) { leadFilter = f; }
  function setIssFilter(f) { issFilter = f; }

  return {
    /* exported helpers for the other chunk + app shell */
    _: { $: $, $$: $$, esc: esc, kpi: kpi, ring: ring, card: card, tbl: tbl, empty: empty, pill: pill,
      statusPill: statusPill, sevBox: sevBox, chart: chart, fmtDate: fmtDate, fmtDT: fmtDT, ago: ago,
      dirOf: dirOf, deltaPct: deltaPct, meterColor: meterColor, funnelHTML: funnelHTML, grow: grow },
    dashboard: dashboard, funnel: funnel, diagnosis: diagnosis, runDx: runDx,
    campaigns: campaigns, campaignDetail: campaignDetail, leads: leads,
    team: team, teamDetail: teamDetail, issues: issues, issueDetail: issueDetail,
    tasks: tasks, web: web, reputation: reputation, knowledge: knowledge,
    implementation: implementation, reports: reports, settings: settings,
    forms: forms, setSettingsTab: setSettingsTab, setLeadFilter: setLeadFilter, setIssFilter: setIssFilter,
    grow: grow
  };
})();
