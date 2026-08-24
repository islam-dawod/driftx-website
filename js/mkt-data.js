/* DRIFTX AI Marketing — state, dataset, analytics, rules engine, diagnosis.
   No backend: state persists in localStorage, the dataset is generated
   deterministically from the business profile, and every headline number in the
   UI is computed from those records — never hardcoded. */
window.MKT_DATA = (function () {
  "use strict";
  var KEY = "driftx_mkt_v1";
  var DAY = 86400000;

  /* ============================ state ============================ */
  var DEFAULTS = {
    v: 1,
    user: null,                 /* {email, name} */
    biz: null,                  /* business profile */
    depts: {},                  /* k -> {on, owner, people} */
    conns: {},                  /* k -> {status, lastSync, records} */
    targets: null,
    assess: {},                 /* index -> 100|60|30|0|"na" */
    demo: false,
    theme: "dark",
    range: 30,
    filters: { country: "all", source: "all", dept: "all" },
    issues: {},                 /* id -> {status, history:[], taskId} */
    tasks: [],
    training: {},               /* key -> {opened, completed, at, before, after} */
    onboarded: false,
    createdAt: null
  };

  var S = read();

  function read() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    var s = {};
    if (raw) { try { s = JSON.parse(raw) || {}; } catch (e) { s = {}; } }
    var out = JSON.parse(JSON.stringify(DEFAULTS));
    Object.keys(s).forEach(function (k) { out[k] = s[k]; });
    return out;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }
  function state() { return S; }
  function set(patch) { Object.keys(patch).forEach(function (k) { S[k] = patch[k]; }); save(); }
  function wipe() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = JSON.parse(JSON.stringify(DEFAULTS));
  }

  var DEFAULT_TARGETS = {
    leads: 300, qleads: 120, cpl: 45, cpql: 130, resp: 15, contact: 85,
    appt: 35, close: 22, revenue: 400000, cac: 900, roas: 3.5, attempts: 4
  };
  function targets() {
    var t = S.targets || {};
    var out = {};
    Object.keys(DEFAULT_TARGETS).forEach(function (k) {
      var v = parseFloat(t[k]);
      out[k] = isFinite(v) && v > 0 ? v : DEFAULT_TARGETS[k];
    });
    return out;
  }
  function currency() { return (S.biz && S.biz.currency) || "₪"; }
  function money(n) {
    n = Math.round(n || 0);
    var c = currency();
    if (Math.abs(n) >= 1000000) return c + (n / 1000000).toFixed(1) + "M";
    if (Math.abs(n) >= 1000) return c + Math.round(n / 1000) + "K";
    return c + n;
  }
  function num(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function pct(n, d) { return d > 0 ? Math.round((n / d) * 1000) / 10 : 0; }

  function connectedKeys() {
    return Object.keys(S.conns).filter(function (k) { return S.conns[k] && S.conns[k].status === "on"; });
  }
  function hasSource() { return S.demo === true || connectedKeys().length > 0; }
  function mode() { return hasSource() ? "demo" : "empty"; }

  /* ============================ dataset ============================ */
  function hash(str) {
    var h = 2166136261;
    str = String(str || "driftx");
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var SURNAMES = ["Cohen", "Haddad", "Levi", "Khoury", "Mizrahi", "Nassar", "Peretz", "Sayed",
    "Barak", "Zoabi", "Golan", "Amir", "Shalev", "Farah", "Dahan", "Kanaan"];
  var INITIALS = "AMYRSNDLKTHEB".split("");
  var SOURCES = ["google", "meta", "whatsapp", "organic"];

  var CACHE = null;
  function invalidate() { CACHE = null; }

  function dataset() {
    if (!hasSource()) return null;
    var biz = S.biz || {};
    var sig = [biz.name, biz.leadsMo, biz.budget, biz.avgDeal, biz.reps, (biz.countries || []).join(""),
      S.demo, connectedKeys().join("")].join("|");
    if (CACHE && CACHE.sig === sig) return CACHE;

    var seed = hash(sig);
    var r = rng(seed);
    var T = targets();
    var monthLeads = Math.max(40, Math.min(4000, parseFloat(biz.leadsMo) || T.leads));
    var budget = Math.max(3000, parseFloat(biz.budget) || monthLeads * T.cpl);
    var avgDeal = Math.max(200, parseFloat(biz.avgDeal) || 3200);
    var repCount = Math.max(2, Math.min(8, parseInt(biz.reps, 10) || 4));
    var countries = (biz.countries && biz.countries.length ? biz.countries : ["IL"]).slice(0, 4);
    var now = Date.now();
    var days = 90;

    /* --- employees: distinct behavioural profiles --- */
    var emps = [];
    for (var e = 0; e < repCount; e++) {
      var slow = e === 0 || (repCount > 4 && e === 3);       /* two slow responders */
      var weakClose = e === 1;                                /* good leads, poor closing */
      emps.push({
        id: "e" + (e + 1),
        name: INITIALS[e % INITIALS.length] + ". " + SURNAMES[(e * 3 + 1) % SURNAMES.length],
        tenure: 3 + Math.floor(r() * 40),
        respBase: slow ? 90 + r() * 180 : 6 + r() * 16,
        attemptBias: weakClose ? 3.2 : 1.4 + r() * 2.4,
        closeSkill: weakClose ? 0.55 : 0.85 + r() * 0.5,
        hygiene: 0.55 + r() * 0.45,
        share: 1
      });
    }
    /* uneven assignment load — the classic hidden cause */
    emps[0].share = 2.6; if (emps[1]) emps[1].share = 2.1;
    var shareSum = emps.reduce(function (a, b) { return a + b.share; }, 0);

    /* --- campaigns --- */
    var CDEF = [
      { n: "Search — Brand", p: "google", q: 0.86, cpc: 3.1, fat: false },
      { n: "Search — Generic", p: "google", q: 0.42, cpc: 5.4, fat: false },
      { n: "Performance Max", p: "google", q: 0.55, cpc: 4.0, fat: false },
      { n: "Lead form — Core", p: "meta", q: 0.62, cpc: 2.2, fat: false },
      { n: "Retargeting", p: "meta", q: 0.74, cpc: 2.6, fat: true },
      { n: "Awareness — Broad", p: "meta", q: 0.31, cpc: 1.2, fat: false },
      { n: "Local services", p: "google", q: 0.68, cpc: 3.6, fat: false }
    ];
    var camps = CDEF.map(function (c, i) {
      return {
        id: "c" + (i + 1), name: c.n, platform: c.p, country: countries[i % countries.length],
        quality: c.q, cpc: c.cpc, fatigue: c.fat,
        budget: 0, spend: 0, impressions: 0, clicks: 0, days: [],
        status: "active", capped: false
      };
    });
    /* budget split: brand + retargeting under-funded, broad over-funded */
    var weights = [0.13, 0.19, 0.15, 0.20, 0.12, 0.15, 0.06];
    camps.forEach(function (c, i) { c.budget = Math.round((budget * weights[i]) / 30); });
    camps[4].capped = true;    /* retargeting: high return, budget capped */
    camps[0].capped = true;

    /* --- daily series + leads --- */
    var leads = [];
    var lid = 1000;
    var perDay = monthLeads / 30;
    var gapStart = days - 6, gapEnd = days - 4;   /* CRM outage window */

    /* calibration: the generated volume has to match the monthly volume the
       business actually declared, otherwise every derived cost is fiction */
    var calib = (function () {
      var expected = 0;
      camps.forEach(function (c) {
        var spend = c.budget * (c.capped ? 1 : 0.93) * 0.948;
        var clicks = spend / c.cpc;
        expected += clicks * (0.028 + c.quality * 0.03) * 0.948 * 1.09 * 1.05;
      });
      return expected > 0 ? Math.max(0.05, Math.min(4, perDay / expected)) : 1;
    })();

    for (var d = 0; d < days; d++) {
      var ts0 = now - (days - 1 - d) * DAY;
      var dow = new Date(ts0).getDay();
      var seasonal = (dow === 5 || dow === 6) ? 0.62 : 1.08;
      var trend = 1 + (d / days) * 0.18;

      camps.forEach(function (c, ci) {
        var fatigueAge = c.fatigue ? Math.max(0, (d - (days - 26)) / 26) : 0;
        var ctr = (c.platform === "google" ? 0.052 : 0.031) * (1 - fatigueAge * 0.42);
        var freq = c.fatigue ? 2.2 + fatigueAge * 4.1 : 1.6 + r() * 1.1;
        var dailyBudget = c.budget;
        var spend = dailyBudget * (c.capped ? 1 : 0.78 + r() * 0.3) * seasonal;
        var clicks = Math.max(1, Math.round((spend / (c.cpc * (1 + fatigueAge * 0.34))) ));
        var impressions = Math.round(clicks / ctr);
        var cvr = 0.028 + c.quality * 0.03;
        var dayLeads = Math.max(0, Math.round(clicks * cvr * seasonal * trend * (0.7 + r() * 0.7) * calib));
        dayLeads = Math.min(dayLeads, Math.ceil(perDay * 1.5));

        c.spend += spend; c.impressions += impressions; c.clicks += clicks;
        c.days.push({ d: d, ts: ts0, spend: spend, clicks: clicks, impressions: impressions, leads: dayLeads, ctr: ctr, freq: freq });

        for (var k = 0; k < dayLeads; k++) {
          var src = c.platform === "google" ? "google" : "meta";
          if (r() < 0.12) src = r() < 0.6 ? "whatsapp" : "organic";
          var noUtm = (src === "whatsapp" || src === "organic") ? r() < 0.72 : r() < 0.04;
          var inGap = d >= gapStart && d <= gapEnd;
          var reachedCrm = inGap ? r() > 0.55 : r() > 0.015;
          /* assignment weighted by rep share */
          var pick = r() * shareSum, acc = 0, owner = null;
          for (var q = 0; q < emps.length; q++) { acc += emps[q].share; if (pick <= acc) { owner = emps[q]; break; } }
          if (!reachedCrm || r() < 0.02) owner = null;

          var quality = Math.max(3, Math.min(99, Math.round(c.quality * 100 + (r() - 0.5) * 58)));
          var qualified = quality >= 55;
          var firstMin = null, attempts = 0, status = "new", lostReason = null, deal = 0, paid = false;

          if (owner) {
            var load = owner.share > 2 ? 2.4 : 1;
            firstMin = Math.round(owner.respBase * load * (0.5 + r()));
            var contacted = r() < 0.93 - (firstMin > 240 ? 0.35 : 0);
            if (contacted) {
              attempts = Math.max(1, Math.round(owner.attemptBias * (0.5 + r() * 1.2)));
              status = "contacted";
              if (qualified) {
                status = "qualified";
                var appt = r() < 0.42 * owner.closeSkill + quality / 400;
                if (appt) {
                  status = "appointment";
                  var won = r() < 0.44 * owner.closeSkill * (attempts >= 3 ? 1.25 : 0.7);
                  if (won) {
                    status = "won";
                    deal = Math.round(avgDeal * (0.6 + r() * 0.9));
                    paid = r() > 0.06;
                  }
                }
              }
              if (status !== "won" && r() < 0.55) {
                status = "lost";
                lostReason = r() < 0.34 ? null : ["price", "timing", "not_relevant", "no_answer", "competitor"][Math.floor(r() * 5)];
              }
            }
          }
          leads.push({
            id: "l" + (++lid),
            name: INITIALS[Math.floor(r() * INITIALS.length)] + ". " + SURNAMES[Math.floor(r() * SURNAMES.length)],
            phone: "05" + Math.floor(r() * 9) + "-XXX-" + String(1000 + Math.floor(r() * 8999)),
            country: c.country, source: src, campaignId: c.id, campaign: c.name,
            createdAt: ts0 + Math.floor(r() * DAY),
            crmAt: reachedCrm ? ts0 + Math.floor(r() * DAY) + 120000 : null,
            utm: !noUtm, ownerId: owner ? owner.id : null, owner: owner ? owner.name : null,
            firstMin: firstMin, attempts: attempts, status: status, quality: quality, qualified: qualified,
            lostReason: lostReason, deal: deal, paid: paid, badPhone: r() < 0.02, dup: false, day: d
          });
        }
      });
    }
    /* normalise deal values so blended return lands in a plausible band, a
       little under target — relative campaign differences are preserved */
    (function () {
      var totalSpend = camps.reduce(function (a, c) { return a + c.spend; }, 0);
      var totalRev = leads.reduce(function (a, l) { return a + l.deal; }, 0);
      if (!totalSpend || !totalRev) return;
      var actual = totalRev / totalSpend;
      var wanted = Math.max(1.4, T.roas * 0.72);
      var factor = wanted / actual;
      leads.forEach(function (l) { if (l.deal) l.deal = Math.max(120, Math.round(l.deal * factor)); });
    })();

    /* duplicates: same phone on a later record */
    for (var i2 = 0; i2 < leads.length; i2++) {
      if (i2 > 20 && rng(seed + i2)() < 0.018) { leads[i2].dup = true; leads[i2].phone = leads[i2 - 7].phone; }
    }
    /* flags */
    var T2 = targets();
    leads.forEach(function (l) {
      var f = [];
      if (!l.crmAt) f.push("noCrm");
      if (l.dup) f.push("dup");
      if (l.badPhone) f.push("badPhone");
      if (!l.utm) f.push("noUtm");
      if (!l.ownerId && l.crmAt) f.push("noOwner");
      if (l.firstMin != null && l.firstMin > T2.resp) f.push("slaBreach");
      if (l.attempts === 1 && l.status !== "won" && l.status !== "new") f.push("noFollowup");
      if (l.status === "lost" && !l.lostReason) f.push("noLostReason");
      if (l.status === "won" && !l.paid) f.push("soldNotMarked");
      if (l.paid && !l.utm) f.push("paidNoCampaign");
      l.flags = f;
    });

    /* customer experience + site health (small synthetic sets) */
    var cx = {
      rating: Math.round((3.6 + r() * 1.1) * 10) / 10,
      ratingPrev: 4.5,
      reviews: 18 + Math.floor(r() * 14),
      negative: 6 + Math.floor(r() * 6),
      negUnanswered: 3 + Math.floor(r() * 5),
      slaMet: Math.round(52 + r() * 30),
      complaints: 4 + Math.floor(r() * 7),
      refunds: 2 + Math.floor(r() * 4),
      causes: [
        { k: ["Waiting time", "זמן המתנה", "زمن الانتظار"], n: 7 },
        { k: ["Communication", "תקשורת", "التواصل"], n: 4 },
        { k: ["Expectation vs delivery", "פער ציפיות", "فجوة التوقّعات"], n: 3 },
        { k: ["Pricing clarity", "בהירות מחיר", "وضوح السعر"], n: 2 }
      ]
    };
    var site = {
      uptime: 99.2 + r() * 0.7,
      loadMobile: Math.round((2.4 + r() * 2.6) * 10) / 10,
      forms: Math.round(leads.length * 0.82),
      formErrors: 6 + Math.floor(r() * 12),
      dupEvents: Math.floor(r() * 3),
      ssl: true,
      checksTotal: 8,
      checksFailing: r() < 0.6 ? 1 + Math.floor(r() * 2) : 0
    };

    CACHE = { sig: sig, camps: camps, leads: leads, emps: emps, cx: cx, site: site, days: days, now: now };
    return CACHE;
  }

  /* ============================ analytics ============================ */
  function inRange(l, ds, range, f) {
    if (l.day < ds.days - range) return false;
    if (f.country !== "all" && l.country !== f.country) return false;
    if (f.source !== "all" && l.source !== f.source) return false;
    return true;
  }

  function metrics(range, filters) {
    var ds = dataset();
    if (!ds) return null;
    range = range || S.range || 30;
    var f = filters || S.filters || { country: "all", source: "all" };
    var T = targets();

    var cur = ds.leads.filter(function (l) { return inRange(l, ds, range, f); });
    var prev = ds.leads.filter(function (l) {
      return l.day < ds.days - range && l.day >= ds.days - range * 2 &&
        (f.country === "all" || l.country === f.country) && (f.source === "all" || l.source === f.source);
    });

    function agg(rows) {
      var o = {
        leads: rows.length,
        crm: 0, assigned: 0, contacted: 0, qualified: 0, followed: 0, appts: 0, won: 0, paid: 0,
        revenue: 0, respSum: 0, respN: 0, slaMet: 0, attemptsSum: 0, attemptsN: 0,
        utm: 0, lost: 0, lostNoReason: 0, dup: 0, noOwner: 0, qualitySum: 0
      };
      var resp = [];
      rows.forEach(function (l) {
        if (l.crmAt) o.crm++;
        if (l.ownerId) o.assigned++; else if (l.crmAt) o.noOwner++;
        if (l.status !== "new") o.contacted++;
        if (l.qualified) o.qualified++;
        if (l.attempts >= T.attempts) o.followed++;
        if (l.status === "appointment" || l.status === "won") o.appts++;
        if (l.status === "won") { o.won++; o.revenue += l.deal; if (l.paid) o.paid++; }
        if (l.firstMin != null) { resp.push(l.firstMin); o.respSum += l.firstMin; o.respN++; if (l.firstMin <= T.resp) o.slaMet++; }
        if (l.attempts > 0) { o.attemptsSum += l.attempts; o.attemptsN++; }
        if (l.utm) o.utm++;
        if (l.status === "lost") { o.lost++; if (!l.lostReason) o.lostNoReason++; }
        if (l.dup) o.dup++;
        o.qualitySum += l.quality;
      });
      resp.sort(function (a, b) { return a - b; });
      o.respMedian = resp.length ? resp[Math.floor(resp.length / 2)] : 0;
      o.avgQuality = rows.length ? Math.round(o.qualitySum / rows.length) : 0;
      o.avgAttempts = o.attemptsN ? Math.round((o.attemptsSum / o.attemptsN) * 10) / 10 : 0;
      return o;
    }
    var a = agg(cur), p = agg(prev);

    /* spend from campaign day series, same window + filters */
    function spendOf(rows) {
      var s = 0, imp = 0, clk = 0;
      ds.camps.forEach(function (c) {
        if (f.country !== "all" && c.country !== f.country) return;
        if (f.source === "google" && c.platform !== "google") return;
        if (f.source === "meta" && c.platform !== "meta") return;
        c.days.forEach(function (dd) { if (rows(dd.d)) { s += dd.spend; imp += dd.impressions; clk += dd.clicks; } });
      });
      return { spend: s, impressions: imp, clicks: clk };
    }
    var sp = spendOf(function (d) { return d >= ds.days - range; });
    var spPrev = spendOf(function (d) { return d < ds.days - range && d >= ds.days - range * 2; });

    var m = {
      range: range, filters: f, days: ds.days,
      leads: a.leads, prevLeads: p.leads,
      crm: a.crm, captureRate: pct(a.crm, a.leads),
      assigned: a.assigned, noOwner: a.noOwner,
      contacted: a.contacted, contactRate: pct(a.contacted, a.assigned || a.leads),
      qualified: a.qualified, qualifiedRate: pct(a.qualified, a.contacted || a.leads),
      prevQualifiedRate: pct(p.qualified, p.contacted || p.leads),
      followed: a.followed, followRate: pct(a.followed, a.contacted),
      appts: a.appts, apptRate: pct(a.appts, a.qualified),
      won: a.won, paid: a.paid, revenue: a.revenue, prevRevenue: p.revenue,
      closeRate: pct(a.won, a.qualified), closeRateAll: pct(a.won, a.leads),
      prevCloseRate: pct(p.won, p.qualified),
      respMedian: a.respMedian, prevRespMedian: p.respMedian,
      slaMetPct: pct(a.slaMet, a.respN), avgAttempts: a.avgAttempts, prevAvgAttempts: p.avgAttempts,
      avgQuality: a.avgQuality,
      utmCoverage: pct(a.utm, a.leads), lost: a.lost, lostNoReason: a.lostNoReason,
      lostReasonCoverage: a.lost ? pct(a.lost - a.lostNoReason, a.lost) : 100,
      dup: a.dup,
      spend: sp.spend, prevSpend: spPrev.spend, impressions: sp.impressions, clicks: sp.clicks,
      ctr: pct(sp.clicks, sp.impressions),
      cpl: a.leads ? Math.round(sp.spend / a.leads) : 0,
      prevCpl: p.leads ? Math.round(spPrev.spend / p.leads) : 0,
      cpql: a.qualified ? Math.round(sp.spend / a.qualified) : 0,
      cac: a.won ? Math.round(sp.spend / a.won) : 0,
      roas: sp.spend ? Math.round((a.revenue / sp.spend) * 100) / 100 : 0,
      cx: ds.cx, site: ds.site
    };
    m.singleAttemptPct = (function () {
      var live = cur.filter(function (l) { return l.status !== "new"; });
      var one = live.filter(function (l) { return l.attempts <= 1 && l.status !== "won"; });
      return pct(one.length, live.length);
    })();
    m.landing = Math.round(sp.clicks * 0.9);
    m.rows = cur;
    m.dataset = ds;
    return m;
  }

  /* per-campaign table rows for the window */
  function campaignRows(range, filters) {
    var ds = dataset(); if (!ds) return [];
    range = range || S.range; var f = filters || S.filters;
    return ds.camps.filter(function (c) {
      if (f.country !== "all" && c.country !== f.country) return false;
      if (f.source === "google" && c.platform !== "google") return false;
      if (f.source === "meta" && c.platform !== "meta") return false;
      return true;
    }).map(function (c) {
      var dd = c.days.filter(function (x) { return x.d >= ds.days - range; });
      var spend = dd.reduce(function (s, x) { return s + x.spend; }, 0);
      var clicks = dd.reduce(function (s, x) { return s + x.clicks; }, 0);
      var impressions = dd.reduce(function (s, x) { return s + x.impressions; }, 0);
      var ls = ds.leads.filter(function (l) { return l.campaignId === c.id && l.day >= ds.days - range; });
      var ql = ls.filter(function (l) { return l.qualified; }).length;
      var won = ls.filter(function (l) { return l.status === "won"; });
      var rev = won.reduce(function (s, l) { return s + l.deal; }, 0);
      var half = Math.floor(dd.length / 2);
      var ctrEarly = pct(dd.slice(0, half).reduce(function (s, x) { return s + x.clicks; }, 0),
        dd.slice(0, half).reduce(function (s, x) { return s + x.impressions; }, 0));
      var ctrLate = pct(dd.slice(half).reduce(function (s, x) { return s + x.clicks; }, 0),
        dd.slice(half).reduce(function (s, x) { return s + x.impressions; }, 0));
      var freq = dd.length ? dd[dd.length - 1].freq : 0;
      var crmCount = ls.filter(function (l) { return l.crmAt; }).length;
      return {
        id: c.id, name: c.name, platform: c.platform, country: c.country, capped: c.capped,
        budget: c.budget * range, spend: spend, impressions: impressions, clicks: clicks,
        ctr: pct(clicks, impressions), cpc: clicks ? Math.round((spend / clicks) * 100) / 100 : 0,
        leads: ls.length, crm: crmCount, gap: ls.length - crmCount,
        cpl: ls.length ? Math.round(spend / ls.length) : 0,
        qleads: ql, cpql: ql ? Math.round(spend / ql) : 0,
        deals: won.length, revenue: rev, roas: spend ? Math.round((rev / spend) * 100) / 100 : 0,
        freq: Math.round(freq * 10) / 10, ctrDelta: ctrEarly ? Math.round(((ctrLate - ctrEarly) / ctrEarly) * 100) : 0,
        days: dd, rows: ls
      };
    });
  }

  /* per-employee scorecards, normalised for the hand they were dealt */
  function employeeRows(range, filters) {
    var ds = dataset(); if (!ds) return [];
    range = range || S.range; var f = filters || S.filters;
    var T = targets();
    return ds.emps.map(function (e) {
      var ls = ds.leads.filter(function (l) { return l.ownerId === e.id && inRange(l, ds, range, f); });
      var contacted = ls.filter(function (l) { return l.status !== "new"; });
      var qual = ls.filter(function (l) { return l.qualified; });
      var won = ls.filter(function (l) { return l.status === "won"; });
      var appts = ls.filter(function (l) { return l.status === "appointment" || l.status === "won"; });
      var resp = ls.filter(function (l) { return l.firstMin != null; }).map(function (l) { return l.firstMin; }).sort(function (a, b) { return a - b; });
      var lost = ls.filter(function (l) { return l.status === "lost"; });
      var avgQ = ls.length ? Math.round(ls.reduce(function (s, l) { return s + l.quality; }, 0) / ls.length) : 0;
      var hygiene = lost.length ? pct(lost.filter(function (l) { return l.lostReason; }).length, lost.length) : 100;
      var closeRate = pct(won.length, qual.length);
      /* fair score: close rate normalised by the average quality of the leads received */
      var qFactor = avgQ ? Math.min(1.6, Math.max(0.6, 62 / avgQ)) : 1;
      var fair = Math.round(Math.min(100,
        closeRate * qFactor * 2.2 * 0.45 +
        pct(contacted.length, ls.length) * 0.2 +
        Math.min(100, (resp.length ? Math.max(0, 100 - (resp[Math.floor(resp.length / 2)] / T.resp) * 22) : 0)) * 0.2 +
        hygiene * 0.15));
      var tr = Object.keys(S.training).filter(function (k) { return S.training[k].completed; }).length;
      return {
        id: e.id, name: e.name, tenure: e.tenure, leads: ls.length, avgQuality: avgQ,
        contactRate: pct(contacted.length, ls.length),
        avgAttempts: contacted.length ? Math.round((contacted.reduce(function (s, l) { return s + l.attempts; }, 0) / contacted.length) * 10) / 10 : 0,
        followRate: pct(contacted.filter(function (l) { return l.attempts >= T.attempts; }).length, contacted.length),
        qualRate: pct(qual.length, contacted.length || ls.length),
        respMedian: resp.length ? resp[Math.floor(resp.length / 2)] : 0,
        appts: appts.length, deals: won.length, revenue: won.reduce(function (s, l) { return s + l.deal; }, 0),
        closeRate: closeRate, hygiene: hygiene, fair: fair, trainings: tr, rows: ls
      };
    }).sort(function (a, b) { return b.fair - a.fair; });
  }

  /* ============================ funnel ============================ */
  function funnel(range, filters) {
    var m = metrics(range, filters); if (!m) return null;
    var T = targets();
    var st = [
      { k: "fn.ads", v: m.impressions, target: null, dept: "marketing" },
      { k: "fn.clicks", v: m.clicks, target: 4, dept: "marketing" },
      { k: "fn.landing", v: m.landing, target: 90, dept: "it" },
      { k: "fn.leads", v: m.leads, target: 3, dept: "marketing" },
      { k: "fn.crm", v: m.crm, target: 99, dept: "it" },
      { k: "fn.assigned", v: m.assigned, target: 99, dept: "sales" },
      { k: "fn.contacted", v: m.contacted, target: T.contact, dept: "sales" },
      { k: "fn.qualified", v: m.qualified, target: 45, dept: "marketing" },
      { k: "fn.followup", v: m.followed, target: 70, dept: "sales", vars: { n: T.attempts } },
      { k: "fn.appointment", v: m.appts, target: T.appt, dept: "sales" },
      { k: "fn.sale", v: m.won, target: T.close, dept: "sales" },
      { k: "fn.paid", v: m.paid, target: 96, dept: "finance" }
    ];
    st.forEach(function (s, i) {
      s.rate = i === 0 ? 100 : pct(s.v, st[i - 1].v);
      s.lost = i === 0 ? 0 : Math.max(0, st[i - 1].v - s.v);
      s.leak = s.target != null && s.rate < s.target * 0.92;
    });
    return st;
  }

  /* ============================ scores ============================ */
  function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function ratioScore(actual, target, lowerIsBetter) {
    if (!target) return 60;
    var r = lowerIsBetter ? target / Math.max(actual, 0.0001) : actual / target;
    return clamp(45 + (r - 1) * 90 + (r >= 1 ? 25 : 0));
  }
  function implementationScore() {
    var keys = Object.keys(S.assess);
    var vals = keys.map(function (k) { return S.assess[k]; }).filter(function (v) { return v !== "na"; });
    if (!vals.length) return null;
    var sum = vals.reduce(function (a, b) { return a + Number(b); }, 0);
    return clamp(sum / vals.length);
  }
  function implementationByArea() {
    var out = {};
    window.MKT_ASSESS.forEach(function (q, i) {
      var v = S.assess[i];
      if (v == null || v === "na") return;
      out[q.area] = out[q.area] || { sum: 0, n: 0, items: [] };
      out[q.area].sum += Number(v); out[q.area].n++;
      out[q.area].items.push({ i: i, v: Number(v), q: q });
    });
    return Object.keys(out).map(function (a) {
      return { area: a, score: clamp(out[a].sum / out[a].n), items: out[a].items };
    }).sort(function (x, y) { return x.score - y.score; });
  }

  function scores(range, filters) {
    var m = metrics(range, filters); if (!m) return null;
    var T = targets();
    var conns = connectedKeys().length;
    var freshness = conns ? 92 : 70;

    var trust = clamp(
      m.captureRate * 0.4 + m.utmCoverage * 0.25 + freshness * 0.2 +
      Math.min(100, (conns / 6) * 100) * 0.15
    );
    var marketing = clamp(
      ratioScore(m.cpl, T.cpl, true) * 0.28 +
      ratioScore(m.cpql, T.cpql, true) * 0.24 +
      Math.min(100, m.qualifiedRate * 2) * 0.24 +
      m.utmCoverage * 0.14 +
      clamp(100 - m.site.checksFailing * 22) * 0.10
    );
    var sales = clamp(
      m.slaMetPct * 0.3 +
      ratioScore(m.contactRate, T.contact) * 0.2 +
      ratioScore(m.avgAttempts, T.attempts) * 0.2 +
      ratioScore(m.closeRate, T.close) * 0.2 +
      m.lostReasonCoverage * 0.1
    );
    var cx = clamp(
      (m.cx.rating / 5) * 100 * 0.35 +
      m.cx.slaMet * 0.25 +
      clamp(100 - m.cx.negUnanswered * 9) * 0.2 +
      clamp(100 - m.cx.refunds * 7) * 0.2
    );
    var fh = (function () {
      var f = funnel(range, filters), n = 0, s = 0, leaks = 0;
      f.forEach(function (st) {
        if (st.target == null || st.rate == null) return;
        s += clamp((st.rate / st.target) * 100 > 100 ? 100 : (st.rate / st.target) * 100); n++;
        if (st.leak) leaks++;
      });
      /* a stage inside target cannot compensate for a stage that leaks money */
      return clamp((n ? s / n : 60) - leaks * 7);
    })();
    var impl = implementationScore();
    var implForMix = impl == null ? 50 : impl;

    var overall = clamp(fh * 0.25 + marketing * 0.20 + sales * 0.20 + cx * 0.15 + implForMix * 0.10 + trust * 0.10);
    return {
      overall: overall, gated: trust < 60, trust: trust, funnel: fh,
      marketing: marketing, sales: sales, cx: cx, implementation: impl,
      band: overall >= 85 ? "green" : overall >= 70 ? "yellow" : overall >= 50 ? "orange" : "red"
    };
  }

  return {
    KEY: KEY, state: state, set: set, save: save, wipe: wipe, invalidate: invalidate,
    targets: targets, DEFAULT_TARGETS: DEFAULT_TARGETS, currency: currency, money: money, num: num, pct: pct,
    connectedKeys: connectedKeys, hasSource: hasSource, mode: mode,
    dataset: dataset, metrics: metrics, campaignRows: campaignRows, employeeRows: employeeRows,
    funnel: funnel, scores: scores, implementationScore: implementationScore, implementationByArea: implementationByArea,
    clamp: clamp
  };
})();
