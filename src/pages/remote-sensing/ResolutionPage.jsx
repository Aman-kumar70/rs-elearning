import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountResolution } from "@/controllers/resolution";

export default function ResolutionPage() {
  usePageTitle("The Four Resolutions — RS.4");
  useLegacyPage(mountResolution);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.4 of 6</div>
          <h1>
            The Four <span>Resolutions</span>
          </h1>
          <p className="hero-intro">
            "Resolution" isn't one number — it's four independent trade-offs
            (spatial, spectral, radiometric, temporal), and no satellite
            maximizes all four at once. Choosing the right data for a job means
            knowing which resolution actually matters for your question.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="now" />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">04.1 / The Four Types</div>
          <h2 className="section-title">What each resolution actually means</h2>
          <div className="resolution-grid">
            <div className="res-card spatial">
              <div
                className="res-icon"
                style={{
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                🔍
              </div>
              <h3>Spatial Resolution</h3>
              <p>
                The ground area one pixel covers. "How much detail can I see?" A
                1m pixel shows individual buildings; a 1km pixel shows only
                broad patterns. Defined by IFOV — the solid angle a detector is
                sensitive to.
              </p>
              <div className="res-examples">
                <span className="res-example">Cartosat-3: 0.25m</span>
                <span className="res-example">IKONOS: 1m</span>
                <span className="res-example">IRS PAN: 5.8m</span>
                <span className="res-example">Landsat: 30m</span>
                <span className="res-example">MODIS: 250m-1km</span>
              </div>
            </div>
            <div className="res-card spectral">
              <div
                className="res-icon"
                style={{ background: "var(--teal-dim)", color: "var(--teal)" }}
              >
                🌈
              </div>
              <h3>Spectral Resolution</h3>
              <p>
                The width and number of wavelength bands a sensor detects. "How
                many colours can I see?" Narrower bands = higher spectral
                resolution. Panchromatic = 1 broad band; hyperspectral =
                hundreds of narrow ones.
              </p>
              <div className="res-examples">
                <span className="res-example">Landsat ETM+: 6 bands</span>
                <span className="res-example">EO-1 ALI: 9 bands</span>
                <span className="res-example">Hyperion: 150 bands</span>
                <span className="res-example">Sentinel-2: 13 bands</span>
              </div>
            </div>
            <div className="res-card radiometric">
              <div
                className="res-icon"
                style={{ background: "var(--blue-dim)", color: "var(--blue)" }}
              >
                📊
              </div>
              <h3>Radiometric Resolution</h3>
              <p>
                Ability to discriminate small energy differences. "How many
                shades of gray?" Measured in bits — each bit doubles the grey
                levels. Higher bits = smoother gradients, more shadow detail.
              </p>
              <div className="res-examples">
                <span className="res-example">Landsat MSS: 6-bit (64)</span>
                <span className="res-example">Landsat TM: 8-bit (256)</span>
                <span className="res-example">Landsat OLI: 12-bit (4096)</span>
                <span className="res-example">IKONOS: 11-bit (2048)</span>
              </div>
            </div>
            <div className="res-card temporal">
              <div
                className="res-icon"
                style={{
                  background: "var(--purple-dim)",
                  color: "var(--purple)",
                }}
              >
                ⏱️
              </div>
              <h3>Temporal Resolution</h3>
              <p>
                How often a satellite revisits the same area. "How often can I
                see changes?" Depends on orbit, swath width, and latitude.
                Weather needs hourly; vegetation monitoring can use weeks.
              </p>
              <div className="res-examples">
                <span className="res-example">GOES/INSAT: Hourly</span>
                <span className="res-example">MODIS: 1-2 days</span>
                <span className="res-example">Sentinel-2: 5 days</span>
                <span className="res-example">Landsat: 16 days</span>
              </div>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">The IFOV Formula</div>
            <p>
              Spatial resolution is defined by the{" "}
              <strong>Instantaneous Field of View (IFOV)</strong>: β = a/f
              (radians), where <strong>a</strong> is detector dimension and{" "}
              <strong>f</strong> is focal length. The{" "}
              <strong>Instantaneous Ground Field of View (IGFOV)</strong> = IFOV
              × h, where <strong>h</strong> is flying height. To get finer
              spatial resolution: smaller detector, longer focal length, or
              lower orbit.
            </p>
          </div>
          {/* INTERACTIVE IFOV & OPTICAL GEOMETRY LAB */}
          <div className="ifov-lab-card">
            <div className="ifov-lab-header">
              <div>
                <div className="lab-pill">ISRO IIRS Optics Lab</div>
                <h3
                  style={{
                    margin: "4px 0 6px 0",
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                >
                  Interactive IFOV &amp; Ground Pixel Projector
                </h3>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  Explore the optical geometry: Instantaneous Field of View (β =
                  a/f) and Ground Resolution Element (IGFOV = β × H). Adjust
                  altitude, focal length, and detector size in real time.
                </p>
              </div>
            </div>
            {/* Platform Presets */}
            <div className="ifov-preset-row">
              <span className="ifov-preset-label">Sensor Presets:</span>
              <div className="ifov-preset-chips">
                <button
                  className="ifov-chip active"
                  data-h={505}
                  data-f={4000}
                  data-a={2}
                  data-name="Cartosat-3 (High-Res LEO)"
                >
                  🛰️ Cartosat-3 (0.25m)
                </button>
                <button
                  className="ifov-chip"
                  data-h={786}
                  data-f={590}
                  data-a="7.5"
                  data-name="Sentinel-2 MSI (LEO)"
                >
                  🛰️ Sentinel-2 (10m)
                </button>
                <button
                  className="ifov-chip"
                  data-h={705}
                  data-f={640}
                  data-a="27.2"
                  data-name="Landsat-8/9 OLI (LEO)"
                >
                  🛰️ Landsat-8/9 (30m)
                </button>
                <button
                  className="ifov-chip"
                  data-h="2.5"
                  data-f={150}
                  data-a={6}
                  data-name="Aerial Survey Aircraft"
                >
                  ✈️ Aerial Survey (10cm)
                </button>
                <button
                  className="ifov-chip"
                  data-h="0.12"
                  data-f={24}
                  data-a="3.2"
                  data-name="Survey Drone / UAV"
                >
                  🚁 Drone / UAV (1.6cm)
                </button>
                <button
                  className="ifov-chip"
                  data-h={35786}
                  data-f={800}
                  data-a="22.4"
                  data-name="INSAT-3D / GOES (Geostationary)"
                >
                  🌐 INSAT-3D (1km)
                </button>
              </div>
            </div>
            <div className="ifov-layout">
              {/* Left: Interactive Ray Tracing Canvas */}
              <div className="ifov-canvas-box">
                <canvas id="ifov-canvas" width={560} height={380} />
                <div className="ifov-canvas-badge" id="ifov-canvas-badge">
                  LEO Satellite · 505 km Altitude
                </div>
              </div>
              {/* Right: Sliders & Live Physics Telemetry */}
              <div className="ifov-controls-box">
                <div className="ifov-slider-group">
                  <div className="ifov-slider-header">
                    <span>
                      Flying Height / Altitude (
                      <span className="mono-amber">H</span>)
                    </span>
                    <span className="ifov-val-badge" id="val-ifov-h">
                      505 km
                    </span>
                  </div>
                  <input
                    type="range"
                    id="slider-ifov-h"
                    min="0.05"
                    max={1000}
                    step="0.05"
                    defaultValue={505}
                  />
                  <div className="ifov-range-hints">
                    <span>Drone (50m)</span>
                    <span>Air (2.5km)</span>
                    <span>LEO (705km)</span>
                  </div>
                </div>
                <div className="ifov-slider-group">
                  <div className="ifov-slider-header">
                    <span>
                      Focal Length (<span className="mono-teal">f</span>)
                    </span>
                    <span className="ifov-val-badge" id="val-ifov-f">
                      4000 mm (4.0 m)
                    </span>
                  </div>
                  <input
                    type="range"
                    id="slider-ifov-f"
                    min={10}
                    max={5000}
                    step={10}
                    defaultValue={4000}
                  />
                  <div className="ifov-range-hints">
                    <span>Wide (24mm)</span>
                    <span>Medium (600mm)</span>
                    <span>Telescope (4000mm)</span>
                  </div>
                </div>
                <div className="ifov-slider-group">
                  <div className="ifov-slider-header">
                    <span>
                      Detector Element Size (
                      <span className="mono-purple">a</span>)
                    </span>
                    <span className="ifov-val-badge" id="val-ifov-a">
                      2.0 μm
                    </span>
                  </div>
                  <input
                    type="range"
                    id="slider-ifov-a"
                    min={1}
                    max={50}
                    step="0.5"
                    defaultValue={2.0}
                  />
                  <div className="ifov-range-hints">
                    <span>1.5 μm (CCD)</span>
                    <span>10 μm (CMOS)</span>
                    <span>30 μm (TIR)</span>
                  </div>
                </div>
                {/* Live Math & Footprint Box */}
                <div className="ifov-math-card">
                  <div className="ifov-calc-grid">
                    <div className="ifov-calc-item">
                      <span className="ci-lbl">Angular IFOV (β = a / f)</span>
                      <span className="ci-val mono-teal" id="calc-ifov-rad">
                        0.50 μrad (0.103 arcsec)
                      </span>
                    </div>
                    <div className="ifov-calc-item">
                      <span className="ci-lbl">
                        Ground Resolution (IGFOV = β × H)
                      </span>
                      <span className="ci-val mono-amber" id="calc-ifov-igfov">
                        0.25 m (25.3 cm / pixel)
                      </span>
                    </div>
                  </div>
                  <div className="ifov-resolvable-box">
                    <span className="res-target-icon" id="res-target-icon">
                      🚗
                    </span>
                    <div className="res-target-desc" id="res-target-desc">
                      <strong>Resolvable Targets:</strong> At 25 cm/pixel, you
                      can clearly distinguish individual cars, building roof
                      structures, road centerlines, and large trees.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Think of IFOV like the beam of a flashlight pointed at the
                ground from an airplane. A narrower beam (smaller detector, or a
                zoomed-in lens) lights up a smaller, more detailed patch of
                ground — that patch is your pixel. Fly higher, and even a narrow
                beam spreads out to cover more ground, so your pixel gets bigger
                and blurrier. That's the whole trade-off in one sentence:{" "}
                <strong>
                  closer or more zoomed-in = smaller, sharper pixels; farther
                  away = bigger, blurrier pixels.
                </strong>
              </p>
            </div>
          </div>
          {/* AUTHENTIC IFOV OPTICAL GEOMETRY DIAGRAM */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/resolution/res-ifov-diagram.jpg"
                alt="Instantaneous Field of View IFOV optical geometry diagram from IIRS lecture"
              />
            </div>
            <figcaption>
              <strong>
                Sensor Optics: The Instantaneous Field of View (IFOV) Geometry.
              </strong>
              The geometric projection of a single detector element through the
              focal optics: Angular IFOV is determined strictly by detector
              pitch <em>a</em> and focal length <em>f</em> (β = a / f). The
              ground resolution cell dimension <em>D</em> (or IGFOV) expands
              linearly with platform altitude <em>H</em> (D = β × H).
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Fundamentals of Remote Sensing"
              </span>
            </figcaption>
          </div>
          {/* INTERACTIVE SPATIAL RESOLUTION: JUXTAPOSE BEFORE/AFTER SLIDER */}
          <div className="spatial-juxtapose-card">
            <div className="juxtapose-header">
              <div>
                <h3>
                  Interactive Spatial Resolution: "Before &amp; After" Slider
                </h3>
                <p>
                  Drag the slider divider horizontally across the same city
                  landscape to see how detail degrades as pixel size increases
                  from 10m (Sentinel-2) to 30m (Landsat) and 250m (MODIS).
                </p>
              </div>
            </div>
            {/* Satellite Pair Selector */}
            <div className="juxtapose-pair-selector">
              <button
                type="button"
                className="jux-btn active"
                data-pair="s2-l8"
              >
                Sentinel-2 (10m) vs Landsat-8/9 (30m)
              </button>
              <button type="button" className="jux-btn" data-pair="l8-modis">
                Landsat-8/9 (30m) vs MODIS (250m)
              </button>
              <button type="button" className="jux-btn" data-pair="carto-s2">
                Cartosat-3 (1m) vs Sentinel-2 (10m)
              </button>
            </div>
            {/* Juxtapose Viewport */}
            <div className="juxtapose-viewport" id="juxtapose-viewport">
              {/* Base Canvas (Right side / Coarser) */}
              <canvas id="jux-canvas-base" className="juxtapose-canvas-base" />
              {/* Overlay Wrap (Left side / Finer) with clipping */}
              <div className="juxtapose-overlay-wrap" id="jux-overlay-wrap">
                <canvas
                  id="jux-canvas-overlay"
                  className="juxtapose-canvas-overlay"
                />
                <div className="juxtapose-handle" id="jux-handle">
                  ❮❯
                </div>
              </div>
              {/* Live Floating Badges */}
              <div className="jux-badge left" id="jux-badge-left">
                10m · Sentinel-2 MSI
              </div>
              <div className="jux-badge right" id="jux-badge-right">
                30m · Landsat-8/9 OLI
              </div>
            </div>
            {/* Live Telemetry Readout */}
            <div className="juxtapose-telemetry">
              <div className="jux-stat-card left">
                <div className="j-label" id="jux-meta-left-lbl">
                  Left Sensor (Finer)
                </div>
                <div className="j-val" id="jux-meta-left-val">
                  10m / pixel · 100 m²
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-dim)",
                    marginTop: 4,
                  }}
                  id="jux-meta-left-desc"
                >
                  Shows individual city streets, buildings, and field
                  boundaries.
                </div>
              </div>
              <div className="jux-stat-card right">
                <div className="j-label" id="jux-meta-right-lbl">
                  Right Sensor (Coarser)
                </div>
                <div className="j-val" id="jux-meta-right-val">
                  30m / pixel · 900 m² (9× area)
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-dim)",
                    marginTop: 4,
                  }}
                  id="jux-meta-right-desc"
                >
                  Urban streets blend into single mixed pixels; only large
                  avenues and fields resolve.
                </div>
              </div>
            </div>
          </div>
          {/* AUTHENTIC ISRO RESOLUTION STEP-LADDER GALLERY */}
          <div className="res-ladder-wrap">
            <div className="res-ladder-header">
              <div className="lab-pill">ISRO Operational Missions</div>
              <h3>
                The Spatial Resolution Ladder: Real Earth Observation
                Step-by-Step
              </h3>
              <p>
                Synthetic blur tests simulate resolution in software, but
                operational satellite payloads reveal true optical physics.
                Below is the exact same geographic scene captured across ISRO's
                operational sensor hierarchy — from regional synoptic monitoring
                down to sub-meter cadastral surveillance.
              </p>
            </div>
            <div className="res-ladder-grid">
              {/* 1. AWiFS 56m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-awifs-56m.jpg"
                    alt="IRS Resourcesat AWiFS 56 meter spatial resolution"
                  />
                  <span className="res-ladder-badge coarse">56 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>AWiFS (Advanced Wide Field)</h4>
                    <span className="sensor-tag">
                      IRS-P6 / Resourcesat-1 &amp; 2
                    </span>
                    <p>
                      <strong>Resolved Features:</strong> 740 km wide swath
                      captures statewide vegetation vigor, major river drainage
                      networks, and regional drought anomalies. Individual city
                      streets blend into regional averages.
                    </p>
                  </div>
                </div>
              </div>
              {/* 2. Landsat ETM+ 30m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-etm-30m.jpg"
                    alt="Landsat-7 ETM+ 30 meter spatial resolution"
                  />
                  <span className="res-ladder-badge coarse">30 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>ETM+ / OLI (Landsat Series)</h4>
                    <span className="sensor-tag">Landsat 7 / 8 / 9</span>
                    <p>
                      <strong>Resolved Features:</strong> Agricultural field
                      parcel boundaries, township outlines, multi-lane highways,
                      and water reservoirs. Mixed urban pixels dominate
                      residential zones.
                    </p>
                  </div>
                </div>
              </div>
              {/* 3. LISS-III 23.5m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-liss3-23m.jpg"
                    alt="IRS LISS-III 23.5 meter spatial resolution"
                  />
                  <span className="res-ladder-badge medium">23.5 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>LISS-III (Linear Self-Scanning)</h4>
                    <span className="sensor-tag">
                      IRS-1C / 1D &amp; Resourcesat-1/2
                    </span>
                    <p>
                      <strong>Resolved Features:</strong> Village settlements,
                      secondary canal networks, distinct forest stand
                      boundaries, and agricultural plot clusters across a 141 km
                      swath.
                    </p>
                  </div>
                </div>
              </div>
              {/* 4. LISS-IV 5.8m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-liss4-5m.jpg"
                    alt="IRS Resourcesat LISS-IV 5.8 meter spatial resolution"
                  />
                  <span className="res-ladder-badge fine">5.8 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>LISS-IV Multispectral</h4>
                    <span className="sensor-tag">Resourcesat-1 / 2 / 2A</span>
                    <p>
                      <strong>Resolved Features:</strong> Arterial city avenues,
                      individual farming plots, factory compounds, and airport
                      runway layouts. Bridges across rivers are clearly
                      demarcated.
                    </p>
                  </div>
                </div>
              </div>
              {/* 5. Cartosat-1 2.5m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-carto1-2m.jpg"
                    alt="ISRO Cartosat-1 2.5 meter stereo panchromatic"
                  />
                  <span className="res-ladder-badge fine">2.5 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>Cartosat-1 Stereo PAN</h4>
                    <span className="sensor-tag">
                      IRS-P5 (Fore +26° / Aft -5°)
                    </span>
                    <p>
                      <strong>Resolved Features:</strong> Individual building
                      footprints, suburban residential layouts, and two-lane
                      tarmac roads. Enables national-scale 3D Digital Elevation
                      Models (CartoDEM).
                    </p>
                  </div>
                </div>
              </div>
              {/* 6. Cartosat-2 0.8m Sub-Meter */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-carto2-submeter.jpg"
                    alt="ISRO Cartosat-2 0.8 meter sub-meter panchromatic"
                  />
                  <span className="res-ladder-badge submeter">0.8 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>Cartosat-2 High-Agility PAN</h4>
                    <span className="sensor-tag">Cartosat-2 Series (ISRO)</span>
                    <p>
                      <strong>Resolved Features:</strong> Individual passenger
                      vehicles on highways, road centerlines, aircraft on
                      taxiways, roof HVAC structures, and cadastral property
                      boundaries.
                    </p>
                  </div>
                </div>
              </div>
              {/* 7. QuickBird 0.6m */}
              <div className="res-ladder-card">
                <div className="res-ladder-thumb">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-isro-ladder-quickbird.jpg"
                    alt="QuickBird 0.6 meter ultra high spatial resolution"
                  />
                  <span className="res-ladder-badge submeter">0.6 m GSD</span>
                </div>
                <div className="res-ladder-info">
                  <div>
                    <h4>QuickBird Commercial VHR</h4>
                    <span className="sensor-tag">
                      DigitalGlobe / VHR Constellation
                    </span>
                    <p>
                      <strong>Resolved Features:</strong> Precise road markings,
                      parking stall divisions, small trees, footpaths, and
                      structural roof edges for ultra-detailed urban cadastre.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, textAlign: "right" }}>
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Earth Observation Platforms and
                Sensors", Shri Vinay Kumar
              </span>
            </div>
          </div>
          {/* INTERACTIVE TEMPORAL RESOLUTION: MINI-CALENDAR FLYOVER TRACKER */}
          <div className="temporal-sim-card">
            <div className="temporal-header">
              <div>
                <h3>Temporal Resolution: Orbit Revisit Calendar Simulator</h3>
                <p>
                  A satellite cannot be everywhere at once. Select a satellite
                  and click "Animate Month" to see how often its orbital path
                  allows it to photograph the exact same target area on the
                  ground.
                </p>
              </div>
            </div>
            {/* Satellite Selection Buttons */}
            <div className="temporal-sat-picker">
              <button
                type="button"
                className="temp-sat-btn active"
                data-sat="sentinel2"
              >
                Sentinel-2 Constellation (5-day revisit)
              </button>
              <button type="button" className="temp-sat-btn" data-sat="landsat">
                Landsat 8/9 Constellation (8-day revisit)
              </button>
              <button type="button" className="temp-sat-btn" data-sat="modis">
                MODIS Terra &amp; Aqua (1–2 day revisit)
              </button>
              <button type="button" className="temp-sat-btn" data-sat="insat">
                INSAT-3D / GOES (Continuous 15-min)
              </button>
              <button type="button" className="temp-sat-btn" data-sat="sar">
                Sentinel-1 SAR (6-day all-weather)
              </button>
            </div>
            {/* Calendar Month Simulation View */}
            <div className="calendar-sim-box">
              <div className="calendar-top-bar">
                <div className="calendar-target-info">
                  <span>Target Ground Location:</span>
                  <span className="coord">
                    Hyderabad Region (17.385° N, 78.486° E)
                  </span>
                </div>
                <div className="calendar-anim-controls">
                  <button
                    type="button"
                    className="cal-play-btn"
                    id="btn-play-calendar"
                  >
                    ▶ Animate Month Timeline
                  </button>
                </div>
              </div>
              {/* Weekday headers */}
              <div className="calendar-weekdays">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
              {/* 30 Calendar Day Cells */}
              <div className="calendar-days-grid" id="calendar-days-grid">
                {/* Dynamically rendered day cells */}
              </div>
              {/* Event Acquisition Log Bar */}
              <div className="calendar-log-box" id="calendar-log-box">
                <div className="cal-log-text" id="cal-log-text">
                  Select a satellite or click{" "}
                  <strong>Animate Month Timeline</strong> to observe orbital
                  passes.
                </div>
                <div className="cal-log-stat">
                  <div className="cal-stat-item">
                    <span className="cs-lbl">Monthly Passes</span>
                    <span className="cs-val" id="stat-monthly-passes">
                      6 Passes / Month
                    </span>
                  </div>
                  <div className="cal-stat-item">
                    <span className="cs-lbl">Cloud Risk</span>
                    <span className="cs-val" id="stat-cloud-risk">
                      ~35% Loss (Optical)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* AUTHENTIC DISASTER MONITORING: TEMPORAL FLOOD INUNDATION */}
          <div className="figure">
            <div className="figure-img-wrap dark">
              <div className="compare-pair-grid">
                <div className="compare-item">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-temporal-preflood.jpg"
                    alt="Pre-flood baseline satellite image of river course"
                  />
                  <span className="compare-label-badge pre">
                    Pass 1 · Pre-Flood Baseline (Dry River Bed)
                  </span>
                </div>
                <div className="compare-item">
                  <img
                    src="/assets/images/remote-sensing/resolution/res-temporal-postflood.jpg"
                    alt="Post-flood peak inundation satellite image of inundated floodplains"
                  />
                  <span className="compare-label-badge post">
                    Pass 2 · Peak Monsoon Surge (Submerged Agricultural Plains)
                  </span>
                </div>
              </div>
            </div>
            <figcaption>
              <strong>
                Operational Disaster Management: Why Temporal Revisit Frequency
                Saves Lives.
              </strong>
              Extreme weather events and flood inundations evolve within 24 to
              72 hours. Left: <em>Pre-Flood Baseline</em> shows a normal
              dry-season river channel with exposed sandbars and bordering farm
              plots. Right: <em>Peak Flood Surge</em> shows the river breaching
              embankments, submerging thousands of hectares of agrarian land
              (dark inundated pixels). If a satellite has a 16-day revisit
              period (like a single Landsat spacecraft), the entire flood crest
              can peak and drain away completely unrecorded between passes.
              Rapid temporal revisit (1–2 days via MODIS/VIIRS, or
              multi-satellite constellations like Sentinel-1 SAR and Sentinel-2)
              is essential to provide national disaster management agencies with
              actionable emergency evacuation and relief maps.
              <span className="fig-credit">
                Source: ISRO IIRS / Disaster Management Support Programme
                (DMSP), Dr. Hina Pande
              </span>
            </figcaption>
          </div>
          {/* INTERACTIVE SPECTRAL RESOLUTION & HYPERSPECTRAL DATA CUBE LAB */}
          <div className="spectral-lab-card">
            <div className="spectral-lab-header">
              <div>
                <div
                  className="lab-pill"
                  style={{
                    background: "rgba(45, 212, 191, 0.15)",
                    color: "var(--teal)",
                    borderColor: "rgba(45, 212, 191, 0.3)",
                  }}
                >
                  ISRO / NASA ARSET Spectrometry Lab
                </div>
                <h3
                  style={{
                    margin: "4px 0 6px 0",
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                >
                  Interactive Spectral Slicer: Panchromatic vs Multispectral vs
                  Hyperspectral
                </h3>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  See how spectral resolution transforms a scene: from 1 wide
                  channel (Pan) to 13 discrete bands (Sentinel-2) to 224
                  contiguous channels (AVIRIS-NG / EnMAP).
                </p>
              </div>
            </div>
            {/* Mode Selector Tabs */}
            <div className="spectral-mode-tabs">
              <button className="spec-mode-btn" data-mode="pan">
                <span className="sm-title">1. Panchromatic (PAN)</span>
                <span className="sm-sub">
                  1 Single Broad Band (450–900 nm) · High Spatial, No Colors
                </span>
              </button>
              <button className="spec-mode-btn" data-mode="msi">
                <span className="sm-title">2. Multispectral (MSI)</span>
                <span className="sm-sub">
                  4–13 Discrete Bands · Sentinel-2 / Landsat · Broad Shapes
                </span>
              </button>
              <button className="spec-mode-btn active" data-mode="hsi">
                <span className="sm-title">3. Hyperspectral (HSI)</span>
                <span className="sm-sub">
                  224 Contiguous Bands · AVIRIS-NG / EnMAP / EMIT · Full
                  Continuous Fingerprint
                </span>
              </button>
            </div>
            {/* Material Target Selector */}
            <div className="spec-target-row">
              <span className="spec-target-lbl">Inspect Ground Target:</span>
              <div className="spec-target-chips">
                <button className="spec-target-chip active" data-target="crop">
                  🌿 Healthy Citrus vs Greening Disease
                </button>
                <button className="spec-target-chip" data-target="clay">
                  🪨 Kaolinite Clay vs Alunite (Mineralogy)
                </button>
                <button className="spec-target-chip" data-target="water">
                  💧 Clean Lake vs Algal Bloom (Chl-a)
                </button>
                <button className="spec-target-chip" data-target="urban">
                  🏙️ Green Painted Roof vs Real Tree Turf
                </button>
              </div>
            </div>
            <div className="spectral-grid-layout">
              {/* Left: Chart.js Spectral Curve with Sampling Bands */}
              <div className="spectral-chart-card">
                <div className="chart-header-bar">
                  <span id="spec-chart-title">
                    Spectral Signature Curve &amp; Band Sampling
                  </span>
                  <span className="spec-badge mono-teal" id="spec-band-count">
                    224 Contiguous Channels (Δλ = 10 nm)
                  </span>
                </div>
                <div
                  className="spec-chart-wrap"
                  style={{ position: "relative", height: 260 }}
                >
                  <canvas id="specResolutionChart" />
                </div>
              </div>
              {/* Right: 3D Data Cube Visualizer & Discrimination Result */}
              <div className="spectral-cube-card">
                <div className="cube-header-bar">
                  <span>Sensor Data Cube Representation</span>
                  <span className="cube-badge" id="cube-mode-badge">
                    Hyperspectral Cube
                  </span>
                </div>
                <div className="cube-canvas-wrap">
                  <canvas id="cube-canvas" width={320} height={200} />
                </div>
                <div className="spec-discrim-verdict" id="spec-discrim-verdict">
                  <div className="verdict-icon" id="verdict-icon">
                    ✅
                  </div>
                  <div className="verdict-body">
                    <strong id="verdict-title">
                      Target Discriminated with 100% Certainty
                    </strong>
                    <p id="verdict-text">
                      Hyperspectral captures the sharp 2.20 μm kaolinite doublet
                      absorption dip, clearly separating it from alunite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* AUTHENTIC SENSOR SPECTRAL SAMPLING FIGURE */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/resolution/res-spectral-resolution-real.jpg"
                alt="Comparison of spectral band sampling: Panchromatic vs Multispectral vs Hyperspectral"
              />
            </div>
            <figcaption>
              <strong>
                Authentic Sensor Band Sampling: Panchromatic vs. Multispectral
                vs. Hyperspectral.
              </strong>
              Notice how <em>Panchromatic</em> integrates all visible/NIR energy
              into a single broad DN value (yielding high spatial resolution and
              photon counts, but zero wavelength discrimination).{" "}
              <em>Multispectral sensors</em> (e.g. IRS LISS-III, Landsat OLI,
              Sentinel-2) sample discrete spectral windows (Δλ ≈ 60–100 nm),
              capturing broad signature envelopes.{" "}
              <em>Hyperspectral sensors</em> (e.g. AVIRIS-NG, EnMAP, NASA EMIT)
              slice the spectrum into hundreds of contiguous narrow channels (Δλ
              ≈ 5–10 nm), pinpointing exact molecular absorption dips in
              minerals, canopy nitrogen, and plant pigments.
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Earth Observation Platforms and
                Sensors", Shri Vinay Kumar
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">04.2 / Pixels &amp; DN Values</div>
          <h2 className="section-title">What your computer actually sees</h2>
          <p className="section-intro">
            A satellite image is a grid of pixels, each holding a Digital Number
            (DN) — the recorded amount of reflected energy. Higher DN = more
            energy = brighter pixel. Drag the sliders to see how detail changes
            with spatial and radiometric resolution together.
          </p>
          <div className="widget-panel">
            <div className="pixel-grid-wrap">
              <div className="pixel-grid" id="pixel-grid" />
              <div className="pixel-controls">
                <div>
                  <div className="pixel-slider-val">
                    <span>Grid Size</span>
                    <span id="pixel-size-val">12 × 12</span>
                  </div>
                  <input
                    type="range"
                    id="pixel-size-slider"
                    min={6}
                    max={48}
                    defaultValue={12}
                  />
                </div>
                <div>
                  <div className="pixel-slider-val">
                    <span>Bits</span>
                    <span id="pixel-bits-val">8-bit (256 levels)</span>
                  </div>
                  <input
                    type="range"
                    id="pixel-bits-slider"
                    min={1}
                    max={12}
                    defaultValue={8}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-dim)",
                    padding: 12,
                    background: "var(--surface-2)",
                    borderRadius: 8,
                  }}
                >
                  <strong style={{ color: "var(--teal)" }}>
                    What's happening:
                  </strong>{" "}
                  The grid represents a satellite image with a river, urban
                  area, forest, and sand. More pixels = higher spatial
                  resolution. More bits = higher radiometric resolution. Reduce
                  both to see what early satellites like Landsat MSS captured.
                </div>
              </div>
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>degrade_resolution.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                <span className="c-kw">from</span> scipy.ndimage{" "}
                <span className="c-kw">import</span> zoom{"\n"}
                {"\n"}
                <span className="c-com">
                  # image is a numpy array of shape (rows, cols) loaded from a
                  GeoTIFF
                </span>
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">simulate_coarser_pixel</span>(image,
                factor):{"\n"}
                {"    "}
                <span className="c-com">
                  """Shrink then re-expand — simulates a lower
                  spatial-resolution sensor."""
                </span>
                {"\n"}
                {"    "}small = zoom(image, 1/factor, order=1){"      "}
                <span className="c-com">
                  # downsample (average nearby pixels)
                </span>
                {"\n"}
                {"    "}
                <span className="c-kw">return</span> zoom(small, factor,
                order=0){"           "}
                <span className="c-com">
                  # blow back up, blocky like real coarse data
                </span>
                {"\n"}
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">reduce_radiometric_bits</span>(image,
                bits):{"\n"}
                {"    "}
                <span className="c-com">
                  """Quantize DN values to fewer grey levels, like an older
                  6-bit sensor."""
                </span>
                {"\n"}
                {"    "}levels = 2**bits{"\n"}
                {"    "}scaled = (image / image.
                <span className="c-fn">max</span>()) * (levels - 1){"\n"}
                {"    "}
                <span className="c-kw">return</span> np.
                <span className="c-fn">round</span>(scaled) * (255 / (levels -
                1)){"  "}
                <span className="c-com">
                  # rescale back to 0-255 for display
                </span>
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">04.3 / Radiometric Resolution</div>
          <h2 className="section-title">The power of bits</h2>
          <p className="section-intro">
            The formula is simple: 2<sup>n</sup> = number of grey levels, where
            n is bit depth. More bits mean the sensor distinguishes finer energy
            differences — critical for shadow and bright-area detail.
          </p>
          <div className="widget-panel">
            <div className="rad-grid" id="rad-grid" />
          </div>
          {/* INTERACTIVE RADIOMETRIC DYNAMIC RANGE & SHADOW/HIGHLIGHT LAB */}
          <div className="radiometric-lab-card">
            <div className="radiometric-lab-header">
              <div>
                <div
                  className="lab-pill"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    color: "var(--blue)",
                    borderColor: "rgba(59, 130, 246, 0.3)",
                  }}
                >
                  ISRO Radiometry Laboratory
                </div>
                <h3
                  style={{
                    margin: "4px 0 6px 0",
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                >
                  Interactive Radiometric Resolution: Shadow Detail &amp;
                  Bit-Depth Explorer
                </h3>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  Experience how bit depth (2<sup>n</sup>) prevents data
                  clipping. Switch between 1-bit, 6-bit (Landsat MSS), 8-bit
                  (Landsat TM), 12-bit (Landsat OLI / Sentinel-2), and 14-bit to
                  inspect hidden textures in deep mountain shadows and bright
                  glaciated terrain.
                </p>
              </div>
            </div>
            {/* Bit Depth Selector */}
            <div className="bit-depth-nav">
              <button className="bit-btn" data-bits={1}>
                <span className="bb-title">1-bit</span>
                <span className="bb-desc">2 Levels · Binary B&amp;W</span>
              </button>
              <button className="bit-btn" data-bits={6}>
                <span className="bb-title">6-bit (MSS)</span>
                <span className="bb-desc">64 Levels · Severe Contouring</span>
              </button>
              <button className="bit-btn" data-bits={8}>
                <span className="bb-title">8-bit (TM)</span>
                <span className="bb-desc">256 Levels · Standard Display</span>
              </button>
              <button className="bit-btn active" data-bits={12}>
                <span className="bb-title">12-bit (OLI / MSI)</span>
                <span className="bb-desc">
                  4,096 Levels · Deep Shadow Penetration
                </span>
              </button>
              <button className="bit-btn" data-bits={14}>
                <span className="bb-title">14-bit (WorldView-3)</span>
                <span className="bb-desc">
                  16,384 Levels · Scientific Dynamic Range
                </span>
              </button>
            </div>
            <div className="rad-interactive-grid">
              {/* Left: High Dynamic Range Scene Canvas */}
              <div className="rad-scene-card">
                <div className="rad-scene-header">
                  <span>
                    Scene: Himalayan Glaciated Valley (Snow + Shadow + Forest +
                    River)
                  </span>
                  <span className="mono-amber" id="rad-active-levels">
                    4,096 Discrete Quantization Steps
                  </span>
                </div>
                <div className="rad-canvas-container">
                  <canvas id="rad-scene-canvas" width={560} height={280} />
                  {/* Shadow Magnifier Loupe Overlay */}
                  <div className="rad-loupe-info">
                    <span className="rli-tag">🔬 Shadow Zone Inspector</span>
                    <span id="rad-shadow-inspect-text">
                      At 12-bit, mountain paths &amp; pine canopies inside the
                      5% reflectance shadow are fully resolved (DN = 160–240).
                    </span>
                  </div>
                </div>
              </div>
              {/* Right: Real-time Histogram & Quantization Steps */}
              <div className="rad-telemetry-card">
                <div className="telemetry-header">
                  Radiometric Histogram &amp; Quantization
                </div>
                <div className="rad-hist-canvas-wrap">
                  <canvas id="rad-hist-canvas" width={280} height={150} />
                </div>
                <div className="rad-metrics-list">
                  <div className="rm-item">
                    <span className="rm-lbl">Quantization Step Width</span>
                    <span className="rm-val mono-teal" id="stat-quant-step">
                      0.024% of Radiance
                    </span>
                  </div>
                  <div className="rm-item">
                    <span className="rm-lbl">Shadow Clipping Loss</span>
                    <span className="rm-val mono-amber" id="stat-shadow-loss">
                      0% (Zero Clipping)
                    </span>
                  </div>
                  <div className="rm-item">
                    <span className="rm-lbl">Highlight Saturation</span>
                    <span
                      className="rm-val mono-purple"
                      id="stat-highlight-loss"
                    >
                      0% (Glacier ice texture preserved)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* AUTHENTIC RADIOMETRIC QUANTIZATION: AIRPORT RUNWAY */}
          <div className="figure">
            <div className="figure-img-wrap dark">
              <img
                src="/assets/images/remote-sensing/resolution/res-real-radiometric-runway.jpg"
                alt="Airport runway satellite image degraded across 8-bit, 4-bit, and 1-bit quantization levels"
              />
            </div>
            <figcaption>
              <strong>
                Authentic Radiometric Resolution Degradation: Airport Runway
                &amp; Apron Complex.
              </strong>
              This classic ISRO IIRS lecture comparison demonstrates how
              quantization levels affect subtle target contrast and feature
              detectability:
              <br />• <strong>8-bit (256 Grey Levels):</strong> Tarmac surface
              variations, taxiway edge lines, painted runway thresholds,
              aircraft markings, and grassy verges are crisply separated with
              smooth grayscale graduation.
              <br />• <strong>4-bit (16 Grey Levels):</strong> Severe false
              contouring (posterization) appears. Continuous radiance gradients
              across concrete paving are crushed into harsh stepped bands, and
              faint surface painted lines vanish into the background.
              <br />• <strong>1-bit (2 Levels / Binary):</strong> Every pixel is
              forced into either 0 (black) or 1 (white). All internal grayscale
              graduation is destroyed; only harsh high-contrast threshold
              boundaries survive.
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Image Interpretation and Digital
                Processing", Dr. Hina Pande
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            04.4 / Choosing the Right Resolution
          </div>
          <h2 className="section-title">
            Application guide &amp; the fundamental trade-off
          </h2>
          {/* INTERACTIVE MISSION TRADE-OFF MATRIX & REQUIREMENTS MATCHER */}
          <div className="tradeoff-lab-card">
            <div className="tradeoff-header">
              <div>
                <div
                  className="lab-pill"
                  style={{
                    background: "rgba(245, 166, 35, 0.15)",
                    color: "var(--amber)",
                    borderColor: "rgba(245, 166, 35, 0.3)",
                  }}
                >
                  Mission Design &amp; Sensor Selection
                </div>
                <h3
                  style={{
                    margin: "4px 0 6px 0",
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                >
                  Interactive Application Requirements &amp; 4-Resolution
                  Matcher
                </h3>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  Why no single satellite can do everything: select your
                  real-world remote sensing objective to inspect the mandatory
                  resolution profile and optimal sensor constellations.
                </p>
              </div>
            </div>
            {/* Application Selection Grid */}
            <div className="app-scenario-grid">
              <button className="app-scenario-btn active" data-app="cyclone">
                <span className="as-icon">🌪️</span>
                <div className="as-text">
                  <strong>Real-Time Cyclone Tracking</strong>
                  <small>Disaster Warning &amp; Cloud Dynamics</small>
                </div>
              </button>
              <button className="app-scenario-btn" data-app="urban">
                <span className="as-icon">🏙️</span>
                <div className="as-text">
                  <strong>Urban Cadastral Mapping</strong>
                  <small>Property Boundary &amp; Infrastructure</small>
                </div>
              </button>
              <button className="app-scenario-btn" data-app="agri">
                <span className="as-icon">🌾</span>
                <div className="as-text">
                  <strong>Precision Agriculture</strong>
                  <small>Crop Stress, Nitrogen &amp; Yield</small>
                </div>
              </button>
              <button className="app-scenario-btn" data-app="ocean">
                <span className="as-icon">🌊</span>
                <div className="as-text">
                  <strong>Ocean Colour &amp; Chlorophyll</strong>
                  <small>Phytoplankton &amp; Coastal Sediment</small>
                </div>
              </button>
              <button className="app-scenario-btn" data-app="wildfire">
                <span className="as-icon">🔥</span>
                <div className="as-text">
                  <strong>Wildfire Early Warning</strong>
                  <small>Active Fronts &amp; Smoke Plumes</small>
                </div>
              </button>
              <button className="app-scenario-btn" data-app="mineral">
                <span className="as-icon">⛏️</span>
                <div className="as-text">
                  <strong>Geological Mineral Prospecting</strong>
                  <small>Lithology &amp; Hydrothermal Alteration</small>
                </div>
              </button>
            </div>
            <div className="tradeoff-content-grid">
              {/* Left: 4-Axis Resolution Spider/Radar Canvas or Gauge Display */}
              <div className="tradeoff-chart-box">
                <div className="tcb-head">4-Resolution Trade-Off Profile</div>
                <div
                  className="radar-chart-wrap"
                  style={{ position: "relative", height: 260 }}
                >
                  <canvas id="tradeoffRadarChart" />
                </div>
              </div>
              {/* Right: Technical Rationale & Sensor Recommendations */}
              <div className="tradeoff-intel-box">
                <div className="intel-banner" id="intel-app-title">
                  🌪️ Cyclone Tracking &amp; Cloud Motion
                </div>
                <div className="intel-specs-grid">
                  <div className="is-spec">
                    <span className="is-label">Spatial Req.</span>
                    <span className="is-val mono-amber" id="req-spatial">
                      1 km – 4 km (Coarse is OK)
                    </span>
                  </div>
                  <div className="is-spec">
                    <span className="is-label">Temporal Req.</span>
                    <span className="is-val mono-purple" id="req-temporal">
                      15 – 30 Minutes (Critical!)
                    </span>
                  </div>
                  <div className="is-spec">
                    <span className="is-label">Spectral Req.</span>
                    <span className="is-val mono-teal" id="req-spectral">
                      Thermal IR (10.8μm) &amp; WV (6.7μm)
                    </span>
                  </div>
                  <div className="is-spec">
                    <span className="is-label">Radiometric Req.</span>
                    <span className="is-val mono-blue" id="req-radiometric">
                      10–12 bits (TIR Noise Equivalent ΔT)
                    </span>
                  </div>
                </div>
                <div className="intel-rationale" id="intel-rationale-text">
                  <strong>The Engineering Physics:</strong> A cyclone spans
                  500–1,000 km across. Sub-meter spatial resolution would
                  produce billions of redundant pixels and take hours to
                  downlink. Instead, geostationary orbit (36,000 km) provides
                  continuous 15-minute hemispheric imagery to track eye
                  progression in real time.
                </div>
                <div className="intel-sensors">
                  <span className="is-sensor-lbl">Matching Spacecraft:</span>
                  <div className="is-sensor-chips" id="intel-sensor-chips">
                    <span className="sensor-chip">🛰️ INSAT-3D/3DR (ISRO)</span>
                    <span className="sensor-chip">🛰️ GOES-16/18 (NOAA)</span>
                    <span className="sensor-chip">
                      🛰️ Meteosat-11 (EUMETSAT)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Spatial Resolution Needed</th>
                  <th>Example Satellites</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-name">Military Surveillance</td>
                  <td className="mono-teal">≤ 1 m</td>
                  <td>IKONOS PAN, Cartosat-3</td>
                </tr>
                <tr>
                  <td className="row-name">Cartography &amp; Urban Planning</td>
                  <td className="mono-teal">2 – 6 m</td>
                  <td>Cartosat-2, WorldView</td>
                </tr>
                <tr>
                  <td className="row-name">
                    Land Use, Crop &amp; Forest Monitoring
                  </td>
                  <td className="mono-teal">10 – 30 m</td>
                  <td>Landsat, Sentinel-2, LISS-III</td>
                </tr>
                <tr>
                  <td className="row-name">
                    Ocean Colour (Chlorophyll, Sediment)
                  </td>
                  <td className="mono-teal">300 – 1100 m</td>
                  <td>OCM, MODIS</td>
                </tr>
                <tr>
                  <td className="row-name">
                    Meteorology (Clouds, Water Vapor)
                  </td>
                  <td className="mono-teal">1 – 8 km</td>
                  <td>INSAT, GOES, METEOSAT</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* AUTHENTIC SUB-METER CADASTRAL & INFRASTRUCTURE IMAGERY */}
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap dark">
                <img
                  src="/assets/images/remote-sensing/resolution/res-cartosat-hyderabad.jpg"
                  alt="ISRO Cartosat sub-meter satellite image of Hyderabad urban infrastructure"
                />
              </div>
              <figcaption>
                <strong>
                  Sub-Meter Urban Cadastral Mapping: ISRO Cartosat over
                  Hyderabad.
                </strong>
                At sub-meter Ground Sample Distance (GSD), multi-lane flyover
                junctions, building footprints, and vehicle parking lots are
                distinctly resolved, providing municipal corporations with base
                maps for property tax GIS and road widening.
                <span className="fig-credit">
                  Source: ISRO NRSC / Cartosat-2 Series, Shri Vinay Kumar
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap dark">
                <img
                  src="/assets/images/remote-sensing/resolution/res-cartosat-bangalore.jpg"
                  alt="ISRO Cartosat sub-meter satellite image of Bangalore airport infrastructure"
                />
              </div>
              <figcaption>
                <strong>
                  High-Resolution Transportation Infrastructure: Bangalore
                  Airport.
                </strong>
                Cartosat sub-meter imaging resolves runway edge markings,
                taxiway high-speed turnoffs, passenger terminal gates, and
                parked commercial airliners for national aerospace asset
                monitoring.
                <span className="fig-credit">
                  Source: ISRO NRSC / Cartosat-2 Series, Shri Vinay Kumar
                </span>
              </figcaption>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">The Resolution Trade-off</div>
            <p>
              It is very difficult to obtain high spatial, spectral, temporal,
              and radiometric resolution all at once. A 0.25m satellite
              typically has a narrow swath and long revisit time. A weather
              satellite with hourly revisit (GOES/INSAT) has kilometre-scale
              pixels. Every satellite embodies a deliberate compromise — you
              pick the one that matches your application.
            </p>
          </div>
          {/* AUTHENTIC APPLICATION VS RESOLUTION HIERARCHY MATRIX */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/resolution/res-application-vs-resolution.jpg"
                alt="Application hierarchy vs spatial and temporal resolution requirements"
              />
            </div>
            <figcaption>
              <strong>
                The Remote Sensing Application vs. Resolution Trade-Off
                Hierarchy.
              </strong>
              No single mission can optimize all four parameters simultaneously.
              Global meteorological &amp; oceanographic systems require high
              temporal revisit (hourly to daily) over continental scales,
              accepting kilometre-scale pixels. Conversely, urban cadastre,
              structural damage assessment, and precision civil engineering
              demand sub-meter spatial detail, operating with narrower swath
              widths and longer revisit cycles.
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Earth Observation Platforms and
                Sensors", Shri Vinay Kumar
              </span>
            </figcaption>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                <strong>Spatial resolution</strong> = pixel size on the ground
                (IFOV × altitude). Smaller pixel = more detail, less coverage.
              </li>
              <li>
                <strong>Spectral resolution</strong> = number/width of bands:
                panchromatic (1) &lt; multispectral (3–10) &lt; hyperspectral
                (100s).
              </li>
              <li>
                <strong>Radiometric resolution</strong> = bits: 2<sup>n</sup>{" "}
                grey levels. 12-bit sensors reveal detail 8-bit sensors simply
                never recorded.
              </li>
              <li>
                <strong>Temporal resolution</strong> = revisit time: hourly for
                weather, daily for ocean, 5–16 days for land monitoring.
              </li>
              <li>
                You can't max out all four —{" "}
                <strong>every satellite is a deliberate trade-off</strong>{" "}
                matched to its purpose.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
