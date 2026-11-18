/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountInterpretation() {
  (function () {
    /* ============================================================
       RS.5 — Element Detective Canvas
       A procedurally drawn overhead scene with 6 clickable features.
       Each feature reveals which of the 7 interpretation elements apply.
    ============================================================ */
    const detCanvas = document.getElementById("detectiveCanvas");
    const detCtx = detCanvas.getContext("2d");
    const detPanel = document.getElementById("detectivePanel");
    const detScoreBadge = document.getElementById("det-score-badge");

    // Scale canvas for crisp display on HiDPI
    const DPR = window.devicePixelRatio || 1;
    detCanvas.width = 720 * DPR;
    detCanvas.height = 400 * DPR;
    detCanvas.style.width = "720px";
    detCanvas.style.height = "400px";
    detCtx.scale(DPR, DPR);

    const W = 720,
      H = 400;

    // Six scene features with their hit boxes and interpretation data
    const FEATURES = [
      {
        id: "river",
        label: "Meandering River",
        elements: ["tone", "shape", "texture"],
        color: "#1d4ed8",
        notes: {
          tone: "Dark blue-black in NIR — water absorbs strongly, creating high contrast with banks.",
          shape:
            "Sinuous, natural meander — no straight river forms without engineering.",
          texture:
            "Smooth, uniform surface — still water has near-zero tonal variation.",
        },
        hint: "Dark winding body",
        discovered: false,
      },
      {
        id: "orchard",
        label: "Orchard Grid",
        elements: ["pattern", "texture", "tone"],
        color: "#15803d",
        notes: {
          pattern:
            "Perfectly regular row spacing — the signature of deliberate plantation.",
          texture:
            "Medium-coarse mottled texture from tree crowns at varying heights.",
          tone: "Bright red in false-colour (high NIR reflectance) — healthy dense canopy.",
        },
        hint: "Regularly spaced dots",
        discovered: false,
      },
      {
        id: "factory",
        label: "Industrial Complex",
        elements: ["shape", "size", "shadow", "association"],
        color: "#78716c",
        notes: {
          shape:
            "Large rectangular footprints with sawtooth roofline — classic factory form.",
          size: "Vastly larger than surrounding houses — scale tells you it's industrial.",
          shadow:
            "Long shadow to the west reveals tall chimney stacks hidden from above.",
          association:
            "Rail siding beside it and access roads confirm industrial function.",
        },
        hint: "Large rectangles with chimney",
        discovered: false,
      },
      {
        id: "residential",
        label: "Residential Grid",
        elements: ["pattern", "size", "association"],
        color: "#c2410c",
        notes: {
          pattern:
            "Regular street grid with uniform block sizes — planned residential layout.",
          size: "Small, uniform plots — consistent house size distinguishes from commercial.",
          association:
            "Adjacent to parks (green patches) and near school ovals.",
        },
        hint: "Uniform small rectangles in grid",
        discovered: false,
      },
      {
        id: "reservoir",
        label: "Reservoir / Dam",
        elements: ["tone", "shape", "association"],
        color: "#0e7490",
        notes: {
          tone: "Deep uniform dark — open water with no suspended sediment.",
          shape:
            "Irregular, dendritic shoreline — water filling a valley, not a geometric tank.",
          association:
            "Dam wall visible at narrow end; roads and settlement cluster at wall.",
        },
        hint: "Dark irregular polygon",
        discovered: false,
      },
      {
        id: "runway",
        label: "Airport Runway",
        elements: ["shape", "size", "shadow", "association"],
        color: "#64748b",
        notes: {
          shape:
            "Perfectly straight, exceptionally long rectangle — unmistakable globally.",
          size: "Length of ~3 km dwarfs all nearby features — scale eliminates other options.",
          shadow:
            "Minimal shadow (flat surface) but threshold markings visible as tone patterns.",
          association:
            "Terminal apron, aircraft stands, and hangars confirm identity.",
        },
        hint: "Long thin grey rectangle",
        discovered: false,
      },
    ];

    let discoveredCount = 0;
    let activeFeature = null;
    let hitZones = []; // populated after drawing

    function drawScene() {
      const ctx = detCtx;
      ctx.clearRect(0, 0, W, H);

      // Background — agricultural landscape base
      ctx.fillStyle = "#3d5a3e";
      ctx.fillRect(0, 0, W, H);

      // Field patches
      const fields = [
        { x: 0, y: 0, w: 180, h: 120, c: "#4a7c59" },
        { x: 185, y: 0, w: 140, h: 100, c: "#5a8a48" },
        { x: 0, y: 125, w: 150, h: 130, c: "#3d6644" },
        { x: 560, y: 0, w: 160, h: 180, c: "#4d7a42" },
        { x: 400, y: 200, w: 130, h: 140, c: "#4a7c59" },
        { x: 0, y: 310, w: 200, h: 90, c: "#557a45" },
        { x: 560, y: 300, w: 160, h: 100, c: "#3e6140" },
      ];
      fields.forEach((f) => {
        ctx.fillStyle = f.c;
        ctx.fillRect(f.x, f.y, f.w, f.h);
      });

      // ── RIVER (meandering) ──────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, 210);
      ctx.bezierCurveTo(60, 190, 100, 240, 160, 225);
      ctx.bezierCurveTo(220, 210, 240, 260, 310, 245);
      ctx.bezierCurveTo(380, 230, 390, 270, 460, 255);
      ctx.bezierCurveTo(530, 240, 560, 200, 620, 210);
      ctx.bezierCurveTo(660, 215, 700, 205, 720, 210);
      ctx.lineWidth = 22;
      ctx.strokeStyle = "#1a4a9e";
      ctx.stroke();
      ctx.lineWidth = 16;
      ctx.strokeStyle = "#1d4ed8";
      ctx.stroke();

      // ── ORCHARD (regular dot grid) ──────────────────────────────
      ctx.fillStyle = "#166534";
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          const cx = 200 + c * 30,
            cy = 18 + r * 25;
          ctx.beginPath();
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fill();
          // tiny shadow
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.beginPath();
          ctx.ellipse(cx + 5, cy + 8, 7, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#166534";
        }
      }

      // ── FACTORY (large rectangles + chimney shadow) ────────────
      ctx.fillStyle = "#57534e";
      ctx.fillRect(30, 270, 160, 80);
      ctx.fillStyle = "#78716c";
      ctx.fillRect(35, 275, 60, 65);
      ctx.fillRect(100, 275, 55, 65);
      ctx.fillRect(160, 275, 25, 40);
      // Sawtooth roof lines
      ctx.strokeStyle = "#a8a29e";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(35 + i * 12, 275);
        ctx.lineTo(40 + i * 12, 285);
        ctx.lineTo(47 + i * 12, 275);
        ctx.stroke();
      }
      // Chimney + shadow
      ctx.fillStyle = "#44403c";
      ctx.fillRect(75, 258, 8, 18);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(85, 280, 22, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Rail siding
      ctx.strokeStyle = "#78716c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 350);
      ctx.lineTo(100, 310);
      ctx.stroke();
      ctx.strokeStyle = "#57534e";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        const sx = t * 100,
          sy = 350 - t * 40;
        ctx.beginPath();
        ctx.moveTo(sx - 4, sy + 3);
        ctx.lineTo(sx + 4, sy - 3);
        ctx.stroke();
      }

      // ── RESIDENTIAL GRID ───────────────────────────────────────
      ctx.fillStyle = "#c2410c";
      const houses = [
        [350, 20],
        [380, 20],
        [410, 20],
        [350, 50],
        [380, 50],
        [410, 50],
        [350, 80],
        [380, 80],
        [410, 80],
        [440, 20],
        [440, 50],
        [440, 80],
      ];
      houses.forEach(([hx, hy]) => {
        ctx.fillRect(hx, hy, 22, 18);
        ctx.fillStyle = "#9a3412";
        ctx.fillRect(hx + 2, hy + 2, 18, 6);
        ctx.fillStyle = "#c2410c";
      });
      // Streets
      ctx.strokeStyle = "#d4c5b2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(345, 15);
      ctx.lineTo(470, 15);
      ctx.moveTo(345, 45);
      ctx.lineTo(470, 45);
      ctx.moveTo(345, 75);
      ctx.lineTo(470, 75);
      ctx.moveTo(345, 105);
      ctx.lineTo(470, 105);
      ctx.moveTo(345, 15);
      ctx.lineTo(345, 105);
      ctx.moveTo(375, 15);
      ctx.lineTo(375, 105);
      ctx.moveTo(405, 15);
      ctx.lineTo(405, 105);
      ctx.moveTo(435, 15);
      ctx.lineTo(435, 105);
      ctx.moveTo(465, 15);
      ctx.lineTo(465, 105);
      ctx.stroke();
      // Park near residential
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(350, 108, 80, 35);
      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.arc(375, 122, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(400, 118, 8, 0, Math.PI * 2);
      ctx.fill();

      // ── RESERVOIR ──────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(600, 30);
      ctx.lineTo(640, 20);
      ctx.lineTo(680, 40);
      ctx.lineTo(700, 80);
      ctx.lineTo(690, 130);
      ctx.lineTo(660, 160);
      ctx.lineTo(640, 150);
      ctx.lineTo(630, 120);
      ctx.lineTo(610, 110);
      ctx.lineTo(590, 90);
      ctx.lineTo(600, 60);
      ctx.closePath();
      ctx.fillStyle = "#0c4a6e";
      ctx.fill();
      ctx.strokeStyle = "#0e7490";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Dam wall
      ctx.fillStyle = "#78716c";
      ctx.fillRect(590, 155, 70, 8);

      // ── RUNWAY ──────────────────────────────────────────────────
      ctx.fillStyle = "#475569";
      ctx.fillRect(150, 155, 350, 45);
      ctx.fillStyle = "#64748b";
      ctx.fillRect(155, 160, 340, 35);
      // Centerline dashes
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 14]);
      ctx.beginPath();
      ctx.moveTo(170, 177);
      ctx.lineTo(480, 177);
      ctx.stroke();
      ctx.setLineDash([]);
      // Threshold markings
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(158 + i * 10, 162);
        ctx.lineTo(158 + i * 10, 193);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(440 + i * 10, 162);
        ctx.lineTo(440 + i * 10, 193);
        ctx.stroke();
      }
      // Terminal building
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(250, 200, 90, 35);
      ctx.fillStyle = "#7f8ea3";
      ctx.fillRect(255, 205, 30, 20);
      ctx.fillRect(295, 205, 30, 20);
      // Apron + aircraft
      ctx.fillStyle = "#64748b";
      ctx.fillRect(250, 140, 90, 15);
      // Tiny aircraft shapes
      ctx.fillStyle = "#cbd5e1";
      [
        [270, 145],
        [300, 145],
        [330, 145],
      ].forEach(([ax, ay]) => {
        ctx.fillRect(ax - 8, ay - 2, 16, 4); // fuselage
        ctx.fillRect(ax - 4, ay - 5, 8, 3); // wings approx
      });

      // Hit zones
      hitZones = [
        { id: "river", x: 200, y: 200, w: 200, h: 55 },
        { id: "orchard", x: 195, y: 5, w: 160, h: 100 },
        { id: "factory", x: 25, y: 255, w: 175, h: 100 },
        { id: "residential", x: 340, y: 10, w: 135, h: 135 },
        { id: "reservoir", x: 585, y: 15, w: 125, h: 155 },
        { id: "runway", x: 145, y: 150, w: 360, h: 55 },
      ];

      // Hover hints (small labels)
      FEATURES.forEach((f) => {
        const hz = hitZones.find((h) => h.id === f.id);
        if (!hz) return;
        const cx = hz.x + hz.w / 2;
        const cy = hz.y + hz.h / 2;
        if (f.discovered) {
          ctx.fillStyle = "rgba(45,212,191,0.25)";
          ctx.strokeStyle = "#2dd4bf";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(hz.x, hz.y, hz.w, hz.h, 4);
          ctx.fill();
          ctx.stroke();
        } else {
          // Subtle dashed hint box on hover handled by click only; draw faint indicator
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.roundRect(hz.x, hz.y, hz.w, hz.h, 4);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        // Label
        if (f.discovered) {
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillStyle = "#2dd4bf";
          ctx.textAlign = "center";
          ctx.fillText("✓ " + f.label.toUpperCase(), cx, hz.y - 5);
        }
      });

      ctx.textAlign = "left";
    }

    function highlightFeature(featureId) {
      const ctx = detCtx;
      const hz = hitZones.find((h) => h.id === featureId);
      if (!hz) return;
      ctx.strokeStyle = "#f5a623";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#f5a623";
      ctx.shadowBlur = 12;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.roundRect(hz.x, hz.y, hz.w, hz.h, 4);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }

    function showPanel(feature) {
      const elColors = {
        tone: "#f5a623",
        shape: "#2dd4bf",
        size: "#3b82f6",
        pattern: "#a78bfa",
        texture: "#4ade80",
        shadow: "#f87171",
        association: "#fb923c",
      };
      let html = `<div class="dp-feature-name">${feature.label}</div>`;
      html += `<div class="dp-elements-row">`;
      feature.elements.forEach((el) => {
        html += `<span class="dp-el-tag" style="border-color:${elColors[el]};color:${elColors[el]}">${el.toUpperCase()}</span>`;
      });
      html += `</div>`;
      html += `<div class="dp-notes">`;
      feature.elements.forEach((el) => {
        html += `<div class="dp-note"><span class="dp-note-el" style="color:${elColors[el]}">${el.charAt(0).toUpperCase() + el.slice(1)}:</span> ${feature.notes[el]}</div>`;
      });
      html += `</div>`;
      detPanel.innerHTML = html;

      // Highlight chips in legend
      document.querySelectorAll(".det-el-chip").forEach((chip) => {
        chip.classList.toggle(
          "active",
          feature.elements.includes(chip.dataset.el),
        );
      });
    }

    detCanvas.addEventListener("click", function (e) {
      const rect = detCanvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);

      let hit = null;
      hitZones.forEach((hz) => {
        if (mx >= hz.x && mx <= hz.x + hz.w && my >= hz.y && my <= hz.y + hz.h)
          hit = hz.id;
      });

      if (!hit) return;
      const feature = FEATURES.find((f) => f.id === hit);
      if (!feature) return;
      if (!feature.discovered) {
        feature.discovered = true;
        discoveredCount++;
        detScoreBadge.textContent = `${discoveredCount} / 6 found`;
        if (discoveredCount === 6)
          detScoreBadge.style.background = "var(--teal-dim)";
      }
      activeFeature = hit;
      drawScene();
      highlightFeature(hit);
      showPanel(feature);
    });

    // Cursor change on hover
    detCanvas.addEventListener("mousemove", function (e) {
      const rect = detCanvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      let onFeature = hitZones.some(
        (hz) =>
          mx >= hz.x && mx <= hz.x + hz.w && my >= hz.y && my <= hz.y + hz.h,
      );
      detCanvas.style.cursor = onFeature ? "pointer" : "default";
    });

    window.detectiveReset = function () {
      FEATURES.forEach((f) => (f.discovered = false));
      discoveredCount = 0;
      activeFeature = null;
      detScoreBadge.textContent = "0 / 6 found";
      detScoreBadge.style.background = "";
      detPanel.innerHTML =
        '<div class="dp-placeholder"><div class="dp-icon">👆</div><div class="dp-text">Click any feature in the scene to analyse it</div></div>';
      document
        .querySelectorAll(".det-el-chip")
        .forEach((c) => c.classList.remove("active"));
      drawScene();
    };

    drawScene();

    /* ============================================================
       RS.5 — False Colour Band Compositor
       Simulated urban/veg/water scene rendered with per-band
       reflectance values, assigned to R G B channels.
    ============================================================ */

    // Band reflectance profiles for 7 land cover types
    // [blue, green, red, nir, swir1, swir2]
    const BAND_PROFILES = {
      healthy_veg: [0.05, 0.1, 0.06, 0.5, 0.22, 0.09],
      stressed_veg: [0.06, 0.13, 0.12, 0.28, 0.3, 0.18],
      water: [0.08, 0.07, 0.04, 0.02, 0.01, 0.005],
      urban: [0.25, 0.26, 0.25, 0.27, 0.28, 0.26],
      bare_soil: [0.22, 0.28, 0.32, 0.36, 0.38, 0.34],
      snow: [0.72, 0.75, 0.72, 0.68, 0.06, 0.02],
      cloud: [0.78, 0.8, 0.78, 0.76, 0.74, 0.72],
    };
    const BAND_IDX = { blue: 0, green: 1, red: 2, nir: 3, swir1: 4, swir2: 5 };
    const ALL_BANDS = [
      { id: "blue", label: "Band 2 · Blue (490 nm)" },
      { id: "green", label: "Band 3 · Green (560 nm)" },
      { id: "red", label: "Band 4 · Red (665 nm)" },
      { id: "nir", label: "Band 8 · NIR (842 nm)" },
      { id: "swir1", label: "Band 11 · SWIR-1 (1.6 µm)" },
      { id: "swir2", label: "Band 12 · SWIR-2 (2.2 µm)" },
    ];

    // Current composite assignment: channel → band id
    let compAssign = { r: "red", g: "green", b: "blue" };

    // Scene layout — multi-feature landscape
    const SCENE_REGIONS = [
      { x: 0, y: 0, w: 190, h: 70, cover: "healthy_veg" },
      { x: 190, y: 0, w: 150, h: 70, cover: "snow" },
      { x: 0, y: 70, w: 100, h: 70, cover: "stressed_veg" },
      { x: 100, y: 70, w: 150, h: 70, cover: "healthy_veg" },
      { x: 250, y: 70, w: 90, h: 70, cover: "cloud" },
      { x: 0, y: 140, w: 340, h: 45, cover: "water" },
      { x: 0, y: 185, w: 140, h: 115, cover: "urban" },
      { x: 140, y: 185, w: 200, h: 115, cover: "bare_soil" },
    ];

    const COVER_LABELS = {
      healthy_veg: "Healthy Vegetation",
      stressed_veg: "Stressed Vegetation",
      water: "Water Body",
      urban: "Urban / Built-up",
      bare_soil: "Bare Soil",
      snow: "Glacial Snow / Ice",
      cloud: "Water Cloud",
    };

    const PRESET_INTERPRETATIONS = {
      true: "Natural True Colour (R·G·B): Vegetation appears green, water is dark blue — matches human vision. Healthy and stressed vegetation look nearly identical.",
      fcc: "Standard False Colour (NIR·R·G): Healthy vegetation glows bright crimson red (intense mesophyll NIR scatter). Stressed veg appears pale pink. Water turns pitch black. Snow & clouds appear white.",
      swir: "SWIR Agriculture (SWIR-1·NIR·R): Crop vigor and soil moisture dynamics highlighted. Active crops appear vivid green; dry fallow fields appear brown; urban areas appear cyan.",
      snow: "Snow vs Cloud (SWIR-1·NIR·G): Ice absorbs SWIR (turning snow bright cyan-blue) while liquid water clouds reflect SWIR (remaining brilliant white), immediately solving cloud vs snow confusion!",
      geology:
        "Geology & Mineralogy (SWIR-2·SWIR-1·R): Highlights hydrothermal alteration zones, clay deposits, and fault structures in contrasting shades of pink, yellow, and magenta.",
    };

    const compCanvas = document.getElementById("compositorCanvas");
    const compCtx = compCanvas.getContext("2d");
    compCanvas.width = 340 * DPR;
    compCanvas.height = 300 * DPR;
    compCanvas.style.width = "340px";
    compCanvas.style.height = "300px";
    compCtx.scale(DPR, DPR);

    function getBandValue(cover, bandId) {
      const idx = BAND_IDX[bandId];
      return BAND_PROFILES[cover][idx];
    }

    function renderComposite() {
      SCENE_REGIONS.forEach((reg) => {
        const rv = getBandValue(reg.cover, compAssign.r);
        const gv = getBandValue(reg.cover, compAssign.g);
        const bv = getBandValue(reg.cover, compAssign.b);
        // Stretch to 0-255 (linear, normalized to 0.72 peak)
        const clamp = (v) => Math.min(255, Math.round((v / 0.72) * 255));
        compCtx.fillStyle = `rgb(${clamp(rv)},${clamp(gv)},${clamp(bv)})`;
        compCtx.fillRect(reg.x, reg.y, reg.w, reg.h);

        // Subtle border between regions
        compCtx.strokeStyle = "rgba(0,0,0,0.25)";
        compCtx.lineWidth = 1;
        compCtx.strokeRect(reg.x, reg.y, reg.w, reg.h);
      });

      // Draw region labels
      SCENE_REGIONS.forEach((reg) => {
        compCtx.font = '9px "JetBrains Mono",monospace';
        compCtx.fillStyle = "rgba(255,255,255,0.85)";
        compCtx.shadowColor = "rgba(0,0,0,0.8)";
        compCtx.shadowBlur = 3;
        compCtx.textAlign = "center";
        compCtx.fillText(
          COVER_LABELS[reg.cover],
          reg.x + reg.w / 2,
          reg.y + reg.h / 2 + 4,
        );
      });
      compCtx.shadowBlur = 0;
      compCtx.textAlign = "left";

      // Update legend
      const leg = document.getElementById("compLegend");
      leg.innerHTML = SCENE_REGIONS.filter(
        (r, i, arr) => arr.findIndex((x) => x.cover === r.cover) === i,
      )
        .map((reg) => {
          const rv = getBandValue(reg.cover, compAssign.r);
          const gv = getBandValue(reg.cover, compAssign.g);
          const bv = getBandValue(reg.cover, compAssign.b);
          const clamp = (v) => Math.min(255, Math.round((v / 0.72) * 255));
          return `<div class="comp-leg-item"><span class="comp-leg-swatch" style="background:rgb(${clamp(rv)},${clamp(gv)},${clamp(bv)})"></span><span>${COVER_LABELS[reg.cover]}</span></div>`;
        })
        .join("");
    }

    function applyPreset(preset) {
      const presets = {
        true: { r: "red", g: "green", b: "blue" },
        fcc: { r: "nir", g: "red", b: "green" },
        swir: { r: "swir1", g: "nir", b: "red" },
        snow: { r: "swir1", g: "nir", b: "green" },
        geology: { r: "swir2", g: "swir1", b: "red" },
      };
      if (!presets[preset]) return;
      compAssign = { ...presets[preset] };
      updateSlotPills();
      renderComposite();
      document.getElementById("compIntText").textContent =
        PRESET_INTERPRETATIONS[preset];
    }

    function updateSlotPills() {
      ["r", "g", "b"].forEach((ch) => {
        const slot = document.getElementById("slot-" + ch);
        const bandId = compAssign[ch];
        const band = ALL_BANDS.find((b) => b.id === bandId);
        slot.innerHTML = `<div class="comp-band-pill assigned" data-band="${bandId}" draggable="true">${band ? band.label : "—"}</div>`;
        setupDraggable(slot.querySelector(".comp-band-pill"));
      });
      refreshPool();
    }

    function refreshPool() {
      const pool = document.getElementById("bandPool");
      const usedBands = Object.values(compAssign);
      pool.innerHTML = "";
      ALL_BANDS.forEach((b) => {
        if (!usedBands.includes(b.id)) {
          const pill = document.createElement("div");
          pill.className = "comp-band-pill";
          pill.dataset.band = b.id;
          pill.draggable = true;
          pill.textContent = b.label;
          setupDraggable(pill);
          pool.appendChild(pill);
        }
      });
    }

    let dragBand = null;

    function setupDraggable(pill) {
      pill.addEventListener("dragstart", (e) => {
        dragBand = pill.dataset.band;
        e.dataTransfer.effectAllowed = "move";
      });

      // Tap/Click to swap support for mobile/tablets
      pill.addEventListener("click", () => {
        const bandId = pill.dataset.band;
        if (!bandId) return;
        // If band is already in a slot, click does nothing or swaps with pool
        const usedChannels = Object.keys(compAssign).filter(
          (ch) => compAssign[ch] === bandId,
        );
        if (usedChannels.length === 0) {
          // Band is in pool -> cycle into Red, then Green, then Blue
          const poolBands = ALL_BANDS.filter(
            (b) => !Object.values(compAssign).includes(b.id),
          );
          const oldR = compAssign.r;
          compAssign.r = bandId;
          updateSlotPills();
          renderComposite();
          document
            .querySelectorAll(".comp-preset-btn")
            .forEach((b) => b.classList.remove("active"));
          document.getElementById("compIntText").textContent =
            `Assigned ${pill.textContent} to Red display channel. Drag or click other bands to customize.`;
        }
      });
    }

    ["slot-r", "slot-g", "slot-b"].forEach((slotId) => {
      const slot = document.getElementById(slotId);
      const ch = slotId.replace("slot-", "");
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        slot.classList.add("drag-over");
      });
      slot.addEventListener("dragleave", () =>
        slot.classList.remove("drag-over"),
      );
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("drag-over");
        if (dragBand) {
          // If this band was in another channel, swap
          Object.keys(compAssign).forEach((k) => {
            if (compAssign[k] === dragBand) compAssign[k] = compAssign[ch];
          });
          compAssign[ch] = dragBand;
          dragBand = null;
          updateSlotPills();
          renderComposite();
          document
            .querySelectorAll(".comp-preset-btn")
            .forEach((b) => b.classList.remove("active"));
          document.getElementById("compIntText").textContent =
            "Custom composite — interpret the scene colours using your band knowledge.";
        }
      });

      // Click slot to cycle next available band from pool
      slot.addEventListener("click", () => {
        const poolBands = ALL_BANDS.filter(
          (b) => !Object.values(compAssign).includes(b.id),
        );
        if (poolBands.length > 0) {
          compAssign[ch] = poolBands[0].id;
          updateSlotPills();
          renderComposite();
          document
            .querySelectorAll(".comp-preset-btn")
            .forEach((b) => b.classList.remove("active"));
          document.getElementById("compIntText").textContent =
            `Assigned ${poolBands[0].label} to ${ch.toUpperCase()} display gun.`;
        }
      });
    });

    document.querySelectorAll(".comp-preset-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".comp-preset-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        applyPreset(this.dataset.preset);
      });
    });

    // Initial pool population
    ALL_BANDS.forEach((b) => {
      const inSlot = ["red", "green", "blue"].includes(b.id);
      if (!inSlot) {
        const pill = document.createElement("div");
        pill.className = "comp-band-pill";
        pill.dataset.band = b.id;
        pill.draggable = true;
        pill.textContent = b.label;
        setupDraggable(pill);
        document.getElementById("bandPool").appendChild(pill);
      }
    });
    document.querySelectorAll(".comp-band-pill").forEach(setupDraggable);
    renderComposite();
  })();

  // The old markup used inline onclick; React removed that attribute.
  const detectiveResetButton = document.querySelector(".det-reset-btn");
  if (detectiveResetButton)
    detectiveResetButton.addEventListener("click", window.detectiveReset);

  return () => {
    try {
      delete window.detectiveReset;
    } catch {
      window.detectiveReset = undefined;
    }
  };
}
