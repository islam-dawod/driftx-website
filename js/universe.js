/* DRIFTX Universe — interactive hero constellation.
   "YOUR BUSINESS" core + connected worlds that react to the cursor.
   Lightweight canvas, DPR-aware, respects reduced-motion. */
(function () {
  const canvas = document.getElementById("universe");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLORS = {
    core: "#F7A200",
    line: "rgba(255,255,255,0.10)",
    lineHot: "rgba(247,162,0,0.55)",
  };
  const PALETTE = ["#2E7DFF", "#8B5CF6", "#22D3EE", "#A3E635", "#FF6B5B", "#FFB733", "#2E7DFF", "#22D3EE"];
  const LABELS = ["Sales", "Marketing", "CRM", "Website", "AI", "Automation", "People", "Data"];

  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;
  let nodes = [];
  const mouse = { x: -9999, y: -9999, active: false };
  let t = 0, raf = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Core sits opposite the copy on wide screens (flips for RTL)
    const rtl = document.documentElement.dir === "rtl";
    cx = W > 900 ? (rtl ? W * 0.28 : W * 0.72) : W * 0.5;
    cy = H * 0.52;
    R = Math.min(W, H) * (W > 900 ? 0.30 : 0.36);
    build();
  }

  function build() {
    nodes = LABELS.map((label, i) => {
      const a = (i / LABELS.length) * Math.PI * 2;
      const ring = 0.7 + (i % 2) * 0.42;
      return {
        label, color: PALETTE[i % PALETTE.length],
        baseA: a, ring,
        speed: 0.00008 + (i % 3) * 0.00003,
        x: 0, y: 0, r: 3 + (i % 3),
        hot: 0,
      };
    });
  }

  function pos(n, time) {
    const a = n.baseA + time * n.speed * (n.ring > 1 ? -1 : 1);
    const rad = R * n.ring;
    return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad * 0.9 };
  }

  function draw() {
    t += 16;
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach((n) => {
      const p = pos(n, t);
      n.x = p.x; n.y = p.y;
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      const near = mouse.active && d < 130;
      n.hot += ((near ? 1 : 0) - n.hot) * 0.12;
    });

    // Core pulse
    const pulse = 1 + Math.sin(t * 0.002) * 0.05;

    // Connections: core → node
    nodes.forEach((n) => {
      const hot = n.hot;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const mx = (cx + n.x) / 2, my = (cy + n.y) / 2 - 18;
      ctx.quadraticCurveTo(mx, my, n.x, n.y);
      ctx.strokeStyle = hot > 0.05
        ? `rgba(247,162,0,${0.15 + hot * 0.5})`
        : COLORS.line;
      ctx.lineWidth = 1 + hot * 1.6;
      ctx.stroke();

      // travelling packet along hot edges
      if (hot > 0.15) {
        const tp = (t * 0.0006) % 1;
        const px = (1 - tp) * (1 - tp) * cx + 2 * (1 - tp) * tp * mx + tp * tp * n.x;
        const py = (1 - tp) * (1 - tp) * cy + 2 * (1 - tp) * tp * my + tp * tp * n.y;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.core;
        ctx.fill();
      }
    });

    // Neighbour links between adjacent nodes (subtle web)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i], b = nodes[(i + 1) % nodes.length];
      const hot = Math.max(a.hot, b.hot);
      if (hot < 0.05 && (i % 2)) continue;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = hot > 0.05 ? `rgba(34,211,238,${0.08 + hot * 0.25})` : "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Nodes
    nodes.forEach((n) => {
      const glow = 8 + n.hot * 22;
      ctx.save();
      ctx.shadowColor = n.color; ctx.shadowBlur = glow;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + n.hot * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = n.color; ctx.fill();
      ctx.restore();

      if (n.hot > 0.2) {
        ctx.font = "600 13px Inter, system-ui, sans-serif";
        ctx.fillStyle = `rgba(244,247,252,${n.hot})`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 14);
      }
    });

    // Core
    ctx.save();
    ctx.shadowColor = COLORS.core; ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(cx, cy, 9 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.core; ctx.fill();
    ctx.restore();
    // core ring
    ctx.beginPath();
    ctx.arc(cx, cy, 18 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(247,162,0,0.35)"; ctx.lineWidth = 1.5; ctx.stroke();

    raf = requestAnimationFrame(draw);
  }

  function drawStatic() {
    // Reduced-motion: a single clean frame
    t = 0;
    nodes.forEach((n) => { const p = pos(n, 0); n.x = p.x; n.y = p.y; });
    ctx.clearRect(0, 0, W, H);
    nodes.forEach((n) => {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = COLORS.line; ctx.lineWidth = 1; ctx.stroke();
    });
    nodes.forEach((n) => {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.core; ctx.fill();
  }

  const hero = document.getElementById("hero");
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  window.addEventListener("pointerleave", () => { mouse.active = false; });

  let ticking;
  window.addEventListener("resize", () => {
    clearTimeout(ticking);
    ticking = setTimeout(() => { resize(); if (reduce) drawStatic(); }, 150);
  });

  resize();
  if (reduce) { drawStatic(); }
  else {
    // Pause when hero not visible (perf)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      });
    }, { threshold: 0.02 });
    io.observe(hero);
  }
})();
