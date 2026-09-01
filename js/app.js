/* DRIFTX — interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- Year ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- i18n ---------- */
  const I18N = window.DRIFTX_I18N || {};
  const RTL = { he: true, ar: true };
  const PAGE = window.PAGE_I18N || {};
  function applyLang(lang) {
    const dict = Object.assign({}, I18N[lang] || {}, PAGE[lang] || {});
    const fallback = Object.assign({}, I18N.en || {}, PAGE.en || {});
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key] != null ? dict[key] : fallback[key];
      if (val != null) el.textContent = val;
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL[lang] ? "rtl" : "ltr";
    $$(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    try { localStorage.setItem("driftx_lang", lang); } catch (e) {}
    buildScan(); // rebuild scan copy in the active language
    layoutOrbit();
    window.dispatchEvent(new Event("resize")); // let the hero constellation flip for RTL
  }
  $$(".lang button").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  /* ---------- Nav scroll state ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Full-screen menu ---------- */
  const fsnav = $("#fsnav"), menuToggle = $("#menuToggle"), fsClose = $("#fsnavClose");
  function openMenu() { fsnav.classList.add("open"); fsnav.setAttribute("aria-hidden", "false"); menuToggle.setAttribute("aria-expanded", "true"); }
  function closeMenu() { fsnav.classList.remove("open"); fsnav.setAttribute("aria-hidden", "true"); menuToggle.setAttribute("aria-expanded", "false"); }
  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (fsClose) fsClose.addEventListener("click", closeMenu);
  $$(".fsnav__list a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Scroll reveal ---------- */
  const revealables = $$(".reveal");
  if (reduce) { revealables.forEach((el) => el.classList.add("in")); }
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Custom cursor ---------- */
  if (!coarse && !reduce) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverSel = "a, button, .card, .verb, .q-option, .chip";
    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest(hoverSel);
      if (el) { ring.classList.add("is-hover"); label.textContent = el.getAttribute("data-cursor") || ""; }
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hoverSel)) { ring.classList.remove("is-hover"); label.textContent = ""; }
    });
  }

  /* ---------- Card glow follows pointer ---------- */
  if (!coarse) {
    $$(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!coarse && !reduce) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Lead journey (funnel + leak reveal) ---------- */
  const funnel = $("#funnel");
  if (funnel) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".funnel__step", funnel).forEach((step, i) => {
          const bar = $(".bar", step);
          const target = bar ? bar.style.width : "100%";
          bar.style.width = "0";
          setTimeout(() => {
            bar.style.width = target;
            if (step.classList.contains("leak")) setTimeout(() => step.classList.add("show"), 400);
          }, i * 180);
        });
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(funnel);
  }

  /* ---------- Orbit nodes positioning ---------- */
  function layoutOrbit() {
    const wrap = $(".orbit-wrap"); if (!wrap) return;
    if (window.innerWidth <= 720) return; // CSS handles stacked layout
    const rect = wrap.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const radii = { 1: 170, 2: 250 };
    $$(".orbit-node", wrap).forEach((n) => {
      const r = radii[n.dataset.r] || 170;
      const a = (parseFloat(n.dataset.a) - 90) * Math.PI / 180;
      n.style.left = (cx + Math.cos(a) * r) + "px";
      n.style.top = (cy + Math.sin(a) * r) + "px";
    });
  }
  layoutOrbit();
  window.addEventListener("resize", layoutOrbit);
  // Re-layout once fonts settle
  window.addEventListener("load", layoutOrbit);

  /* ---------- Contact form ---------- */
  const chips = $("#focusChips");
  if (chips) chips.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (c) c.classList.toggle("active");
  });
  const form = $("#contactForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = $("#formNote");
    const dict = (window.DRIFTX_I18N && window.DRIFTX_I18N[document.documentElement.lang]) || {};
    const msg = (k, fb) => dict[k] || fb;
    const email = form.email.value.trim(), name = form.name.value.trim();
    if (!name || !email) { note.textContent = msg("contact.fill", "Please add your name and email."); note.style.color = "var(--coral)"; return; }
    const focus = $$(".chip.active", chips).map((c) => c.textContent.trim()).join(", ");
    const fd = new FormData(form);
    fd.set("focus", focus);
    fd.set("lang", document.documentElement.lang || "en");
    const submitBtn = form.querySelector("[type=submit]");
    note.textContent = msg("contact.sending", "Sending…"); note.style.color = "var(--ink-3)";
    if (submitBtn) submitBtn.disabled = true;
    fetch("contact.php", { method: "POST", body: fd })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => {
        if (!d || !d.ok) throw new Error("send");
        note.textContent = msg("contact.thanks", "Thanks — we'll get back to you within one business day.");
        note.style.color = "var(--lime)";
        form.reset();
        $$(".chip.active", chips).forEach((c) => c.classList.remove("active"));
      })
      .catch(() => {
        // Fallback: hand off to the visitor's mail app.
        const subject = encodeURIComponent("DriftX enquiry — " + name);
        const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nFocus: " + focus + "\n\nChallenge:\n" + form.challenge.value);
        note.textContent = msg("contact.mailapp", "Opening your email app…"); note.style.color = "var(--brand-soft)";
        window.location.href = "mailto:info@driftx.co?subject=" + subject + "&body=" + body;
      })
      .finally(() => { if (submitBtn) submitBtn.disabled = false; });
  });

  /* ================= AI BUSINESS SCAN ================= */
  const SCAN = {
    en: {
      q: [
        { t: "How do you currently generate leads?", o: [["Word of mouth only", 20], ["Some ads, no strategy", 45], ["Multiple channels", 70], ["Data-driven, optimized", 95]], dim: "Marketing" },
        { t: "How quickly does your team respond to a new lead?", o: [["Hours or days", 15], ["Within an hour", 55], ["Within minutes", 85], ["Instantly / automated", 100]], dim: "Sales" },
        { t: "Do you use a CRM?", o: [["No", 10], ["Spreadsheets", 35], ["Basic CRM", 65], ["CRM + automation", 95]], dim: "Technology" },
        { t: "Do you track conversion rates?", o: [["No idea", 15], ["Roughly", 45], ["Yes, monthly", 75], ["Real-time dashboards", 95]], dim: "Operations" },
        { t: "Do employees follow a defined sales process?", o: [["No process", 20], ["Loosely", 45], ["Mostly", 70], ["Documented & trained", 95]], dim: "Sales" },
        { t: "How many tasks are still manual?", o: [["Almost everything", 20], ["A lot", 45], ["Some", 70], ["Very few", 92]], dim: "Operations" },
        { t: "Do you currently use AI in the business?", o: [["Not at all", 10], ["Just ChatGPT sometimes", 35], ["A few tools", 60], ["Integrated into workflows", 90]], dim: "AI Readiness" },
        { t: "How confident are you in your business data?", o: [["We don't really have it", 15], ["Scattered", 40], ["Mostly reliable", 70], ["Single source of truth", 95]], dim: "Technology" }
      ],
      dims: ["Sales", "Marketing", "Technology", "AI Readiness", "Operations"],
      improve: { low: "Needs attention", mid: "Room to grow" }
    }
  };
  // HE/AR question copy (dims stay in EN as short labels for the rings — translated via map below)
  SCAN.he = {
    q: [
      { t: "איך אתה מייצר לידים כיום?", o: [["רק מפה לאוזן", 20], ["קצת פרסום, ללא אסטרטגיה", 45], ["כמה ערוצים", 70], ["מבוסס נתונים, ממוטב", 95]], dim: "Marketing" },
      { t: "כמה מהר הצוות מגיב לליד חדש?", o: [["שעות או ימים", 15], ["תוך שעה", 55], ["תוך דקות", 85], ["מיידי / אוטומטי", 100]], dim: "Sales" },
      { t: "האם אתה משתמש ב-CRM?", o: [["לא", 10], ["גיליונות", 35], ["CRM בסיסי", 65], ["CRM + אוטומציה", 95]], dim: "Technology" },
      { t: "האם אתה עוקב אחרי אחוזי המרה?", o: [["אין מושג", 15], ["בערך", 45], ["כן, חודשי", 75], ["דשבורדים בזמן אמת", 95]], dim: "Operations" },
      { t: "האם העובדים עובדים לפי תהליך מכירה?", o: [["אין תהליך", 20], ["באופן רופף", 45], ["ברובו", 70], ["מתועד ומודרך", 95]], dim: "Sales" },
      { t: "כמה משימות עדיין ידניות?", o: [["כמעט הכול", 20], ["הרבה", 45], ["חלק", 70], ["מעט מאוד", 92]], dim: "Operations" },
      { t: "האם אתה משתמש ב-AI בעסק?", o: [["בכלל לא", 10], ["לפעמים ChatGPT", 35], ["כמה כלים", 60], ["משולב בתהליכים", 90]], dim: "AI Readiness" },
      { t: "עד כמה אתה בוטח בנתוני העסק?", o: [["אין לנו באמת", 15], ["מפוזר", 40], ["ברובו אמין", 70], ["מקור אמת יחיד", 95]], dim: "Technology" }
    ],
    dims: SCAN.en.dims
  };
  SCAN.ar = {
    q: [
      { t: "كيف تجذب العملاء المحتملين حالياً؟", o: [["الكلام الشفهي فقط", 20], ["إعلانات دون استراتيجية", 45], ["عدة قنوات", 70], ["مبني على البيانات ومُحسّن", 95]], dim: "Marketing" },
      { t: "ما سرعة استجابة فريقك لعميل جديد؟", o: [["ساعات أو أيام", 15], ["خلال ساعة", 55], ["خلال دقائق", 85], ["فوري / آلي", 100]], dim: "Sales" },
      { t: "هل تستخدم نظام CRM؟", o: [["لا", 10], ["جداول بيانات", 35], ["CRM أساسي", 65], ["CRM + أتمتة", 95]], dim: "Technology" },
      { t: "هل تتابع معدّلات التحويل؟", o: [["لا فكرة", 15], ["تقريباً", 45], ["نعم، شهرياً", 75], ["لوحات لحظية", 95]], dim: "Operations" },
      { t: "هل يتّبع الموظفون عملية مبيعات محدّدة؟", o: [["لا عملية", 20], ["بشكل غير منظّم", 45], ["غالباً", 70], ["موثّقة ومُدرّبة", 95]], dim: "Sales" },
      { t: "كم عدد المهام التي ما زالت يدوية؟", o: [["كل شيء تقريباً", 20], ["الكثير", 45], ["بعضها", 70], ["قليلة جداً", 92]], dim: "Operations" },
      { t: "هل تستخدم الذكاء الاصطناعي في عملك؟", o: [["إطلاقاً", 10], ["ChatGPT أحياناً", 35], ["بضع أدوات", 60], ["مدمج في العمليات", 90]], dim: "AI Readiness" },
      { t: "ما مدى ثقتك ببيانات عملك؟", o: [["لا نملكها فعلاً", 15], ["مبعثرة", 40], ["موثوقة غالباً", 70], ["مصدر حقيقة واحد", 95]], dim: "Technology" }
    ],
    dims: SCAN.en.dims
  };
  const DIM_LABELS = {
    en: { Sales: "Sales", Marketing: "Marketing", Technology: "Technology", "AI Readiness": "AI Readiness", Operations: "Operations" },
    he: { Sales: "מכירות", Marketing: "שיווק", Technology: "טכנולוגיה", "AI Readiness": "מוכנות AI", Operations: "תפעול" },
    ar: { Sales: "المبيعات", Marketing: "التسويق", Technology: "التقنية", "AI Readiness": "جاهزية الذكاء", Operations: "التشغيل" }
  };
  const DIM_COLORS = { Sales: "#F7A200", Marketing: "#FF6B5B", Technology: "#2E7DFF", "AI Readiness": "#22D3EE", Operations: "#A3E635" };

  let scanLang = "en", step = 0, answers = [];
  const scanTool = $("#scanTool");

  function curLang() { try { return localStorage.getItem("driftx_lang") || "en"; } catch (e) { return "en"; } }

  function buildScan() {
    if (!scanTool) return;
    scanLang = SCAN[curLang()] ? curLang() : "en";
    step = 0; answers = [];
    $("#scanResult").classList.remove("show");
    $("#scanQuestion").style.display = "";
    const nav = scanTool.querySelector(".scan__nav"); if (nav) nav.style.display = "";
    $("#scanTotal").textContent = SCAN[scanLang].q.length;
    renderQuestion();
  }

  function renderQuestion() {
    const data = SCAN[scanLang], q = data.q[step];
    $("#scanStep").textContent = (I18N[scanLang] && I18N[scanLang]["scan.back"] ? "" : "") + `Q${step + 1}`;
    $("#qText").textContent = q.t;
    const wrap = $("#qOptions"); wrap.innerHTML = "";
    q.o.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "q-option"; b.type = "button"; b.textContent = opt[0];
      if (answers[step] && answers[step].i === i) b.classList.add("selected");
      b.addEventListener("click", () => {
        answers[step] = { i, score: opt[1], dim: q.dim };
        if (step < data.q.length - 1) { step++; renderQuestion(); }
        else showResult();
      });
      wrap.appendChild(b);
    });
    const bar = $("#scanBar");
    bar.style.width = ((step) / data.q.length * 100) + "%";
    const back = $("#scanBack");
    back.style.visibility = step > 0 ? "visible" : "hidden";
  }
  const backBtn = $("#scanBack");
  if (backBtn) backBtn.addEventListener("click", () => { if (step > 0) { step--; renderQuestion(); } });

  function showResult() {
    $("#scanBar").style.width = "100%";
    const data = SCAN[scanLang];
    // aggregate scores by dimension
    const agg = {}, cnt = {};
    data.dims.forEach((d) => { agg[d] = 0; cnt[d] = 0; });
    answers.forEach((a) => { if (a) { agg[a.dim] += a.score; cnt[a.dim]++; } });
    const scores = data.dims.map((d) => ({
      dim: d, val: cnt[d] ? Math.round(agg[d] / cnt[d]) : 50
    }));
    $("#scanQuestion").style.display = "none";
    const navRow = scanTool.querySelector(".scan__nav"); if (navRow) navRow.style.display = "none";
    const res = $("#scanResult"); res.classList.add("show");
    const holder = $("#scanScores"); holder.innerHTML = "";
    scores.forEach((s) => {
      const el = document.createElement("div");
      el.className = "score";
      el.innerHTML = `<div class="ring" style="--c:${DIM_COLORS[s.dim]};--p:0"><b>0</b></div>
        <div class="lbl">${(DIM_LABELS[scanLang] || DIM_LABELS.en)[s.dim]}</div>`;
      holder.appendChild(el);
      const ring = $(".ring", el), b = $("b", el);
      let cur = 0;
      const animate = () => {
        cur += Math.max(1, Math.round((s.val - cur) * 0.12));
        if (cur >= s.val) cur = s.val;
        ring.style.setProperty("--p", cur); b.textContent = cur;
        if (cur < s.val) requestAnimationFrame(animate);
      };
      if (reduce) { ring.style.setProperty("--p", s.val); b.textContent = s.val; }
      else requestAnimationFrame(animate);
    });
    // improvement areas = weakest dims
    const weak = [...scores].sort((a, b) => a.val - b.val).slice(0, 3);
    const imp = $("#scanImprove"); imp.innerHTML = "";
    weak.forEach((w) => {
      const s = document.createElement("span");
      s.textContent = (DIM_LABELS[scanLang] || DIM_LABELS.en)[w.dim];
      imp.appendChild(s);
    });
  }
  const restart = $("#scanRestart");
  if (restart) restart.addEventListener("click", buildScan);

  /* ---------- Scene mouse parallax ---------- */
  if (!coarse && !reduce) {
    $$(".world__media").forEach((box) => {
      const wrap = $(".scene-wrap", box);
      if (!wrap) return;
      box.addEventListener("pointermove", (e) => {
        const r = box.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / r.width;
        const dy = (e.clientY - r.top - r.height / 2) / r.height;
        wrap.style.setProperty("--px", (dx * 18).toFixed(1));
        wrap.style.setProperty("--py", (dy * 18).toFixed(1));
      });
      box.addEventListener("pointerleave", () => {
        wrap.style.setProperty("--px", 0); wrap.style.setProperty("--py", 0);
      });
    });
  }

  /* ---------- Rotating words ---------- */
  function makeRotator(el, interval) {
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;
    items.forEach((x) => x.classList.remove("on"));
    let i = 0; items[0].classList.add("on");
    if (reduce || items.length < 2) return;
    setInterval(() => {
      items[i].classList.remove("on");
      i = (i + 1) % items.length;
      items[i].classList.add("on");
    }, interval);
  }
  makeRotator($("#heroRotator"), 2100);
  makeRotator($("#contactRotator"), 1700);
  makeRotator($("#filmWords"), 700);

  /* ---------- Hero engine — zoom on scroll ---------- */
  const heroX = $("#heroEngine"), heroEl = $("#hero");
  if (heroX && heroEl && !reduce) {
    let hticking = false;
    const onHero = () => {
      const h = heroEl.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      heroX.style.transform = "scale(" + (1 + p * 1.6).toFixed(3) + ")";
      heroX.style.opacity = (1 - p * 0.85).toFixed(3);
      hticking = false;
    };
    window.addEventListener("scroll", () => { if (!hticking) { hticking = true; requestAnimationFrame(onHero); } }, { passive: true });
    onHero();
  }

  /* ---------- "This is DriftX" — growing video circle ---------- */
  const stage = $("#filmStage"), media = $("#filmMedia"), overlay = $("#filmOverlay"), video = $("#driftxVideo");
  if (stage && media) {
    let loaded = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (video && !loaded) { loaded = true; try { video.load(); } catch (e) {} }
          if (video) video.play().catch(() => {});
        } else if (video) { video.pause(); }
      });
    }, { threshold: 0.3 });
    io.observe(stage);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (reduce) {
      media.style.clipPath = "circle(72% at 50% 50%)";
      if (overlay) overlay.style.opacity = "0";
    } else if (isMobile) {
      // CSS frames the video vertically; offer tap-to-unmute instead of the scroll circle
      if (video) {
        const hint = document.createElement("div");
        hint.className = "film__tap"; hint.textContent = "Tap for sound";
        stage.appendChild(hint);
        const toggle = () => {
          video.muted = !video.muted;
          if (!video.muted) video.play().catch(() => {});
          hint.textContent = video.muted ? "Tap for sound" : "Sound on";
        };
        media.style.cursor = "pointer";
        media.addEventListener("click", toggle);
        hint.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
      }
    } else {
      let fticking = false;
      const onFilm = () => {
        const r = stage.getBoundingClientRect(), vh = window.innerHeight;
        const center = r.top + r.height / 2;
        const p = Math.min(1, Math.max(0, 1 - Math.abs(center - vh / 2) / (vh * 0.75)));
        media.style.clipPath = "circle(" + (18 + p * 62).toFixed(1) + "% at 50% 50%)";
        if (overlay) overlay.style.opacity = (1 - p * 1.15).toFixed(2);
        fticking = false;
      };
      window.addEventListener("scroll", () => { if (!fticking) { fticking = true; requestAnimationFrame(onFilm); } }, { passive: true });
      window.addEventListener("resize", onFilm);
      onFilm();
    }
  }

  /* ---------- Init language (persisted or browser) ---------- */
  let initLang = "en";
  try {
    const saved = localStorage.getItem("driftx_lang");
    if (saved && I18N[saved]) initLang = saved;
    else { const b = (navigator.language || "en").slice(0, 2); if (I18N[b]) initLang = b; }
  } catch (e) {}
  applyLang(initLang);
})();
