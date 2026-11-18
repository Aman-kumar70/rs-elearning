/* ================================================================
   Remote Sensing Process — reusable animation component
   Self-contained custom element. No globals, no build step.
   Lifecycle: connectedCallback mounts, disconnectedCallback tears
   down every animation frame, observer and media-query listener.
   Based on the standalone canvas animation supplied for RS.0.
   ================================================================ */

const TAU = Math.PI * 2;
const DUR = 9;
const TOTAL = DUR * 6;
const L = (a, b, k) => a + (b - a) * k;
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const E = (k) => k * k * (3 - 2 * k);
const hs = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const COL = ["#2f7fe0", "#1f8a4c", "#c4d03e", "#b4bccb", "#86705c"];
const CR = [
  [47, 127, 224],
  [31, 138, 76],
  [196, 208, 62],
  [180, 188, 203],
  [134, 112, 92],
];
const CN = ["Water", "Forest", "Agriculture", "Urban", "Mountain"];
const TNc = [
  "150,210,255",
  "150,255,150",
  "235,255,130",
  "240,240,255",
  "235,205,170",
];
const SIG = [
  [0.2, 0.15, 0.05, 0.02],
  [0.05, 0.1, 0.04, 0.6],
  [0.08, 0.2, 0.15, 0.5],
  [0.3, 0.3, 0.3, 0.35],
  [0.15, 0.2, 0.25, 0.3],
];
const LU = [0.25, 0.45, 0.5, 0.75, 0.55];

function lc(x, y) {
  if (Math.abs(y - 0.5 - 0.18 * Math.sin(x * 7)) < 0.045) return 0;
  const v = x + 0.05 * Math.sin(y * 9 + x * 5);
  return v < 0.2 ? 4 : v < 0.38 ? 1 : v < 0.58 ? 2 : v < 0.76 ? 0 : 3;
}

const STAGES = [
  [
    "Energy",
    "Energy Source",
    "The Sun is the main source of electromagnetic energy for most optical remote sensing.",
    [["#ffb42e", "Energy travelling Sun to Earth"]],
  ],
  [
    "Atmosphere",
    "Atmosphere",
    "Radiation passes through gases, aerosols and clouds that may scatter or absorb energy.",
    [
      ["#ffb42e", "Transmitted"],
      ["#aee0ff", "Scattered"],
      ["#ff5a32", "Absorbed"],
    ],
  ],
  [
    "Target",
    "Target Interaction",
    "Earth's surface absorbs, reflects, transmits or emits energy.",
    [
      ["#fff0be", "Reflection"],
      ["#ff4628", "Absorption"],
      ["#5ac8ff", "Transmission"],
      ["#ff7896", "Emission (thermal)"],
    ],
  ],
  [
    "Sensor",
    "Sensor",
    "The sensor measures electromagnetic energy coming from the target.",
    [
      ["#fff0be", "Reflected energy"],
      ["#3fd8ff", "Sensor scan"],
    ],
  ],
  [
    "Processing",
    "Data Transmission and Processing",
    "Measurements are sent to a ground station, then corrected, enhanced and classified into usable images.",
    [
      ["#3fd8ff", "Data signal"],
      ["#9a7bff", "Digital processing"],
    ],
  ],
  [
    "Interpretation",
    "Interpretation and Application",
    "Analysts turn processed imagery into maps and information that support decisions.",
    CN.map((n, i) => [COL[i], n]),
  ],
];

const STAR = Array.from({ length: 230 }, (_, i) => ({
  x: hs(i),
  y: hs(i + 400),
  z: hs(i + 800),
  c: hs(i + 1200),
}));
const CONT = [
  [0, 0.3, 0.5],
  [1.3, -0.2, 0.45],
  [2.5, 0.4, 0.4],
  [3.8, -0.1, 0.55],
  [5, 0.35, 0.4],
  [0.7, -0.6, 0.3],
];

const STYLE = `
:host { display: block; }
* { box-sizing: border-box; }
.rsa-shell {
  --rsa-gold: #ffb42e; --rsa-cy: #3fd8ff; --rsa-pu: #9a7bff; --rsa-ink: #e8f1ff;
  font-family: 'Sora', var(--font-display, 'Space Grotesk'), system-ui, sans-serif;
  color: var(--rsa-ink);
  background: #03050d;
  border: 1px solid rgba(120,170,255,.22);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04);
}
.rsa-head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
  padding: 16px 20px 12px;
  background: linear-gradient(180deg, rgba(10,18,40,.95), rgba(3,5,13,.9));
  border-bottom: 1px solid rgba(120,170,255,.14);
}
.rsa-title { font-size: clamp(13px, 1.7vw, 18px); font-weight: 700; letter-spacing: .24em; text-transform: uppercase; line-height: 1.25; }
.rsa-sub { font-size: clamp(10px, 1.1vw, 12.5px); font-weight: 300; color: #9fb4d6; margin-top: 3px; }
.rsa-tag { flex: 0 0 auto; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--rsa-cy); border: 1px solid rgba(63,216,255,.3); background: rgba(63,216,255,.08); padding: 4px 9px; border-radius: 100px; white-space: nowrap; }
.rsa-stage { position: relative; background: #03050d; aspect-ratio: 16 / 9; }
.rsa-stage:focus-visible { outline: 2px solid var(--rsa-cy); outline-offset: -3px; }
.rsa-canvas { display: block; width: 100%; height: 100%; }
.rsa-info { display: grid; grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); border-top: 1px solid rgba(120,170,255,.14); background: rgba(7,13,30,.72); }
.rsa-caption { padding: 16px 22px 18px; min-height: 100px; border-left: 3px solid var(--rsa-gold); }
.rsa-cap-kicker { font-size: 9.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--rsa-gold); margin-bottom: 5px; }
.rsa-cap-title { font-size: clamp(14px, 1.6vw, 18px); font-weight: 600; line-height: 1.3; }
.rsa-cap-text { font-size: clamp(11px, 1.15vw, 13px); line-height: 1.55; color: #a9bbdc; margin-top: 4px; }
.rsa-legend-wrap { padding: 16px 18px; border-left: 1px solid rgba(120,170,255,.14); }
.rsa-legend-label { font-size: 9.5px; letter-spacing: .2em; text-transform: uppercase; color: #7f94bd; margin-bottom: 8px; }
.rsa-legend { display: grid; gap: 6px; }
.rsa-legend span { display: flex; align-items: center; gap: 8px; font-size: 10.5px; line-height: 1.3; color: #b8c8e0; }
.rsa-legend i { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; box-shadow: 0 0 8px currentColor; }
.rsa-controls { border-top: 1px solid rgba(120,170,255,.16); background: rgba(4,8,20,.92); padding: 12px 18px 15px; }
.rsa-progress-row { display: flex; align-items: center; gap: 12px; }
.rsa-range { -webkit-appearance: none; appearance: none; width: 100%; height: 24px; background: transparent; cursor: pointer; margin: 0; }
.rsa-range::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, var(--rsa-gold), var(--rsa-cy), var(--rsa-pu)) 0 / var(--rsa-progress, 0%) 100% no-repeat, rgba(255,255,255,.14); }
.rsa-range::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,.14); }
.rsa-range::-moz-range-progress { height: 6px; border-radius: 3px; background: linear-gradient(90deg, var(--rsa-gold), var(--rsa-cy), var(--rsa-pu)); }
.rsa-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; margin-top: -5px; border-radius: 50%; background: #e8f1ff; border: 2px solid var(--rsa-cy); box-shadow: 0 0 10px rgba(63,216,255,.65); }
.rsa-range::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #e8f1ff; border: 2px solid var(--rsa-cy); box-shadow: 0 0 10px rgba(63,216,255,.65); }
.rsa-range:focus-visible { outline: 2px solid var(--rsa-cy); outline-offset: 4px; border-radius: 4px; }
.rsa-time { flex: 0 0 auto; font-size: 10px; color: #7f94bd; letter-spacing: .06em; white-space: nowrap; font-variant-numeric: tabular-nums; }
.rsa-stages, .rsa-actions { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
.rsa-btn {
  font: inherit; color: var(--rsa-ink); cursor: pointer; background: rgba(255,255,255,.06);
  border: 1px solid rgba(150,190,255,.25); border-radius: 7px; padding: 8px 13px;
  font-size: 11.5px; line-height: 1.2; min-height: 38px; display: inline-flex; align-items: center; justify-content: center;
  transition: background .18s, border-color .18s, color .18s;
}
.rsa-btn:hover { background: rgba(120,180,255,.18); }
.rsa-btn:focus-visible { outline: 2px solid var(--rsa-cy); outline-offset: 2px; }
.rsa-btn.is-active { background: rgba(63,216,255,.2); border-color: var(--rsa-cy); color: #fff; }
.rsa-play { min-width: 96px; }
.rsa-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width: 900px) { .rsa-stage { aspect-ratio: 4 / 3; } }
@media (max-width: 720px) {
  .rsa-info { grid-template-columns: 1fr; }
  .rsa-caption { min-height: 0; }
  .rsa-legend-wrap { border-left: 0; border-top: 1px solid rgba(120,170,255,.14); padding-top: 12px; padding-bottom: 14px; }
  .rsa-legend { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .rsa-stage { aspect-ratio: 3 / 4; }
  .rsa-head { padding: 13px 15px 10px; align-items: flex-start; }
  .rsa-tag { display: none; }
  .rsa-title { letter-spacing: .16em; }
  .rsa-caption { padding: 13px 15px 15px; }
  .rsa-legend-wrap { padding: 12px 15px 14px; }
  .rsa-controls { padding: 10px 12px 13px; }
  .rsa-time { display: none; }
  .rsa-actions { display: grid; grid-template-columns: 1fr 1fr; }
  .rsa-actions .rsa-btn { width: 100%; }
  .rsa-actions .rsa-play { order: 1; }
  .rsa-actions [data-act="restart"] { order: 2; }
  .rsa-actions [data-act="prev"] { order: 3; }
  .rsa-actions [data-act="next"] { order: 4; }
  .rsa-stages .rsa-btn { flex: 0 1 auto; font-size: 11px; padding: 7px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .rsa-btn { transition: none; }
}
`;

const MARKUP = `
<div class="rsa-shell">
  <div class="rsa-head">
    <div>
      <h3 class="rsa-title" id="rsa-title">Remote Sensing Process</h3>
      <p class="rsa-sub">From electromagnetic energy to useful information</p>
    </div>
    <span class="rsa-tag" aria-hidden="true">6 stages · 54s</span>
  </div>
  <div class="rsa-stage" tabindex="0" role="group" aria-label="Animation stage. Press Space to play or pause, and the left and right arrow keys to change stage.">
    <canvas class="rsa-canvas" role="img" aria-labelledby="rsa-title" aria-describedby="rsa-desc"></canvas>
  </div>
  <div class="rsa-info">
    <div class="rsa-caption" aria-live="polite" aria-atomic="true">
      <div class="rsa-cap-kicker">Stage <span class="rsa-cap-num">1</span> of 6</div>
      <h4 class="rsa-cap-title"></h4>
      <p class="rsa-cap-text"></p>
    </div>
    <div class="rsa-legend-wrap">
      <div class="rsa-legend-label">Colour legend</div>
      <div class="rsa-legend"></div>
    </div>
  </div>
  <div class="rsa-controls">
    <div class="rsa-progress-row">
      <input class="rsa-range" type="range" min="0" max="54" step="0.1" value="0"
             aria-label="Animation progress" aria-valuetext="Stage 1 of 6, 0 seconds elapsed">
      <span class="rsa-time" aria-hidden="true">0:00 / 0:54</span>
    </div>
    <div class="rsa-stages" role="group" aria-label="Choose a stage"></div>
    <div class="rsa-actions">
      <button type="button" class="rsa-btn" data-act="prev">← Previous</button>
      <button type="button" class="rsa-btn rsa-play" data-act="play" aria-label="Pause animation">❚❚ Pause</button>
      <button type="button" class="rsa-btn" data-act="restart">↻ Restart</button>
      <button type="button" class="rsa-btn" data-act="next">Next →</button>
    </div>
  </div>
  <p class="rsa-sr-only" id="rsa-desc">This animation walks through the six components of the remote sensing process: energy source, atmosphere, target interaction, sensor, data transmission and processing, and interpretation and application. Use the Previous, Next, Pause and Restart buttons, choose a stage, or drag the progress bar. When the stage is focused, press Space to play or pause and the arrow keys to change stage.</p>
</div>`;

function mount(shadow) {
  shadow.innerHTML = `<style>${STYLE}</style>${MARKUP}`;

  const $ = (sel) => shadow.querySelector(sel);
  const $$ = (sel) => Array.from(shadow.querySelectorAll(sel));
  const cv = $(".rsa-canvas");
  const g = cv.getContext("2d");
  const stageEl = $(".rsa-stage");
  const shell = $(".rsa-shell");
  const capNum = $(".rsa-cap-num");
  const capTitle = $(".rsa-cap-title");
  const capText = $(".rsa-cap-text");
  const legendEl = $(".rsa-legend");
  const stagesEl = $(".rsa-stages");
  const playBtn = $(".rsa-play");
  const prevBtn = $('[data-act="prev"]');
  const nextBtn = $('[data-act="next"]');
  const range = $(".rsa-range");
  const timeEl = $(".rsa-time");

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let W = 0,
    H = 0,
    dpr = 1;
  let t = 0,
    clk = 0,
    cur = -1,
    last = 0,
    raf = 0;
  let playing = !mq.matches;
  let destroyed = false;
  let seekWasPlaying = false;

  /* ---------- drawing helpers ---------- */
  let TR = null;
  const bv = [0, 0, 0, 0];

  function glowN(x, y, r, c, a) {
    const q = g.createRadialGradient(x, y, 0, x, y, r);
    q.addColorStop(0, `rgba(${c},${a})`);
    q.addColorStop(0.35, `rgba(${c},${a * 0.35})`);
    q.addColorStop(0.7, `rgba(${c},${a * 0.08})`);
    q.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = q;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  function glow(x, y, r, c, a) {
    const o = g.globalCompositeOperation;
    g.globalCompositeOperation = "lighter";
    glowN(x, y, r, c, a);
    g.globalCompositeOperation = o;
  }
  function dot(x, y, r, c, a = 1) {
    if (TR)
      for (let i = 5; i >= 1; i--) {
        const k = i / 5;
        glow(
          x - TR[0] * k * r * 10,
          y - TR[1] * k * r * 10,
          r * (3.2 - 2.2 * k),
          c,
          a * 0.45 * (1 - k),
        );
      }
    glow(x, y, r * 6, c, a * 0.5);
    glow(x, y, r * 2.4, c, a * 0.8);
    g.fillStyle = `rgba(255,255,255,${a})`;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }
  function tx(s, x, y, sz, col = "#e8f1ff", al = "center") {
    g.font = `${sz}px Sora, system-ui, sans-serif`;
    g.textAlign = al;
    g.fillStyle = col;
    g.shadowColor = "rgba(0,5,20,.85)";
    g.shadowBlur = 7;
    g.fillText(s, x, y);
    g.shadowBlur = 0;
  }
  function rr(x, y, w, h, r, f, s) {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    if (f) {
      g.fillStyle = f;
      g.fill();
    }
    if (s) {
      g.strokeStyle = s;
      g.lineWidth = 1;
      g.stroke();
    }
  }

  function bg(a, b) {
    const q = g.createLinearGradient(0, 0, 0, H);
    q.addColorStop(0, a);
    q.addColorStop(1, b);
    g.fillStyle = q;
    g.fillRect(0, 0, W, H);
    glow(0, 0, Math.max(W, H) * 0.7, "255,170,60", 0.1);
    glow(
      W * 0.78 + Math.sin(clk * 0.05) * 30,
      H * 0.28,
      W * 0.5,
      "80,55,180",
      0.08,
    );
    glow(
      W * 0.15,
      H * 0.85 + Math.cos(clk * 0.04) * 20,
      W * 0.45,
      "20,100,190",
      0.07,
    );
    for (const p of STAR) {
      const x = (((p.x * W - clk * (1.5 + p.z * 7)) % W) + W) % W;
      const y = p.y * H;
      const tw = 0.5 + 0.5 * Math.sin(clk * (1 + p.z * 2) + p.c * 40);
      const r = 0.5 + p.z * 1.2;
      g.fillStyle = `rgba(${p.c < 0.3 ? "185,210,255" : p.c < 0.7 ? "255,255,255" : "255,225,185"},${(0.15 + 0.7 * tw) * (0.35 + p.z * 0.65)})`;
      g.fillRect(x, y, r, r);
      if (p.z > 0.94) glow(x, y, 11, "200,220,255", 0.3 * tw);
    }
  }

  function sun(x, y, r) {
    glow(x, y, r * 5.5, "255,100,20", 0.2);
    glow(x, y, r * 3.4, "255,140,35", 0.36);
    glow(x, y, r * 2.1, "255,195,85", 0.5);
    g.save();
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 52; i++) {
      const a = (i / 52) * TAU + clk * 0.03;
      const l =
        1.3 + 0.7 * hs(i) * (0.55 + 0.45 * Math.sin(clk * 1.3 + i * 2.1));
      const w = 0.016 + 0.016 * hs(i + 7);
      const c = Math.cos(a),
        n = Math.sin(a);
      const q = g.createLinearGradient(
        x + c * r,
        y + n * r,
        x + c * r * l * 1.7,
        y + n * r * l * 1.7,
      );
      q.addColorStop(0, "rgba(255,190,70,.38)");
      q.addColorStop(1, "rgba(255,110,20,0)");
      g.fillStyle = q;
      g.beginPath();
      g.moveTo(x + Math.cos(a - w) * r * 0.97, y + Math.sin(a - w) * r * 0.97);
      g.lineTo(x + c * r * l * 1.7, y + n * r * l * 1.7);
      g.lineTo(x + Math.cos(a + w) * r * 0.97, y + Math.sin(a + w) * r * 0.97);
      g.fill();
    }
    g.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      const a = hs(i + 60) * TAU + clk * 0.04;
      const h = 0.22 + 0.14 * Math.sin(clk * 0.8 + i * 3);
      const b = a + 0.2 + 0.05 * Math.sin(clk + i);
      g.strokeStyle = `rgba(255,${100 + i * 18},40,.5)`;
      g.lineWidth = r * (0.03 + ((0.01 * i) % 2));
      g.beginPath();
      g.moveTo(x + Math.cos(a) * r * 0.98, y + Math.sin(a) * r * 0.98);
      g.quadraticCurveTo(
        x + Math.cos((a + b) / 2) * r * (1 + h * 2),
        y + Math.sin((a + b) / 2) * r * (1 + h * 2),
        x + Math.cos(b) * r * 0.98,
        y + Math.sin(b) * r * 0.98,
      );
      g.stroke();
    }
    g.restore();
    let q = g.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.05, x, y, r);
    q.addColorStop(0, "#fffce6");
    q.addColorStop(0.45, "#ffd650");
    q.addColorStop(0.8, "#ff9a24");
    q.addColorStop(1, "#d2461a");
    g.fillStyle = q;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
    g.save();
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.clip();
    for (let i = 0; i < 80; i++) {
      const a = hs(i) * TAU + clk * 0.1 * (0.4 + hs(i + 9));
      const d = r * Math.sqrt(hs(i + 3)) * 0.96;
      const sz = r * (0.07 + 0.1 * hs(i + 5));
      glowN(
        x + Math.cos(a) * d,
        y + Math.sin(a) * d,
        sz,
        i % 3 ? "255,245,170" : "200,70,10",
        i % 3 ? 0.28 : 0.22,
      );
    }
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 10; i++) {
      const a = hs(i + 90) * TAU + clk * 0.07;
      const d = r * 0.7 * hs(i + 95);
      glow(
        x + Math.cos(a) * d,
        y + Math.sin(a) * d,
        r * 0.28,
        "255,240,190",
        0.14 + 0.06 * Math.sin(clk * 1.5 + i),
      );
    }
    g.globalCompositeOperation = "source-over";
    q = g.createRadialGradient(x, y, r * 0.55, x, y, r);
    q.addColorStop(0, "rgba(120,20,0,0)");
    q.addColorStop(1, "rgba(110,20,0,.55)");
    g.fillStyle = q;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
    g.restore();
    g.strokeStyle = "rgba(255,230,160,.35)";
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(x, y, r * 0.995, 0, TAU);
    g.stroke();
  }

  function earth(x, y, r) {
    glow(x, y, r * 2.3, "50,130,255", 0.18);
    glow(x, y, r * 1.55, "90,180,255", 0.24);
    let q = g.createRadialGradient(
      x - r * 0.5,
      y - r * 0.2,
      r * 0.05,
      x,
      y,
      r * 1.05,
    );
    q.addColorStop(0, "#63bcff");
    q.addColorStop(0.45, "#1f6cc6");
    q.addColorStop(1, "#041433");
    g.fillStyle = q;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
    g.save();
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.clip();
    CONT.forEach(([c, la, s], ci) => {
      const lo = c + clk * 0.08;
      const cs = Math.cos(lo);
      if (cs > -0.3)
        for (let k = 0; k < 6; k++) {
          const o = hs(ci * 9 + k) * 2 - 1;
          const o2 = hs(ci * 9 + k + 30) * 2 - 1;
          const l2 = lo + o * s * 0.5;
          const la2 = la + o2 * s * 0.4;
          const c2 = Math.cos(l2);
          if (c2 < -0.1) continue;
          const px = x + r * Math.sin(l2) * Math.cos(la2);
          const py = y + r * Math.sin(la2);
          const sz = r * s * (0.2 + 0.2 * hs(ci * 9 + k + 60));
          g.fillStyle =
            k % 3 === 0
              ? "rgba(150,150,70,.9)"
              : k % 3 === 1
                ? "rgba(46,150,84,.92)"
                : "rgba(34,122,70,.92)";
          g.beginPath();
          g.ellipse(px, py, sz * Math.max(0.2, c2), sz * 0.8, 0, 0, TAU);
          g.fill();
        }
    });
    for (let i = 0; i < 16; i++) {
      const lo = hs(i) * TAU + clk * 0.13;
      const la = (hs(i + 20) - 0.5) * 1.7;
      const c2 = Math.cos(lo);
      if (c2 < -0.05) continue;
      glowN(
        x + r * Math.sin(lo) * Math.cos(la),
        y + r * Math.sin(la),
        r * (0.14 + 0.14 * hs(i + 40)),
        "255,255,255",
        0.34 * Math.max(0.3, c2),
      );
    }
    glowN(x - r * 0.45, y - r * 0.35, r * 0.5, "255,255,255", 0.16);
    q = g.createRadialGradient(
      x - r * 0.6,
      y - r * 0.1,
      r * 0.45,
      x - r * 0.6,
      y - r * 0.1,
      r * 1.75,
    );
    q.addColorStop(0, "rgba(0,2,12,0)");
    q.addColorStop(0.55, "rgba(0,4,18,.2)");
    q.addColorStop(1, "rgba(0,3,12,.92)");
    g.fillStyle = q;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
    for (let i = 0; i < 34; i++) {
      const lo = hs(i + 200) * TAU + clk * 0.08;
      const la = (hs(i + 240) - 0.5) * 1.2;
      const sn = Math.sin(lo) * Math.cos(la);
      if (Math.cos(lo) > 0.1 && sn > 0.25)
        glow(
          x + r * sn,
          y + r * Math.sin(la),
          r * 0.05,
          "255,200,110",
          0.5 * Math.min(1, (sn - 0.25) * 3),
        );
    }
    g.restore();
    g.save();
    g.lineWidth = r * 0.05;
    let lg = g.createLinearGradient(x - r, 0, x + r, 0);
    lg.addColorStop(0, "rgba(170,225,255,.6)");
    lg.addColorStop(0.6, "rgba(110,190,255,.12)");
    lg.addColorStop(1, "rgba(90,160,255,.04)");
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = lg;
    g.beginPath();
    g.arc(x, y, r * 1.01, 0, TAU);
    g.stroke();
    q = g.createRadialGradient(x, y, r * 0.9, x, y, r * 1.16);
    q.addColorStop(0, "rgba(110,200,255,0)");
    q.addColorStop(0.35, "rgba(110,200,255,.35)");
    q.addColorStop(1, "rgba(110,200,255,0)");
    g.fillStyle = q;
    g.beginPath();
    g.arc(x, y, r * 1.16, 0, TAU);
    g.fill();
    g.restore();
  }

  function rim(cx, cy, R) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const inner = Math.max(1, R - 3);
    const outer = Math.max(inner + 1, R + H * 0.07);
    const q = g.createRadialGradient(cx, cy, inner, cx, cy, outer);
    q.addColorStop(0, "rgba(160,220,255,.6)");
    q.addColorStop(0.25, "rgba(100,190,255,.24)");
    q.addColorStop(1, "rgba(80,160,255,0)");
    g.fillStyle = q;
    g.beginPath();
    g.arc(cx, cy, outer, 0, TAU);
    g.fill();
    g.restore();
  }

  function sat(x, y, s, a = 0) {
    g.save();
    g.translate(x, y);
    g.scale(s, s);
    g.rotate(a);
    for (const d of [-1, 1]) {
      g.save();
      g.scale(d, 1);
      const q = g.createLinearGradient(26, -10, 96, 10);
      q.addColorStop(0, "#1a3c8c");
      q.addColorStop(1, "#5b92e6");
      g.fillStyle = q;
      g.fillRect(26, -10, 70, 20);
      g.strokeStyle = "rgba(200,225,255,.4)";
      g.lineWidth = 0.6;
      g.beginPath();
      for (let i = 0; i <= 8; i++) {
        g.moveTo(26 + i * 8.75, -10);
        g.lineTo(26 + i * 8.75, 10);
      }
      for (let j = -1; j <= 1; j++) {
        g.moveTo(26, j * 5);
        g.lineTo(96, j * 5);
      }
      g.stroke();
      g.save();
      g.beginPath();
      g.rect(26, -10, 70, 20);
      g.clip();
      const sw = 26 + (((clk * 0.3 + (d > 0 ? 0 : 0.5)) % 1.8) - 0.4) * 70;
      const sg = g.createLinearGradient(sw - 14, 0, sw + 14, 0);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,.4)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = sg;
      g.beginPath();
      g.moveTo(sw - 14, 10);
      g.lineTo(sw, -10);
      g.lineTo(sw + 14, -10);
      g.lineTo(sw, 10);
      g.fill();
      g.restore();
      g.strokeStyle = "rgba(215,230,250,.65)";
      g.lineWidth = 1;
      g.strokeRect(26, -10, 70, 20);
      g.fillStyle = "#aab6cb";
      g.fillRect(20, -1.5, 7, 3);
      g.fillStyle = "#e6edf8";
      g.fillRect(20, -1.5, 7, 1);
      g.restore();
    }
    const q = g.createLinearGradient(-20, -15, 20, 15);
    q.addColorStop(0, "#fbefc0");
    q.addColorStop(0.45, "#d2a444");
    q.addColorStop(0.7, "#f2d98a");
    q.addColorStop(1, "#a07a30");
    rr(-20, -15, 40, 30, 4, q, "rgba(255,255,255,.35)");
    g.fillStyle = "rgba(255,255,255,.28)";
    g.fillRect(-18, -14, 36, 3);
    const lens = g.createRadialGradient(-7, -1, 0, -7, -1, 5);
    lens.addColorStop(0, "#5fdcff");
    lens.addColorStop(0.5, "#0b2a4a");
    lens.addColorStop(1, "#050b16");
    g.fillStyle = lens;
    g.beginPath();
    g.arc(-7, -1, 5, 0, TAU);
    g.fill();
    g.fillStyle = "#2a3350";
    g.fillRect(-6, 15, 12, 12);
    const pu = 0.75 + 0.25 * Math.sin(clk * 9);
    glow(0, 30, 16 * pu + 4, "63,216,255", 0.95);
    g.fillStyle = "#d6f7ff";
    g.beginPath();
    g.ellipse(0, 28, 6, 2.5, 0, 0, TAU);
    g.fill();
    g.strokeStyle = "#cfd8e6";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(8, -15);
    g.lineTo(8, -26);
    g.stroke();
    g.fillStyle = "#e8eef7";
    g.beginPath();
    g.arc(8, -27, 3, 0, TAU);
    g.fill();
    glow(8, -27, 9, "255,70,70", Math.max(0, Math.sin(clk * 3)) * 0.9);
    g.restore();
  }

  function dish(x, y, s, a) {
    g.save();
    g.translate(x, y);
    g.scale(s, s);
    g.strokeStyle = "#a9b6cc";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-22, 50);
    g.lineTo(0, 5);
    g.lineTo(22, 50);
    g.moveTo(-12, 50);
    g.lineTo(0, 5);
    g.lineTo(12, 50);
    g.stroke();
    g.rotate(a);
    const q = g.createLinearGradient(-30, 0, 30, 0);
    q.addColorStop(0, "#dfe6f2");
    q.addColorStop(1, "#7e8aa3");
    g.fillStyle = q;
    g.beginPath();
    g.ellipse(0, -6, 34, 13, 0, 0, Math.PI);
    g.fill();
    g.strokeStyle = "#cfd8e6";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, -6);
    g.lineTo(0, -34);
    g.stroke();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(0, -35, 3, 0, TAU);
    g.fill();
    g.restore();
  }

  function icon(i, x, y, s) {
    g.lineWidth = 2;
    if (i === 0) {
      g.fillStyle = COL[2];
      g.beginPath();
      g.moveTo(x - s, y + s);
      g.quadraticCurveTo(x - s, y - s, x + s, y - s);
      g.quadraticCurveTo(x + s, y + s, x - s, y + s);
      g.fill();
      g.strokeStyle = "#3a4a10";
      g.beginPath();
      g.moveTo(x - s, y + s);
      g.lineTo(x + s * 0.5, y - s * 0.5);
      g.stroke();
    } else if (i === 1) {
      g.fillStyle = COL[1];
      for (const o of [-0.2, 0.35]) {
        g.beginPath();
        g.moveTo(x, y + o * s - s * 0.7);
        g.lineTo(x - s * 0.8, y + o * s + s * 0.4);
        g.lineTo(x + s * 0.8, y + o * s + s * 0.4);
        g.fill();
      }
      g.fillStyle = "#6b4a2b";
      g.fillRect(x - s * 0.12, y + s * 0.7, s * 0.24, s * 0.4);
    } else if (i === 2) {
      g.fillStyle = COL[0];
      g.beginPath();
      g.moveTo(x, y - s);
      g.bezierCurveTo(x + s * 1.1, y + s * 0.1, x + s * 0.8, y + s, x, y + s);
      g.bezierCurveTo(x - s * 0.8, y + s, x - s * 1.1, y + s * 0.1, x, y - s);
      g.fill();
    } else if (i === 3) {
      [
        [-0.9, 0.2],
        [-0.3, -0.6],
        [0.35, 0],
      ].forEach(([a, b], j) => {
        g.fillStyle = j % 2 ? "#dfe5f0" : COL[3];
        g.fillRect(x + a * s, y + b * s, s * 0.6, s * (1 - b));
      });
    } else {
      g.strokeStyle = "#ff9a3c";
      g.fillStyle = "rgba(255,154,60,.2)";
      g.beginPath();
      g.moveTo(x, y - s);
      g.lineTo(x + s, y + s * 0.8);
      g.lineTo(x - s, y + s * 0.8);
      g.closePath();
      g.fill();
      g.stroke();
      g.fillStyle = "#ff9a3c";
      g.fillRect(x - 1.2, y - s * 0.35, 2.4, s * 0.6);
      g.fillRect(x - 1.2, y + s * 0.45, 2.4, 2.4);
    }
  }

  /* ---------- Scene 1: energy source ---------- */
  function s1(u) {
    bg("#010208", "#060c22");
    const small = W < 560;
    const k = E(u),
      m = Math.min(W, H);
    const sx = L(W * 0.22, W * 0.08, k),
      sy = H * 0.52,
      sr = m * L(0.19, 0.13, k);
    const ex = L(W * 1.25, W * 0.82, k),
      ey = H * 0.54,
      er = m * L(0.07, 0.17, k);
    sun(sx, sy, sr);
    earth(ex, ey, er);
    const N = 13,
      x0 = sx + sr * 0.95;
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1) - 0.5;
      const y0 = sy + f * sr * 1.7,
        y1 = ey + f * er * 1.9;
      const x1 = ex - er * Math.sqrt(Math.max(0.04, 1 - (f * 1.9) ** 2));
      const lg = g.createLinearGradient(x0, 0, x1, 0);
      lg.addColorStop(0, "rgba(255,190,60,.05)");
      lg.addColorStop(1, "rgba(255,190,60,.4)");
      g.strokeStyle = lg;
      g.lineWidth = 1.2;
      g.beginPath();
      for (let s = 0; s <= 40; s++) {
        const p = s / 40;
        const x = L(x0, x1, p),
          y =
            L(y0, y1, p) +
            Math.sin(p * 60 - clk * 9) * 4 * Math.sin(p * Math.PI);
        s ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
      const dx = x1 - x0,
        dy = y1 - y0,
        n = Math.hypot(dx, dy);
      TR = [dx / n, dy / n];
      for (let j = 0; j < 4; j++) {
        const p = (clk * 0.22 + i * 0.31 + j / 4) % 1;
        dot(
          L(x0, x1, p),
          L(y0, y1, p),
          2.2,
          "255,200,90",
          0.9 * Math.min(1, p * 8) * Math.min(1, (1 - p) * 8),
        );
      }
      TR = null;
    }
    g.save();
    g.globalAlpha *= cl((u - 0.25) * 3);
    tx("Sun", sx, sy + sr + 34, small ? 14 : 16);
    tx("Earth", ex, ey + er + 34, small ? 14 : 16);
    tx(
      "Electromagnetic energy  →",
      (x0 + ex - er) / 2,
      sy - sr * 0.95 - 12,
      small ? 11 : 14,
      "#ffc861",
    );
    g.restore();
  }

  /* ---------- Scene 2: atmosphere ---------- */
  function s2(u) {
    bg("#020611", "#07163a");
    glow(0, 0, H * 0.9, "255,180,60", 0.35);
    const small = W < 560;
    const ys = H * 0.74,
      R = H * 1.5,
      cx = W / 2,
      cy = ys + R;
    [0.5, 0.38, 0.26, 0.14].forEach((h, i) => {
      g.fillStyle = `rgba(80,175,255,${0.05 + 0.015 * i})`;
      g.beginPath();
      g.arc(cx, cy, R + H * h, 0, TAU);
      g.fill();
    });
    let q = g.createLinearGradient(0, ys, 0, H);
    q.addColorStop(0, "#2a8a5a");
    q.addColorStop(1, "#0b2f55");
    g.fillStyle = q;
    g.beginPath();
    g.arc(cx, cy, R, 0, TAU);
    g.fill();
    rim(cx, cy, R);
    for (let i = 0; i < 6; i++) {
      const x = ((hs(i) * W * 1.3 + clk * (6 + i * 2)) % (W + 400)) - 200;
      const y = H * (0.5 + 0.12 * hs(i + 20)),
        s = H * (0.05 + 0.03 * hs(i + 9));
      for (let j = 0; j < 5; j++)
        glow(
          x + (j - 2) * s * 0.8,
          y + Math.sin(j * 2) * s * 0.25,
          s * 1.1,
          "235,245,255",
          0.3,
        );
    }
    for (let i = 0; i < 45; i++) {
      const x = (hs(i + 60) * W + clk * 10) % W;
      const y = H * (0.3 + 0.38 * hs(i + 80)) + Math.sin(clk + i) * 6;
      g.fillStyle = "rgba(215,170,110,.7)";
      g.beginPath();
      g.arc(x, y, 2.2, 0, TAU);
      g.fill();
    }
    for (let i = 0; i < 90; i++) {
      const x = hs(i + 120) * W + Math.sin(clk * 1.3 + i) * 5;
      const y = H * (0.24 + 0.5 * hs(i + 140)) + Math.cos(clk * 1.1 + i) * 5;
      g.fillStyle = "rgba(150,220,255,.45)";
      g.fillRect(x, y, 1.6, 1.6);
    }
    const y0 = H * 0.14,
      sl = 0.28,
      ang0 = Math.atan2(1, sl);
    for (let i = 0; i < 64; i++) {
      const xs = hs(i) * W * 1.15 - W * 0.15;
      const ph = (clk * 0.15 + hs(i + 50)) % 1;
      const fe = 0.3 + hs(i + 7) * 0.4;
      const f = hs(i + 3);
      const P = (p) => [xs + p * (ys - y0) * sl, y0 + p * (ys - y0)];
      const [ex, ey] = P(fe);
      if (ph < fe || f < 0.45) {
        const [x, y] = P(ph),
          n = Math.hypot(sl, 1);
        TR = [sl / n, 1 / n];
        dot(x, y, 2.3, "255,190,70", 0.95);
        TR = null;
      } else {
        const w = (ph - fe) / (1 - fe);
        if (f < 0.75) {
          const a = ang0 + (i % 2 ? 1 : -1) * (0.7 + hs(i + 11) * 2),
            d = w * H * 0.3;
          TR = [Math.cos(a), Math.sin(a)];
          dot(
            ex + Math.cos(a) * d,
            ey + Math.sin(a) * d,
            2,
            "175,225,255",
            1 - w,
          );
          TR = null;
        } else {
          glow(ex, ey, 10 + w * 34, "255,80,40", 0.8 * (1 - w));
          dot(ex, ey, 2, "255,110,60", 1 - w);
        }
      }
    }
    g.save();
    g.globalAlpha *= cl(u * 3);
    tx(
      "Atmosphere",
      W * (small ? 0.82 : 0.9),
      H * 0.27,
      small ? 12 : 15,
      "#9fdcff",
    );
    tx(
      "Aerosols",
      W * (small ? 0.18 : 0.2),
      H * 0.36,
      small ? 11 : 13,
      "#e8c69a",
    );
    tx("Clouds", W * 0.5, H * 0.43, small ? 11 : 13);
    tx(
      "Gases",
      W * (small ? 0.72 : 0.78),
      H * 0.34,
      small ? 11 : 13,
      "#9fdcff",
    );
    tx("Earth's surface", W * 0.5, H * 0.8, small ? 13 : 15);
    g.restore();
  }

  /* ---------- Scene 3: target interaction ---------- */
  function s3(u) {
    const small = W < 560;
    const gy = H * 0.62,
      z = L(1.7, 1, E(cl(u * 2.2)));
    const X = (f) => W * f;
    let q = g.createLinearGradient(0, 0, 0, gy);
    q.addColorStop(0, "#071433");
    q.addColorStop(1, "#3b79a6");
    g.fillStyle = q;
    g.fillRect(0, 0, W, H);
    glow(0, 0, H * 0.8, "255,190,80", 0.4);
    g.save();
    g.translate(W / 2, gy);
    g.scale(z, z);
    g.translate(-W / 2, -gy);
    const B = [0, 0.2, 0.38, 0.58, 0.76, 1],
      GC = [COL[4], "#1b6e3c", "#a3b030", COL[0], "#8d95a6"];
    g.fillStyle = "#4b5d7a";
    g.beginPath();
    g.moveTo(X(-0.1), gy);
    [
      [-0.05, 0],
      [0.03, 0.2],
      [0.08, 0.12],
      [0.14, 0.3],
      [0.2, 0.14],
      [0.26, 0.2],
      [0.34, 0],
    ].forEach(([a, b]) => g.lineTo(X(a), gy - H * b));
    g.lineTo(X(0.4), gy);
    g.fill();
    g.fillStyle = "#e8f0ff";
    [
      [0.14, 0.3],
      [0.03, 0.2],
    ].forEach(([a, b]) => {
      g.beginPath();
      g.moveTo(X(a), gy - H * b);
      g.lineTo(X(a) - W * 0.014, gy - H * (b - 0.05));
      g.lineTo(X(a) + W * 0.014, gy - H * (b - 0.05));
      g.fill();
    });
    for (let i = 0; i < 5; i++) {
      g.fillStyle = GC[i];
      g.fillRect(X(B[i]), gy, X(B[i + 1]) - X(B[i]), H);
    }
    for (let r = 0; r < 8; r++) {
      g.fillStyle = r % 2 ? "#a9b92f" : "#7fa32a";
      g.fillRect(X(0.38), gy + r * H * 0.025, X(0.2), H * 0.025);
    }
    q = g.createLinearGradient(0, gy, 0, H);
    q.addColorStop(0, "#3d95e0");
    q.addColorStop(1, "#0b3f80");
    g.fillStyle = q;
    g.fillRect(X(0.58), gy, X(0.18), H);
    g.strokeStyle = "rgba(255,255,255,.25)";
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      for (let s = 0; s <= 20; s++) {
        const x = X(0.58) + (s / 20) * X(0.18);
        const y = gy + H * 0.03 * (i + 1) + Math.sin(s * 0.9 + clk * 2 + i) * 2;
        s ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
    for (let i = 0; i < 26; i++) {
      const x = X(0.2) + hs(i) * X(0.18);
      const b = gy + H * 0.02 + hs(i + 5) * H * 0.07;
      const h = H * (0.05 + 0.04 * hs(i + 9));
      g.fillStyle = i % 2 ? "#0f6a3a" : "#0b4f2c";
      g.beginPath();
      g.moveTo(x, b - h);
      g.lineTo(x - h * 0.35, b);
      g.lineTo(x + h * 0.35, b);
      g.fill();
    }
    for (let i = 0; i < 10; i++) {
      const x = X(0.77) + i * W * 0.021;
      const w = W * 0.017,
        h = H * (0.06 + 0.12 * hs(i + 30));
      const b = gy + H * 0.05;
      g.fillStyle = i % 2 ? "#c9d0dc" : "#8f99ab";
      g.fillRect(x, b - h, w, h);
      for (let r = 0; r < h / 11; r++)
        for (let c = 0; c < 2; c++) {
          g.fillStyle =
            hs(i * 9 + r * 3 + c) > 0.6 ? "#ffe08a" : "rgba(30,40,70,.6)";
          g.fillRect(x + 3 + c * w * 0.45, b - h + 4 + r * 11, w * 0.3, 5);
        }
    }
    const IM = [0.1, 0.29, 0.48, 0.67, 0.86];
    const OUT = ["ARA", "RAR", "RAR", "TRT", "RRA"];
    const TN = [4, 1, 2, 0, 3].map((i) => TNc[i]);
    const SX = X(0.88),
      SY = H * 0.16 + 16;
    sat(X(0.88), H * 0.16, 0.5);
    for (let r = 0; r < 5; r++) {
      const ix = X(IM[r]),
        iy = gy + H * 0.03;
      for (let k = 0; k < 3; k++) {
        const p = (clk * 0.2 + k / 3 + r * 0.17) % 1;
        const o = OUT[r][k];
        if (p < 0.5) {
          const a = p * 2;
          const n = Math.hypot(W * 0.2, iy);
          TR = [(W * 0.2) / n, iy / n];
          dot(L(ix - W * 0.2, ix, a), L(0, iy, a), 2.2, "255,190,70", 0.95);
          TR = null;
        } else {
          const w = (p - 0.5) * 2;
          if (o === "R") {
            const n = Math.hypot(SX - ix, SY - iy);
            TR = [(SX - ix) / n, (SY - iy) / n];
            dot(L(ix, SX, w), L(iy, SY, w), 2.2, TN[r], 1 - 0.35 * w);
            TR = null;
          } else if (o === "A") {
            glow(ix, iy, 6 + w * 26, "255,70,40", 0.8 * (1 - w));
          } else {
            dot(
              ix + Math.sin(w * 9) * 3,
              iy + w * H * 0.12,
              2,
              "90,200,255",
              1 - w,
            );
          }
        }
      }
    }
    for (let i = 0; i < 14; i++) {
      const x = X(0.03 + 0.07 * i),
        p = (clk * 0.3 + hs(i + 70)) % 1;
      g.strokeStyle = `rgba(255,120,150,${(1 - p) * 0.6})`;
      g.lineWidth = 1.5;
      g.beginPath();
      for (let s = 0; s <= 10; s++) {
        const yy = gy - s * H * 0.012 - p * H * 0.04;
        const xx = x + Math.sin(s * 1.2 + clk * 4 + i) * 4;
        s ? g.lineTo(xx, yy) : g.moveTo(xx, yy);
      }
      g.stroke();
    }
    ["Mountain", "Forest", "Field", "Lake", "Urban area"].forEach((n, i) =>
      tx(n, X(IM[i]), gy + H * 0.12, small ? 10 : 13, "#fff"),
    );
    g.restore();
  }

  /* ---------- Scene 4: sensor ---------- */
  function s4(u) {
    bg("#02040c", "#08122e");
    const ys = H * 0.72,
      R = H * 1.5,
      cx = W / 2,
      cy = ys + R;
    const sf = (x) => cy - Math.sqrt(R * R - (x - cx) ** 2);
    g.fillStyle = "rgba(110,200,255,.12)";
    g.beginPath();
    g.arc(cx, cy, R + H * 0.02, 0, TAU);
    g.fill();
    const x0 = W * 0.3,
      x1 = W * 0.7,
      pp = Math.abs(((clk * 0.04) % 2) - 1);
    const sx = L(x0, x1, pp),
      s = W < 700 ? 0.8 : 1.1;
    const sy = H * 0.27 + Math.sin(clk * 1.2) * 3,
      ay = sy + 30 * s,
      sw = W * 0.07;
    g.save();
    g.beginPath();
    g.arc(cx, cy, R, 0, TAU);
    g.clip();
    let q = g.createLinearGradient(0, ys, 0, H);
    q.addColorStop(0, "#16508f");
    q.addColorStop(1, "#061530");
    g.fillStyle = q;
    g.fillRect(0, ys - 20, W, H);
    for (let x = 0; x < W; x += 5) {
      g.fillStyle = COL[lc(x / W, 0.3)];
      g.fillRect(x, sf(x), 5.5, H * 0.1);
    }
    q = g.createLinearGradient(0, ys, 0, ys + H * 0.1);
    q.addColorStop(0, "rgba(4,12,30,0)");
    q.addColorStop(1, "rgba(4,12,30,.9)");
    g.fillStyle = q;
    g.fillRect(0, ys - 20, W, H * 0.14);
    g.fillStyle = "rgba(63,216,255,.22)";
    for (let x = x0; x < sx; x += 5) g.fillRect(x, sf(x) - 1, 5.5, H * 0.1);
    g.restore();
    rim(cx, cy, R);
    g.setLineDash([6, 8]);
    g.strokeStyle = "rgba(255,255,255,.18)";
    g.beginPath();
    g.moveTo(W * 0.04, sy);
    g.lineTo(W * 0.96, sy);
    g.stroke();
    g.setLineDash([]);
    q = g.createLinearGradient(0, ay, 0, ys);
    q.addColorStop(0, "rgba(255,240,190,.35)");
    q.addColorStop(1, "rgba(255,240,190,.05)");
    g.fillStyle = q;
    g.beginPath();
    g.moveTo(sx, ay);
    g.lineTo(sx - sw, sf(sx - sw));
    g.lineTo(sx + sw, sf(sx + sw));
    g.fill();
    g.shadowBlur = 14;
    g.shadowColor = "#3fd8ff";
    g.strokeStyle = "#3fd8ff";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(sx - sw, sf(sx - sw));
    g.lineTo(sx + sw, sf(sx + sw));
    g.stroke();
    g.shadowBlur = 0;
    for (let i = 0; i < 9; i++) {
      const gx = sx + ((i - 4) * sw) / 4;
      const gyy = sf(gx);
      const p = (clk * 0.5 + i * 0.13) % 1;
      const c = TNc[lc(gx / W, 0.3)];
      const n = Math.hypot(sx - gx, ay - gyy);
      TR = [(sx - gx) / n, (ay - gyy) / n];
      dot(L(gx, sx, p), L(gyy, ay, p), 2.2, c, 0.95);
      TR = null;
    }
    glow(sx, ay, 26 + 6 * Math.sin(clk * 8), "63,216,255", 0.7);
    sat(sx, sy, s);
    g.save();
    g.globalAlpha *= cl(u * 3);
    tx("Orbit", W * 0.95, sy - 10, 12, "#9fb4d6", "right");
    tx("Sensor", sx, sy - 50 * s, 13);
    tx("Swath", sx, Math.min(sf(sx) + H * 0.11, H * 0.86), 12, "#fff");
    if (W > 1000) {
      const cls = lc(sx / W, 0.3),
        px = W * 0.04,
        pb = H * 0.56,
        ph = H * 0.13;
      tx(
        "Energy measured by the sensor",
        px,
        pb - ph - 28,
        13,
        "#e8f1ff",
        "left",
      );
      tx(CN[cls], px, pb - ph - 10, 12, COL[cls], "left");
      ["Blue", "Green", "Red", "NIR"].forEach((n, i) => {
        bv[i] += (SIG[cls][i] - bv[i]) * 0.08;
        const h = (bv[i] * ph) / 0.65,
          bx = px + i * 42;
        g.fillStyle = ["#4aa3ff", "#4cd26a", "#ff5a4a", "#c7a0ff"][i];
        g.fillRect(bx, pb - h, 28, h);
        tx(n, bx + 14, pb + 16, 11, "#b8c8e0");
      });
    }
    g.restore();
  }

  /* ---------- Scene 5: transmission and processing ---------- */
  function s5(u) {
    bg("#03050f", "#0b1030");
    const small = W < 560;
    const SXc = small ? W * 0.18 : W * 0.17;
    const SYc = small ? H * 0.13 : H * 0.28;
    const DX = small ? W * 0.8 : W * 0.4;
    const DY = small ? H * 0.12 : H * 0.66;
    const MX = small ? W * 0.5 : W * 0.76;
    const MY = small ? H * 0.47 : H * 0.4;
    const mw = small ? Math.min(W * 0.7, 300) : Math.min(W * 0.28, 420);
    const mh = mw * 0.62;
    const satS = small ? 0.7 : 0.9,
      dishS = small ? 0.9 : 1.2;
    sat(SXc, SYc, satS, 0.3);
    dish(DX, DY, dishS, -0.75);
    const fx = DX - 24 * dishS,
      fy = DY - 28 * dishS;
    const ax = SXc + 10 * satS,
      ay = SYc + 34 * satS;
    g.setLineDash([5, 7]);
    g.lineDashOffset = -clk * 30;
    g.strokeStyle = "rgba(63,216,255,.5)";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(fx, fy);
    g.stroke();
    const cx2 = MX - mw / 2 - 10;
    const cy2 = small ? MY : MY + mh / 2 + 10;
    g.strokeStyle = "rgba(154,123,255,.55)";
    g.beginPath();
    g.moveTo(DX + 18 * dishS, DY + 46 * dishS);
    g.lineTo(cx2, cy2);
    g.stroke();
    g.setLineDash([]);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.lineWidth = 7;
    g.strokeStyle = "rgba(63,216,255,.07)";
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(fx, fy);
    g.stroke();
    g.strokeStyle = "rgba(154,123,255,.07)";
    g.beginPath();
    g.moveTo(DX + 18 * dishS, DY + 46 * dishS);
    g.lineTo(cx2, cy2);
    g.stroke();
    for (let k = 0; k < 3; k++) {
      const q = (clk * 0.5 + k / 3) % 1;
      g.lineWidth = 1.5;
      g.strokeStyle = `rgba(63,216,255,${(1 - q) * 0.55})`;
      g.beginPath();
      g.arc(ax, ay, 6 + q * 46, 0, TAU);
      g.stroke();
      g.strokeStyle = `rgba(154,123,255,${(1 - q) * 0.4})`;
      g.beginPath();
      g.arc(DX + 18 * dishS, DY + 46 * dishS, 4 + q * 30, 0, TAU);
      g.stroke();
    }
    g.restore();
    for (let i = 0; i < 7; i++) {
      const p0 = (clk * 0.35 + i / 7) % 1;
      for (let T = 7; T >= 0; T--) {
        const p = p0 - T * 0.012;
        if (p < 0) continue;
        const a = (1 - T / 8) * 0.8,
          z = 1 - T / 10;
        let x = L(ax, fx, p),
          y = L(ay, fy, p);
        glow(x, y, 13 * z, "63,216,255", a * 0.8);
        g.fillStyle = `rgba(191,242,255,${a})`;
        g.fillRect(x - 3 * z, y - 3 * z, 6 * z, 6 * z);
        x = L(DX + 18 * dishS, cx2, p);
        y = L(DY + 46 * dishS, cy2, p);
        glow(x, y, 13 * z, "154,123,255", a * 0.8);
        g.fillStyle = `rgba(214,200,255,${a})`;
        g.fillRect(x - 3 * z, y - 3 * z, 6 * z, 6 * z);
      }
    }
    rr(
      MX - mw / 2 - 10,
      MY - mh / 2 - 10,
      mw + 20,
      mh + 20,
      10,
      "#1b2547",
      "rgba(150,190,255,.35)",
    );
    g.fillStyle = "#050a18";
    g.fillRect(MX - mw / 2, MY - mh / 2, mw, mh);
    rr(MX - mw * 0.6, MY + mh / 2 + 22, mw * 1.2, 14, 6, "#233059");
    const cols = 22,
      rows = 13,
      cw = mw / cols,
      ch = mh / rows;
    const x0 = MX - mw / 2,
      y0 = MY - mh / 2,
      shown = cl(u / 0.3) * rows;
    const ph = u < 0.3 ? 0 : u < 0.5 ? 1 : u < 0.72 ? 2 : 3;
    for (let r = 0; r < Math.ceil(shown); r++)
      for (let c = 0; c < cols; c++) {
        const k = lc(c / cols, r / rows),
          n = hs(c * 31 + r * 17),
          rgb = CR[k],
          lu = LU[k] * 255;
        let a, b, d;
        if (ph === 0) {
          a = b = d = cl(lu + (n - 0.5) * 150 - (r % 4 === 0 ? 60 : 0), 0, 255);
        } else if (ph === 1) {
          a = b = d = cl(lu + (n - 0.5) * 30, 0, 255);
        } else if (ph === 2) {
          const v = cl(lu + (n - 0.5) * 20, 0, 255);
          a = L(v, rgb[0], 0.6);
          b = L(v, rgb[1], 0.6);
          d = L(v, rgb[2], 0.6);
        } else {
          a = rgb[0];
          b = rgb[1];
          d = rgb[2];
        }
        g.fillStyle = `rgb(${a | 0},${b | 0},${d | 0})`;
        g.fillRect(x0 + c * cw, y0 + r * ch, cw + 0.6, ch + 0.6);
      }
    if (shown < rows) {
      g.fillStyle = "rgba(63,216,255,.8)";
      g.fillRect(x0, y0 + shown * ch, mw, 2);
    }
    const nm = ["Reception", "Correction", "Enhancement", "Classification"];
    if (small) {
      const cwc = (W * 0.88 - 8) / 2;
      nm.forEach((n, i) => {
        const col = i % 2,
          row = Math.floor(i / 2);
        const x = (W - (cwc * 2 + 8)) / 2 + col * (cwc + 8);
        const y = H * 0.75 + row * 40;
        rr(
          x,
          y,
          cwc,
          32,
          6,
          i < ph
            ? "rgba(63,216,255,.2)"
            : i === ph
              ? "rgba(154,123,255,.45)"
              : "rgba(255,255,255,.05)",
          i < ph ? "#3fd8ff" : i === ph ? "#9a7bff" : "rgba(255,255,255,.2)",
        );
        tx(n, x + cwc / 2, y + 20, 10);
      });
    } else if (W < 960) {
      // Tablet / narrow desktop: keep the station area clear and use a
      // two-column pipeline so labels never run off the canvas.
      const cwc = (W * 0.44 - 8) / 2;
      const x0 = W * 0.52;
      nm.forEach((n, i) => {
        const col = i % 2,
          row = Math.floor(i / 2);
        const x = x0 + col * (cwc + 8);
        const y = H * 0.75 + row * 40;
        rr(
          x,
          y,
          cwc,
          32,
          6,
          i < ph
            ? "rgba(63,216,255,.2)"
            : i === ph
              ? "rgba(154,123,255,.45)"
              : "rgba(255,255,255,.05)",
          i < ph ? "#3fd8ff" : i === ph ? "#9a7bff" : "rgba(255,255,255,.2)",
        );
        tx(n, x + cwc / 2, y + 20, 11);
      });
    } else {
      const cwc = (W * 0.45 - 24) / 4;
      nm.forEach((n, i) => {
        const x = W * 0.52 + i * (cwc + 8),
          y = H * 0.77;
        rr(
          x,
          y,
          cwc,
          32,
          6,
          i < ph
            ? "rgba(63,216,255,.2)"
            : i === ph
              ? "rgba(154,123,255,.45)"
              : "rgba(255,255,255,.05)",
          i < ph ? "#3fd8ff" : i === ph ? "#9a7bff" : "rgba(255,255,255,.2)",
        );
        tx(n, x + cwc / 2, y + 20, 12);
      });
    }
    tx("Satellite", SXc, SYc + (small ? 55 : 75), small ? 11 : 13);
    if (!small)
      tx("Downlink", (ax + fx) / 2 + 40, (ay + fy) / 2, 12, "#8fe8ff");
    tx("Ground station", DX, DY + (small ? 55 : 82), small ? 11 : 13);
    tx("Processing centre", MX, y0 - 26, small ? 11 : 13);
  }

  /* ---------- Scene 6: interpretation ---------- */
  function s6(u) {
    bg("#04060f", "#0c1030");
    glow(W * 0.3, H * 0.5, W * 0.35, "110,90,255", 0.12);
    const small = W < 560;
    const mw = small ? W * 0.82 : Math.min(W * 0.4, (H * 0.52) / 0.62, 560);
    const mh = mw * 0.62;
    const mx = small ? (W - mw) / 2 : W * 0.07;
    const my = small ? H * 0.06 : H * 0.33;
    const cols = 40,
      rows = 25,
      cwd = mw / cols,
      chh = mh / rows;
    const vis = cols * cl(u / 0.3);
    for (let c = 0; c < Math.ceil(vis); c++)
      for (let r = 0; r < rows; r++) {
        g.fillStyle = COL[lc(c / cols, r / rows)];
        g.fillRect(mx + c * cwd, my + r * chh, cwd + 0.5, chh + 0.5);
      }
    g.strokeStyle = "rgba(154,123,255,.6)";
    g.lineWidth = 1.5;
    g.strokeRect(mx, my, mw, mh);
    if (u > 0.3) {
      const a = cl((u - 0.3) * 5);
      const fx = 0.5 + 0.3 * Math.sin(clk * 0.7),
        fy = 0.5 + 0.25 * Math.cos(clk * 0.5);
      const px = mx + mw * fx,
        py = my + mh * fy,
        r = mh * 0.17;
      g.save();
      g.globalAlpha *= a;
      g.fillStyle = "rgba(255,255,255,.12)";
      g.beginPath();
      g.arc(px, py, r, 0, TAU);
      g.fill();
      g.strokeStyle = "#bfefff";
      g.lineWidth = 3;
      g.stroke();
      g.beginPath();
      g.moveTo(px + r * 0.7, py + r * 0.7);
      g.lineTo(px + r * 1.5, py + r * 1.5);
      g.stroke();
      const k = lc(fx, fy);
      tx(CN[k], px, py + 4, small ? 10 : 12, "#fff");
      g.restore();
    }
    const A = [
      ["Agriculture", "Crop health and yield estimates"],
      ["Forestry", "Forest cover and change"],
      ["Water resources", "Lakes, rivers and flood extent"],
      ["Urban planning", "City growth and land use"],
      ["Hazard mapping", "Damage and risk assessment"],
    ];
    const cwid = small ? W * 0.86 : Math.min(W * 0.34, 380);
    const chh2 = small ? Math.min(H * 0.075, 46) : Math.min(H * 0.095, 64);
    const gap = small ? 5 : H * 0.018;
    const ct = small ? my + mh + 22 : H * 0.32;
    const cx0 = small ? (W - cwid) / 2 : W * 0.6;
    if (small) {
      g.strokeStyle = "rgba(154,123,255,.5)";
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(mx + mw / 2, my + mh);
      g.lineTo(mx + mw / 2, ct - 4);
      g.stroke();
    }
    A.forEach(([n, d], i) => {
      const a = E(cl((u - (0.3 + i * 0.11)) / 0.1));
      if (a <= 0) return;
      const y = ct + i * (chh2 + gap),
        x = cx0 + (1 - a) * 30;
      const sx = mx + mw,
        sy = my + mh / 2;
      g.save();
      g.globalAlpha *= a;
      if (!small) {
        g.strokeStyle = "rgba(154,123,255,.5)";
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(sx, sy);
        g.bezierCurveTo(sx + 80, sy, x - 80, y + chh2 / 2, x, y + chh2 / 2);
        g.stroke();
        const p = (clk * 0.4 + i * 0.2) % 1,
          m = 1 - p;
        const bx =
          m * m * m * sx +
          3 * m * m * p * (sx + 80) +
          3 * m * p * p * (x - 80) +
          p * p * p * x;
        const by =
          m * m * m * sy +
          3 * m * m * p * sy +
          3 * m * p * p * (y + chh2 / 2) +
          p * p * p * (y + chh2 / 2);
        dot(bx, by, 2.2, "154,123,255", 0.9);
      }
      rr(x, y, cwid, chh2, 8, "rgba(14,22,50,.88)", "rgba(120,170,255,.3)");
      g.fillStyle = "rgba(255,255,255,.08)";
      g.beginPath();
      g.arc(x + chh2 / 2, y + chh2 / 2, chh2 * 0.38, 0, TAU);
      g.fill();
      icon(i, x + chh2 / 2, y + chh2 / 2, chh2 * 0.2);
      tx(n, x + chh2 + 6, y + chh2 * 0.45, small ? 12 : 14, "#fff", "left");
      tx(d, x + chh2 + 6, y + chh2 * 0.75, small ? 9.5 : 11, "#a8bbdc", "left");
      g.restore();
    });
    g.save();
    g.globalAlpha *= cl((u - 0.8) * 5);
    tx(
      "Pixels become information that supports decisions.",
      small ? W / 2 : mx + mw / 2,
      small ? Math.min(H - 10, ct + 5 * (chh2 + gap) + 4) : my + mh + 36,
      small ? 10 : 13,
      "#bfefff",
    );
    g.restore();
  }

  const S = [s1, s2, s3, s4, s5, s6];

  /* ---------- post-processing ---------- */
  const bl = document.createElement("canvas");
  const bx = bl.getContext("2d");
  const gr = document.createElement("canvas");
  gr.width = gr.height = 160;
  {
    const x = gr.getContext("2d");
    const d = x.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) {
      d.data[i] = d.data[i + 1] = d.data[i + 2] = Math.random() * 255;
      d.data[i + 3] = 255;
    }
    x.putImageData(d, 0, 0);
  }
  let noisePattern = null;

  function post(f, tr) {
    const w = Math.max(2, W >> 2),
      h = Math.max(2, H >> 2);
    if (bl.width != w || bl.height != h) {
      bl.width = w;
      bl.height = h;
    }
    bx.clearRect(0, 0, w, h);
    bx.filter = "contrast(1.5) brightness(.85) blur(6px)";
    bx.drawImage(cv, 0, 0, w, h);
    bx.filter = "none";
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.5;
    g.drawImage(bl, 0, 0, W, H);
    g.restore();
    if (tr) {
      const e = Math.sin(f * Math.PI);
      g.save();
      g.globalCompositeOperation = "lighter";
      const q = g.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.7,
      );
      q.addColorStop(0, `rgba(150,200,255,${0.2 * e})`);
      q.addColorStop(1, "rgba(150,200,255,0)");
      g.fillStyle = q;
      g.fillRect(0, 0, W, H);
      const sg = g.createLinearGradient(0, 0, W, 0);
      sg.addColorStop(0, "rgba(120,190,255,0)");
      sg.addColorStop(0.5, `rgba(190,225,255,${0.7 * e})`);
      sg.addColorStop(1, "rgba(120,190,255,0)");
      g.fillStyle = sg;
      g.fillRect(0, H / 2 - 1.5, W, 3);
      g.restore();
    }
    if (!noisePattern) noisePattern = g.createPattern(gr, "repeat");
    g.save();
    g.globalCompositeOperation = "overlay";
    g.globalAlpha = 0.07;
    g.fillStyle = noisePattern;
    g.translate(-Math.random() * 160, -Math.random() * 160);
    g.fillRect(0, 0, W + 160, H + 160);
    g.restore();
    const v = g.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.35,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.78,
    );
    v.addColorStop(0, "rgba(0,0,8,0)");
    v.addColorStop(1, "rgba(0,0,8,.6)");
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
    if (!mq.matches && t < 0.9) {
      g.fillStyle = `rgba(0,0,0,${1 - E(t / 0.9)})`;
      g.fillRect(0, 0, W, H);
    }
  }

  /* ---------- stage UI ---------- */
  function setStage(s, force = false) {
    if (!force && s === cur) return;
    cur = s;
    capNum.textContent = String(s + 1);
    capTitle.textContent = STAGES[s][1];
    capText.textContent = STAGES[s][2];
    legendEl.replaceChildren(
      ...STAGES[s][3].map(([c, n]) => {
        const span = document.createElement("span");
        const i = document.createElement("i");
        i.style.background = c;
        i.style.color = c;
        span.append(i, document.createTextNode(n));
        return span;
      }),
    );
    $$(".rsa-stage-btn").forEach((b, i) => {
      b.classList.toggle("is-active", i === s);
      b.setAttribute("aria-pressed", i === s ? "true" : "false");
    });
  }

  STAGES.forEach((st, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rsa-btn rsa-stage-btn";
    b.textContent = `${i + 1} ${st[0]}`;
    b.setAttribute("aria-label", `Go to stage ${i + 1}: ${st[1]}`);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => go(i));
    stagesEl.appendChild(b);
  });

  function fmt(sec) {
    const s = Math.max(0, Math.min(TOTAL, Math.floor(sec)));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  function updateProgress(force = false) {
    const pct = `${(t / TOTAL) * 100}%`;
    range.style.setProperty("--rsa-progress", pct);
    if (!range.matches(":active") || force) {
      range.value = String(Math.round(t * 10) / 10);
    }
    const stage = Math.min(5, Math.floor(t / DUR)) + 1;
    range.setAttribute(
      "aria-valuetext",
      `Stage ${stage} of 6, ${fmt(t)} elapsed of ${fmt(TOTAL)}`,
    );
    timeEl.textContent = `${fmt(t)} / ${fmt(TOTAL)}`;
  }

  function updatePlayUI() {
    playBtn.textContent = playing ? "❚❚ Pause" : "▶ Play";
    playBtn.setAttribute(
      "aria-label",
      playing ? "Pause animation" : "Play animation",
    );
  }

  function drawScene() {
    if (destroyed || W < 20 || H < 20) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    g.filter = "none";
    const s = cl(Math.floor(t / DUR), 0, 5);
    setStage(s);
    const lt = t - s * DUR;
    const u = cl(lt / DUR);
    const f = E(cl(lt / 0.8));
    g.clearRect(0, 0, W, H);
    const cam = (k) => {
      g.translate(W / 2, H / 2);
      g.scale(k, k);
      g.translate(-W / 2, -H / 2);
    };
    if (s > 0 && f < 1) {
      g.save();
      cam(L(1.04, 1.24, f));
      S[s - 1](1);
      g.restore();
    }
    g.save();
    cam((1 + 0.04 * u) * (s > 0 ? L(1.18, 1, f) : 1));
    g.globalAlpha = s > 0 ? f : 1;
    S[s](u);
    g.restore();
    post(f, s > 0 && f < 1);
    updateProgress();
  }

  function loop(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (playing) {
      clk += dt;
      t += dt;
      if (t >= TOTAL) {
        t = TOTAL;
        playing = false;
        updatePlayUI();
      }
    }
    drawScene();
    if (playing) raf = requestAnimationFrame(loop);
    else raf = 0;
  }

  function play() {
    if (destroyed || playing) return;
    if (t >= TOTAL - 0.01) t = 0;
    playing = true;
    last = performance.now();
    updatePlayUI();
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function pause() {
    if (destroyed || !playing) return;
    playing = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    updatePlayUI();
    drawScene();
  }

  function togglePlay() {
    if (playing) pause();
    else play();
  }

  // A stage jump lands on a representative, fully developed frame rather
  // than the first black/cross-faded instant of the scene.
  const STAGE_SEEK = [7, 6, 6, 6, 8, 8.5];

  function go(stage) {
    const s = cl(stage, 0, 5);
    t = s * DUR + STAGE_SEEK[s];
    drawScene();
  }

  function seek(v) {
    t = cl(v, 0, TOTAL);
    drawScene();
  }

  function resize() {
    if (destroyed) return;
    const rect = stageEl.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const d = Math.min(window.devicePixelRatio || 1, 2);
    if (w === W && h === H && d === dpr) return;
    W = w;
    H = h;
    dpr = d;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScene();
  }

  /* ---------- events ---------- */
  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", () => go(cur - 1));
  nextBtn.addEventListener("click", () => go(cur + 1));
  $('[data-act="restart"]').addEventListener("click", () => {
    t = 0;
    if (playing) {
      drawScene();
    } else {
      play();
    }
  });

  range.addEventListener("pointerdown", () => {
    seekWasPlaying = playing;
    if (playing) pause();
  });
  range.addEventListener("input", () => seek(parseFloat(range.value)));
  const finishSeek = () => {
    if (seekWasPlaying) {
      seekWasPlaying = false;
      play();
    }
  };
  range.addEventListener("change", finishSeek);
  range.addEventListener("pointerup", finishSeek);

  function onKey(e) {
    if (e.target.closest("button, input, a, select, textarea")) return;
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(cur + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(cur - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(5);
    }
  }
  stageEl.addEventListener("keydown", onKey);

  const onMotionChange = (e) => {
    if (e.matches && playing) pause();
  };
  if (mq.addEventListener) mq.addEventListener("change", onMotionChange);
  else if (mq.addListener) mq.addListener(onMotionChange);

  let ro = null;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(resize);
    ro.observe(stageEl);
  }
  const onWinResize = () => resize();
  window.addEventListener("resize", onWinResize);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!destroyed && !playing) drawScene();
    });
  }

  setStage(0, true);
  updatePlayUI();
  resize();
  if (playing) {
    last = performance.now();
    raf = requestAnimationFrame(loop);
  } else {
    drawScene();
  }

  return function destroy() {
    destroyed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (ro) ro.disconnect();
    window.removeEventListener("resize", onWinResize);
    stageEl.removeEventListener("keydown", onKey);
    if (mq.removeEventListener)
      mq.removeEventListener("change", onMotionChange);
    else if (mq.removeListener) mq.removeListener(onMotionChange);
    shadow.replaceChildren();
  };
}

class RemoteSensingProcessAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cleanup = null;
  }
  connectedCallback() {
    if (!this._cleanup) this._cleanup = mount(this.shadowRoot);
  }
  disconnectedCallback() {
    if (this._cleanup) {
      this._cleanup();
      this._cleanup = null;
    }
  }
  destroy() {
    this.disconnectedCallback();
  }
}

if (!customElements.get("rs-remote-sensing-process-animation")) {
  customElements.define(
    "rs-remote-sensing-process-animation",
    RemoteSensingProcessAnimation,
  );
}
