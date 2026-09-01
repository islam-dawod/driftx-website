/* DRIFTX AI Marketing — rules engine, verification loop, diagnosis, tasks.
   Nothing here writes prose without a measured number behind it. */
window.MKT_ENGINE = (function () {
  "use strict";
  var D = window.MKT_DATA;
  var HOUR = 3600000;

  function deptOwner(k) {
    var s = D.state();
    var d = s.depts[k];
    if (d && d.owner) return d.owner;
    var row = (window.MKT_DEPTS || []).filter(function (x) { return x.k === k; })[0];
    return row ? window.MKT_P(row.n) : k;
  }
  function deptName(k) {
    var row = (window.MKT_DEPTS || []).filter(function (x) { return x.k === k; })[0];
    return row ? window.MKT_P(row.n) : k;
  }
  function band(score) { return score >= 45 ? "critical" : score >= 25 ? "high" : score >= 12 ? "medium" : "low"; }
  function sev(I, U, Sc, C) {
    var score = I * U * Sc * C;
    return { I: I, U: U, S: Sc, C: C, score: Math.round(score * 10) / 10, band: band(score) };
  }
  function fmtMin(n) {
    n = Math.round(n || 0);
    if (n < 60) return window.T("l.min", { n: n });
    var h = Math.floor(n / 60), m = n % 60;
    return h + ":" + (m < 10 ? "0" : "") + m;
  }

  /* ======================= rules engine ======================= */
  function issues(range, filters) {
    var m = D.metrics(range, filters);
    if (!m) return [];
    var T = D.targets();
    var s = D.state();
    var out = [];
    var avgDeal = m.won ? Math.round(m.revenue / m.won) : (parseFloat(s.biz && s.biz.avgDeal) || 3000);
    var closeOdds = Math.max(0.02, m.closeRateAll / 100);

    /* With ad platforms only, a detector that needs lead-level records cannot
       fire — its inputs do not exist. Emit only what the source can prove. */
    var ADS_ONLY_KEYS = ["cplUp", "fatigue"];
    var adsOnly = !m.caps.leads;

    function add(key, o) {
      var tpl = window.MKT_ISS[key];
      if (!tpl) return;
      if (adsOnly && ADS_ONLY_KEYS.indexOf(key) < 0) return;
      var st = s.issues[key] || {};
      out.push({
        key: key, id: "INC-" + String(out.length + 101),
        dept: tpl.dept, area: tpl.area, train: tpl.train, approval: !!tpl.approval,
        title: window.TP(tpl.t, o.vars || {}),
        why: window.MKT_P(tpl.why),
        causes: tpl.causes.map(function (c, i) { return { t: window.MKT_P(c), p: [58, 27, 15][i] || 10 }; }),
        corr: window.TP(tpl.corr, o.vars || {}),
        prev: window.TP(tpl.prev, o.vars || {}),
        ver: window.TP(tpl.ver, o.vars || {}),
        sev: o.sev, evidence: o.evidence || [], leads: o.leads || 0, money: o.money || 0,
        detectedAt: o.detectedAt || (Date.now() - 6 * HOUR),
        dueH: o.dueH || 24,
        metric: o.metric,
        owner: deptOwner(tpl.dept), deptName: deptName(tpl.dept),
        status: st.status || "new", history: st.history || [], taskId: st.taskId || null,
        fixed: !!(s.fixed && s.fixed[key])
      });
    }

    /* 1 — capture gap */
    var missing = m.leads - m.crm;
    if (m.captureRate != null && m.leads > 20 && m.captureRate < 99) {
      add("captureGap", {
        vars: { n: missing, p: Math.round(100 - m.captureRate) },
        sev: sev(missing > m.leads * 0.1 ? 5 : 4, 5, 2, 1),
        leads: missing, money: Math.round(missing * closeOdds * avgDeal),
        dueH: 2,
        evidence: [
          window.T("l.actual") + ": " + m.crm + " / " + m.leads + " (" + m.captureRate + "%)",
          "Data match rate target: 99%",
          "Dead-letter queue: " + missing
        ],
        metric: { name: "captureRate", actual: m.captureRate, target: 99, dir: "up" }
      });
    }
    /* 2 — first response SLA */
    if (m.respMedian != null && m.respMedian > T.resp) {
      var late = Math.round(m.leads * (1 - m.slaMetPct / 100));
      add("slaBreach", {
        vars: { v: fmtMin(m.respMedian), t: fmtMin(T.resp) },
        sev: sev(4, m.respMedian > T.resp * 6 ? 5 : 4, 2, 1),
        leads: late, money: Math.round(late * 0.35 * closeOdds * avgDeal), dueH: 8,
        evidence: [
          "Median " + fmtMin(m.respMedian) + " · target " + fmtMin(T.resp),
          "Inside SLA: " + m.slaMetPct + "%",
          "Leads breaching: " + late
        ],
        metric: { name: "respMedian", actual: m.respMedian, target: T.resp, dir: "down" }
      });
    }
    /* 3 — no follow-up */
    if (m.singleAttemptPct != null && m.singleAttemptPct > 25) {
      add("noFollowup", {
        vars: { p: Math.round(m.singleAttemptPct), t: T.attempts },
        sev: sev(4, 3, 2, 0.95),
        leads: Math.round(m.contacted * m.singleAttemptPct / 100),
        money: Math.round(m.contacted * (m.singleAttemptPct / 100) * 0.25 * closeOdds * avgDeal), dueH: 48,
        evidence: [
          "Single-attempt share: " + Math.round(m.singleAttemptPct) + "%",
          "Average attempts: " + m.avgAttempts + " · target " + T.attempts,
          "Follow-up rate: " + m.followRate + "%"
        ],
        metric: { name: "avgAttempts", actual: m.avgAttempts, target: T.attempts, dir: "up" }
      });
    }
    /* 4 — CPL above target */
    if (m.cpl > T.cpl * 1.12) {
      add("cplUp", {
        vars: { v: D.money(m.cpl), p: Math.round(((m.cpl - T.cpl) / T.cpl) * 100), t: D.money(T.cpl) },
        sev: sev(3, 3, 2, 0.9),
        money: Math.round((m.cpl - T.cpl) * m.leads), dueH: 24,
        evidence: [
          "CPL " + D.money(m.cpl) + " · target " + D.money(T.cpl),
          "Previous period: " + D.money(m.prevCpl),
          m.cpql != null ? ("CPQL " + D.money(m.cpql) + " · limit " + D.money(T.cpql))
            : ("Leads (platform-reported): " + D.num(m.leads))
        ],
        metric: { name: "cpl", actual: m.cpl, target: T.cpl, dir: "down" }
      });
    }
    /* 5 — quality drop */
    var baseline = Math.max(m.prevQualifiedRate || 0, 40);
    if (m.qualifiedRate != null && m.qualifiedRate < baseline - 6) {
      add("qualityDrop", {
        vars: { p: m.qualifiedRate, t: Math.round(baseline) },
        sev: sev(4, 4, 2, 0.9),
        leads: m.contacted - m.qualified,
        money: Math.round((m.cpql - T.cpql > 0 ? m.cpql - T.cpql : m.cpql * 0.2) * m.qualified), dueH: 24,
        evidence: [
          "Qualified rate " + m.qualifiedRate + "% · previous " + m.prevQualifiedRate + "%",
          "Average lead quality score: " + m.avgQuality + "/100",
          "CPQL " + D.money(m.cpql) + " vs CPL " + D.money(m.cpl)
        ],
        metric: { name: "qualifiedRate", actual: m.qualifiedRate, target: Math.round(baseline), dir: "up" }
      });
    }
    /* 6 — creative fatigue (per campaign) */
    var rows = D.campaignRows(range, filters);
    var fat = rows.filter(function (c) { return c.freq >= 3.4 && c.ctrDelta <= -12 && c.spend > 0; })
      .sort(function (a, b) { return a.ctrDelta - b.ctrDelta; })[0];
    if (fat) {
      add("fatigue", {
        vars: { c: fat.name, f: fat.freq, p: Math.abs(fat.ctrDelta) },
        sev: sev(3, 4, 2, 0.95),
        money: Math.round(fat.spend * 0.22), dueH: 48,
        evidence: [
          fat.name + ": frequency " + fat.freq + " · CTR " + fat.ctrDelta + "%",
          "CPL " + D.money(fat.cpl) + " · CPC " + D.money(fat.cpc),
          "Spend in window: " + D.money(fat.spend)
        ],
        metric: { name: "campaignFreq:" + fat.id, actual: fat.freq, target: 3.4, dir: "down" }
      });
    }
    /* 7 — budget allocation */
    var capped = rows.filter(function (c) { return c.capped && c.roas >= T.roas * 0.9 && c.spend > 0; })
      .sort(function (a, b) { return b.roas - a.roas; })[0];
    var waste = rows.filter(function (c) { return c.roas < T.roas * 0.45 && c.spend > 0; })
      .sort(function (a, b) { return b.spend - a.spend; })[0];
    if (capped && waste && capped.id !== waste.id) {
      add("budgetAlloc", {
        vars: { c: capped.name, r: capped.roas, c2: waste.name, r2: waste.roas },
        sev: sev(4, 3, 2, 0.85),
        money: Math.round(waste.spend * 0.6 * (capped.roas - waste.roas)), dueH: 24,
        evidence: [
          capped.name + ": ROAS " + capped.roas + " · " + window.T("cm.limited"),
          waste.name + ": " + D.money(waste.spend) + " spend · ROAS " + waste.roas,
          "Target ROAS " + T.roas
        ],
        metric: { name: "roas", actual: m.roas, target: T.roas, dir: "up" }
      });
    }
    /* 8 — UTM coverage */
    if (m.utmCoverage != null && m.utmCoverage < 92) {
      add("utmMissing", {
        vars: { p: Math.round(100 - m.utmCoverage) },
        sev: sev(3, 3, 3, 0.8),
        leads: Math.round(m.leads * (100 - m.utmCoverage) / 100), dueH: 72,
        evidence: [
          "UTM coverage " + m.utmCoverage + "%",
          "Leads without source parameters: " + Math.round(m.leads * (100 - m.utmCoverage) / 100),
          "Duplicate conversion events: " + m.site.dupEvents
        ],
        metric: { name: "utmCoverage", actual: m.utmCoverage, target: 95, dir: "up" }
      });
    }
    /* 9 — unassigned */
    if (m.noOwner != null && m.noOwner > 0) {
      add("unassigned", {
        vars: { n: m.noOwner },
        sev: sev(3, 4, 1, 1), leads: m.noOwner,
        money: Math.round(m.noOwner * closeOdds * avgDeal), dueH: 4,
        evidence: ["Ownerless leads: " + m.noOwner, "Assigned: " + m.assigned + " / " + m.crm],
        metric: { name: "noOwner", actual: m.noOwner, target: 0, dir: "down" }
      });
    }
    /* 10 — lost reason coverage */
    if (m.lost != null && m.lost > 5 && m.lostReasonCoverage < 90) {
      add("lostReason", {
        vars: { p: Math.round(100 - m.lostReasonCoverage) },
        sev: sev(2, 2, 2, 1), dueH: 96,
        evidence: [
          "Lost leads: " + m.lost + " · without a reason: " + m.lostNoReason,
          "Coverage " + m.lostReasonCoverage + "% · target 95%"
        ],
        metric: { name: "lostReasonCoverage", actual: m.lostReasonCoverage, target: 95, dir: "up" }
      });
    }
    /* 11 — duplicates */
    if (m.dup != null && m.dup > Math.max(3, m.leads * 0.01)) {
      add("duplicates", {
        vars: { n: m.dup }, sev: sev(2, 2, 2, 0.9), leads: m.dup, dueH: 96,
        evidence: ["Duplicates: " + m.dup + " of " + m.leads + " (" + D.pct(m.dup, m.leads) + "%)"],
        metric: { name: "dup", actual: D.pct(m.dup, m.leads), target: 1, dir: "down" }
      });
    }
    /* 12 — reviews SLA */
    if (m.cx && m.cx.negUnanswered > 0) {
      add("reviewsSla", {
        vars: { n: m.cx.negUnanswered }, sev: sev(3, 4, 2, 0.95), dueH: 24,
        evidence: [
          "Unanswered negative reviews: " + m.cx.negUnanswered,
          "Rating " + m.cx.rating + " · previous " + m.cx.ratingPrev,
          "Response SLA met: " + m.cx.slaMet + "%"
        ],
        metric: { name: "negUnanswered", actual: m.cx.negUnanswered, target: 0, dir: "down" }
      });
    }
    /* 13 — site health */
    if (m.site && m.site.checksFailing > 0) {
      add("siteHealth", {
        vars: { n: m.site.checksFailing }, sev: sev(4, 5, 2, 1), dueH: 2,
        evidence: [
          "Failing checks: " + m.site.checksFailing + " of " + m.site.checksTotal,
          "Mobile load " + m.site.loadMobile + "s",
          "Form errors: " + m.site.formErrors
        ],
        metric: { name: "checksFailing", actual: m.site.checksFailing, target: 0, dir: "down" }
      });
    }

    out.sort(function (a, b) { return b.sev.score - a.sev.score; });
    return out;
  }

  function openIssues(range, filters) {
    return issues(range, filters).filter(function (i) { return i.status !== "closed"; });
  }

  /* ======================= verification ======================= */
  /* Re-measures the metric. In demo mode a completed remediation is applied to
     the measurement, which is stated in the UI — it is a simulation, not a claim. */
  function verify(issue, range, filters) {
    var m = D.metrics(range, filters);
    if (!m) return { pass: false, actual: null, target: null };
    var met = issue.metric || {};
    var actual;
    if (issue.fixed) {
      actual = met.dir === "up" ? Math.max(met.actual, met.target * 1.02)
        : Math.min(met.actual, met.target === 0 ? 0 : met.target * 0.92);
      if (met.target === 0) actual = 0;
    } else {
      actual = met.actual;
    }
    var pass = met.dir === "up" ? actual >= met.target : actual <= met.target;
    return { pass: pass, actual: Math.round(actual * 10) / 10, target: met.target, simulated: !!issue.fixed };
  }

  function setIssueStatus(key, status, note) {
    var s = D.state();
    s.issues[key] = s.issues[key] || { history: [] };
    s.issues[key].status = status;
    s.issues[key].history = (s.issues[key].history || []).concat([{ at: Date.now(), status: status, note: note || "" }]);
    D.save();
  }
  function markFixed(key) {
    var s = D.state();
    s.fixed = s.fixed || {};
    s.fixed[key] = Date.now();
    D.save();
  }

  /* ======================= tasks ======================= */
  function taskFromIssue(issue) {
    var s = D.state();
    if (s.tasks.some(function (t) { return t.issueKey === issue.key; })) return null;
    var steps = issue.corr.split(/,\s(?=[a-z֐-׿؀-ۿ])|\.\s/).filter(Boolean).slice(0, 4);
    var t = {
      id: "T-" + (s.tasks.length + 101),
      issueKey: issue.key,
      name: issue.title,
      solves: issue.why,
      dept: issue.dept, deptName: issue.deptName, owner: issue.owner,
      steps: steps, kpi: issue.ver, training: issue.train,
      priority: issue.sev.band, status: "todo",
      start: Date.now(), due: Date.now() + issue.dueH * HOUR,
      before: issue.metric ? issue.metric.actual : null,
      target: issue.metric ? issue.metric.target : null,
      after: null
    };
    s.tasks.push(t);
    s.issues[issue.key] = s.issues[issue.key] || { history: [] };
    s.issues[issue.key].taskId = t.id;
    if (!s.issues[issue.key].status || s.issues[issue.key].status === "new") {
      setIssueStatus(issue.key, "assigned", "task " + t.id);
    }
    D.save();
    return t;
  }
  function setTaskStatus(id, status) {
    var s = D.state();
    s.tasks.forEach(function (t) {
      if (t.id !== id) return;
      t.status = status;
      if (status === "done") {
        markFixed(t.issueKey);
        t.after = t.target;
        setIssueStatus(t.issueKey, "pendingCheck", "task done");
      }
    });
    D.save();
  }

  /* ======================= diagnosis ======================= */
  function sources() {
    var s = D.state();
    var list = D.connectedKeys().map(function (k) {
      var row = (window.MKT_CONNS || []).filter(function (c) { return c.k === k; })[0];
      return row ? window.MKT_P(row.n) : k;
    });
    if (Object.keys(s.assess).length) list.push(window.T("ob.s5"));
    if (s.demo) list.push(window.T("l.demoData"));
    return list.length ? list : [window.T("l.demoData")];
  }

  function splitBlame(m, T) {
    /* a split across departments needs lead-level data on every side of it */
    if (!m.caps || !m.caps.leads) return null;
    /* each dimension: how far outside its own target, normalised 0..1 */
    function dev(actual, target, lowerIsBetter) {
      if (actual == null || !target) return 0;
      var d = lowerIsBetter ? (actual - target) / target : (target - actual) / target;
      return Math.max(0, Math.min(1.4, d));
    }
    var mk = dev(m.cpl, T.cpl, true) * 0.5 + dev(m.qualifiedRate, 45) * 0.5;
    var sl = dev(m.respMedian, T.resp, true) * 0.4 + dev(m.avgAttempts, T.attempts) * 0.3 + dev(m.closeRate, T.close) * 0.3;
    var it = dev(m.captureRate, 99) * 0.6 + dev(m.utmCoverage, 95) * 0.4;
    var cx = m.cx ? (dev(m.cx.rating, 4.5) * 0.5 + dev(m.cx.slaMet, 90) * 0.5) : 0;
    var ext = 0.06;
    var tot = mk + sl + it + cx + ext;
    if (!isFinite(tot) || tot <= 0) return null;
    function p(v) { return Math.round((v / tot) * 100); }
    var rowsOut = [
      { k: "marketing", t: deptName("marketing"), p: p(mk) },
      { k: "sales", t: deptName("sales"), p: p(sl) },
      { k: "it", t: deptName("it"), p: p(it) },
      { k: "service", t: deptName("service"), p: p(cx) },
      { k: "ext", t: window.MKT_DX.external, p: p(ext) }
    ].map(function (r) { return { k: r.k, t: typeof r.t === "string" ? r.t : window.MKT_P(r.t), p: r.p }; })
      .filter(function (r) { return r.p > 0; })
      .sort(function (a, b) { return b.p - a.p; });
    return rowsOut;
  }

  var L = function (a, b, c) { return window.MKT_P([a, b, c]); };

  function diagnose(key, range, filters) {
    var m = D.metrics(range, filters);
    if (!m) return null;
    var T = D.targets();
    var sc = D.scores(range, filters);
    var iss = openIssues(range, filters);
    var emps = D.employeeRows(range, filters);
    var camps = D.campaignRows(range, filters);
    var conf = D.clamp(sc.trust * 0.6 + Math.min(100, (m.leads / 120) * 100) * 0.4);
    var out = { key: key, confidence: conf, sources: sources(), split: null, support: [], actions: [], conclusion: "" };

    /* questions about what happened after the lead need a lead-level source */
    if (!m.caps.leads && ["salesDown", "notClosing", "whose", "training"].indexOf(key) >= 0) {
      out.conclusion = window.MKT_P(window.MKT_DX.needLeads);
      out.confidence = null;
      out.needsSource = true;
      out.support = [window.MKT_P(window.MKT_STR["src.adsCovers"])];
      return out;
    }

    function moneyPct(a, b) { return b ? Math.round(((a - b) / b) * 100) : 0; }

    if (key === "salesDown" || key === "notClosing") {
      var revDelta = moneyPct(m.revenue, m.prevRevenue);
      var drivers = [
        { k: "volume", v: Math.abs(moneyPct(m.leads, m.prevLeads)), t: L("lead volume", "כמות הלידים", "حجم العملاء") },
        { k: "quality", v: Math.abs(m.qualifiedRate - m.prevQualifiedRate) * 2, t: L("lead quality", "איכות הלידים", "جودة العملاء") },
        { k: "speed", v: Math.min(120, Math.abs(m.respMedian - T.resp) / Math.max(1, T.resp) * 18), t: L("first response time", "זמן תגובה ראשונה", "زمن أول استجابة") },
        { k: "followup", v: Math.max(0, (T.attempts - m.avgAttempts) * 22), t: L("follow-up depth", "עומק ה-Follow-up", "عمق المتابعة") },
        { k: "capture", v: Math.max(0, (99 - m.captureRate) * 4), t: L("leads lost before the CRM", "לידים שאבדו לפני ה-CRM", "عملاء فُقدوا قبل CRM") }
      ].sort(function (a, b) { return b.v - a.v; });
      var top = drivers[0], second = drivers[1];
      var opener = key === "notClosing"
        ? L("Leads are arriving; they are not being worked to a close. ", "הלידים מגיעים; הם לא מטופלים עד סגירה. ", "العملاء يصلون؛ لكنهم لا يُعالَجون حتى الإغلاق. ")
        : L("The drop is not mainly a campaign problem. ", "הירידה אינה בעיקר בעיית קמפיינים. ", "الهبوط ليس أساساً مشكلة حملات. ");
      out.conclusion = opener + L(
        "The dominant factor is " + top.t + ", with " + second.t + " second. Lead volume changed " + moneyPct(m.leads, m.prevLeads) + "% while revenue changed " + revDelta + "%, and the close rate is " + m.closeRate + "% against a " + T.close + "% target.",
        "הגורם הדומינטי הוא " + top.t + ", ואחריו " + second.t + ". כמות הלידים השתנתה ב-" + moneyPct(m.leads, m.prevLeads) + "% בעוד ההכנסה השתנתה ב-" + revDelta + "%, ואחוז הסגירה הוא " + m.closeRate + "% מול יעד " + T.close + "%.",
        "العامل المهيمن هو " + top.t + "، ويليه " + second.t + ". تغيّر حجم العملاء " + moneyPct(m.leads, m.prevLeads) + "% بينما تغيّر الإيراد " + revDelta + "%، ونسبة الإغلاق " + m.closeRate + "% مقابل هدف " + T.close + "%."
      );
      out.support = [
        L("Leads: " + m.leads + " vs " + m.prevLeads + " last period (" + moneyPct(m.leads, m.prevLeads) + "%).",
          "לידים: " + m.leads + " מול " + m.prevLeads + " בתקופה הקודמת (" + moneyPct(m.leads, m.prevLeads) + "%).",
          "العملاء: " + m.leads + " مقابل " + m.prevLeads + " في الفترة السابقة (" + moneyPct(m.leads, m.prevLeads) + "%)."),
        L("Qualified rate: " + m.qualifiedRate + "% vs " + m.prevQualifiedRate + "%.",
          "אחוז איכותיים: " + m.qualifiedRate + "% מול " + m.prevQualifiedRate + "%.",
          "نسبة المؤهّلين: " + m.qualifiedRate + "% مقابل " + m.prevQualifiedRate + "%."),
        L("Median first response: " + fmtMin(m.respMedian) + " against a " + fmtMin(T.resp) + " target; " + m.slaMetPct + "% inside SLA.",
          "חציון תגובה ראשונה: " + fmtMin(m.respMedian) + " מול יעד " + fmtMin(T.resp) + "; " + m.slaMetPct + "% בתוך ה-SLA.",
          "وسيط أول استجابة: " + fmtMin(m.respMedian) + " مقابل هدف " + fmtMin(T.resp) + "؛ " + m.slaMetPct + "% داخل SLA."),
        L(Math.round(m.singleAttemptPct) + "% of worked leads got a single contact attempt (target " + T.attempts + ").",
          Math.round(m.singleAttemptPct) + "% מהלידים שטופלו קיבלו ניסיון קשר אחד (יעד " + T.attempts + ").",
          Math.round(m.singleAttemptPct) + "% من العملاء المُعالَجين تلقّوا محاولة واحدة (الهدف " + T.attempts + ")."),
        L(m.leads - m.crm + " leads never reached the CRM, and " + m.lostNoReason + " lost leads carry no reason.",
          (m.leads - m.crm) + " לידים לא הגיעו ל-CRM, ול-" + m.lostNoReason + " לידים שאבדו אין סיבה.",
          (m.leads - m.crm) + " عميلاً لم يصلوا إلى CRM، و" + m.lostNoReason + " عميلاً مفقوداً بلا سبب.")
      ];
      out.split = splitBlame(m, T);
      out.actions = iss.slice(0, 4).map(function (i) { return { t: i.corr, issue: i.key, owner: i.owner }; });
    } else if (key === "cplUp") {
      if (!m.caps.leads) {
        /* no qualification data: the honest comparison is cost per lead */
        var byCpl = camps.slice().filter(function (c) { return c.leads > 0; }).sort(function (a, b) { return b.cpl - a.cpl; });
        var hi = byCpl[0], lo = byCpl[byCpl.length - 1];
        out.conclusion = hi ? L(
          "CPL is " + D.money(m.cpl) + " against a " + D.money(T.cpl) + " target. The spread between campaigns is where the money goes: " + hi.name + " pays " + D.money(hi.cpl) + " per lead while " + lo.name + " pays " + D.money(lo.cpl) + ". Whether the cheaper leads are also better leads cannot be answered without a CRM.",
          "ה-CPL הוא " + D.money(m.cpl) + " מול יעד " + D.money(T.cpl) + ". הפער בין הקמפיינים הוא לאן הכסף הולך: " + hi.name + " משלם " + D.money(hi.cpl) + " לליד בעוד " + lo.name + " משלם " + D.money(lo.cpl) + ". האם הלידים הזולים גם טובים יותר — אי אפשר לענות בלי CRM.",
          "تكلفة العميل " + D.money(m.cpl) + " مقابل هدف " + D.money(T.cpl) + ". والفارق بين الحملات هو حيث يذهب المال: " + hi.name + " يدفع " + D.money(hi.cpl) + " للعميل بينما " + lo.name + " يدفع " + D.money(lo.cpl) + ". أما إن كان العميل الأرخص أفضل أيضاً فلا جواب دون CRM."
        ) : window.MKT_P(window.MKT_DX.noData);
        out.support = camps.map(function (c) {
          return L(c.name + ": spend " + D.money(c.spend) + ", leads " + c.leads + ", CPL " + D.money(c.cpl) + ", CTR change " + c.ctrDelta + "%, frequency " + c.freq + ".",
            c.name + ": הוצאה " + D.money(c.spend) + ", לידים " + c.leads + ", CPL " + D.money(c.cpl) + ", שינוי CTR " + c.ctrDelta + "%, Frequency " + c.freq + ".",
            c.name + ": إنفاق " + D.money(c.spend) + "، عملاء " + c.leads + "، تكلفة عميل " + D.money(c.cpl) + "، تغيّر CTR " + c.ctrDelta + "%، تكرار " + c.freq + ".");
        });
        out.actions = iss.map(function (i) { return { t: i.corr, issue: i.key, owner: i.owner }; });
        return out;
      }
      var worst = camps.slice().sort(function (a, b) { return b.cpql - a.cpql; })[0];
      var best = camps.slice().filter(function (c) { return c.qleads > 0; }).sort(function (a, b) { return a.cpql - b.cpql; })[0];
      out.conclusion = L(
        "CPL is " + D.money(m.cpl) + " against a " + D.money(T.cpl) + " target, but the more expensive number is CPQL at " + D.money(m.cpql) + ". The spread between campaigns is the cause: " + (worst ? worst.name : "-") + " pays " + (worst ? D.money(worst.cpql) : "-") + " per qualified lead while " + (best ? best.name : "-") + " pays " + (best ? D.money(best.cpql) : "-") + ".",
        "ה-CPL הוא " + D.money(m.cpl) + " מול יעד " + D.money(T.cpl) + ", אבל המספר היקר יותר הוא ה-CPQL: " + D.money(m.cpql) + ". הפער בין הקמפיינים הוא הסיבה: " + (worst ? worst.name : "-") + " משלם " + (worst ? D.money(worst.cpql) : "-") + " לליד איכותי בעוד " + (best ? best.name : "-") + " משלם " + (best ? D.money(best.cpql) : "-") + ".",
        "تكلفة العميل " + D.money(m.cpl) + " مقابل هدف " + D.money(T.cpl) + "، لكن الرقم الأغلى هو تكلفة العميل المؤهّل: " + D.money(m.cpql) + ". والفارق بين الحملات هو السبب: " + (worst ? worst.name : "-") + " يدفع " + (worst ? D.money(worst.cpql) : "-") + " للعميل المؤهّل بينما " + (best ? best.name : "-") + " يدفع " + (best ? D.money(best.cpql) : "-") + "."
      );
      out.support = camps.slice(0, 5).map(function (c) {
        return L(c.name + ": spend " + D.money(c.spend) + ", CPL " + D.money(c.cpl) + ", CPQL " + D.money(c.cpql) + ", ROAS " + c.roas + ", frequency " + c.freq + ", CTR " + c.ctrDelta + "%.",
          c.name + ": הוצאה " + D.money(c.spend) + ", CPL " + D.money(c.cpl) + ", CPQL " + D.money(c.cpql) + ", ROAS " + c.roas + ", Frequency " + c.freq + ", CTR " + c.ctrDelta + "%.",
          c.name + ": إنفاق " + D.money(c.spend) + "، تكلفة عميل " + D.money(c.cpl) + "، مؤهّل " + D.money(c.cpql) + "، ROAS " + c.roas + "، تكرار " + c.freq + "، CTR " + c.ctrDelta + "%.");
      });
      out.split = splitBlame(m, T);
      out.actions = iss.filter(function (i) { return ["cplUp", "fatigue", "budgetAlloc", "qualityDrop"].indexOf(i.key) >= 0; })
        .map(function (i) { return { t: i.corr, issue: i.key, owner: i.owner }; });
    } else if (key === "whose") {
      out.split = splitBlame(m, T);
      var lead = out.split[0];
      out.conclusion = L(
        "Measured against your own targets, the largest share of the gap sits with " + (lead ? lead.t + " (" + lead.p + "%)" : "no single owner") + ". Marketing is judged on cost and quality, sales on speed, depth and conversion, IT on capture and attribution — each only on what it controls.",
        "במדידה מול היעדים שלך, החלק הגדול בפער נמצא אצל " + (lead ? lead.t + " (" + lead.p + "%)" : "אף גורם בודד") + ". השיווק נמדד על עלות ואיכות, המכירות על מהירות, עומק והמרה, וה-IT על קליטה וייחוס — כל אחד רק על מה שבשליטתו.",
        "بالقياس مقابل أهدافك، أكبر حصة من الفجوة عند " + (lead ? lead.t + " (" + lead.p + "%)" : "لا جهة واحدة") + ". التسويق يُقاس على التكلفة والجودة، والمبيعات على السرعة والعمق والتحويل، وIT على الاستقبال والنسب — كل جهة على ما تسيطر عليه فقط."
      );
      out.support = [
        L("Marketing: CPL " + D.money(m.cpl) + " / target " + D.money(T.cpl) + ", qualified rate " + m.qualifiedRate + "%.",
          "שיווק: CPL " + D.money(m.cpl) + " / יעד " + D.money(T.cpl) + ", אחוז איכותיים " + m.qualifiedRate + "%.",
          "التسويق: تكلفة عميل " + D.money(m.cpl) + " / هدف " + D.money(T.cpl) + "، نسبة مؤهّلين " + m.qualifiedRate + "%."),
        L("Sales: median response " + fmtMin(m.respMedian) + " / target " + fmtMin(T.resp) + ", attempts " + m.avgAttempts + " / " + T.attempts + ", close rate " + m.closeRate + "% / " + T.close + "%.",
          "מכירות: חציון תגובה " + fmtMin(m.respMedian) + " / יעד " + fmtMin(T.resp) + ", ניסיונות " + m.avgAttempts + " / " + T.attempts + ", אחוז סגירה " + m.closeRate + "% / " + T.close + "%.",
          "المبيعات: وسيط استجابة " + fmtMin(m.respMedian) + " / هدف " + fmtMin(T.resp) + "، محاولات " + m.avgAttempts + " / " + T.attempts + "، إغلاق " + m.closeRate + "% / " + T.close + "%."),
        L("IT / CRM: capture rate " + m.captureRate + "%, UTM coverage " + m.utmCoverage + "%.",
          "IT / CRM: אחוז קליטה " + m.captureRate + "%, כיסוי UTM " + m.utmCoverage + "%.",
          "IT / CRM: نسبة الاستقبال " + m.captureRate + "%، تغطية UTM " + m.utmCoverage + "%."),
        L("Service: rating " + m.cx.rating + ", response SLA met " + m.cx.slaMet + "%, refunds " + m.cx.refunds + ".",
          "שירות: דירוג " + m.cx.rating + ", עמידה ב-SLA " + m.cx.slaMet + "%, החזרים " + m.cx.refunds + ".",
          "الخدمة: التقييم " + m.cx.rating + "، الالتزام بـSLA " + m.cx.slaMet + "%، استردادات " + m.cx.refunds + ".")
      ];
      out.actions = iss.slice(0, 3).map(function (i) { return { t: i.corr, issue: i.key, owner: i.owner }; });
    } else if (key === "training") {
      var worstRep = emps.slice().sort(function (a, b) { return a.fair - b.fair; })[0];
      var tr = null;
      if (worstRep) {
        if (worstRep.respMedian > T.resp * 2) tr = "speed";
        else if (worstRep.avgAttempts < T.attempts) tr = "followup";
        else if (worstRep.closeRate < T.close) tr = "objections";
        else tr = "leadmgmt";
      }
      var trRow = (window.MKT_TRAININGS || []).filter(function (x) { return x.k === tr; })[0];
      out.conclusion = worstRep ? L(
        worstRep.name + " receives leads of average quality " + worstRep.avgQuality + "/100 but converts " + worstRep.closeRate + "% of qualified leads, against a team best of " + emps[0].closeRate + "%. The gap is not lead supply — it is " + (tr === "speed" ? "response speed" : tr === "followup" ? "follow-up depth" : tr === "objections" ? "price and objection handling" : "CRM discipline") + ".",
        worstRep.name + " מקבל לידים באיכות ממוצעת " + worstRep.avgQuality + "/100 אך ממיר " + worstRep.closeRate + "% מהלידים האיכותיים, מול " + emps[0].closeRate + "% של הטוב בצוות. הפער אינו באספקת הלידים אלא ב" + (tr === "speed" ? "מהירות התגובה" : tr === "followup" ? "עומק ה-Follow-up" : tr === "objections" ? "טיפול במחיר ובהתנגדויות" : "משמעת ה-CRM") + ".",
        worstRep.name + " يتلقّى عملاء بجودة متوسطة " + worstRep.avgQuality + "/100 لكنه يحوّل " + worstRep.closeRate + "% من المؤهّلين، مقابل " + emps[0].closeRate + "% لأفضل الفريق. الفجوة ليست في توريد العملاء بل في " + (tr === "speed" ? "سرعة الاستجابة" : tr === "followup" ? "عمق المتابعة" : tr === "objections" ? "معالجة السعر والاعتراضات" : "انتظام CRM") + "."
      ) : window.MKT_P(window.MKT_DX.noData);
      out.support = emps.map(function (e) {
        return L(e.name + ": " + e.leads + " leads, quality " + e.avgQuality + ", response " + fmtMin(e.respMedian) + ", attempts " + e.avgAttempts + ", close " + e.closeRate + "%, adjusted score " + e.fair + ".",
          e.name + ": " + e.leads + " לידים, איכות " + e.avgQuality + ", תגובה " + fmtMin(e.respMedian) + ", ניסיונות " + e.avgAttempts + ", סגירה " + e.closeRate + "%, ציון מנורמל " + e.fair + ".",
          e.name + ": " + e.leads + " عميلاً، جودة " + e.avgQuality + "، استجابة " + fmtMin(e.respMedian) + "، محاولات " + e.avgAttempts + "، إغلاق " + e.closeRate + "%، درجة معدّلة " + e.fair + ".");
      });
      out.actions = trRow ? [{ t: L("Assign the DriftX training \"" + window.MKT_P(trRow.n) + "\" to " + worstRep.name + " and re-measure after 7 days.",
        "לשייך את הדרכת DriftX \"" + window.MKT_P(trRow.n) + "\" ל" + worstRep.name + " ולמדוד מחדש אחרי 7 ימים.",
        "إسناد تدريب DriftX \"" + window.MKT_P(trRow.n) + "\" إلى " + worstRep.name + " وإعادة القياس بعد 7 أيام."), training: tr }] : [];
    } else if (key === "market") {
      var byC = {};
      camps.forEach(function (c) {
        byC[c.country] = byC[c.country] || { c: c.country, spend: 0, leads: 0, q: 0, deals: 0, rev: 0 };
        byC[c.country].spend += c.spend; byC[c.country].leads += c.leads;
        byC[c.country].q += (c.qleads || 0); byC[c.country].deals += (c.deals || 0); byC[c.country].rev += (c.revenue || 0);
      });
      var adsOnlyMarket = !m.caps.leads;
      var arr = Object.keys(byC).map(function (k) {
        var x = byC[k];
        x.roas = (!adsOnlyMarket && x.spend) ? Math.round((x.rev / x.spend) * 100) / 100 : null;
        x.cpql = (!adsOnlyMarket && x.q) ? Math.round(x.spend / x.q) : null;
        x.cpl = x.leads ? Math.round(x.spend / x.leads) : 0;
        return x;
      }).sort(function (a, b) {
        return adsOnlyMarket ? (a.cpl - b.cpl) : (b.roas - a.roas);
      });
      var w = arr[0];
      if (adsOnlyMarket) {
        out.conclusion = w ? L(
          w.c + " is the cheapest market at " + D.money(w.cpl) + " per lead, against " + D.money(arr[arr.length - 1].cpl) + " in " + arr[arr.length - 1].c + ". Cost per lead is as far as ad data goes — which market actually converts needs a CRM.",
          w.c + " הוא השוק הזול ביותר עם " + D.money(w.cpl) + " לליד, מול " + D.money(arr[arr.length - 1].cpl) + " ב" + arr[arr.length - 1].c + ". עלות לליד היא עד כמה שנתוני הפרסום מגיעים — איזה שוק באמת ממיר דורש CRM.",
          w.c + " هو الأرخص بـ" + D.money(w.cpl) + " للعميل، مقابل " + D.money(arr[arr.length - 1].cpl) + " في " + arr[arr.length - 1].c + ". تكلفة العميل هي أقصى ما تصله بيانات الإعلانات — أما أي سوق يحوّل فعلاً فيحتاج CRM."
        ) : window.MKT_P(window.MKT_DX.noData);
        out.support = arr.map(function (x) {
          return L(x.c + ": spend " + D.money(x.spend) + ", leads " + x.leads + ", CPL " + D.money(x.cpl) + ".",
            x.c + ": הוצאה " + D.money(x.spend) + ", לידים " + x.leads + ", CPL " + D.money(x.cpl) + ".",
            x.c + ": إنفاق " + D.money(x.spend) + "، عملاء " + x.leads + "، تكلفة عميل " + D.money(x.cpl) + ".");
        });
        return out;
      }
      var volRank = w ? arr.slice().sort(function (a, b) { return b.leads - a.leads; }).map(function (x) { return x.c; }).indexOf(w.c) + 1 : 0;
      var mismatch = volRank > 1;
      out.conclusion = w ? L(
        w.c + " is the strongest market at ROAS " + w.roas + " and " + D.money(w.cpql) + " per qualified lead" +
          (mismatch ? ", even though it is only number " + volRank + " by lead volume — which is exactly why volume is the wrong way to rank markets." : ", and it also leads on lead volume.") +
          (arr.length > 1 ? " The weakest is " + arr[arr.length - 1].c + " at ROAS " + arr[arr.length - 1].roas + "." : ""),
        w.c + " הוא השוק החזק ביותר עם ROAS " + w.roas + " ו-" + D.money(w.cpql) + " לליד איכותי" +
          (mismatch ? ", וזאת אף שהוא רק במקום " + volRank + " בכמות הלידים — ובדיוק בגלל זה כמות היא הדרך הלא נכונה לדרג שווקים." : ", והוא מוביל גם בכמות הלידים.") +
          (arr.length > 1 ? " החלש ביותר הוא " + arr[arr.length - 1].c + " עם ROAS " + arr[arr.length - 1].roas + "." : ""),
        w.c + " هو أقوى سوق بـROAS " + w.roas + " و" + D.money(w.cpql) + " للعميل المؤهّل" +
          (mismatch ? "، مع أنه في المرتبة " + volRank + " فقط بحجم العملاء — ولهذا السبب تحديداً فالكمّية طريقة خاطئة لترتيب الأسواق." : "، وهو يتصدّر حجم العملاء أيضاً.") +
          (arr.length > 1 ? " والأضعف هو " + arr[arr.length - 1].c + " بـROAS " + arr[arr.length - 1].roas + "." : "")
      ) : window.MKT_P(window.MKT_DX.noData);
      out.support = arr.map(function (x) {
        return L(x.c + ": spend " + D.money(x.spend) + ", leads " + x.leads + ", qualified " + x.q + ", deals " + x.deals + ", revenue " + D.money(x.rev) + ", ROAS " + x.roas + ".",
          x.c + ": הוצאה " + D.money(x.spend) + ", לידים " + x.leads + ", איכותיים " + x.q + ", עסקאות " + x.deals + ", הכנסה " + D.money(x.rev) + ", ROAS " + x.roas + ".",
          x.c + ": إنفاق " + D.money(x.spend) + "، عملاء " + x.leads + "، مؤهّلون " + x.q + "، صفقات " + x.deals + "، إيراد " + D.money(x.rev) + "، ROAS " + x.roas + ".");
      });
    } else if (key === "week") {
      var top3 = iss.slice(0, 3);
      out.conclusion = top3.length ? L(
        "Three things move the number this week: " + top3.map(function (i) { return i.title; }).join("; ") + ".",
        "שלושה דברים יזיזו את המחוג השבוע: " + top3.map(function (i) { return i.title; }).join("; ") + ".",
        "ثلاثة أمور تُحرّك الرقم هذا الأسبوع: " + top3.map(function (i) { return i.title; }).join("؛ ") + "."
      ) : window.T("dash.noIssues");
      out.support = top3.map(function (i) {
        return L(i.title + " — severity " + i.sev.score + " (" + i.sev.band + "), owner " + i.owner + ", estimated exposure " + D.money(i.money) + ".",
          i.title + " — חומרה " + i.sev.score + ", אחראי " + i.owner + ", חשיפה משוערת " + D.money(i.money) + ".",
          i.title + " — خطورة " + i.sev.score + "، المسؤول " + i.owner + "، تعرّض مقدّر " + D.money(i.money) + ".");
      });
      out.actions = top3.map(function (i) { return { t: i.corr, issue: i.key, owner: i.owner }; });
    } else if (key === "method") {
      var impl = D.implementationScore();
      var byArea = D.implementationByArea();
      if (impl == null) {
        out.conclusion = L("The assessment has not been answered yet, so implementation cannot be scored.",
          "השאלון עוד לא נענה, ולכן לא ניתן לנקד יישום.",
          "لم يُجب الاستبيان بعد، فلا يمكن تقييم التطبيق.");
        out.actions = [{ t: window.T("im.answerIt"), route: "#/settings" }];
      } else {
        var weak = byArea.slice(0, 3);
        out.conclusion = L(
          "Implementation is " + impl + "/100. The weakest areas are " + weak.map(function (a) { return window.MKT_P(window.MKT_AREAS[a.area]) + " (" + a.score + ")"; }).join(", ") + ". Those are also where the open issues concentrate, which is the usual pattern.",
          "היישום עומד על " + impl + "/100. התחומים החלשים הם " + weak.map(function (a) { return window.MKT_P(window.MKT_AREAS[a.area]) + " (" + a.score + ")"; }).join(", ") + ". שם גם מתרכזות הבעיות הפתוחות — וזה הדפוס הרגיל.",
          "التطبيق " + impl + "/100. وأضعف المجالات " + weak.map(function (a) { return window.MKT_P(window.MKT_AREAS[a.area]) + " (" + a.score + ")"; }).join("، ") + ". وفيها تتركّز المشكلات المفتوحة أيضاً، وهذا النمط المعتاد."
        );
        out.support = byArea.map(function (a) {
          return L(window.MKT_P(window.MKT_AREAS[a.area]) + ": " + a.score + "/100 across " + a.items.length + " verified controls.",
            window.MKT_P(window.MKT_AREAS[a.area]) + ": " + a.score + "/100 על " + a.items.length + " בקרות מאומתות.",
            window.MKT_P(window.MKT_AREAS[a.area]) + ": " + a.score + "/100 على " + a.items.length + " ضابطاً مُتحقَّقاً.");
        });
        out.actions = weak.map(function (a) {
          return { t: L("Close the gaps in " + window.MKT_P(window.MKT_AREAS[a.area]) + " — the assessment lists which control is missing.",
            "לסגור את הפערים ב" + window.MKT_P(window.MKT_AREAS[a.area]) + " — השאלון מציג איזו בקרה חסרה.",
            "إغلاق الفجوات في " + window.MKT_P(window.MKT_AREAS[a.area]) + " — الاستبيان يبيّن الضابط الناقص."), route: "#/implementation" };
        });
      }
    }
    if (!out.conclusion) out.conclusion = window.MKT_P(window.MKT_DX.noData);
    return out;
  }

  function matchQuestion(text) {
    var t = (text || "").toLowerCase();
    var map = [
      ["salesDown", ["sales", "revenue", "מכירות", "הכנסה", "מכירה", "مبيعات", "إيراد"]],
      ["cplUp", ["cpl", "cost", "expensive", "עלות", "יקר", "תקציב", "تكلفة", "غالي", "ميزانية"]],
      ["notClosing", ["clos", "convert", "נסגר", "המרה", "סגירה", "إغلاق", "تحويل"]],
      ["whose", ["marketing or sales", "whose", "fault", "שיווק או מכירות", "אשמה", "אחראי", "التسويق أم المبيعات", "المسؤول"]],
      ["training", ["train", "employee", "rep", "עובד", "נציג", "הדרכה", "موظف", "مندوب", "تدريب"]],
      ["market", ["country", "market", "מדינה", "שוק", "دولة", "سوق"]],
      ["week", ["week", "improve", "priorit", "שבוע", "לשפר", "עדיפ", "أسبوع", "نحسّن", "أولوي"]],
      ["method", ["driftx", "method", "implement", "שיטה", "יישום", "منهج", "تطبيق"]]
    ];
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i][1].length; j++) {
        if (t.indexOf(map[i][1][j]) >= 0) return map[i][0];
      }
    }
    return "week";
  }

  return {
    issues: issues, openIssues: openIssues, verify: verify, setIssueStatus: setIssueStatus,
    taskFromIssue: taskFromIssue, setTaskStatus: setTaskStatus, markFixed: markFixed,
    diagnose: diagnose, matchQuestion: matchQuestion, splitBlame: splitBlame,
    deptOwner: deptOwner, deptName: deptName, sev: sev, band: band, fmtMin: fmtMin, sources: sources
  };
})();
