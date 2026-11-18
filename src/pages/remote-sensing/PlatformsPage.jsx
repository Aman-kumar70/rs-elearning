import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountPlatforms } from "@/controllers/platforms";

export default function PlatformsPage() {
  usePageTitle("Orbits & Scanning — RS.3");
  useLegacyPage(mountPlatforms);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.3 of 6</div>
          <h1>
            Orbits &amp; <span>Scanning</span>
          </h1>
          <p className="hero-intro">
            A satellite's orbit decides what it can see, how often, and at what
            time of day — before a single photon is even captured. Get the orbit
            wrong for your application and no amount of clever image processing
            will fix it.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="now" />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">03.1 / Orbit Types</div>
          <h2 className="section-title">Two ways to orbit Earth</h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                Almost every Earth-observation satellite uses one of two orbit
                families: low-altitude <strong>polar/sun-synchronous</strong>{" "}
                orbits, or very-high-altitude <strong>geostationary</strong>{" "}
                orbits directly above the equator.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                They solve opposite problems. Polar orbits give you high spatial
                resolution and full global coverage over days/weeks.
                Geostationary orbits give you the same view, continuously,
                forever — perfect for watching a storm develop hour by hour,
                useless for mapping fine detail.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                Orbit altitude and inclination are chosen so gravity balances
                the satellite's speed at the right period — 90 minutes at
                700–800 km (polar), or exactly 24 hours at ~36,000 km
                (geostationary, matching Earth's own rotation so the satellite
                appears fixed).
              </p>
            </div>
          </div>
          {/* AUTHENTIC PLATFORMS: GROUND VS AIRBORNE VS SPACEBORNE */}
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/platforms/plat-ground-truck.jpg"
                  alt="Ground-based field spectroradiometer mounted on hydraulic truck cherry picker"
                />
              </div>
              <figcaption>
                <strong>1. Ground-Based Platform:</strong> Field
                spectroradiometers mounted on hydraulic crane trucks measure
                pure, in-situ canopy reflectance without atmospheric
                interference — essential for ground-truthing satellite data.
                <span className="fig-credit">
                  Source: ISRO IIRS Dehradun — "Platforms &amp; Sensors," Shri
                  Vinay Kumar
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/platforms/plat-airborne-aircraft.jpg"
                  alt="Airborne remote sensing survey aircraft with fuselage sensor pod"
                />
              </div>
              <figcaption>
                <strong>2. Airborne Platform:</strong> Survey aircraft operate
                at 1–10 km altitude, providing flexible on-demand high spatial
                resolution (5–20 cm) and specialized hyperspectral payloads
                (e.g. AVIRIS-NG).
                <span className="fig-credit">
                  Source: ISRO IIRS Dehradun, Shri Vinay Kumar
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/platforms/plat-spaceborne-satellite.jpg"
                  alt="Spaceborne Earth observation satellite payload in cleanroom"
                />
              </div>
              <figcaption>
                <strong>3. Spaceborne Platform:</strong> Satellites in orbit
                (500–36,000 km) operate in a vacuum, providing automated,
                recurring global synoptic coverage for decades.
                <span className="fig-credit">
                  Source: ISRO IIRS Dehradun, Shri Vinay Kumar
                </span>
              </figcaption>
            </div>
          </div>
          <div className="orbit-sim-card">
            <div className="orbit-toggle">
              <button
                type="button"
                className="orbit-btn active"
                data-orbit="leo"
              >
                Polar / Sun-Synchronous (LEO)
              </button>
              <button type="button" className="orbit-btn" data-orbit="geo">
                Geostationary (GEO)
              </button>
              <button type="button" className="orbit-btn" data-orbit="compare">
                Compare Scale (LEO vs GEO)
              </button>
            </div>
            {/* Orbit Canvas Viewport */}
            <div className="orbit-canvas-container">
              <canvas id="orbit-canvas" />
              {/* Live Telemetry HUD */}
              <div className="orbit-hud">
                <div className="hud-badge">
                  Orbit: <span id="hud-orbit-type">Polar Sun-Sync (LEO)</span>
                </div>
                <div className="hud-badge">
                  Altitude: <span id="hud-alt">705 km</span>
                </div>
                <div className="hud-badge">
                  Velocity: <span id="hud-speed">7.5 km/s (27,000 km/h)</span>
                </div>
                <div className="hud-badge">
                  Rel. Ground Speed:{" "}
                  <span id="hud-ground-speed">6.8 km/s (Scanning)</span>
                </div>
                <div className="hud-badge">
                  Period:{" "}
                  <span id="hud-period">98.8 min (~14.5 orbits/day)</span>
                </div>
              </div>
              {/* Controls */}
              <div className="orbit-sim-controls">
                <button
                  type="button"
                  className="orbit-sim-btn"
                  id="btn-swath-toggle"
                  title="Toggle ground swath scan beam"
                >
                  Swath: ON
                </button>
                <button
                  type="button"
                  className="orbit-sim-btn"
                  id="btn-speed-toggle"
                  title="Cycle simulation speed"
                >
                  Speed: 1x
                </button>
                <button
                  type="button"
                  className="orbit-sim-btn"
                  id="btn-pause-toggle"
                  title="Pause or resume motion"
                >
                  ⏸ Pause
                </button>
              </div>
            </div>
            <div className="orbit-info" id="orbit-info">
              <h4 id="orbit-title">Polar / Sun-Synchronous Orbit (LEO)</h4>
              <p id="orbit-desc">
                The satellite orbits north-south at 700-800 km altitude while
                Earth rotates beneath it (west-east). Because the Earth turns
                continuously, each polar pass cuts across a new strip of
                longitude. It crosses the equator at ~10:30 AM local solar time
                every orbit, ensuring consistent sun illumination shadows across
                the globe.
              </p>
              <div className="orbit-stats" id="orbit-stats">
                <div className="orbit-stat">
                  <span className="label">Altitude</span>
                  <span className="val">700–800 km</span>
                </div>
                <div className="orbit-stat">
                  <span className="label">Orbital Period</span>
                  <span className="val">~90–100 min</span>
                </div>
                <div className="orbit-stat">
                  <span className="label">Inclination</span>
                  <span className="val">~98.2° – 98.7°</span>
                </div>
                <div className="orbit-stat">
                  <span className="label">Primary Missions</span>
                  <span className="val">Sentinel-2, Landsat, Resourcesat</span>
                </div>
              </div>
            </div>
          </div>
          {/* AUTHENTIC SATELLITE DATA: GEOSTATIONARY FULL EARTH DISK */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/platforms/plat-goes-earth-disk.jpg"
                alt="Full disk Earth imagery captured from Geostationary orbit at 36,000 km altitude"
              />
            </div>
            <figcaption>
              <strong>Geostationary Perspective (35,786 km Altitude):</strong> A
              full hemispheric scan captured by a meteorological imager (GOES /
              INSAT). The spacecraft is locked above the equator with an orbital
              speed matching Earth's rotation (0 km/h relative velocity),
              providing unbroken hourly tracking of global cyclone spirals and
              weather fronts.
              <span className="fig-credit">
                Source: NASA Applied Remote Sensing Training (ARSET) —
                "Satellites and Sensors"
              </span>
            </figcaption>
          </div>
          <div className="formula-box">
            <div className="formula">T = 2π √(a³/μ)</div>
            <div className="formula-note">
              Kepler's Third Law: orbital period T depends only on the
              semi-major axis a (~ altitude + Earth's radius) and Earth's
              gravitational parameter μ (3.986×10⁵ km³/s²). Plug in a ≈ 7,150 km
              (700 km altitude) and you get T ≈ 98 minutes — that's why Landsat
              and Sentinel-2 orbit roughly every 90–100 minutes, ~14–15 times a
              day.
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Swing a ball on a string: a short string whips around fast, a
                long string swings slowly. Orbits work the same way — altitude
                is the "string length." Fly low (short string) and you race
                around Earth in 90 minutes. Fly all the way out to 36,000 km (a
                very long string) and it takes a full 24 hours to go around once
                — which happens to exactly match how long Earth takes to spin
                once, which is the whole trick behind a geostationary satellite
                appearing to "hover."
              </p>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">Key Terms You Must Know</div>
            <p>
              <strong>Swath:</strong> The strip of Earth's surface imaged in one
              pass. <strong>Revisit Time:</strong> Time between two images of
              the same area. <strong>Repeat Cycle:</strong> Time between two
              identical orbits. <strong>Inclination:</strong> Angle between the
              orbital plane and the equator — polar orbit inclination sits
              between 80° and 100°. <strong>Period:</strong> Time for one full
              orbit.
            </p>
          </div>
          <div className="sensor-comparison">
            <div className="sensor-card passive">
              <div className="sensor-type">Passive Sensor</div>
              <h3>📷 Like a Camera</h3>
              <p>
                Measures radiant energy reflected or emitted by the
                Earth-atmosphere system. Relies on sunlight — only works during
                daytime and can be blocked by clouds.
              </p>
              <p>
                Converted to bio-geophysical quantities like temperature,
                precipitation, and soil moisture.
              </p>
              <div className="examples">
                <span className="example-tag">Landsat OLI/TIRS</span>
                <span className="example-tag">Terra MODIS</span>
                <span className="example-tag">GPM GMI</span>
                <span className="example-tag">GRACE</span>
              </div>
            </div>
            <div className="sensor-card active-s">
              <div className="sensor-type">Active Sensor</div>
              <h3>🔦 Like a Flashlight</h3>
              <p>
                Provides its own energy source. Mostly microwave — penetrates
                clouds and works day or night.
              </p>
              <p>
                Applications include meteorology, surface elevation mapping,
                ocean wind speed measurement.
              </p>
              <div className="examples">
                <span className="example-tag">LiDAR (ICESat-2)</span>
                <span className="example-tag">RADAR (Sentinel-1)</span>
                <span className="example-tag">Scatterometer</span>
                <span className="example-tag">Laser Altimeter</span>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">03.2 / How Sensors Scan</div>
          <h2 className="section-title">Whisk broom vs push broom</h2>
          <p className="section-intro">
            Once a satellite is in the right orbit, it still needs to build a 2D
            image line by line as it flies forward. Two mechanisms dominate —
            the difference matters for reliability and image quality.
          </p>
          <div className="scan-grid">
            <div className="scan-card">
              <div className="scan-type">Whisk Broom</div>
              <h3>🧹 Rotating Mirror Scanner</h3>
              <p>
                A single detector (or small bank) sweeps side-to-side across
                track via an oscillating/rotating mirror, building the image
                line by line as the satellite flies forward.
              </p>
              <div className="scanner-canvas-wrap">
                <canvas id="canvas-whisk" />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-faint)",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Mirror sweeps ±45° across flight direction
              </div>
              <div className="examples">
                <span className="example-tag">Landsat MSS (1972)</span>
                <span className="example-tag">Landsat TM (1984)</span>
                <span className="example-tag">NOAA AVHRR</span>
              </div>
            </div>
            <div className="scan-card">
              <div className="scan-type">Push Broom</div>
              <h3>🧹 CCD Linear Array</h3>
              <p>
                A stationary linear array of thousands of CCD detectors captures
                the entire cross-track line simultaneously. Forward satellite
                velocity provides along-track scan without moving mirrors.
              </p>
              <div className="scanner-canvas-wrap">
                <canvas id="canvas-push" />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-faint)",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Thousands of detectors expose simultaneously
              </div>
              <div className="examples">
                <span className="example-tag">IRS LISS-III &amp; IV</span>
                <span className="example-tag">Sentinel-2 MSI</span>
                <span className="example-tag">SPOT 1-7</span>
              </div>
            </div>
          </div>
          {/* AUTHENTIC SENSOR HARDWARE: WHISK BROOM VS PUSH BROOM */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/platforms/plat-whisk-push-hardware.jpg"
                alt="Whisk broom oscillating mirror vs push broom CCD linear array sensor hardware diagrams"
              />
            </div>
            <figcaption>
              <strong>Scanner Engineering Architecture:</strong> Left:{" "}
              <em>Whisk-Broom (Electromechanical)</em> uses an oscillating
              mirror reflecting energy onto a single detector point. Prone to
              mechanical wear and line striping. Right:{" "}
              <em>Push-Broom (Linear Array)</em> uses a wide strip of thousands
              of micro-detectors exposed simultaneously without moving mirrors.
              Longer dwell time per pixel yields higher signal-to-noise ratio
              (SNR).
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Platforms &amp; Sensors," Shri
                Vinay Kumar
              </span>
            </figcaption>
          </div>
          <div className="tech-detail">
            <div className="label">Why This Matters for Image Processing</div>
            <p>
              Whisk-broom mirrors that wear unevenly cause{" "}
              <strong>line striping / banding</strong> — a systematic
              radiometric error you'll learn to correct in IP.2. Push-broom
              sensors instead suffer from individual dead or miscalibrated
              detector elements, causing <strong>line dropout</strong>. Knowing
              which scanning mechanism produced your image tells you which
              correction to expect.
            </p>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                <strong>Sun-synchronous (LEO)</strong> satellites at 700–800 km
                orbit pole-to-pole, crossing each spot at the same local time —
                ideal for consistent, comparable global monitoring.
              </li>
              <li>
                <strong>Geostationary (GEO)</strong> satellites at ~36,000 km
                hover over one spot, viewing ~45% of Earth continuously — ideal
                for weather.
              </li>
              <li>
                Orbital period follows <strong>Kepler's Third Law</strong> —
                altitude alone determines how often a satellite passes overhead.
              </li>
              <li>
                <strong>Passive sensors</strong> need sunlight;{" "}
                <strong>active sensors</strong> (RADAR, LiDAR) make their own
                signal and work day/night, through clouds.
              </li>
              <li>
                <strong>Whisk broom</strong> = rotating mirror (→ striping
                errors); <strong>push broom</strong> = CCD array, no moving
                parts (→ dropout errors, but higher reliability).
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
