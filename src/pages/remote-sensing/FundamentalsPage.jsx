import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountFundamentals } from "@/controllers/fundamentals";

export default function FundamentalsPage() {
  usePageTitle("What Is Remote Sensing? — RS.1");
  useLegacyPage(mountFundamentals);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.1 of 6</div>
          <h1>
            What Is <span>Remote Sensing?</span>
          </h1>
          <p className="hero-intro">
            Remote sensing means learning about an object without touching it —
            and it works because every object on Earth interacts with light in
            its own particular way. This chapter builds the physics you need
            before any of the rest of the course makes sense: what's actually
            flowing from the Sun to a sensor, and why the atmosphere gets in the
            way.
          </p>
          <div className="chapter-progress">
            <span className="now" />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">01.1 / The Idea</div>
          <h2 className="section-title">
            Obtaining information about something without touching it
          </h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                Remote sensing is the science of gathering information about an
                object, area, or phenomenon through analysis of data acquired by
                a device that is not in physical contact with it. A camera, your
                eye, and a satellite sensor are all, technically, remote sensing
                instruments.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Because physical access is often impossible, dangerous,
                expensive, or simply too slow. You can't walk every square
                kilometre of the Amazon to track deforestation, or send a person
                into a cyclone to map flood extent — but a satellite passes over
                the whole planet every few days.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                A sensor measures electromagnetic radiation that has interacted
                with a surface — reflected sunlight, emitted heat, or a radar
                pulse bounced back. The pattern of that energy across
                wavelengths and space is converted into a digital image, which
                is what the rest of this course is about.
              </p>
            </div>
          </div>
          <p className="section-intro" style={{ marginBottom: 8 }}>
            In the remote sensing context specifically, we mean: a sensor
            mounted on a platform (aircraft or satellite) records energy
            reflected or emitted from the Earth's surface, from a distance, and
            that recording is turned into imagery we can interpret.
          </p>
          <div className="widget-panel">
            <h3>Energy Flow: Sun → Earth → Sensor</h3>
            <p className="widget-sub">
              This is the path almost every optical satellite image takes.
              Follow the arrows.
            </p>
            <div className="energy-flow">
              <div className="flow-node sun">
                <div className="circle">☀️</div>
                <div className="label">Sun</div>
                <div className="desc">
                  Emits EM radiation across all wavelengths
                </div>
              </div>
              <div className="flow-arrow">
                <svg viewBox="0 0 160 40">
                  <path
                    d="M5,20 L150,20"
                    stroke="rgba(245,166,35,0.4)"
                    strokeWidth={2}
                    strokeDasharray="6,4"
                  />
                  <circle className="flow-particle" cx={20} cy={20} r={3}>
                    <animate
                      attributeName="cx"
                      values="10;150"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
              <div className="flow-node earth">
                <div className="circle">🌍</div>
                <div className="label">Earth</div>
                <div className="desc">
                  Surface reflects, absorbs, or re-emits the energy
                </div>
              </div>
              <div className="flow-arrow">
                <svg viewBox="0 0 160 40">
                  <path
                    d="M5,20 L150,20"
                    stroke="rgba(45,212,191,0.4)"
                    strokeWidth={2}
                    strokeDasharray="6,4"
                  />
                  <circle
                    className="flow-particle return"
                    cx={20}
                    cy={20}
                    r={3}
                  >
                    <animate
                      attributeName="cx"
                      values="10;150"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
              <div className="flow-node satellite">
                <div className="circle">🛰️</div>
                <div className="label">Sensor</div>
                <div className="desc">
                  Records the returning energy as a digital signal
                </div>
              </div>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">Two Kinds of Remote Sensing</div>
            <p>
              <strong>Passive</strong> sensors use an external energy source —
              usually the Sun. They only work when the source is illuminating
              the target, which is why optical satellites can't see through
              cloud or darkness. <strong>Active</strong> sensors (RADAR, LiDAR)
              carry their own energy source, send it out, and measure what
              bounces back. That means they work day or night and can penetrate
              cloud cover — the trade-off is a more complex sensor and different
              image characteristics (radar images "look" very different from
              optical ones).
            </p>
          </div>
          {/* AUTHENTIC SATELLITE DATA: OPTICAL VS THERMAL VS MICROWAVE SAR */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/fundamentals/fund-optical-thermal-sar.jpg"
                alt="Comparison of Optical Visible/IR, Thermal Infrared, and Active Microwave SAR radar data of the same geographic area"
              />
            </div>
            <figcaption>
              <strong>
                Authentic Multi-Sensor Data: Optical vs. Thermal vs. Active
                Microwave SAR.
              </strong>
              Left: <em>Optical (Visible/NIR)</em> reflects surface albedo in
              daytime, but is completely blocked by monsoon clouds. Center:{" "}
              <em>Thermal Infrared</em> measures day/night radiated heat
              emissions (e.g. sea surface temperatures and volcanic heat).
              Right: <em>Microwave SAR (Synthetic Aperture Radar)</em> emits its
              own 5.6 cm pulses, piercing 100% of dense clouds and rain to
              reveal land surface topography and roughness day or night.
              <span className="fig-credit">
                Source: ISRO IIRS Dehradun — "Earth Observation Platforms and
                Sensors," Shri Vinay Kumar
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">01.2 / Electromagnetic Radiation</div>
          <h2 className="section-title">
            The signal that carries the information
          </h2>
          <p className="section-intro">
            Electromagnetic (EM) radiation travels as waves, described by
            wavelength (distance between wave peaks) and frequency (how many
            waves pass a point per second). These are inversely related — short
            wavelength means high frequency, and vice versa. Different
            wavelengths interact with matter differently, which is the entire
            reason remote sensing works: a leaf and a rooftop reflect the same
            visible light similarly, but wildly differently in near-infrared.
          </p>
          <div className="widget-panel">
            <h3>Wave Lab</h3>
            <p className="widget-sub">
              Drag the sliders to see how wavelength and amplitude change the
              wave — and how that relates to frequency.
            </p>
            <div className="wave-canvas-wrap">
              <canvas id="wave-canvas" />
            </div>
            <div className="wave-controls">
              <div className="wave-control">
                <label>
                  Wavelength (λ) <span id="wl-val">400</span> nm
                </label>
                <input
                  type="range"
                  id="wl-slider"
                  min={380}
                  max={900}
                  defaultValue={400}
                />
              </div>
              <div className="wave-control">
                <label>
                  Amplitude <span id="amp-val">1.0</span>
                </label>
                <input
                  type="range"
                  id="amp-slider"
                  min={20}
                  max={100}
                  defaultValue={70}
                />
              </div>
            </div>
          </div>
          <div className="formula-box">
            <div className="formula">
              c = λ × ν&nbsp;&nbsp;&nbsp;&nbsp;E = h × ν
            </div>
            <div className="formula-note">
              c = speed of light (3×10⁸ m/s), λ = wavelength, ν = frequency, E =
              energy of a photon, h = Planck's constant. Shorter wavelength →
              higher frequency → higher energy. This is why UV and X-rays are
              dangerous and radio waves are not.
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Picture waves in a swimming pool. <strong>Wavelength</strong> is
                the distance between two wave crests. <strong>Frequency</strong>{" "}
                is how many waves smack the pool wall per second. Make the waves
                closer together (shorter wavelength) and more of them arrive per
                second (higher frequency) — and each one hits a little harder
                (more energy). That's the whole formula: short and choppy =
                high-energy (like X-rays); long and lazy = low-energy (like
                radio waves).
              </p>
            </div>
          </div>
          <div className="section-label" style={{ marginTop: 8 }}>
            01.3 / The Full Spectrum
          </div>
          <h2 className="section-title">
            Not just visible light: The Remote Sensing Spectrum
          </h2>
          <p className="section-intro">
            Human eyes only detect an extremely narrow sliver of the
            electromagnetic spectrum (0.4–0.7 µm). Earth observation satellites
            exploit wavelengths from ultraviolet to microwave radar. Slide the
            knob below across the full spectrum to explore each wavelength band,
            its atmospheric transmission, and see which satellite sensors
            operate in it.
          </p>
          <div className="em-explorer" id="em-explorer">
            <div className="em-header-row">
              <div>
                <h3>
                  Interactive Electromagnetic Spectrum &amp; Sensor Tracker
                </h3>
                <p>
                  Drag the slider or click any band to inspect wavelength
                  physics, atmospheric windows, and active satellite
                  constellations.
                </p>
              </div>
              <div className="em-view-toggle">
                <button
                  className="em-toggle-btn active"
                  id="btn-mode-band"
                  type="button"
                >
                  Explore by Band
                </button>
              </div>
            </div>
            {/* Interactive Spectrum Slider & Bar */}
            <div className="spectrum-slider-wrapper">
              <div className="spectrum-bar-full" id="spectrum-bar-full">
                <div
                  className="spectrum-band-step"
                  data-index={0}
                  style={{ background: "#3b0764" }}
                >
                  <span className="band-abbr">GAMMA</span>
                  <span className="band-wl-hint">&lt;0.01 nm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={1}
                  style={{ background: "#312e81" }}
                >
                  <span className="band-abbr">X-RAY</span>
                  <span className="band-wl-hint">0.01-10 nm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={2}
                  style={{ background: "#1e3a8a" }}
                >
                  <span className="band-abbr">UV</span>
                  <span className="band-wl-hint">10-400 nm</span>
                </div>
                <div
                  className="spectrum-band-step active"
                  data-index={3}
                  style={{
                    background:
                      "linear-gradient(to right, #7c3aed, #2563eb, #06b6d4, #16a34a, #eab308, #ea580c, #dc2626)",
                  }}
                >
                  <span className="band-abbr">VISIBLE</span>
                  <span className="band-wl-hint">0.4-0.7 µm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={4}
                  style={{ background: "#991b1b" }}
                >
                  <span className="band-abbr">NIR</span>
                  <span className="band-wl-hint">0.7-1.3 µm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={5}
                  style={{ background: "#c2410c" }}
                >
                  <span className="band-abbr">SWIR</span>
                  <span className="band-wl-hint">1.3-3.0 µm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={6}
                  style={{ background: "#701a75" }}
                >
                  <span className="band-abbr">THERMAL IR</span>
                  <span className="band-wl-hint">3-14 µm</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={7}
                  style={{ background: "#0f766e" }}
                >
                  <span className="band-abbr">MICROWAVE</span>
                  <span className="band-wl-hint">1 mm-1 m</span>
                </div>
                <div
                  className="spectrum-band-step"
                  data-index={8}
                  style={{ background: "#164e63" }}
                >
                  <span className="band-abbr">RADIO</span>
                  <span className="band-wl-hint">&gt;1 m</span>
                </div>
              </div>
              {/* Atmospheric Transmission Ribbon */}
              <div className="atmo-ribbon-wrap">
                <div className="atmo-ribbon-title">
                  <span>Atmospheric Transmission (Opacity vs Windows)</span>
                  <span id="atmo-status-quick">
                    Clear Window (Reflected Solar)
                  </span>
                </div>
                <div className="atmo-ribbon" id="atmo-ribbon">
                  <div
                    className="atmo-segment atmo-blocked"
                    title="Gamma: Blocked by upper atmosphere"
                  />
                  <div
                    className="atmo-segment atmo-blocked"
                    title="X-Ray: Absorbed by O2/N2"
                  />
                  <div
                    className="atmo-segment atmo-blocked"
                    title="UV: Largely absorbed by ozone"
                  />
                  <div
                    className="atmo-segment atmo-open"
                    title="Visible: Transparent optical window"
                  />
                  <div
                    className="atmo-segment atmo-open"
                    title="NIR: High atmospheric transmission"
                  />
                  <div
                    className="atmo-segment atmo-partial"
                    title="SWIR: Windows between H2O absorption bands"
                  />
                  <div
                    className="atmo-segment atmo-partial"
                    title="Thermal IR: 8-14 µm window (H2O/CO2 absorption outside)"
                  />
                  <div
                    className="atmo-segment atmo-open"
                    title="Microwave: Cloud penetrating, transparent window"
                  />
                  <div
                    className="atmo-segment atmo-open"
                    title="Radio: Transparent down to ionospheric cutoff"
                  />
                </div>
              </div>
              {/* Slider range input */}
              <div className="slider-control-bar">
                <input
                  type="range"
                  id="em-spectrum-slider"
                  min={0}
                  max={8}
                  defaultValue={3}
                  step={1}
                  aria-label="Electromagnetic spectrum band selector"
                />
                <div className="slider-ticks" id="slider-ticks">
                  <span className="slider-tick" data-index={0}>
                    Gamma
                  </span>
                  <span className="slider-tick" data-index={1}>
                    X-Ray
                  </span>
                  <span className="slider-tick" data-index={2}>
                    UV
                  </span>
                  <span className="slider-tick active" data-index={3}>
                    Visible
                  </span>
                  <span className="slider-tick" data-index={4}>
                    NIR
                  </span>
                  <span className="slider-tick" data-index={5}>
                    SWIR
                  </span>
                  <span className="slider-tick" data-index={6}>
                    TIR
                  </span>
                  <span className="slider-tick" data-index={7}>
                    Microwave
                  </span>
                  <span className="slider-tick" data-index={8}>
                    Radio
                  </span>
                </div>
              </div>
            </div>
            {/* Dashboard: Band Telemetry Card + Sensors Constellation Matrix */}
            <div className="em-dashboard">
              {/* Left: Band Details Card */}
              <div className="band-details-card" id="band-details-card">
                <div className="band-meta-head">
                  <div className="b-name" id="b-name">
                    Visible Light
                  </div>
                  <div className="b-tag" id="b-range">
                    0.4 – 0.7 µm (400 – 700 nm)
                  </div>
                </div>
                <div className="band-metrics-grid">
                  <div className="b-metric">
                    <div className="bm-label">Frequency (ν)</div>
                    <div className="bm-value" id="b-freq">
                      430 – 750 THz
                    </div>
                  </div>
                  <div className="b-metric">
                    <div className="bm-label">Photon Energy (E)</div>
                    <div className="bm-value" id="b-energy">
                      1.8 – 3.1 eV
                    </div>
                  </div>
                  <div className="b-metric">
                    <div className="bm-label">Radiation Origin</div>
                    <div className="bm-value" id="b-origin">
                      Solar Reflected
                    </div>
                  </div>
                </div>
                <div className="band-desc-text" id="b-desc">
                  What human eyes perceive: Blue (0.4–0.5 µm), Green (0.5–0.6
                  µm), and Red (0.6–0.7 µm). In remote sensing, red is strongly
                  absorbed by chlorophyll for photosynthesis, while green is
                  reflected, giving healthy plants their color.
                </div>
                <div className="band-atmo-status window" id="b-atmo-box">
                  <span style={{ fontSize: 16 }}>🌤️</span>
                  <span id="b-atmo-desc">
                    <strong>Optical Atmospheric Window:</strong> High
                    transmission through the atmosphere. Susceptible to Rayleigh
                    scattering (which makes the sky blue) and cloud obscuration.
                  </span>
                </div>
                <div className="band-uses-tags" id="b-uses">
                  <span className="band-use-pill">
                    True-Colour RGB Composites
                  </span>
                  <span className="band-use-pill">Chlorophyll Absorption</span>
                  <span className="band-use-pill">
                    Water Turbidity &amp; Bathymetry
                  </span>
                  <span className="band-use-pill">
                    Urban &amp; Infrastructure Mapping
                  </span>
                </div>
              </div>
              {/* Right: Satellite Sensors Constellation Matrix */}
              <div className="sensors-panel">
                <div className="sensors-panel-head">
                  <h4>🛰️ Operating Satellite Sensors</h4>
                  <span className="active-count" id="active-sensor-count">
                    6 Active in this Band
                  </span>
                </div>
                {/* Interactive Quick-Filter Chips for Constellations */}
                <div
                  className="sensor-filter-row"
                  title="Click a sensor to highlight its operational spectrum bands"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--text-faint)",
                      marginRight: 4,
                      alignSelf: "center",
                    }}
                  >
                    Filter by Sensor:
                  </span>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="sentinel2"
                  >
                    Sentinel-2 MSI
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="landsat"
                  >
                    Landsat 8/9
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="resourcesat"
                  >
                    Resourcesat-2A
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="cartosat"
                  >
                    Cartosat-3
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="sentinel1"
                  >
                    Sentinel-1 SAR
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="nisar"
                  >
                    NISAR
                  </button>
                  <button
                    type="button"
                    className="sensor-chip"
                    data-sensor="modis"
                  >
                    MODIS
                  </button>
                </div>
                <div className="sensors-list" id="sensors-list">
                  {/* Dynamically populated sensor cards */}
                </div>
              </div>
            </div>
            {/* ISRO / NASA ARSET Pedagogical Insight */}
            <div className="slide-pedagogy-callout">
              <div className="callout-icon">💡</div>
              <div>
                <h5>
                  Why Do Remote Sensing Satellites Avoid Gamma, X-Ray, and Most
                  UV?
                </h5>
                <p>
                  High-energy photons (Gamma, X-Rays) are virtually 100%
                  absorbed by nitrogen, oxygen, and the ozone layer in the upper
                  atmosphere. Furthermore, the Sun emits comparatively little
                  energy in these wavelengths relative to the visible and
                  infrared peak. Satellites designed for Earth observation place
                  their detectors exclusively within{" "}
                  <strong>atmospheric windows</strong> (0.4–2.5 µm, 8–14 µm, and
                  microwave) where radiation can transit from surface to space
                  with minimal atmospheric attenuation.
                </p>
              </div>
            </div>
          </div>
          {/* AUTHENTIC SATELLITE DATA: WATER PENETRATION & COASTAL SCATTERING */}
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/fundamentals/fund-water-penetration.jpg"
                alt="Satellite imagery of coastal waters and coral reefs showing water penetration across optical wavelengths"
              />
            </div>
            <figcaption>
              <strong>
                Wavelength Physics in Action: Water Column Penetration &amp;
                Bathymetry.
              </strong>
              Longer wavelengths (Red &amp; NIR, &gt;0.65 μm) are strongly
              absorbed within the top 0.5–1 metre of water, rendering deep water
              jet black. Conversely, shorter blue and green wavelengths
              (0.45–0.55 μm) penetrate up to 30 metres into clear oligotrophic
              water, allowing satellite sensors to map submerged barrier reefs,
              sandbars, and coastal sediment plumes.
              <span className="fig-credit">
                Source: NASA Applied Remote Sensing Training (ARSET) —
                "Fundamentals of Remote Sensing"
              </span>
            </figcaption>
          </div>
          <div className="tech-detail">
            <div className="label">Why the Atmosphere Matters</div>
            <p>
              Not every wavelength makes it from the ground to a satellite.
              Gases like water vapour, CO₂, and ozone absorb specific wavelength
              bands almost completely. The wavelength ranges that <em>do</em>{" "}
              pass through relatively unobstructed are called{" "}
              <strong>atmospheric windows</strong> — and sensors are
              deliberately designed to operate inside them. This is why
              satellite bands cluster around 0.4–2.5 µm (optical/NIR/SWIR
              window), 8–14 µm (thermal window), and the microwave region (which
              passes through almost unimpeded, including through clouds).
            </p>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Think of the atmosphere as a frosted glass window. Some colours
                of light pass through clearly (the "windows"); others get
                scattered or absorbed and never make it through (like trying to
                shine a UV flashlight through frosted glass — mostly blocked).
                Engineers designing a satellite sensor first ask "which windows
                are actually clear?" and only then decide which wavelengths the
                sensor should look through. Building a sensor for a wavelength
                the atmosphere blocks would be like installing a camera behind a
                brick wall.
              </p>
            </div>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                Remote sensing = gathering information about an object{" "}
                <strong>without physical contact</strong>, by measuring the
                electromagnetic energy it reflects or emits.
              </li>
              <li>
                <strong>Passive sensors</strong> depend on sunlight (optical
                cameras); <strong>active sensors</strong> (RADAR, LiDAR) provide
                their own energy and work day/night, through cloud.
              </li>
              <li>
                Wavelength and frequency are inversely related (c = λν); higher
                frequency = higher photon energy (E = hν).
              </li>
              <li>
                The EM spectrum used in remote sensing spans far beyond visible
                light: <strong>NIR, SWIR, thermal IR, and microwave</strong>{" "}
                each reveal different surface properties.
              </li>
              <li>
                The atmosphere blocks most wavelengths — sensors are built to
                operate inside the <strong>atmospheric windows</strong> that do
                get through.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
