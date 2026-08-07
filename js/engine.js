/* DRIFTX Business Engine — interactive hero object (canvas).
   A living system: YOUR BUSINESS core connected to the parts of a business.
   Mouse-reactive, brand colours, scroll zoom handled in app.js. */
(function () {
  const canvas = document.getElementById("engine");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CORE = "#F7A200";
  const NODES = [
    { label: "Sales", c: "#FFD400" },
    { label: "Marketing", c: "#FF2E7E" },
    { label: "CRM", c: "#2E7DFF" },
    { label: "Website", c: "#22D3EE" },
    { label: "AI", c: "#C6FF3A" },
    { label: "Automation", c: "#A855F7" },
    { label: "People", c: "#FFB733" },
    { label: "Data", c: "#2E7DFF" },
  ];

  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, t = 0, raf = null;
  const mouse = { x: -9999, y: -9999, active: false };

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rtl = document.documentElement.dir === "rtl";
    cx = W > 960 ? (rtl ? W * 0.30 : W * 0.70) : W * 0.5;
    cy = H * 0.5;
    R = Math.min(W, H) * (W > 960 ? 0.30 : 0.34);
    NODES.forEach((n, i) => {
      n.baseA = (i / NODES.length) * Math.PI * 2;
      n.ring = 0.72 + (i % 2) * 0.42;
      n.speed = 0.00006 + (i % 3) * 0.00003;
      n.hot = 0; n.r = 4 + (i % 3);
    });
  }

  function pos(n, time) {
    const a = n.baseA + time * n.speed * (n.ring > 1 ? -1 : 1);
    const rad = R * n.ring;
    return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad * 0.92 };
  }

  function frame() {
    t += 16;
    ctx.clearRect(0, 0, W, H);
    NODES.forEach((n) => {
      const p = pos(n, t); n.x = p.x; n.y = p.y;
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      const near = mouse.active && d < 140;
      n.hot += ((near ? 1 : 0) - n.hot) * 0.12;
    });

    // connections core -> node
    NODES.forEach((n) => {
      const hot = n.hot;
      const mx = (cx + n.x) / 2, my = (cy + n.y) / 2 - 16;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(mx, my, n.x, n.y);
      ctx.strokeStyle = hot > 0.05 ? "rgba(247,162,0," + (0.2 + hot * 0.55) + ")" : "rgba(255,255,255,0.09)";
      ctx.lineWidth = 1 + hot * 1.8;
      ctx.stroke();
      if (hot > 0.12) {
        const tp = (t * 0.0006) % 1;
        const px = (1 - tp) * (1 - tp) * cx + 2 * (1 - tp) * tp * mx + tp * tp * n.x;
        const py = (1 - tp) * (1 - tp) * cy + 2 * (1 - tp) * tp * my + tp * tp * n.y;
        ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fillStyle = CORE; ctx.fill();
      }
    });

    // nodes
    NODES.forEach((n) => {
      ctx.save();
      ctx.shadowColor = n.c; ctx.shadowBlur = 10 + n.hot * 22;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.hot * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = n.c; ctx.fill();
      ctx.restore();
      if (n.hot > 0.15) {
        ctx.font = "600 13px Inter, system-ui, sans-serif";
        ctx.fillStyle = "rgba(244,247,252," + n.hot + ")";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 14);
      }
    });

    // core
    const pulse = 1 + Math.sin(t * 0.002) * 0.06;
    ctx.save();
    ctx.shadowColor = CORE; ctx.shadowBlur = 44;
    ctx.beginPath(); ctx.arc(cx, cy, 12 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = CORE; ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 22 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(247,162,0,0.35)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = "800 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.textAlign = "center";
    ctx.fillText("YOUR BUSINESS", cx, cy + 40);

    raf = requestAnimationFrame(frame);
  }

  function staticFrame() {
    NODES.forEach((n) => { const p = pos(n, 0); n.x = p.x; n.y = p.y; });
    ctx.clearRect(0, 0, W, H);
    NODES.forEach((n) => {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = "rgba(255,255,255,0.09)"; ctx.lineWidth = 1; ctx.stroke();
    });
    NODES.forEach((n) => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = n.c; ctx.fill(); });
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = CORE; ctx.fill();
  }

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  window.addEventListener("pointerleave", () => { mouse.active = false; });
  let tk; window.addEventListener("resize", () => { clearTimeout(tk); tk = setTimeout(() => { resize(); if (reduce) staticFrame(); }, 150); });

  resize();
  if (reduce) { staticFrame(); return; }
  const hero = document.getElementById("hero");
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }), { threshold: 0.02 });
  io.observe(hero || canvas);
})();
