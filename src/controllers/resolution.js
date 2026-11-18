import Chart from "chart.js/auto";

/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountResolution() {
  (function () {
    const grid = document.getElementById("pixel-grid");
    const sizeSlider = document.getElementById("pixel-size-slider");
    const bitsSlider = document.getElementById("pixel-bits-slider");
    const sizeVal = document.getElementById("pixel-size-val");
    const bitsVal = document.getElementById("pixel-bits-val");
    function getLandscapeValue(row, col, size) {
      const r = row / size,
        c = col / size;
      let val =
        0.3 + 0.2 * Math.sin(r * Math.PI * 2) * Math.cos(c * Math.PI * 3);
      const distToRiver = Math.abs(r - c * 0.8 - 0.1);
      if (distToRiver < 0.04) val = 0.05;
      if (r < 0.3 && c > 0.6)
        val = 0.7 + 0.1 * Math.sin(r * 50) * Math.cos(c * 50);
      if (r > 0.55 && c < 0.35)
        val = 0.45 + 0.08 * Math.sin(r * 30) * Math.cos(c * 30);
      if (r < 0.2 && c < 0.2) val = 0.85;
      return Math.max(0, Math.min(1, val));
    }
    function renderGrid() {
      const size = parseInt(sizeSlider.value);
      const bits = parseInt(bitsSlider.value);
      const maxVal = Math.pow(2, bits) - 1;
      sizeVal.textContent = `${size} × ${size}`;
      bitsVal.textContent = `${bits}-bit (${(maxVal + 1).toLocaleString()} levels)`;
      grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
      grid.innerHTML = "";
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const normalized = getLandscapeValue(r, c, size);
          const dn = Math.round(normalized * maxVal);
          const brightness = Math.round(normalized * 255);
          const cell = document.createElement("div");
          cell.className = "pixel-cell";
          cell.style.background = `rgb(${brightness},${brightness},${brightness})`;
          cell.style.aspectRatio = "1";
          if (size <= 16) cell.textContent = dn;
          grid.appendChild(cell);
        }
      }
    }
    sizeSlider.addEventListener("input", renderGrid);
    bitsSlider.addEventListener("input", renderGrid);
    renderGrid();
  })();
  (function () {
    const container = document.getElementById("rad-grid");
    const bitsList = [1, 2, 4, 8, 11, 12];
    bitsList.forEach((bits) => {
      const levels = Math.pow(2, bits);
      const card = document.createElement("div");
      card.className = "rad-card";
      const gradDiv = document.createElement("div");
      gradDiv.className = "rad-bar";
      const stops = [];
      const nStops = Math.min(levels, 64);
      for (let i = 0; i < nStops; i++) {
        const pct = (i / (nStops - 1)) * 100;
        const val = Math.round((i / (nStops - 1)) * 255);
        stops.push(`rgb(${val},${val},${val}) ${pct}%`);
      }
      gradDiv.style.background = `linear-gradient(to right, ${stops.join(", ")})`;
      card.innerHTML = `<div class="bits">${bits}-bit</div><div class="levels">${levels.toLocaleString()} grey levels</div>`;
      card.appendChild(gradDiv);
      const sensors = {
        1: "Binary image",
        2: "Early weather fax",
        4: "Basic display",
        8: "Landsat TM, most displays",
        11: "IKONOS — detail in shadows",
        12: "Landsat OLI — sharpest",
      };
      const sensorDiv = document.createElement("div");
      sensorDiv.style.cssText =
        "font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); margin-top: 8px; text-align: center;";
      sensorDiv.textContent = sensors[bits] || "";
      card.appendChild(sensorDiv);
      container.appendChild(card);
    });
  })();

  // ================================================================
  // SPATIAL RESOLUTION JUXTAPOSE SLIDER ENGINE
  // ================================================================
  (function () {
    const viewport = document.getElementById("juxtapose-viewport");
    const overlayWrap = document.getElementById("jux-overlay-wrap");
    const baseCanvas = document.getElementById("jux-canvas-base");
    const overlayCanvas = document.getElementById("jux-canvas-overlay");
    const handle = document.getElementById("jux-handle");
    if (!viewport || !overlayWrap || !baseCanvas || !overlayCanvas) return;

    const bCtx = baseCanvas.getContext("2d");
    const oCtx = overlayCanvas.getContext("2d");

    let currentPair = "s2-l8";
    let isDragging = false;
    let splitPct = 50;

    const pairConfig = {
      "s2-l8": {
        leftBadge: "10m · Sentinel-2 MSI",
        rightBadge: "30m · Landsat-8/9 OLI",
        leftRes: 10,
        rightRes: 30,
        leftMeta: {
          val: "10m / pixel · 100 m²",
          desc: "Shows individual city streets, buildings, and field boundaries.",
        },
        rightMeta: {
          val: "30m / pixel · 900 m² (9× area)",
          desc: "Urban streets blend into single mixed pixels; only large avenues and fields resolve.",
        },
      },
      "l8-modis": {
        leftBadge: "30m · Landsat-8/9 OLI",
        rightBadge: "250m · MODIS Terra/Aqua",
        leftRes: 30,
        rightRes: 250,
        leftMeta: {
          val: "30m / pixel · 900 m²",
          desc: "Agricultural fields, city limits, and water reservoirs clearly distinct.",
        },
        rightMeta: {
          val: "250m / pixel · 62,500 m² (69× area)",
          desc: "Entire city is compressed into ~4 coarse blocks; runways & bridges disappear entirely.",
        },
      },
      "carto-s2": {
        leftBadge: "1m · Cartosat-3 PAN",
        rightBadge: "10m · Sentinel-2 MSI",
        leftRes: 1,
        rightRes: 10,
        leftMeta: {
          val: "1m / pixel · 1 m²",
          desc: "Sharp sub-meter detail: individual parked aircraft on tarmac, road lanes, houses.",
        },
        rightMeta: {
          val: "10m / pixel · 100 m² (100× area)",
          desc: "Aircraft blur into grey smudges; runway centerline vanishes; only boundary remains.",
        },
      },
    };

    // High-resolution procedural urban landscape generator (City + Airport + River)
    function drawHighResScene(ctx, w, h) {
      // Background terrain (agriculture fields & suburbs)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, w, h);

      // Diagonal winding river
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = w * 0.08;
      ctx.beginPath();
      ctx.moveTo(w * 0.05, 0);
      ctx.bezierCurveTo(w * 0.4, h * 0.35, w * 0.2, h * 0.65, w * 0.75, h);
      ctx.stroke();

      // Sandbanks along river
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = w * 0.015;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, 0);
      ctx.bezierCurveTo(w * 0.42, h * 0.35, w * 0.23, h * 0.65, w * 0.77, h);
      ctx.stroke();

      // Agricultural grid patches (left side)
      const fieldColors = [
        "#15803d",
        "#166534",
        "#a16207",
        "#4d7c0f",
        "#047857",
      ];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
          ctx.fillStyle = fieldColors[(r * 4 + c) % fieldColors.length];
          ctx.fillRect(
            w * 0.02 + c * (w * 0.07),
            h * 0.45 + r * (h * 0.09),
            w * 0.062,
            h * 0.078,
          );
        }
      }

      // Dense Urban Grid / City Blocks (top-right)
      ctx.fillStyle = "#475569";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const bx = w * 0.52 + c * (w * 0.05);
          const by = h * 0.05 + r * (h * 0.05);
          ctx.fillStyle = (r + c) % 3 === 0 ? "#94a3b8" : "#64748b";
          ctx.fillRect(bx, by, w * 0.04, h * 0.038);
        }
      }

      // Main Highways (roads with bridge over river)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = w * 0.018;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.4);
      ctx.lineTo(w, h * 0.4);
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();

      // Airport Complex (bottom-right)
      const airX = w * 0.48;
      const airY = h * 0.62;
      // Tarmac
      ctx.fillStyle = "#334155";
      ctx.fillRect(airX, airY, w * 0.48, h * 0.34);

      // Primary Runways
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(airX + w * 0.04, airY + h * 0.06, w * 0.4, h * 0.05);
      ctx.fillRect(airX + w * 0.04, airY + h * 0.18, w * 0.35, h * 0.045);

      // Runway Centerline dashes (sub-meter detail)
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(airX + w * 0.04, airY + h * 0.085);
      ctx.lineTo(airX + w * 0.44, airY + h * 0.085);
      ctx.stroke();
      ctx.setLineDash([]);

      // Parked Airplanes on apron
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 5; i++) {
        const ax = airX + w * 0.08 + i * (w * 0.06);
        const ay = airY + h * 0.28;
        // Fuselage + wings
        ctx.fillRect(ax - 2, ay - 6, 4, 12);
        ctx.fillRect(ax - 7, ay - 2, 14, 3);
      }
    }

    // Downsample high-res canvas into discrete blocky pixels
    function renderPixelated(targetCtx, w, h, pixelSizeMeters) {
      // Map meter resolution to canvas pixel block size
      // 1m -> 1px, 10m -> 5px, 30m -> 15px, 250m -> 75px
      let blockSize = 1;
      if (pixelSizeMeters === 1) blockSize = 1;
      else if (pixelSizeMeters === 10) blockSize = 6;
      else if (pixelSizeMeters === 30) blockSize = 18;
      else if (pixelSizeMeters === 250) blockSize = 80;

      if (blockSize <= 1) {
        drawHighResScene(targetCtx, w, h);
        return;
      }

      // Render offscreen at full resolution first
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d");
      drawHighResScene(offCtx, w, h);

      const cols = Math.ceil(w / blockSize);
      const rows = Math.ceil(h / blockSize);

      // Downsample by averaging inside block
      const imgData = offCtx.getImageData(0, 0, w, h).data;
      targetCtx.clearRect(0, 0, w, h);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const startX = c * blockSize;
          const startY = r * blockSize;

          // Sample center of block
          const sampleX = Math.min(w - 1, startX + Math.floor(blockSize / 2));
          const sampleY = Math.min(h - 1, startY + Math.floor(blockSize / 2));
          const idx = (sampleY * w + sampleX) * 4;

          targetCtx.fillStyle = `rgb(${imgData[idx]}, ${imgData[idx + 1]}, ${imgData[idx + 2]})`;
          targetCtx.fillRect(startX, startY, blockSize, blockSize);

          // Draw faint pixel grid border for coarse resolutions (30m & 250m)
          if (blockSize >= 18) {
            targetCtx.strokeStyle = "rgba(0, 0, 0, 0.15)";
            targetCtx.lineWidth = 1;
            targetCtx.strokeRect(startX, startY, blockSize, blockSize);
          }
        }
      }
    }

    function resizeAndRender() {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      baseCanvas.width = w;
      baseCanvas.height = h;
      overlayCanvas.width = w;
      overlayCanvas.height = h;

      const cfg = pairConfig[currentPair];
      // Base (Right = Coarser)
      renderPixelated(bCtx, w, h, cfg.rightRes);
      // Overlay (Left = Finer)
      renderPixelated(oCtx, w, h, cfg.leftRes);

      updateSplit(splitPct);
    }

    function updateSplit(pct) {
      splitPct = Math.max(0, Math.min(100, pct));
      overlayWrap.style.width = splitPct + "%";
    }

    // Dragging event handlers
    function handleMove(clientX) {
      const rect = viewport.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      updateSplit(pct);
    }

    viewport.addEventListener("mousedown", (e) => {
      isDragging = true;
      handleMove(e.clientX);
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) handleMove(e.clientX);
    });
    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    viewport.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        handleMove(e.touches[0].clientX);
      },
      { passive: true },
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (isDragging) handleMove(e.touches[0].clientX);
      },
      { passive: true },
    );
    window.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Satellite pair selector buttons
    const pairBtns = document.querySelectorAll(".jux-btn");
    const bLeft = document.getElementById("jux-badge-left");
    const bRight = document.getElementById("jux-badge-right");
    const metaLeftVal = document.getElementById("jux-meta-left-val");
    const metaLeftDesc = document.getElementById("jux-meta-left-desc");
    const metaRightVal = document.getElementById("jux-meta-right-val");
    const metaRightDesc = document.getElementById("jux-meta-right-desc");

    pairBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        pairBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentPair = btn.dataset.pair;
        const cfg = pairConfig[currentPair];

        bLeft.textContent = cfg.leftBadge;
        bRight.textContent = cfg.rightBadge;
        metaLeftVal.innerHTML = cfg.leftMeta.val;
        metaLeftDesc.textContent = cfg.leftMeta.desc;
        metaRightVal.innerHTML = cfg.rightMeta.val;
        metaRightDesc.textContent = cfg.rightMeta.desc;

        resizeAndRender();
      });
    });

    window.addEventListener("resize", resizeAndRender);
    resizeAndRender();
  })();

  // ================================================================
  // TEMPORAL RESOLUTION: MINI-CALENDAR FLYOVER TRACKER ENGINE
  // ================================================================
  (function () {
    const calGrid = document.getElementById("calendar-days-grid");
    const playBtn = document.getElementById("btn-play-calendar");
    const logText = document.getElementById("cal-log-text");
    const statPasses = document.getElementById("stat-monthly-passes");
    const statCloud = document.getElementById("stat-cloud-risk");
    const satBtns = document.querySelectorAll(".temp-sat-btn");
    if (!calGrid) return;

    const satSchedules = {
      sentinel2: {
        name: "Sentinel-2A & 2B Constellation",
        revisit: "5 days",
        passDays: [2, 7, 12, 17, 22, 27],
        monthlyPasses: "6 Passes / Month",
        cloudRisk: "~35% Loss (Optical)",
        type: "Sun-Synchronous Multi-Spectral",
        swath: "290 km",
        cloudDays: [7, 17], // Simulated cloudy days
        note: "5-day revisit achieved by phasing two identical satellites (2A + 2B) 180° apart in the same polar orbit.",
      },
      landsat: {
        name: "Landsat 8 & 9 Constellation",
        revisit: "8 days",
        passDays: [3, 11, 19, 27],
        monthlyPasses: "4 Passes / Month",
        cloudRisk: "~35% Loss (Optical)",
        type: "Sun-Synchronous Multispectral/Thermal",
        swath: "185 km",
        cloudDays: [11],
        note: "A single Landsat revisits every 16 days. Operating Landsat 8 and 9 together offsets their orbits by 8 days.",
      },
      modis: {
        name: "MODIS (Terra & Aqua)",
        revisit: "1–2 days",
        passDays: [
          1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28,
          29,
        ],
        monthlyPasses: "20 Passes / Month",
        cloudRisk: "~30% Loss (Optical)",
        type: "Coarse Wide-Swath Global Monitor",
        swath: "2,330 km",
        cloudDays: [5, 14, 22],
        note: "Gigantic 2,330 km swath sweeps the entire globe every 1–2 days, trading 250m resolution for near-daily global coverage.",
      },
      insat: {
        name: "INSAT-3D / 3DR Imager (GEO)",
        revisit: "Continuous (15-min scans)",
        passDays: Array.from({ length: 30 }, (_, i) => i + 1), // All 30 days
        monthlyPasses: "2,880 Scans / Month (96/day)",
        cloudRisk: "0% Loss (Measures clouds!)",
        type: "Geostationary Meteorological Imager",
        swath: "Full Earth Disk",
        cloudDays: [],
        note: "Parked permanently over the Indian Ocean at 74°E & 82°E. Never leaves the sky, capturing storm updates every 15 minutes.",
      },
      sar: {
        name: "Sentinel-1 C-band SAR",
        revisit: "6 days (Constellation)",
        passDays: [1, 7, 13, 19, 25],
        monthlyPasses: "5 Passes / Month",
        cloudRisk: "0% Loss (Microwave All-Weather)",
        type: "Synthetic Aperture Radar (Active)",
        swath: "250 km",
        cloudDays: [7, 19], // Passes on cloudy days succeed!
        note: "Microwave radar pulses pierce dense monsoon rain and cloud cover. 100% of planned acquisitions succeed day or night.",
      },
    };

    let activeSatKey = "sentinel2";
    let isAnimating = false;
    let animTimer = null;

    function renderCalendar() {
      const sched = satSchedules[activeSatKey];
      calGrid.innerHTML = "";
      statPasses.textContent = sched.monthlyPasses;
      statCloud.textContent = sched.cloudRisk;

      for (let day = 1; day <= 30; day++) {
        const hasPass = sched.passDays.includes(day);
        const isCloudy = sched.cloudDays.includes(day);

        const cell = document.createElement("div");
        cell.className = `cal-day-cell ${hasPass ? "has-pass" : ""}`;
        cell.id = `cal-day-${day}`;

        let pillText = hasPass ? "🛰️ Pass" : "—";
        if (activeSatKey === "insat") pillText = "24/7";

        cell.innerHTML = `
          <span class="cal-day-num">${day}</span>
          <span class="cal-pass-pill">${pillText}</span>
        `;
        calGrid.appendChild(cell);
      }
    }

    function runTimelineAnimation() {
      if (isAnimating) {
        clearInterval(animTimer);
        isAnimating = false;
        playBtn.textContent = "▶ Animate Month Timeline";
        return;
      }

      isAnimating = true;
      playBtn.textContent = "⏹ Stop Animation";
      const sched = satSchedules[activeSatKey];
      let currentDay = 1;

      // Clear existing cell highlights
      document.querySelectorAll(".cal-day-cell").forEach((c) => {
        c.classList.remove("current-step", "pulse-pass");
      });

      animTimer = setInterval(() => {
        if (currentDay > 30) {
          clearInterval(animTimer);
          isAnimating = false;
          playBtn.textContent = "▶ Replay Month Timeline";
          logText.innerHTML = `<strong>Month Completed:</strong> ${sched.name} completed its scheduled pass cycle over Hyderabad. Total valid acquisitions: ${sched.passDays.length - (activeSatKey === "sar" || activeSatKey === "insat" ? 0 : sched.cloudDays.length)}.`;
          return;
        }

        // Highlight current step
        document
          .querySelectorAll(".cal-day-cell")
          .forEach((c) => c.classList.remove("current-step"));
        const activeCell = document.getElementById(`cal-day-${currentDay}`);
        if (activeCell) activeCell.classList.add("current-step");

        const isPass = sched.passDays.includes(currentDay);
        const isCloudy = sched.cloudDays.includes(currentDay);

        if (isPass) {
          activeCell.classList.add("pulse-pass");
          if (activeSatKey === "insat") {
            logText.innerHTML = `<strong>Day ${currentDay}:</strong> INSAT-3D captured 96 continuous hemispheric scans. Cloud movement tracked in thermal infrared.`;
          } else if (activeSatKey === "sar") {
            logText.innerHTML = `<strong>Day ${currentDay} Flyover:</strong> 🛰️ Sentinel-1 C-SAR pass! ${isCloudy ? "Heavy cloud cover present, but 5.6cm radar pulses penetrate with 100% transmission." : "Clear weather radar scan successful."}`;
          } else if (isCloudy) {
            logText.innerHTML = `<strong>Day ${currentDay} Flyover:</strong> ☁️ Optical Pass Failed: Dense monsoon clouds obscure Hyderabad. Visible/NIR data unusable. Revisit missed!`;
          } else {
            logText.innerHTML = `<strong>Day ${currentDay} Flyover:</strong> 🛰️ ${sched.name} pass! Crisp clear-sky multispectral acquisition captured at 10:30 AM local solar time.`;
          }
        } else {
          logText.innerHTML = `<strong>Day ${currentDay}:</strong> Satellite in adjacent orbit track (${sched.revisit} revisit). Target waiting for next pass.`;
        }

        currentDay++;
      }, 280);
    }

    playBtn.addEventListener("click", runTimelineAnimation);

    satBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (isAnimating) {
          clearInterval(animTimer);
          isAnimating = false;
          playBtn.textContent = "▶ Animate Month Timeline";
        }
        satBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeSatKey = btn.dataset.sat;
        renderCalendar();
        logText.innerHTML = `Switched to <strong>${satSchedules[activeSatKey].name}</strong>. Revisit period: <strong>${satSchedules[activeSatKey].revisit}</strong>. Click "Animate Month Timeline" to run flyover simulation.`;
      });
    });

    renderCalendar();
  })();

  // ================================================================
  // 1. IFOV & OPTICAL GEOMETRY RAY TRACER & CALCULATOR ENGINE
  // ================================================================
  (function () {
    const canvas = document.getElementById("ifov-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const sH = document.getElementById("slider-ifov-h");
    const sF = document.getElementById("slider-ifov-f");
    const sA = document.getElementById("slider-ifov-a");

    const vH = document.getElementById("val-ifov-h");
    const vF = document.getElementById("val-ifov-f");
    const vA = document.getElementById("val-ifov-a");

    const cRad = document.getElementById("calc-ifov-rad");
    const cIgfov = document.getElementById("calc-ifov-igfov");
    const badge = document.getElementById("ifov-canvas-badge");
    const targetIcon = document.getElementById("res-target-icon");
    const targetDesc = document.getElementById("res-target-desc");
    const chips = document.querySelectorAll(".ifov-chip");

    let currentPlatformName = "Cartosat-3 (High-Res LEO)";

    function updateCalculations() {
      const H_km = parseFloat(sH.value); // in km
      const f_mm = parseFloat(sF.value); // in mm
      const a_um = parseFloat(sA.value); // in micrometers

      // Text labels
      vH.textContent =
        H_km < 1
          ? `${Math.round(H_km * 1000)} m`
          : `${H_km.toLocaleString()} km`;
      vF.textContent =
        f_mm >= 1000
          ? `${(f_mm / 1000).toFixed(1)} m (${f_mm} mm)`
          : `${f_mm} mm`;
      vA.textContent = `${a_um.toFixed(1)} \u03BCm`;
      badge.textContent = `${currentPlatformName} \u00B7 ${vH.textContent} Alt`;

      // beta = a / f (a in um, f in mm -> 10^-6 / 10^-3 = 10^-3 rad = mrad)
      // beta_rad = (a_um * 1e-6) / (f_mm * 1e-3) = a_um / (f_mm * 1000)
      const beta_rad = (a_um * 1e-6) / (f_mm * 1e-3);
      const beta_urad = beta_rad * 1e6;
      const beta_arcsec = beta_rad * 206265;

      // IGFOV = beta * H (H in meters)
      const H_m = H_km * 1000;
      const igfov_m = beta_rad * H_m;

      cRad.textContent = `${beta_urad.toFixed(2)} \u03BCrad (${beta_arcsec.toFixed(2)} arcsec)`;

      if (igfov_m < 0.01) {
        cIgfov.textContent = `${(igfov_m * 1000).toFixed(1)} mm / pixel`;
      } else if (igfov_m < 1) {
        cIgfov.textContent = `${(igfov_m * 100).toFixed(1)} cm / pixel`;
      } else if (igfov_m < 1000) {
        cIgfov.textContent = `${igfov_m.toFixed(2)} m / pixel`;
      } else {
        cIgfov.textContent = `${(igfov_m / 1000).toFixed(2)} km / pixel`;
      }

      // Resolvable targets text
      if (igfov_m <= 0.05) {
        targetIcon.textContent = "🌿";
        targetDesc.innerHTML =
          "<strong>Sub-Centimeter Detail (Drone/UAV):</strong> Individual crop leaves, weed patches, fine asphalt cracks, and golf balls resolve clearly.";
      } else if (igfov_m <= 0.35) {
        targetIcon.textContent = "🚗";
        targetDesc.innerHTML =
          "<strong>Sub-Meter High-Res (Cartosat-3 / WorldView):</strong> Individual automobiles, rooftop AC units, pedestrian crosswalks, and manhole covers visible.";
      } else if (igfov_m <= 5) {
        targetIcon.textContent = "🏠";
        targetDesc.innerHTML =
          "<strong>High Resolution (IRS PAN / PlanetScope):</strong> House footprints, swimming pools, small farm ponds, and local roads resolved.";
      } else if (igfov_m <= 15) {
        targetIcon.textContent = "🌾";
        targetDesc.innerHTML =
          "<strong>Medium-High Resolution (Sentinel-2 MSI):</strong> Agricultural field boundaries, city arterial avenues, aircraft on runways, and forest clearings.";
      } else if (igfov_m <= 60) {
        targetIcon.textContent = "🗺️";
        targetDesc.innerHTML =
          "<strong>Medium Resolution (Landsat OLI):</strong> Broad agricultural plots, urban district boundaries, large water reservoirs, and wildfire burn scars.";
      } else if (igfov_m <= 300) {
        targetIcon.textContent = "🌊";
        targetDesc.innerHTML =
          "<strong>Coarse Regional (MODIS 250m):</strong> Regional river basins, large mountain ranges, urban sprawl limits, and ocean sediment plumes.";
      } else {
        targetIcon.textContent = "🌪️";
        targetDesc.innerHTML =
          "<strong>Very Coarse Hemispheric (INSAT-3D / GOES 1-4km):</strong> Continental weather systems, cyclone eye vortex, cloud cover, and sea surface temperature.";
      }

      drawIFOVScene(igfov_m, H_km, f_mm, a_um);
    }

    function drawIFOVScene(igfov_m, H_km, f_mm, a_um) {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background gradient (Space to Earth Atmosphere)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#030712");
      skyGrad.addColorStop(0.65, "#0b192e");
      skyGrad.addColorStop(0.85, "#1e3a5f");
      skyGrad.addColorStop(1, "#064e3b");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars in upper space
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      const stars = [
        [30, 20],
        [90, 45],
        [160, 15],
        [240, 60],
        [380, 25],
        [460, 50],
        [520, 18],
        [70, 80],
        [490, 95],
      ];
      stars.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Satellite / Platform Position at top center
      const satX = w * 0.5;
      const satY = 45;

      // Draw Sensor Telescope / Satellite Body
      ctx.save();
      ctx.translate(satX, satY);

      // Solar panels
      ctx.fillStyle = "#0284c7";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.fillRect(-65, -8, 40, 16);
      ctx.strokeRect(-65, -8, 40, 16);
      ctx.fillRect(25, -8, 40, 16);
      ctx.strokeRect(25, -8, 40, 16);

      // Solar panel grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(-45, -8);
      ctx.lineTo(-45, 8);
      ctx.moveTo(45, -8);
      ctx.lineTo(45, 8);
      ctx.stroke();

      // Satellite main body (Gold foil)
      ctx.fillStyle = "#f59e0b";
      ctx.strokeStyle = "#d97706";
      ctx.fillRect(-18, -14, 36, 28);
      ctx.strokeRect(-18, -14, 36, 28);

      // Telescope barrel & Lens
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-9, 14, 18, 12);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, 26, 8, 0, Math.PI);
      ctx.fill();

      ctx.restore();

      // Ground Surface Line
      const groundY = h - 60;
      ctx.fillStyle = "#166534";
      ctx.fillRect(0, groundY, w, 60);

      // Ground terrain details (roads, trees, river)
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(w * 0.05, groundY + 15, w * 0.9, 8); // River
      ctx.fillStyle = "#475569";
      ctx.fillRect(w * 0.15, groundY + 30, w * 0.7, 6); // Road

      // Projected Ray Beam (IFOV cone)
      const beamSpread = Math.max(
        16,
        Math.min(180, Math.log10(igfov_m + 1.1) * 60 + 24),
      );
      const groundLeft = satX - beamSpread;
      const groundRight = satX + beamSpread;

      // Beam Fill
      const beamGrad = ctx.createLinearGradient(0, satY + 26, 0, groundY);
      beamGrad.addColorStop(0, "rgba(245, 166, 35, 0.45)");
      beamGrad.addColorStop(0.7, "rgba(45, 212, 191, 0.25)");
      beamGrad.addColorStop(1, "rgba(45, 212, 191, 0.6)");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(satX, satY + 26);
      ctx.lineTo(groundLeft, groundY);
      ctx.lineTo(groundRight, groundY);
      ctx.closePath();
      ctx.fill();

      // Ray Outlines
      ctx.strokeStyle = "rgba(245, 166, 35, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(satX, satY + 26);
      ctx.lineTo(groundLeft, groundY);
      ctx.moveTo(satX, satY + 26);
      ctx.lineTo(groundRight, groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ground Resolution Element (Pixel Footprint) on Ground
      ctx.fillStyle = "rgba(245, 166, 35, 0.35)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.fillRect(groundLeft, groundY - 6, beamSpread * 2, 12);
      ctx.strokeRect(groundLeft, groundY - 6, beamSpread * 2, 12);

      // Dimension Callouts
      ctx.fillStyle = "#fff";
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(
        `IGFOV Ground Pixel: ${cIgfov.textContent}`,
        satX,
        groundY + 38,
      );

      // Angle label (beta)
      ctx.fillStyle = "#f5a623";
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`\u03B2 = a/f`, satX, satY + 55);
      ctx.fillText(`H = ${vH.textContent}`, satX + 75, (satY + groundY) * 0.5);

      // Altitude indicator ruler line
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(satX + 45, satY + 26);
      ctx.lineTo(satX + 45, groundY);
      ctx.stroke();
    }

    // Slider event listeners
    [sH, sF, sA].forEach((slider) => {
      slider.addEventListener("input", () => {
        currentPlatformName = "Custom Sensor";
        chips.forEach((c) => c.classList.remove("active"));
        updateCalculations();
      });
    });

    // Preset chips
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        currentPlatformName = chip.dataset.name;
        sH.value = chip.dataset.h;
        sF.value = chip.dataset.f;
        sA.value = chip.dataset.a;
        updateCalculations();
      });
    });

    updateCalculations();
  })();

  // ================================================================
  // 2. SPECTRAL RESOLUTION & DATA CUBE ENGINE
  // ================================================================
  (function () {
    const chartCanvas = document.getElementById("specResolutionChart");
    const cubeCanvas = document.getElementById("cube-canvas");
    if (!chartCanvas || !cubeCanvas) return;

    const modeBtns = document.querySelectorAll(".spec-mode-btn");
    const targetChips = document.querySelectorAll(".spec-target-chip");
    const bandBadge = document.getElementById("spec-band-count");
    const cubeBadge = document.getElementById("cube-mode-badge");
    const verdictIcon = document.getElementById("verdict-icon");
    const verdictTitle = document.getElementById("verdict-title");
    const verdictText = document.getElementById("verdict-text");

    let currentMode = "hsi"; // 'pan', 'msi', 'hsi'
    let currentTarget = "crop"; // 'crop', 'clay', 'water', 'urban'

    // Wavelengths from 400nm to 2400nm (step 20nm)
    const wavelengths = [];
    for (let w = 400; w <= 2400; w += 20) wavelengths.push(w);

    // Spectral signature models
    function getSignatures(target) {
      if (target === "crop") {
        // Curve 1: Healthy Citrus (Strong NIR plateau, sharp chlorophyll dip)
        // Curve 2: Citrus Greening Disease (Degraded NIR, flattened red edge)
        const c1 = wavelengths.map((w) => {
          if (w < 500) return 6;
          if (w < 600) return 14;
          if (w < 680) return 5;
          if (w < 740) return 5 + (w - 680) * 0.7; // Sharp Red Edge
          if (w < 1300) return 52 - (w - 740) * 0.005; // NIR Plateau
          if (w < 1500) return 22; // Water absorption
          if (w < 1800) return 38;
          if (w < 2000) return 15;
          return 24;
        });
        const c2 = wavelengths.map((w) => {
          if (w < 500) return 9;
          if (w < 600) return 18;
          if (w < 680) return 12; // Chlorophyll loss
          if (w < 740) return 12 + (w - 680) * 0.32; // Weak Red Edge
          if (w < 1300) return 33 - (w - 740) * 0.004; // Collapsed NIR
          if (w < 1500) return 26;
          if (w < 1800) return 34;
          if (w < 2000) return 22;
          return 25;
        });
        return {
          label1: "Healthy Citrus (Intact Canopy)",
          label2: "HLB Greening Disease (Chlorotic)",
          c1,
          c2,
          panDiscrim: {
            ok: false,
            title: "Materials Indistinguishable (0% Separation)",
            text: "Panchromatic averages all 450–900nm light into one pixel. Both citrus types yield the same DN (~38).",
          },
          msiDiscrim: {
            ok: false,
            title: "Inconclusive / Ambiguous (NDVI overlaps)",
            text: "Multispectral Red and NIR bands show lower NDVI, but cannot separate greening disease from simple nitrogen deficiency or drought.",
          },
          hsiDiscrim: {
            ok: true,
            title: "100% Diagnostic Discrimination Confirmed",
            text: "Hyperspectral detects the 705nm red-edge inflection shift and 531nm xanthophyll absorption characteristic of early-stage bacterial HLB infection.",
          },
        };
      } else if (target === "clay") {
        // Kaolinite vs Alunite (Hydrothermal alteration minerals)
        const c1 = wavelengths.map((w) => {
          let base = 25 + (w - 400) * 0.025;
          if (w >= 1390 && w <= 1430) base -= 24; // 1.4um dip
          if (w >= 2150 && w <= 2230) base -= 28; // Kaolinite 2.20um doublet!
          return Math.max(5, base);
        });
        const c2 = wavelengths.map((w) => {
          let base = 24 + (w - 400) * 0.024;
          if (w >= 1420 && w <= 1470) base -= 22; // 1.44um dip
          if (w >= 2160 && w <= 2190) base -= 25; // Alunite 2.17um dip
          if (w >= 2300 && w <= 2340) base -= 18;
          return Math.max(5, base);
        });
        return {
          label1: "Kaolinite Clay (Al2Si2O5(OH)4)",
          label2: "Alunite Hydrothermal Mineral",
          c1,
          c2,
          panDiscrim: {
            ok: false,
            title: "Identical Bright Clay Appearance",
            text: "Both minerals have high visible/NIR albedo. In Pan mode, both show as identical white rock.",
          },
          msiDiscrim: {
            ok: false,
            title: "Both Fall in SWIR Band 11/12 (Ambiguous)",
            text: 'Landsat/Sentinel SWIR bands are ~100nm wide. They detect a generic "clay mineral absorption" but cannot tell Kaolinite apart from Alunite.',
          },
          hsiDiscrim: {
            ok: true,
            title: "Kaolinite 2.20\u03BCm Doublet Resolved",
            text: "224 contiguous 10nm bands resolve the diagnostic double absorption valley (2.16\u03BCm & 2.20\u03BCm), crucial for gold/copper prospecting.",
          },
        };
      } else if (target === "water") {
        // Clean Deep Lake vs Algal Bloom
        const c1 = wavelengths.map((w) => {
          if (w < 500) return 10;
          if (w < 600) return 6;
          if (w < 700) return 2;
          return 0.5;
        });
        const c2 = wavelengths.map((w) => {
          if (w < 500) return 4;
          if (w < 580) return 14; // Green peak
          if (w < 680) return 3; // Chl-a absorption
          if (w < 720) return 18; // Cyanobacteria phycocyanin fluorescence peak!
          if (w < 900) return 12;
          return 1;
        });
        return {
          label1: "Oligotrophic Clean Water",
          label2: "Eutrophic Toxic Cyanobacteria Bloom",
          c1,
          c2,
          panDiscrim: {
            ok: false,
            title: "Both Appear Dark/Grey",
            text: "Pan merges green chlorophyll radiance with black water background.",
          },
          msiDiscrim: {
            ok: true,
            title: "Detected (High Green/Red Ratio)",
            text: "Multispectral distinguishes turbid algae water from clear water, but cannot isolate toxic microcystin toxin strains.",
          },
          hsiDiscrim: {
            ok: true,
            title: "Phycocyanin 620nm Biomarker Quantified",
            text: "Narrow 620nm absorption and 709nm fluorescence peak directly quantifies toxic blue-green cyanobacteria cell density.",
          },
        };
      } else {
        // Urban: Green Painted Metal Roof vs Real Tree Turf
        const c1 = wavelengths.map((w) => {
          if (w < 500) return 6;
          if (w < 600) return 14;
          if (w < 680) return 5;
          if (w < 1300) return 50; // Huge NIR plateau in real vegetation
          return 20;
        });
        const c2 = wavelengths.map((w) => {
          // Green paint: reflects green, but ZERO NIR plateau!
          if (w < 500) return 6;
          if (w < 600) return 14; // Green paint
          if (w < 680) return 7;
          if (w < 1300) return 9; // Stays low in NIR!
          return 12;
        });
        return {
          label1: "Real Living Vegetation Turf",
          label2: "Green Painted Metal Industrial Roof",
          c1,
          c2,
          panDiscrim: {
            ok: false,
            title: "Zero Contrast in Visible Light",
            text: "Human eyes and Pan cameras see both as identical shade of green.",
          },
          msiDiscrim: {
            ok: true,
            title: "NIR Band Instantly Exposes Fake Turf",
            text: "Multispectral NIR band easily separates living turf (50% NIR) from green paint (9% NIR).",
          },
          hsiDiscrim: {
            ok: true,
            title: "Full Cellulose & Lignin Spectrum Confirmed",
            text: "Pinpoints artificial pigment phthalocyanine green absorption versus natural chlorophyll a/b.",
          },
        };
      }
    }

    // Chart setup
    const chartCtx = chartCanvas.getContext("2d");
    let specChart = new Chart(chartCtx, {
      type: "line",
      data: {
        labels: wavelengths.map((w) => `${w}`),
        datasets: [
          {
            label: "Target 1",
            data: [],
            borderColor: "#2dd4bf",
            backgroundColor: "rgba(45, 212, 191, 0.1)",
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: 0,
          },
          {
            label: "Target 2",
            data: [],
            borderColor: "#f5a623",
            backgroundColor: "rgba(245, 166, 35, 0.1)",
            borderWidth: 2.5,
            borderDash: [5, 4],
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            title: {
              display: true,
              text: "Wavelength (nm)",
              color: "#94a3b8",
              font: { family: "JetBrains Mono", size: 10 },
            },
            ticks: {
              color: "#64748b",
              maxTicksLimit: 8,
              font: { family: "JetBrains Mono", size: 10 },
            },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          y: {
            title: {
              display: true,
              text: "Reflectance (%)",
              color: "#94a3b8",
              font: { family: "JetBrains Mono", size: 10 },
            },
            ticks: {
              color: "#64748b",
              font: { family: "JetBrains Mono", size: 10 },
            },
            grid: { color: "rgba(255,255,255,0.05)" },
            min: 0,
            max: 60,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#e2e8f0",
              font: { family: "Space Grotesk", size: 11 },
            },
          },
        },
      },
    });

    function updateSpectralView() {
      const data = getSignatures(currentTarget);

      if (currentMode === "pan") {
        bandBadge.textContent = "1 Broadband Channel (450–900 nm)";
        cubeBadge.textContent = "2D Grayscale Matrix (No Depth)";

        // PAN: Average curve between 450 and 900, flat line
        const avg1 = data.c1.slice(3, 26).reduce((a, b) => a + b, 0) / 23;
        const avg2 = data.c2.slice(3, 26).reduce((a, b) => a + b, 0) / 23;

        specChart.data.datasets[0].data = wavelengths.map(() => avg1);
        specChart.data.datasets[1].data = wavelengths.map(() => avg2);
        specChart.data.datasets[0].label = `${data.label1} (Broadband Pan Average: ${avg1.toFixed(1)}%)`;
        specChart.data.datasets[1].label = `${data.label2} (Broadband Pan Average: ${avg2.toFixed(1)}%)`;

        verdictIcon.textContent = data.panDiscrim.ok ? "✅" : "❌";
        verdictTitle.textContent = data.panDiscrim.title;
        verdictText.textContent = data.panDiscrim.text;
      } else if (currentMode === "msi") {
        bandBadge.textContent = "13 Discrete Bands (Sentinel-2 MSI)";
        cubeBadge.textContent = "13-Slice Layered Stack";

        // MSI: sample at 6 key band centers, step interpolations
        const msiBands = [490, 560, 665, 705, 842, 1610, 2190];
        function sampleMSI(curve) {
          return wavelengths.map((w) => {
            let closestIdx = 0;
            let minDiff = 9999;
            msiBands.forEach((bw) => {
              const diff = Math.abs(w - bw);
              if (diff < minDiff) {
                minDiff = diff;
                closestIdx = Math.round((bw - 400) / 20);
              }
            });
            return curve[Math.min(curve.length - 1, closestIdx)];
          });
        }

        specChart.data.datasets[0].data = sampleMSI(data.c1);
        specChart.data.datasets[1].data = sampleMSI(data.c2);
        specChart.data.datasets[0].label = `${data.label1} (MSI 13-Band Sampled)`;
        specChart.data.datasets[1].label = `${data.label2} (MSI 13-Band Sampled)`;

        verdictIcon.textContent = data.msiDiscrim.ok ? "✅" : "⚠️";
        verdictTitle.textContent = data.msiDiscrim.title;
        verdictText.textContent = data.msiDiscrim.text;
      } else {
        // HSI: Continuous full curve
        bandBadge.textContent =
          "224 Contiguous Channels (\u0394\u03BB = 10 nm)";
        cubeBadge.textContent = "3D Hyperspectral Data Cube";

        specChart.data.datasets[0].data = data.c1;
        specChart.data.datasets[1].data = data.c2;
        specChart.data.datasets[0].label = data.label1;
        specChart.data.datasets[1].label = data.label2;

        verdictIcon.textContent = "✅";
        verdictTitle.textContent = data.hsiDiscrim.title;
        verdictText.textContent = data.hsiDiscrim.text;
      }

      specChart.update();
      drawCubeVisualization();
    }

    function drawCubeVisualization() {
      const ctx = cubeCanvas.getContext("2d");
      const w = cubeCanvas.width;
      const h = cubeCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Isometric Data Cube Rendering
      const originX = 70;
      const originY = 140;
      const cubeW = 110;
      const cubeH = 80;
      const cubeDepth =
        currentMode === "pan" ? 8 : currentMode === "msi" ? 65 : 130;

      // Draw slices along depth
      const nSlices =
        currentMode === "pan" ? 1 : currentMode === "msi" ? 7 : 20;
      const sliceColors = [
        "#3b82f6",
        "#06b6d4",
        "#10b981",
        "#84cc16",
        "#eab308",
        "#f97316",
        "#ef4444",
        "#ec4899",
        "#8b5cf6",
      ];

      for (let s = nSlices - 1; s >= 0; s--) {
        const offsetX = (s / nSlices) * cubeDepth * 0.866;
        const offsetY = -(s / nSlices) * cubeDepth * 0.5;

        const px = originX + offsetX;
        const py = originY + offsetY;

        ctx.fillStyle =
          currentMode === "pan"
            ? "#475569"
            : sliceColors[s % sliceColors.length];
        ctx.globalAlpha = currentMode === "pan" ? 0.9 : 0.45;

        // Draw rectangular slice in perspective
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + cubeW, py);
        ctx.lineTo(px + cubeW, py - cubeH);
        ctx.lineTo(px, py - cubeH);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = currentMode === "pan" ? "#94a3b8" : "#fff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;

      // Axis labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText("X (Spatial)", originX + 25, originY + 18);
      ctx.fillText("Y (Spatial)", originX - 45, originY - 35);
      ctx.fillStyle = "#2dd4bf";
      ctx.fillText(
        "\u03BB (Spectral Depth)",
        originX + 100,
        originY - cubeH - 20,
      );
    }

    modeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;
        updateSpectralView();
      });
    });

    targetChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        targetChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        currentTarget = chip.dataset.target;
        updateSpectralView();
      });
    });

    updateSpectralView();
  })();

  // ================================================================
  // 3. RADIOMETRIC RESOLUTION DYNAMIC RANGE & SHADOW LAB ENGINE
  // ================================================================
  (function () {
    const sceneCanvas = document.getElementById("rad-scene-canvas");
    const histCanvas = document.getElementById("rad-hist-canvas");
    if (!sceneCanvas || !histCanvas) return;

    const sCtx = sceneCanvas.getContext("2d");
    const hCtx = histCanvas.getContext("2d");

    const bitBtns = document.querySelectorAll(".bit-btn");
    const activeLevels = document.getElementById("rad-active-levels");
    const shadowText = document.getElementById("rad-shadow-inspect-text");
    const quantStep = document.getElementById("stat-quant-step");
    const shadowLoss = document.getElementById("stat-shadow-loss");
    const highlightLoss = document.getElementById("stat-highlight-loss");

    let activeBits = 12;

    // Generate synthetic High Dynamic Range image buffer (Glacier + Shadowed Valley + River)
    const W = 560,
      H = 280;
    const rawLuma = new Float32Array(W * H);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const nx = x / W;
        const ny = y / H;

        let luma = 0.3;

        // 1. Sunlit Himalayan Glacial Peak (top right, 80-98% radiance)
        if (ny < 0.45 && nx > 0.45) {
          const peakDist = Math.hypot(nx - 0.75, ny - 0.2);
          if (peakDist < 0.35) {
            luma = 0.85 + 0.12 * Math.sin(nx * 40 + ny * 20);
          }
        }

        // 2. Deep Mountain Shadow Ravine (center left, 2-7% radiance!)
        if (ny > 0.25 && ny < 0.85 && nx > 0.1 && nx < 0.48) {
          const shadowDist = Math.hypot(nx - 0.28, ny - 0.55);
          if (shadowDist < 0.26) {
            // Fine internal shadow details (roads and tree canopy texture)
            const roadPattern =
              Math.abs(ny - (0.4 + nx * 0.4)) < 0.015 ? 0.04 : 0;
            const treeNoise = 0.015 * Math.sin(nx * 120) * Math.cos(ny * 120);
            luma = 0.03 + roadPattern + treeNoise; // 3% to 7% radiance
          }
        }

        // 3. Valley Floor Agriculture & River (bottom)
        if (ny >= 0.75) {
          luma = 0.25 + 0.08 * Math.sin(nx * 25);
          // Winding dark river
          if (Math.abs(ny - (0.85 + 0.08 * Math.sin(nx * 8))) < 0.03) {
            luma = 0.08;
          }
        }

        rawLuma[y * W + x] = Math.max(0, Math.min(1, luma));
      }
    }

    function renderRadiometricScene() {
      const levels = Math.pow(2, activeBits);
      activeLevels.textContent = `${levels.toLocaleString()} Quantization Levels (${activeBits}-bit)`;

      // Calculate metrics
      const stepPct = (100 / levels).toFixed(activeBits > 8 ? 4 : 2);
      quantStep.textContent = `${stepPct}% of Radiance`;

      if (activeBits === 1) {
        shadowLoss.textContent = "100% Clipped (Pure Black)";
        highlightLoss.textContent = "100% Saturated (Pure White)";
        shadowText.innerHTML =
          "<strong>1-bit Failure:</strong> The entire shadow region is clipped to pure 0 (black). All forestry paths, elevation contours, and canopy structures are permanently lost.";
      } else if (activeBits === 6) {
        shadowLoss.textContent = "45% Detail Loss (Severe Contouring)";
        highlightLoss.textContent = "12% Glacier Saturation";
        shadowText.innerHTML =
          "<strong>6-bit (Landsat MSS):</strong> Quantization noise creates false contour bands across the shadow. The forest path merges into flat shadow floor.";
      } else if (activeBits === 8) {
        shadowLoss.textContent = "8% Detail Loss in Deep Shadows";
        highlightLoss.textContent = "2% Highlight Clipping";
        shadowText.innerHTML =
          "<strong>8-bit (Landsat TM):</strong> Standard display depth. Shadow is visible, but faint canopy gradients and narrow mountain tracks remain noisy and compressed into ~8 DN levels.";
      } else if (activeBits === 12) {
        shadowLoss.textContent = "0% (Zero Shadow Clipping)";
        highlightLoss.textContent = "0% (Full Glacier Texture Preserved)";
        shadowText.innerHTML =
          "<strong>12-bit (Landsat OLI / Sentinel-2):</strong> 4,096 discrete levels allocate 250+ DN steps to the shadow zone alone. Mountain paths, rock strata, and dense canopy textures are fully resolved.";
      } else {
        shadowLoss.textContent = "0% (Super-Resolution Radiometry)";
        highlightLoss.textContent = "0% (Scientific Precision)";
        shadowText.innerHTML =
          "<strong>14-bit (WorldView-3 / MODIS):</strong> 16,384 levels provide laboratory-grade dynamic range, simultaneously measuring blinding snow albedo and 1% dark ocean reflections without saturation.";
      }

      // Render Scene Pixels
      const imgData = sCtx.createImageData(W, H);
      const data = imgData.data;
      const histBins = new Array(32).fill(0);

      for (let i = 0; i < rawLuma.length; i++) {
        const raw = rawLuma[i];
        // Quantize to bit depth
        const quant = Math.round(raw * (levels - 1)) / (levels - 1);
        const byteVal = Math.round(quant * 255);

        const p = i * 4;
        data[p] = byteVal;
        data[p + 1] = byteVal;
        data[p + 2] = byteVal;
        data[p + 3] = 255;

        // Histogram bin
        const binIdx = Math.min(31, Math.floor(quant * 32));
        histBins[binIdx]++;
      }

      sCtx.putImageData(imgData, 0, 0);

      // Draw Shadow Inspector Loupe Ring on canvas
      const loupeX = W * 0.28;
      const loupeY = H * 0.55;
      const loupeR = 50;

      sCtx.strokeStyle = "#38bdf8";
      sCtx.lineWidth = 2;
      sCtx.beginPath();
      sCtx.arc(loupeX, loupeY, loupeR, 0, Math.PI * 2);
      sCtx.stroke();

      // Crosshairs
      sCtx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      sCtx.moveTo(loupeX - loupeR - 10, loupeY);
      sCtx.lineTo(loupeX + loupeR + 10, loupeY);
      sCtx.moveTo(loupeX, loupeY - loupeR - 10);
      sCtx.lineTo(loupeX, loupeY + loupeR + 10);
      sCtx.stroke();

      sCtx.fillStyle = "#38bdf8";
      sCtx.font = '10px "JetBrains Mono", monospace';
      sCtx.fillText("Shadow Zone (5% Luma)", loupeX - 55, loupeY - loupeR - 6);

      // Render Histogram on histCanvas
      renderHistogram(histBins);
    }

    function renderHistogram(bins) {
      const hw = histCanvas.width;
      const hh = histCanvas.height;
      hCtx.clearRect(0, 0, hw, hh);

      const maxBin = Math.max(...bins, 1);
      const barW = (hw - 30) / bins.length;

      hCtx.fillStyle = "#38bdf8";
      for (let b = 0; b < bins.length; b++) {
        const barH = (bins[b] / maxBin) * (hh - 35);
        const bx = 15 + b * barW;
        const by = hh - 20 - barH;

        hCtx.fillRect(bx, by, barW - 1, barH);
      }

      // Baseline & Axis labels
      hCtx.strokeStyle = "rgba(255,255,255,0.2)";
      hCtx.lineWidth = 1;
      hCtx.beginPath();
      hCtx.moveTo(10, hh - 20);
      hCtx.lineTo(hw - 10, hh - 20);
      hCtx.stroke();

      hCtx.fillStyle = "#94a3b8";
      hCtx.font = '9px "JetBrains Mono", monospace';
      hCtx.fillText("DN: 0 (Shadow)", 12, hh - 6);
      hCtx.fillText(
        `DN: ${Math.pow(2, activeBits) - 1} (Glacier)`,
        hw - 110,
        hh - 6,
      );
    }

    bitBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        bitBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeBits = parseInt(btn.dataset.bits);
        renderRadiometricScene();
      });
    });

    renderRadiometricScene();
  })();

  // ================================================================
  // 4. MISSION REQUIREMENTS & 4-RESOLUTION TRADEOFF MATCHER
  // ================================================================
  (function () {
    const radarCanvas = document.getElementById("tradeoffRadarChart");
    if (!radarCanvas) return;

    const appBtns = document.querySelectorAll(".app-scenario-btn");
    const banner = document.getElementById("intel-app-title");
    const reqSpatial = document.getElementById("req-spatial");
    const reqTemporal = document.getElementById("req-temporal");
    const reqSpectral = document.getElementById("req-spectral");
    const reqRadiometric = document.getElementById("req-radiometric");
    const rationale = document.getElementById("intel-rationale-text");
    const sensorChipsWrap = document.getElementById("intel-sensor-chips");

    const appProfiles = {
      cyclone: {
        title: "🌪️ Real-Time Cyclone Tracking & Cloud Motion",
        radarValues: [2, 10, 4, 7], // [Spatial, Temporal, Spectral, Radiometric] out of 10
        spatial: "1 km – 4 km (Coarse is OK)",
        temporal: "15 – 30 Minutes (Critical!)",
        spectral: "Thermal IR (10.8\u03BCm) & Water Vapor (6.7\u03BCm)",
        radiometric: "10–12 bits (TIR Noise Equivalent \u0394T)",
        rationale:
          "<strong>The Engineering Physics:</strong> A tropical cyclone spans 500–1,000 km across. Sub-meter spatial resolution would generate terabytes of redundant pixels and take hours to downlink. Instead, geostationary orbit (36,000 km) provides continuous 15-minute scans to track eye progression and storm intensity in real time.",
        sensors: [
          "🛰️ INSAT-3D/3DR (ISRO)",
          "🛰️ GOES-16/18 (NOAA)",
          "🛰️ Meteosat-11 (EUMETSAT)",
        ],
      },
      urban: {
        title: "🏙️ Urban Cadastral Mapping & Property Boundary",
        radarValues: [10, 2, 3, 8],
        spatial: "\u2264 0.25 m – 0.5 m (Sub-meter Mandatory)",
        temporal: "30 – 90 Days (Low Priority)",
        spectral: "Panchromatic + 4-Band RGB/NIR",
        radiometric: "11–12 bits (Building Shadow Discrimination)",
        rationale:
          "<strong>The Engineering Physics:</strong> Property boundaries, cadastral tax maps, and road layouts require sub-meter precision to resolve walls and curb lines. Urban layouts change slowly, so long revisit intervals (months) are completely acceptable in exchange for maximum spatial resolving power.",
        sensors: [
          "🛰️ Cartosat-3 / 2S (ISRO)",
          "🛰️ WorldView-3/4 (Maxar)",
          "🛰️ Pl\u00E9iades Neo (Airbus)",
        ],
      },
      agri: {
        title: "🌾 Precision Agriculture & Crop Nitrogen Stress",
        radarValues: [7, 8, 8, 8],
        spatial: "5 m – 10 m (Individual Farm Plots)",
        temporal: "3 – 5 Days (Track Phenology Cycles)",
        spectral: "Red-Edge (705nm), NIR (842nm), SWIR (1610nm)",
        radiometric: "12 bits (Canopy Reflectance Contrast)",
        rationale:
          "<strong>The Engineering Physics:</strong> Crops grow and exhibit fertilizer/pest stress over weekly cycles. 10m spatial resolution resolves individual agricultural fields, while narrow Red-Edge bands quantify chlorophyll without saturation.",
        sensors: [
          "🛰️ Sentinel-2A/2B (ESA)",
          "🛰️ Resourcesat-2A LISS-IV (ISRO)",
          "🛰️ PlanetScope SuperDove",
        ],
      },
      ocean: {
        title: "🌊 Ocean Colour & Chlorophyll-a Phytoplankton",
        radarValues: [3, 9, 9, 10],
        spatial: "300 m – 1 km (Open Ocean Mesoscale)",
        temporal: "1 – 2 Days (Rapid Ocean Dynamics)",
        spectral: "16–21 Narrow Ocean Colour Bands (412–865 nm)",
        radiometric: "14 bits (High Signal-to-Noise Ratio SNR)",
        rationale:
          "<strong>The Engineering Physics:</strong> Water reflects less than 5% of incident sunlight, requiring ultra-high radiometric sensitivity (14-bit) with exceptional SNR to detect minute microgram variations of chlorophyll-a without sensor noise swamping the signal.",
        sensors: [
          "🛰️ Oceansat-3 / EOS-06 OCM (ISRO)",
          "🛰️ Sentinel-3 OLCI (ESA)",
          "🛰️ MODIS Aqua (NASA)",
        ],
      },
      wildfire: {
        title: "🔥 Wildfire Early Warning & Thermal Fronts",
        radarValues: [4, 9, 7, 9],
        spatial: "375 m – 1 km (Active Burn Fronts)",
        temporal: "Hourly to Daily (Rapid Fire Spread)",
        spectral: "Mid-Wave IR (3.9\u03BCm) & Long-Wave IR (11\u03BCm)",
        radiometric: "12–14 bits (High Saturation Temperature)",
        rationale:
          "<strong>The Engineering Physics:</strong> Flaming fires radiate predominantly in Mid-Wave Infrared (3.9\u03BCm according to Wien's Displacement Law). Fire detection sensors must have specialized detectors that don't saturate at 1,000 K while providing daily or sub-hourly flyovers.",
        sensors: [
          "🛰️ VIIRS (Suomi NPP / NOAA-20)",
          "🛰️ MODIS (Terra/Aqua)",
          "🛰️ INSAT-3D TIR",
        ],
      },
      mineral: {
        title: "⛏️ Geological Mineral Prospecting & Hydrothermal Alteration",
        radarValues: [6, 1, 10, 9],
        spatial: "15 m – 30 m (Rock Outcrops)",
        temporal: "Months to Years (Static Geology)",
        spectral: "200+ Contiguous SWIR Channels (Hyperspectral)",
        radiometric: "12–14 bits (Diagnostic Crystal Absorption)",
        rationale:
          "<strong>The Engineering Physics:</strong> Geological formations never move, so temporal revisit is irrelevant. However, discriminating alunite from kaolinite requires 200+ narrow 10nm spectral channels across the SWIR (2.0–2.4\u03BCm) region.",
        sensors: [
          "🛰️ AVIRIS-NG (ISRO/NASA)",
          "🛰️ EnMAP (DLR)",
          "🛰️ EMIT (NASA ISS)",
          "🛰️ Hyperion (EO-1)",
        ],
      },
    };

    const radarCtx = radarCanvas.getContext("2d");
    let tradeoffRadar = new Chart(radarCtx, {
      type: "radar",
      data: {
        labels: [
          "Spatial (Detail)",
          "Temporal (Revisit)",
          "Spectral (Bands)",
          "Radiometric (Bits)",
        ],
        datasets: [
          {
            label: "Mandatory Requirement",
            data: [2, 10, 4, 7],
            fill: true,
            backgroundColor: "rgba(245, 166, 35, 0.25)",
            borderColor: "#f5a623",
            pointBackgroundColor: "#f5a623",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#f5a623",
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: "rgba(255, 255, 255, 0.1)" },
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            pointLabels: {
              color: "#e2e8f0",
              font: { family: "Space Grotesk", size: 11, weight: "600" },
            },
            ticks: {
              display: false,
              min: 0,
              max: 10,
            },
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    function updateTradeoffView(appKey) {
      const prof = appProfiles[appKey];
      banner.textContent = prof.title;
      reqSpatial.textContent = prof.spatial;
      reqTemporal.textContent = prof.temporal;
      reqSpectral.textContent = prof.spectral;
      reqRadiometric.textContent = prof.radiometric;
      rationale.innerHTML = prof.rationale;

      sensorChipsWrap.innerHTML = prof.sensors
        .map((s) => `<span class="sensor-chip">${s}</span>`)
        .join("");

      tradeoffRadar.data.datasets[0].data = prof.radarValues;
      tradeoffRadar.update();
    }

    appBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        appBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateTradeoffView(btn.dataset.app);
      });
    });

    updateTradeoffView("cyclone");
  })();

  return () => {
    document.querySelectorAll("canvas").forEach((canvas) => {
      const chart = Chart.getChart(canvas);
      if (chart) chart.destroy();
    });
  };
}
