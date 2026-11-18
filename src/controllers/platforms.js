/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountPlatforms() {
  (function () {
    const canvas = document.getElementById("orbit-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let currentMode = "leo"; // 'leo' | 'geo' | 'compare'
    let isPaused = false;
    let speedMultiplier = 1;
    let showSwath = true;

    let earthRotation = 0;
    let satAngleLEO = 0;
    let satAngleGEO = 0;
    let swathTracks = []; // Historical swath footprints on the rotating globe

    // Telemetry HUD elements
    const hudType = document.getElementById("hud-orbit-type");
    const hudAlt = document.getElementById("hud-alt");
    const hudSpeed = document.getElementById("hud-speed");
    const hudGroundSpeed = document.getElementById("hud-ground-speed");
    const hudPeriod = document.getElementById("hud-period");
    const orbitTitle = document.getElementById("orbit-title");
    const orbitDesc = document.getElementById("orbit-desc");
    const orbitStats = document.getElementById("orbit-stats");

    const orbitMeta = {
      leo: {
        type: "Polar Sun-Sync (LEO)",
        alt: "705 km",
        speed: "7.5 km/s (27,000 km/h)",
        groundSpeed: "6.8 km/s (Rapid Scanning)",
        period: "98.8 min (~14.5 orbits/day)",
        title: "Polar / Sun-Synchronous Orbit (LEO)",
        desc: "The satellite orbits north-south at 700–800 km altitude while Earth rotates beneath it (west-to-east). Because the Earth turns continuously, each polar pass cuts across a new strip of longitude. It crosses the equator at ~10:30 AM local solar time every orbit, ensuring consistent sun illumination shadows across the globe.",
        stats: [
          { label: "Altitude", val: "700–800 km" },
          { label: "Orbital Period", val: "~90–100 min" },
          { label: "Inclination", val: "~98.2° – 98.7°" },
          {
            label: "Primary Missions",
            val: "Sentinel-2, Landsat, Resourcesat",
          },
        ],
      },
      geo: {
        type: "Geostationary (GEO)",
        alt: "35,786 km",
        speed: "3.07 km/s (11,000 km/h)",
        groundSpeed: "0.0 km/h (Fixed Sub-Satellite Point)",
        period: "23h 56m 04s (Exact 1:1 with Earth)",
        title: "Geostationary Orbit (GEO)",
        desc: "Positioned ~35,786 km directly over the Equator (0° inclination), the satellite circles Earth in the exact same direction and time it takes the planet to spin once (24 hours). To an observer on the ground, the satellite appears permanently fixed in the sky, providing non-stop weather and atmospheric scans over ~42% of the globe.",
        stats: [
          { label: "Altitude", val: "35,786 km" },
          { label: "Orbital Period", val: "24 hours" },
          { label: "Inclination", val: "0.0° (Equatorial)" },
          { label: "Primary Missions", val: "INSAT-3D, GOES-16, Meteosat" },
        ],
      },
      compare: {
        type: "Scale Comparison (LEO vs GEO)",
        alt: "700 km vs 35,786 km",
        speed: "LEO: 7.5 km/s | GEO: 3.1 km/s",
        groundSpeed: "LEO: Moving | GEO: Fixed",
        period: "LEO: 1.5 hr | GEO: 24.0 hr",
        title: "Orbital Scale & Keplerian Trade-Off",
        desc: "Kepler's Third Law dictates that orbital speed decreases and orbital period lengthens with altitude. Notice how close and fast the Polar LEO satellite is (whipping around Earth every 90 minutes) compared to the distant Geostationary satellite parked 35,786 km away matching Earth's 24-hour spin.",
        stats: [
          { label: "LEO Distance", val: "1.11 Earth Radii" },
          { label: "GEO Distance", val: "6.61 Earth Radii" },
          { label: "Speed Ratio", val: "LEO travels 2.4× faster" },
          { label: "Period Ratio", val: "1 GEO orbit = 16 LEO orbits" },
        ],
      },
    };

    function updateHUD() {
      const m = orbitMeta[currentMode];
      if (!m) return;
      hudType.textContent = m.type;
      hudAlt.textContent = m.alt;
      hudSpeed.textContent = m.speed;
      hudGroundSpeed.textContent = m.groundSpeed;
      hudPeriod.textContent = m.period;
      orbitTitle.textContent = m.title;
      orbitDesc.textContent = m.desc;
      orbitStats.innerHTML = m.stats
        .map(
          (s) => `
        <div class="orbit-stat">
          <span class="label">${s.label}</span>
          <span class="val">${s.val}</span>
        </div>
      `,
        )
        .join("");
    }

    function resizeCanvas() {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Draw 3D Earth Globe with Shading and Continents
    function drawEarth(cx, cy, radius, rotAngle) {
      ctx.save();
      ctx.translate(cx, cy);

      // Axial tilt rotation (23.4 degrees)
      const tilt = -23.4 * (Math.PI / 180);
      ctx.rotate(tilt);

      // Deep space atmosphere glow rim
      const atmGlow = ctx.createRadialGradient(
        0,
        0,
        radius * 0.92,
        0,
        0,
        radius * 1.15,
      );
      atmGlow.addColorStop(0, "rgba(56, 189, 248, 0.35)");
      atmGlow.addColorStop(0.5, "rgba(45, 212, 191, 0.15)");
      atmGlow.addColorStop(1, "rgba(45, 212, 191, 0)");
      ctx.fillStyle = atmGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Ocean sphere with spherical gradient
      const oceanGrad = ctx.createRadialGradient(
        -radius * 0.35,
        -radius * 0.35,
        radius * 0.1,
        0,
        0,
        radius,
      );
      oceanGrad.addColorStop(0, "#1d4ed8");
      oceanGrad.addColorStop(0.6, "#1e3a8a");
      oceanGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Clip to globe for surface features
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      // Continental shapes wrapping around globe as Earth rotates
      ctx.fillStyle = "#22c55e";
      const landmasses = [
        { lon: 0, lat: 20, w: 50, h: 35 }, // Africa/Europe
        { lon: 80, lat: 22, w: 45, h: 40 }, // Asia / India
        { lon: 135, lat: -25, w: 30, h: 25 }, // Australia
        { lon: 260, lat: 40, w: 50, h: 30 }, // N. America
        { lon: 290, lat: -15, w: 35, h: 45 }, // S. America
      ];

      landmasses.forEach((land) => {
        // Calculate projected longitude
        let currentLon = (land.lon + (rotAngle * 180) / Math.PI) % 360;
        if (currentLon < 0) currentLon += 360;

        // Project onto sphere if on visible front hemisphere (90 to 270 deg relative)
        if (currentLon > 90 && currentLon < 270) {
          const radX = (currentLon - 180) / 90; // -1 to +1
          const px = radX * radius * 0.88;
          const py = -(land.lat / 90) * radius * 0.75;
          const sizeX =
            (land.w / 180) * radius * Math.cos(radX * Math.PI * 0.5);
          const sizeY = (land.h / 180) * radius;

          if (sizeX > 1) {
            ctx.beginPath();
            ctx.ellipse(px, py, Math.abs(sizeX), sizeY, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Latitude parallels & Equator line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      [-45, -20, 0, 20, 45].forEach((lat) => {
        const y = -(lat / 90) * radius * 0.8;
        const w = Math.sqrt(Math.max(0, radius * radius - y * y));
        ctx.beginPath();
        if (lat === 0) {
          ctx.strokeStyle = "rgba(245, 166, 35, 0.4)";
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1;
        }
        ctx.ellipse(0, y, w, w * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Polar rotation axis line
      ctx.strokeStyle = "rgba(245, 166, 35, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, -radius * 1.3);
      ctx.lineTo(0, radius * 1.3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Day/Night Terminator shadow
      const shadowGrad = ctx.createLinearGradient(-radius, 0, radius, 0);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadowGrad.addColorStop(0.55, "rgba(0, 0, 0, 0.2)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.7)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      ctx.restore(); // Restore clip

      // Labels for Poles & Equator
      ctx.font = "9px JetBrains Mono";
      ctx.fillStyle = "#f5a623";
      ctx.fillText("N. POLE", -18, -radius * 1.35);
      ctx.fillText("S. POLE", -18, radius * 1.45);

      ctx.restore(); // Restore tilt
    }

    // Draw Satellite Graphic
    function drawSatellite(x, y, headingAngle, color, size = 10) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(headingAngle);

      // Solar panels (blue arrays)
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(-size * 1.6, -size * 0.35, size * 0.9, size * 0.7);
      ctx.fillRect(size * 0.7, -size * 0.35, size * 0.9, size * 0.7);

      // Satellite body (gold/foil core)
      ctx.fillStyle = color;
      ctx.fillRect(-size * 0.5, -size * 0.5, size, size);

      // Sensor optics aperture
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function renderScene() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Stars background
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      const starCoords = [
        [0.1, 0.2],
        [0.25, 0.75],
        [0.85, 0.15],
        [0.75, 0.85],
        [0.92, 0.6],
        [0.08, 0.85],
        [0.4, 0.1],
        [0.65, 0.25],
      ];
      starCoords.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx * W, sy * H, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      const cx = W / 2;
      const cy = H / 2;

      if (currentMode === "leo") {
        // POLAR SUN-SYNCHRONOUS ORBIT
        const earthR = Math.min(W, H) * 0.28;
        const orbitRx = earthR * 0.42; // Inclined ellipse semi-minor
        const orbitRy = earthR * 1.26; // Near-pole semi-major (altitude ~705 km)

        // Draw Earth at center
        drawEarth(cx, cy, earthR, earthRotation);

        // Draw Polar Orbit Ellipse
        ctx.strokeStyle = "rgba(245, 166, 35, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          orbitRx,
          orbitRy,
          -10 * (Math.PI / 180),
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite position along Polar ellipse
        const satTilt = -10 * (Math.PI / 180);
        const satX_unrot = orbitRx * Math.sin(satAngleLEO);
        const satY_unrot = -orbitRy * Math.cos(satAngleLEO);
        const satX =
          cx + satX_unrot * Math.cos(satTilt) - satY_unrot * Math.sin(satTilt);
        const satY =
          cy + satX_unrot * Math.sin(satTilt) + satY_unrot * Math.cos(satTilt);

        // Swath cone from satellite to ground
        if (showSwath) {
          // Point on surface underneath satellite
          const distFromCenter = Math.hypot(satX - cx, satY - cy);
          const subSatX = cx + (satX - cx) * (earthR / distFromCenter);
          const subSatY = cy + (satY - cy) * (earthR / distFromCenter);

          // Cone gradient
          const coneGrad = ctx.createRadialGradient(
            satX,
            satY,
            5,
            subSatX,
            subSatY,
            earthR * 0.28,
          );
          coneGrad.addColorStop(0, "rgba(245, 166, 35, 0.7)");
          coneGrad.addColorStop(1, "rgba(245, 166, 35, 0.05)");

          ctx.fillStyle = coneGrad;
          ctx.beginPath();
          ctx.moveTo(satX, satY);
          ctx.lineTo(subSatX - 22, subSatY);
          ctx.lineTo(subSatX + 22, subSatY);
          ctx.closePath();
          ctx.fill();

          // Swath ground footprint ellipse
          ctx.strokeStyle = "#f5a623";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(subSatX, subSatY, 20, 8, satTilt, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Satellite
        const satHeading = Math.atan2(satY - cy, satX - cx) + Math.PI / 2;
        drawSatellite(satX, satY, satHeading, "#f5a623", 8);
      } else if (currentMode === "geo") {
        // GEOSTATIONARY ORBIT
        const earthR = Math.min(W, H) * 0.16;
        const geoR = earthR * 2.5; // Scaled geostationary distance

        // Draw Earth
        drawEarth(cx, cy, earthR, earthRotation);

        // Equatorial Orbit Circle
        ctx.strokeStyle = "rgba(45, 212, 191, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, geoR, geoR * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite position: synchronous with Earth rotation
        const geoX = cx + geoR * Math.cos(earthRotation);
        const geoY = cy + geoR * 0.35 * Math.sin(earthRotation);

        // Fixed Field of View Cone to Earth disk
        if (showSwath) {
          const geoCone = ctx.createRadialGradient(
            geoX,
            geoY,
            10,
            cx,
            cy,
            earthR,
          );
          geoCone.addColorStop(0, "rgba(45, 212, 191, 0.6)");
          geoCone.addColorStop(1, "rgba(45, 212, 191, 0.08)");
          ctx.fillStyle = geoCone;
          ctx.beginPath();
          ctx.moveTo(geoX, geoY);
          ctx.lineTo(cx - earthR * 0.85, cy);
          ctx.lineTo(cx + earthR * 0.85, cy);
          ctx.closePath();
          ctx.fill();
        }

        // Draw GEO Satellite
        drawSatellite(geoX, geoY, earthRotation + Math.PI / 2, "#2dd4bf", 9);
      } else if (currentMode === "compare") {
        // SIDE-BY-SIDE SCALE COMPARISON
        const earthR = Math.min(W, H) * 0.12;
        const leoR_x = earthR * 1.35;
        const leoR_y = earthR * 1.45;
        const geoR_x = earthR * 3.4;
        const geoR_y = earthR * 1.2;

        drawEarth(cx, cy, earthR, earthRotation);

        // LEO Orbit (close, amber)
        ctx.strokeStyle = "rgba(245, 166, 35, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          leoR_x,
          leoR_y,
          -10 * (Math.PI / 180),
          0,
          Math.PI * 2,
        );
        ctx.stroke();

        // GEO Orbit (far, teal)
        ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, geoR_x, geoR_y, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // LEO Satellite
        const lx = cx + leoR_x * Math.sin(satAngleLEO);
        const ly = cy - leoR_y * Math.cos(satAngleLEO);
        drawSatellite(lx, ly, satAngleLEO, "#f5a623", 6);

        // GEO Satellite
        const gx = cx + geoR_x * Math.cos(earthRotation);
        const gy = cy + geoR_y * Math.sin(earthRotation);
        drawSatellite(gx, gy, earthRotation + Math.PI / 2, "#2dd4bf", 8);

        // Labels
        ctx.font = "10px JetBrains Mono";
        ctx.fillStyle = "#f5a623";
        ctx.fillText("LEO: 705 km (90 min)", lx + 8, ly - 6);
        ctx.fillStyle = "#2dd4bf";
        ctx.fillText("GEO: 35,786 km (24 hr)", gx + 8, gy - 6);
      }

      // Animation increments
      if (!isPaused) {
        const dt = 0.012 * speedMultiplier;
        earthRotation += dt * 0.4; // Earth spins west-to-east
        satAngleLEO += dt * 2.8; // LEO satellite moves rapidly pole-to-pole
      }

      requestAnimationFrame(renderScene);
    }

    // Mode Buttons
    document.querySelectorAll(".orbit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".orbit-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.orbit;
        updateHUD();
      });
    });

    // Swath Toggle
    const swathBtn = document.getElementById("btn-swath-toggle");
    if (swathBtn) {
      swathBtn.addEventListener("click", () => {
        showSwath = !showSwath;
        swathBtn.textContent = `Swath: ${showSwath ? "ON" : "OFF"}`;
        swathBtn.classList.toggle("active", showSwath);
      });
    }

    // Speed Cycle
    const speedBtn = document.getElementById("btn-speed-toggle");
    if (speedBtn) {
      const speeds = [1, 2, 4];
      let sIdx = 0;
      speedBtn.addEventListener("click", () => {
        sIdx = (sIdx + 1) % speeds.length;
        speedMultiplier = speeds[sIdx];
        speedBtn.textContent = `Speed: ${speedMultiplier}x`;
      });
    }

    // Pause / Resume
    const pauseBtn = document.getElementById("btn-pause-toggle");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "▶ Play" : "⏸ Pause";
        pauseBtn.classList.toggle("active", isPaused);
      });
    }

    updateHUD();
    requestAnimationFrame(renderScene);
  })();

  // Active Canvas Scanners Engine (Whisk-Broom vs Push-Broom)
  (function () {
    const whiskCanvas = document.getElementById("canvas-whisk");
    const pushCanvas = document.getElementById("canvas-push");
    if (!whiskCanvas || !pushCanvas) return;

    function initScannerCanvas(c) {
      c.width = c.clientWidth * window.devicePixelRatio;
      c.height = c.clientHeight * window.devicePixelRatio;
    }
    initScannerCanvas(whiskCanvas);
    initScannerCanvas(pushCanvas);

    let whiskPhase = 0;
    let flightY = 0;

    function renderScanners() {
      // 1. WHISK BROOM (Oscillating Mirror)
      const wCtx = whiskCanvas.getContext("2d");
      const wW = whiskCanvas.width,
        wH = whiskCanvas.height;
      wCtx.clearRect(0, 0, wW, wH);

      // Ground swath track
      const satX = wW / 2;
      const satY = 24;

      // Moving ground lines (simulating satellite forward flight)
      wCtx.strokeStyle = "rgba(120, 160, 255, 0.08)";
      wCtx.lineWidth = 1;
      for (let y = flightY % 24; y < wH; y += 24) {
        wCtx.beginPath();
        wCtx.moveTo(wW * 0.15, y);
        wCtx.lineTo(wW * 0.85, y);
        wCtx.stroke();
      }

      // Oscillating mirror angle sweep (side to side)
      const sweepX = satX + Math.sin(whiskPhase) * (wW * 0.32);
      const groundY = wH - 20;

      // Laser/mirror detector beam
      const beamGrad = wCtx.createLinearGradient(satX, satY, sweepX, groundY);
      beamGrad.addColorStop(0, "rgba(245, 166, 35, 0.9)");
      beamGrad.addColorStop(1, "rgba(245, 166, 35, 0.2)");
      wCtx.strokeStyle = beamGrad;
      wCtx.lineWidth = 2.5;
      wCtx.beginPath();
      wCtx.moveTo(satX, satY);
      wCtx.lineTo(sweepX, groundY);
      wCtx.stroke();

      // Spot on ground
      wCtx.fillStyle = "#f5a623";
      wCtx.beginPath();
      wCtx.arc(sweepX, groundY, 4.5, 0, Math.PI * 2);
      wCtx.fill();

      // Satellite body + oscillating mirror
      wCtx.fillStyle = "#e6ebf5";
      wCtx.fillRect(satX - 16, satY - 8, 32, 14);
      wCtx.fillStyle = "#f5a623";
      wCtx.save();
      wCtx.translate(satX, satY);
      wCtx.rotate(Math.sin(whiskPhase) * 0.4);
      wCtx.fillRect(-6, -2, 12, 4);
      wCtx.restore();

      // 2. PUSH BROOM (Linear CCD Array)
      const pCtx = pushCanvas.getContext("2d");
      const pW = pushCanvas.width,
        pH = pushCanvas.height;
      pCtx.clearRect(0, 0, pW, pH);

      // Parallel curtain of rays exposing simultaneously
      const pSatX = pW / 2;
      const pSatY = 24;
      const arrayWidth = pW * 0.65;
      const leftX = pSatX - arrayWidth / 2;
      const rightX = pSatX + arrayWidth / 2;
      const pGroundY = pH - 20;

      // Moving ground lines
      pCtx.strokeStyle = "rgba(120, 160, 255, 0.08)";
      pCtx.lineWidth = 1;
      for (let y = flightY % 24; y < pH; y += 24) {
        pCtx.beginPath();
        pCtx.moveTo(pW * 0.15, y);
        pCtx.lineTo(pW * 0.85, y);
        pCtx.stroke();
      }

      // Curtain of parallel beams
      const curtainGrad = pCtx.createLinearGradient(
        pSatX,
        pSatY,
        pSatX,
        pGroundY,
      );
      curtainGrad.addColorStop(0, "rgba(45, 212, 191, 0.7)");
      curtainGrad.addColorStop(1, "rgba(45, 212, 191, 0.12)");
      pCtx.fillStyle = curtainGrad;
      pCtx.beginPath();
      pCtx.moveTo(leftX, pSatY);
      pCtx.lineTo(rightX, pSatY);
      pCtx.lineTo(rightX + 15, pGroundY);
      pCtx.lineTo(leftX - 15, pGroundY);
      pCtx.closePath();
      pCtx.fill();

      // Ground scanned line (all pixels simultaneous)
      pCtx.strokeStyle = "#2dd4bf";
      pCtx.lineWidth = 3;
      pCtx.beginPath();
      pCtx.moveTo(leftX - 15, pGroundY);
      pCtx.lineTo(rightX + 15, pGroundY);
      pCtx.stroke();

      // Satellite with CCD array bar
      pCtx.fillStyle = "#e6ebf5";
      pCtx.fillRect(pSatX - 25, pSatY - 8, 50, 14);
      pCtx.fillStyle = "#2dd4bf";
      pCtx.fillRect(leftX, pSatY + 2, arrayWidth, 4);

      whiskPhase += 0.06;
      flightY += 0.8;

      requestAnimationFrame(renderScanners);
    }

    requestAnimationFrame(renderScanners);
  })();
}
