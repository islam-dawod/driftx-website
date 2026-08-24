/* DRIFTX AI Marketing — shell, router, sign-in, onboarding, wiring. */
(function () {
  "use strict";
  var D = window.MKT_DATA, E = window.MKT_ENGINE, V = window.MKT_VIEWS;
  var H = V._;
  var $ = H.$, $$ = H.$$, esc = H.esc;
  var ROOT = document.getElementById("mkRoot");
  var multiState = {};        /* onboarding multi-selects */
  var obStep = 0;

  /* ---------------- language + theme ---------------- */
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "he" || lang === "ar") ? "rtl" : "ltr";
    try { localStorage.setItem("driftx_lang", lang); } catch (e) {}
    render();
  }
  function initLang() {
    var l = "en";
    try {
      var saved = localStorage.getItem("driftx_lang");
      if (saved && ["en", "he", "ar"].indexOf(saved) >= 0) l = saved;
      else { var b = (navigator.language || "en").slice(0, 2); if (["en", "he", "ar"].indexOf(b) >= 0) l = b; }
    } catch (e) {}
    var q = new URLSearchParams(location.search).get("lang");
    if (q && ["en", "he", "ar"].indexOf(q) >= 0) l = q;
    document.documentElement.lang = l;
    document.documentElement.dir = (l === "he" || l === "ar") ? "rtl" : "ltr";
  }
  function applyTheme(t) {
    D.set({ theme: t });
    ROOT.setAttribute("data-theme", t);
  }

  /* ---------------- routes ---------------- */
  var ROUTES = [
    { r: "dashboard", i: "◱", k: "nav.dashboard", g: 0 },
    { r: "diagnosis", i: "◈", k: "nav.diagnosis", g: 0 },
    { r: "funnel", i: "⧗", k: "nav.funnel", g: 1 },
    { r: "campaigns", i: "◎", k: "nav.campaigns", g: 1 },
    { r: "leads", i: "☰", k: "nav.leads", g: 1 },
    { r: "team", i: "⚇", k: "nav.team", g: 1 },
    { r: "web", i: "⌘", k: "nav.web", g: 1 },
    { r: "reputation", i: "✶", k: "nav.reputation", g: 1 },
    { r: "issues", i: "⚠", k: "nav.issues", g: 2 },
    { r: "tasks", i: "✓", k: "nav.tasks", g: 2 },
    { r: "knowledge", i: "◫", k: "nav.knowledge", g: 2 },
    { r: "implementation", i: "▤", k: "nav.implementation", g: 2 },
    { r: "reports", i: "▦", k: "nav.reports", g: 2 },
    { r: "settings", i: "⚙", k: "nav.settings", g: 2 }
  ];
  function route() {
    var h = (location.hash || "#/dashboard").replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return { name: parts[0] || "dashboard", id: parts[1] || null };
  }

  /* ---------------- sign-in ---------------- */
  function authHTML() {
    return '<div class="mk-auth"><div class="mk-auth__box">' +
      '<div class="lg"><img src="../../assets/brand/logo-mark.png" alt="DriftX" width="120" height="34">' +
      '<span class="mk-badge violet">' + window.T("app.tag") + '</span></div>' +
      '<h1>' + window.T("auth.title") + '</h1><div class="sb">' + window.T("auth.sub") + '</div>' +
      '<form id="authForm" autocomplete="off">' +
      '<div class="mk-fld"><label class="mk-lbl" for="au_email">' + window.T("auth.email") + '</label>' +
      '<input class="mk-in" id="au_email" type="email" required placeholder="name@company.com"></div>' +
      '<div class="mk-fld"><label class="mk-lbl" for="au_pass">' + window.T("auth.pass") + '</label>' +
      '<input class="mk-in" id="au_pass" type="password" autocomplete="new-password"></div>' +
      '<div class="rowb"><label><input type="checkbox" id="au_rem" checked> ' + window.T("auth.remember") + '</label>' +
      '<button type="button" class="mk-btn mk-btn--ghost mk-btn--sm" data-act="need-backend">' + window.T("auth.forgot") + '</button></div>' +
      '<button class="mk-btn mk-btn--pri" type="submit" style="justify-content:center">' + window.T("auth.enter") + '</button>' +
      '<div class="mk-or"><span>' + window.T("auth.or") + '</span></div>' +
      '<button type="button" class="mk-btn" style="justify-content:center" data-act="need-backend">' + window.T("auth.google") + '</button>' +
      '<button type="button" class="mk-btn" style="justify-content:center" data-act="need-backend">' + window.T("auth.2fa") + '</button>' +
      '<p class="mk-note">' + window.T("auth.needBackend") + '</p>' +
      '<p class="mk-note">' + window.T("auth.localOnly") + '</p>' +
      '<div class="rowb"><div class="mk-lang">' + langButtons() + '</div>' +
      '<a class="mk-btn mk-btn--ghost mk-btn--sm" href="../">' + window.T("auth.backSite") + '</a></div>' +
      '</form></div></div>';
  }
  function langButtons() {
    var cur = window.MKT_LANG();
    return [["en", "EN"], ["he", "עב"], ["ar", "ع"]].map(function (l) {
      return '<button data-lang="' + l[0] + '" class="' + (cur === l[0] ? "on" : "") + '">' + l[1] + '</button>';
    }).join("");
  }

  /* ---------------- onboarding ---------------- */
  var OB_STEPS = ["ob.s1", "ob.s2", "ob.s3", "ob.s4", "ob.s5"];
  function onboardingHTML() {
    var steps = '<div class="mk-steps">' + OB_STEPS.map(function (k, i) {
      return '<div class="mk-step ' + (i === obStep ? "on" : i < obStep ? "done" : "") + '"><span class="n">' + (i < obStep ? "✓" : i + 1) + '</span>' + window.T(k) + '</div>';
    }).join("") + '</div>';
    var body = "";
    if (obStep === 0) body = V.forms.biz();
    else if (obStep === 1) body = V.forms.depts();
    else if (obStep === 2) body = V.forms.conns();
    else if (obStep === 3) body = V.forms.targets();
    else body = V.forms.assess();
    var foot = '<div class="mk-wizfoot">' +
      (obStep > 0 ? '<button class="mk-btn" data-act="ob-back">' + window.T("ob.back") + '</button>' : '') +
      '<span class="sp"></span>' +
      (obStep === 4
        ? '<button class="mk-btn mk-btn--pri" data-act="ob-finish">' + window.T("ob.finish") + '</button>'
        : '<button class="mk-btn mk-btn--pri" data-act="ob-next">' + window.T("ob.next") + '</button>') +
      (obStep >= 2 ? '<button class="mk-btn mk-btn--ghost" data-act="ob-skip">' + window.T("ob.skip") + '</button>' : '') +
      '</div>';
    return '<div class="mk-view mk-wrap" style="padding-top:26px">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
      '<img src="../../assets/brand/logo-mark.png" alt="DriftX" width="110" height="32">' +
      '<span class="mk-badge violet">' + window.T("app.tag") + '</span><span class="sp" style="margin-inline-start:auto"></span>' +
      '<div class="mk-lang">' + langButtons() + '</div></div>' +
      '<div class="mk-h1">' + window.T("ob.title") + '</div><div class="mk-sub">' + window.T("ob.sub") + '</div>' +
      '<div class="mk-sec">' + steps + '</div>' +
      '<div class="mk-card">' + body + '</div>' + foot + '</div>';
  }

  /* ---------------- shell ---------------- */
  function shellHTML(inner, titleKey) {
    var s = D.state();
    var r = route();
    var openIss = D.mode() === "empty" ? 0 : E.openIssues().length;
    var groups = [window.T("nav.grpOps"), window.T("nav.grpAnalyse"), window.T("nav.grpImprove")];
    var nav = "";
    [0, 1, 2].forEach(function (g) {
      nav += '<div class="mk-nav__sep">' + esc(groups[g]) + '</div>';
      nav += ROUTES.filter(function (x) { return x.g === g; }).map(function (x) {
        return '<a href="#/' + x.r + '" class="' + (r.name === x.r ? "on" : "") + '"><span class="ic">' + x.i + '</span>' +
          '<span>' + window.T(x.k) + '</span>' +
          (x.r === "issues" && openIss ? '<span class="cnt">' + openIss + '</span>' : '') +
          (x.r === "tasks" && s.tasks.length ? '<span class="cnt" style="background:rgba(139,92,246,.18);color:var(--acc)">' + s.tasks.filter(function (t) { return t.status !== "done"; }).length + '</span>' : '') + '</a>';
      }).join("");
    });
    var initial = ((s.user && s.user.email) || "d")[0].toUpperCase();
    var side = '<aside class="mk-side" id="mkSide">' +
      '<div class="mk-side__top"><img src="../../assets/brand/logo-mark.png" alt="DriftX" width="116" height="33">' +
      '<span class="mk-side__tag">' + window.T("app.tag") + '</span></div>' +
      '<nav class="mk-nav">' + nav + '</nav>' +
      '<div class="mk-side__foot">' +
      '<div class="mk-who"><span class="mk-av">' + esc(initial) + '</span>' +
      '<span><span class="nm">' + esc((s.user && s.user.email) || "—") + '</span>' +
      '<span class="bz">' + esc((s.biz && s.biz.name) || "—") + '</span></span></div>' +
      '<div class="row"><div class="mk-lang">' + langButtons() + '</div>' +
      '<button class="mk-icobtn" data-act="theme" title="' + window.T("nav.theme") + '">' + (s.theme === "light" ? "☾" : "☀") + '</button>' +
      '<a class="mk-icobtn" href="../#contact" title="' + window.T("nav.support") + '">?</a>' +
      '<button class="mk-icobtn" data-act="logout" title="' + window.T("nav.logout") + '">⏻</button></div>' +
      '</div></aside>';

    var ds = D.dataset();
    var banner = "";
    if (D.mode() === "demo" && ds) {
      banner = '<div class="mk-banner"><span>◐</span><p><b>' + window.T("l.demoData") + '.</b> ' +
        esc(window.T("demo.banner", { n: D.num(ds.leads.length), c: ds.camps.length })) + '</p>' +
        '<button class="mk-btn mk-btn--sm" data-act="demo-off">' + window.T("demo.turnOff") + '</button></div>';
    }

    var filters = D.mode() === "demo" ? (function () {
      var countries = [];
      ds.camps.forEach(function (c) { if (countries.indexOf(c.country) < 0) countries.push(c.country); });
      return '<select class="mk-sel" style="width:auto" data-f="range">' +
        [[7, "top.d7"], [30, "top.d30"], [90, "top.d90"]].map(function (o) {
          return '<option value="' + o[0] + '"' + (s.range === o[0] ? " selected" : "") + '>' + window.T(o[1]) + '</option>';
        }).join("") + '</select>' +
        '<select class="mk-sel" style="width:auto" data-f="country"><option value="all">' + window.T("top.allCountries") + '</option>' +
        countries.map(function (c) { return '<option value="' + c + '"' + (s.filters.country === c ? " selected" : "") + '>' + c + '</option>'; }).join("") + '</select>' +
        '<select class="mk-sel" style="width:auto" data-f="source"><option value="all">' + window.T("top.allSources") + '</option>' +
        ["google", "meta", "whatsapp", "organic"].map(function (c) { return '<option value="' + c + '"' + (s.filters.source === c ? " selected" : "") + '>' + c + '</option>'; }).join("") + '</select>';
    })() : "";

    var top = '<header class="mk-top">' +
      '<button class="mk-burger" data-act="side">☰</button>' +
      '<span class="mk-top__t">' + esc((s.biz && s.biz.name) || window.T("app.name")) + '</span>' +
      filters +
      '<span class="sp"></span>' +
      '<button class="mk-btn mk-btn--sm" data-act="rerun">' + window.T("top.rerun") + '</button>' +
      '<a class="mk-btn mk-btn--sm mk-btn--pri" href="#/reports">' + window.T("top.report") + '</a>' +
      '</header>';

    return '<div class="mk-shell">' + side + '<main class="mk-main">' + top +
      '<div class="mk-view">' + banner + inner + '</div></main></div>';
  }

  /* ---------------- render ---------------- */
  function viewFor(r) {
    switch (r.name) {
      case "dashboard": return V.dashboard();
      case "diagnosis": return V.diagnosis();
      case "funnel": return V.funnel();
      case "campaigns": return r.id ? V.campaignDetail(r.id) : V.campaigns();
      case "leads": return V.leads();
      case "team": return r.id ? V.teamDetail(r.id) : V.team();
      case "web": return V.web();
      case "reputation": return V.reputation();
      case "issues": return r.id ? V.issueDetail(r.id) : V.issues();
      case "tasks": return V.tasks();
      case "knowledge": return V.knowledge();
      case "implementation": return V.implementation();
      case "reports": return V.reports();
      case "settings": return V.settings();
      default: return V.dashboard();
    }
  }

  function render() {
    var s = D.state();
    ROOT.setAttribute("data-theme", s.theme || "dark");
    if (!s.user) { ROOT.innerHTML = authHTML(); return; }
    if (!s.onboarded) { ROOT.innerHTML = onboardingHTML(); return; }
    var r = route();
    var v = viewFor(r);
    ROOT.innerHTML = shellHTML(v.html);
    requestAnimationFrame(function () { requestAnimationFrame(function () { V.grow(ROOT); }); });
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    var b = t.closest ? t.closest("[data-act],[data-lang],[data-issue],[data-camp],[data-emp],[data-dx],[data-flag],[data-istab],[data-settab],[data-setst],[data-task],[data-conn],[data-assess],[data-multi],[data-dept-toggle],[data-train-open],[data-train-done],[data-area]") : null;
    if (!b) return;

    /* language */
    if (b.hasAttribute("data-lang")) { applyLang(b.getAttribute("data-lang")); return; }

    /* navigation-ish */
    if (b.hasAttribute("data-issue")) { location.hash = "#/issues/" + b.getAttribute("data-issue"); return; }
    if (b.hasAttribute("data-camp")) { location.hash = "#/campaigns/" + b.getAttribute("data-camp"); return; }
    if (b.hasAttribute("data-emp")) { location.hash = "#/team/" + b.getAttribute("data-emp"); return; }

    /* diagnosis */
    if (b.hasAttribute("data-dx")) { V.runDx(b.getAttribute("data-dx")); return; }

    /* filters/tabs */
    if (b.hasAttribute("data-flag")) { V.setLeadFilter(b.getAttribute("data-flag")); render(); return; }
    if (b.hasAttribute("data-istab")) { V.setIssFilter(b.getAttribute("data-istab")); render(); return; }
    if (b.hasAttribute("data-settab")) { V.setSettingsTab(b.getAttribute("data-settab")); render(); return; }

    /* issue status */
    if (b.hasAttribute("data-setst")) {
      var key = b.getAttribute("data-key"), to = b.getAttribute("data-setst");
      var iss = E.issues().filter(function (x) { return x.key === key; })[0];
      if (to === "closed" && iss) {
        var v = E.verify(iss);
        if (!v.pass) { alert(window.T("is.checkFail") + "\n" + window.T("is.cantClose")); return; }
      }
      E.setIssueStatus(key, to);
      render(); return;
    }
    /* task status */
    if (b.hasAttribute("data-task")) { E.setTaskStatus(b.getAttribute("data-task"), b.getAttribute("data-to")); render(); return; }

    /* connections */
    if (b.hasAttribute("data-conn")) {
      var k = b.getAttribute("data-conn"), st = b.getAttribute("data-to");
      var s = D.state();
      var row = (window.MKT_CONNS || []).filter(function (c) { return c.k === k; })[0];
      s.conns[k] = st === "on"
        ? { status: "on", lastSync: Date.now(), records: row ? row.rec : 0 }
        : { status: "off", lastSync: s.conns[k] ? s.conns[k].lastSync : null, records: 0 };
      D.save(); D.invalidate(); render(); return;
    }

    /* assessment answer — updated in place so a long questionnaire stays usable */
    if (b.hasAttribute("data-assess")) {
      var i = b.getAttribute("data-assess"), val = b.getAttribute("data-v");
      var st2 = D.state();
      st2.assess[i] = val === "na" ? "na" : Number(val);
      D.save();
      $$('[data-assess="' + i + '"]').forEach(function (x) { x.classList.toggle("on", x === b); });
      var counter = $$(".mk-card .mk-hint b").filter(function (x) { return x.textContent.indexOf("/") >= 0 || true; })[0];
      if (counter) counter.textContent = window.T("ob.answered", { n: Object.keys(st2.assess).length, t: (window.MKT_ASSESS || []).length });
      return;
    }

    /* onboarding multi-select — read the selection back off the UI so the
       values rendered as pre-selected are never silently dropped */
    if (b.hasAttribute("data-multi")) {
      var name = b.getAttribute("data-multi");
      b.classList.toggle("on");
      multiState[name] = $$('[data-multi="' + name + '"].on').map(function (x) { return x.getAttribute("data-v"); });
      return;
    }

    /* departments */
    if (b.hasAttribute("data-dept-toggle")) {
      var dk = b.getAttribute("data-dept-toggle");
      var s3 = D.state();
      s3.depts[dk] = s3.depts[dk] || {};
      s3.depts[dk].on = !s3.depts[dk].on;
      D.save(); render(); return;
    }

    /* trainings */
    if (b.hasAttribute("data-train-open")) {
      var tk = b.getAttribute("data-train-open"), s4 = D.state();
      s4.training[tk] = s4.training[tk] || {};
      s4.training[tk].opened = true; s4.training[tk].at = Date.now();
      D.save(); render(); return;
    }
    if (b.hasAttribute("data-train-done")) {
      var tk2 = b.getAttribute("data-train-done"), s5 = D.state();
      s5.training[tk2] = s5.training[tk2] || {};
      s5.training[tk2].opened = true; s5.training[tk2].completed = true; s5.training[tk2].at = Date.now();
      D.save(); render(); return;
    }
    if (b.hasAttribute("data-area")) { location.hash = "#/settings"; V.setSettingsTab("assessment"); render(); return; }

    /* actions */
    var act = b.getAttribute("data-act");
    if (!act) return;
    if (act === "need-backend") { alert(window.T("auth.needBackend")); return; }
    if (act === "theme") { applyTheme(D.state().theme === "light" ? "dark" : "light"); render(); return; }
    if (act === "logout") { D.set({ user: null }); render(); return; }
    if (act === "side") { var sd = $("#mkSide"); if (sd) sd.classList.toggle("open"); return; }
    if (act === "rerun") { D.invalidate(); render(); return; }
    if (act === "print") { window.print(); return; }
    if (act === "demo-on") { D.set({ demo: true }); D.invalidate(); render(); return; }
    if (act === "demo-off") { D.set({ demo: false }); D.invalidate(); render(); return; }
    if (act === "wipe") {
      if (confirm(window.T("se.resetConfirm"))) { D.wipe(); multiState = {}; obStep = 0; location.hash = "#/dashboard"; render(); }
      return;
    }
    if (act === "task") {
      var ik = b.getAttribute("data-key");
      var issue = E.issues().filter(function (x) { return x.key === ik; })[0];
      if (issue) E.taskFromIssue(issue);
      location.hash = "#/tasks"; render(); return;
    }
    if (act === "verify") {
      var ik2 = b.getAttribute("data-key");
      var is2 = E.issues().filter(function (x) { return x.key === ik2; })[0];
      if (!is2) return;
      var res = E.verify(is2);
      if (res.pass) { E.setIssueStatus(ik2, "closed", "verified " + res.actual + "/" + res.target); alert(window.T("is.checkPass")); }
      else alert(window.T("is.checkFail"));
      render(); return;
    }
    if (act === "dx-tasks") {
      var made = 0;
      (E.openIssues() || []).slice(0, 4).forEach(function (i) { if (E.taskFromIssue(i)) made++; });
      alert(window.TP(window.MKT_DX.tasksMade, { n: made }));
      location.hash = "#/tasks"; render(); return;
    }
    if (act === "dx-run") {
      var q = $("#dxq");
      V.runDx(E.matchQuestion(q ? q.value : ""));
      return;
    }
    if (act === "assign-train") {
      var trk = b.getAttribute("data-train"), s6 = D.state();
      s6.training[trk] = s6.training[trk] || {};
      s6.training[trk].assigned = true;
      D.save();
      alert(window.T("tm.assigned"));
      return;
    }
    if (act === "save-biz") {
      D.set({ biz: V.forms.collectBiz(multiState) });
      D.invalidate(); alert(window.T("l.saved")); render(); return;
    }
    if (act === "save-targets") {
      D.set({ targets: V.forms.collectTargets() });
      D.invalidate(); alert(window.T("l.saved")); render(); return;
    }
    /* onboarding */
    if (act === "ob-next" || act === "ob-skip" || act === "ob-finish") {
      if (obStep === 0) {
        var biz = V.forms.collectBiz(multiState);
        if (act !== "ob-skip" && (!biz.name || !biz.industry)) { alert(window.T("ob.req")); return; }
        D.set({ biz: biz });
      }
      if (obStep === 1) {
        var s7 = D.state();
        $$("[data-dept-owner]").forEach(function (el) {
          var kk = el.getAttribute("data-dept-owner");
          s7.depts[kk] = s7.depts[kk] || { on: true }; s7.depts[kk].owner = el.value;
        });
        $$("[data-dept-people]").forEach(function (el) {
          var kk = el.getAttribute("data-dept-people");
          s7.depts[kk] = s7.depts[kk] || { on: true }; s7.depts[kk].people = el.value;
        });
        D.save();
      }
      if (obStep === 3) D.set({ targets: V.forms.collectTargets() });
      if (act === "ob-finish") {
        /* no source connected → the dashboard shows the empty state, never demo
           numbers dressed up as the business's own */
        D.set({ onboarded: true, createdAt: Date.now() });
        D.invalidate();
        location.hash = "#/dashboard";
        render(); return;
      }
      obStep = Math.min(4, obStep + 1);
      D.invalidate(); render(); return;
    }
    if (act === "ob-back") { obStep = Math.max(0, obStep - 1); render(); return; }
  });

  /* sign-in submit */
  document.addEventListener("submit", function (ev) {
    if (!ev.target || ev.target.id !== "authForm") return;
    ev.preventDefault();
    var email = ($("#au_email") || {}).value || "";
    if (!email.trim()) { alert(window.T("auth.emailReq")); return; }
    /* the password field is intentionally never read or stored */
    D.set({ user: { email: email.trim(), name: email.trim().split("@")[0] } });
    obStep = 0;
    render();
  });

  /* top-bar filters */
  document.addEventListener("change", function (ev) {
    var el = ev.target;
    if (!el || !el.getAttribute) return;
    var f = el.getAttribute("data-f");
    if (!f) return;
    var s = D.state();
    if (f === "range") s.range = parseInt(el.value, 10) || 30;
    else { s.filters[f] = el.value; }
    D.save(); render();
  });

  window.addEventListener("hashchange", render);
  initLang();
  render();
})();
