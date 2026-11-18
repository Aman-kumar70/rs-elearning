import ContentLink from "@/components/ContentLink";
import usePageTitle from "@/hooks/usePageTitle";
import "@/components/RemoteSensingAnimation/rs-process-animation.js";

export default function IntroPage() {
  usePageTitle("Intro to Remote Sensing — RS.0");

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.0 — Introduction</div>
          <h1>
            Intro to <span>Remote Sensing</span>
          </h1>
          <p className="hero-intro">
            Remote sensing is how we study the Earth without touching it. This
            chapter lays the groundwork for Track A: what remote sensing is, the
            six-component process behind every satellite image — animated step
            by step — the real-world problems it is used to solve, and what it
            can and can't do.
          </p>
          <div className="chapter-progress">
            <span className="now" />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">00.1 / The Idea</div>
          <h2 className="section-title">What is remote sensing?</h2>
          <p
            className="section-intro"
            style={{ maxWidth: 760, marginBottom: 8 }}
          >
            Remote sensing is the science of collecting information about an
            object, area, or phenomenon without physically touching it. It
            collects information by detecting and measuring electromagnetic
            energy reflected, emitted, or scattered by objects using sensors
            mounted on satellites, aircraft, drones, or other platforms.
          </p>
          <div className="tech-detail">
            <div className="label">Example</div>
            <p>
              A satellite takes an image of a forest from space. By studying the
              image, scientists can estimate forest cover without visiting every
              part of the forest.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">00.2 / Animation</div>
          <h2 className="section-title">The process, animated</h2>
          <p className="section-intro" style={{ maxWidth: 760 }}>
            Play the full sequence, pause on a stage, jump directly to any
            component, or drag the progress bar. The six stages below explain
            what each scene shows.
          </p>
          <rs-remote-sensing-process-animation>
            <p>
              Loading the interactive animation… The six components of the
              process are described below.
            </p>
          </rs-remote-sensing-process-animation>
          <noscript>
            <p className="anim-noscript">
              The animation requires JavaScript. The six components of the
              process are described below.
            </p>
          </noscript>
        </section>
        <section className="content-section reveal">
          <div className="section-label">00.3 / The Process</div>
          <h2 className="section-title">
            The six components of the remote sensing process
          </h2>
          <div className="step-grid">
            <div className="step-card">
              <div className="sc-num">COMPONENT 1</div>
              <h4>Energy source</h4>
              <p>
                Supplies electromagnetic energy. The Sun is the main source for
                most optical satellite images.
              </p>
            </div>
            <div className="step-card">
              <div className="sc-num">COMPONENT 2</div>
              <h4>Atmosphere</h4>
              <p>
                Radiation passes through gases, aerosols, and clouds that may
                scatter or absorb it.
              </p>
            </div>
            <div className="step-card">
              <div className="sc-num">COMPONENT 3</div>
              <h4>Target interaction</h4>
              <p>
                Earth's surface absorbs, reflects, transmits, or emits energy.
              </p>
            </div>
            <div className="step-card">
              <div className="sc-num">COMPONENT 4</div>
              <h4>Sensor</h4>
              <p>Measures the energy coming from the target.</p>
            </div>
            <div className="step-card">
              <div className="sc-num">COMPONENT 5</div>
              <h4>Data transmission and processing</h4>
              <p>
                Measurements are converted into digital data, corrected, and
                processed into images.
              </p>
            </div>
            <div className="step-card">
              <div className="sc-num">COMPONENT 6</div>
              <h4>Interpretation and application</h4>
              <p>Analysts identify features and extract useful information.</p>
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">00.4 / Why</div>
          <h2 className="section-title">Why remote sensing?</h2>
          <div className="tech-detail" style={{ marginTop: 8 }}>
            <div className="label">Why</div>
            <p>
              Because physical access is often impossible, dangerous, expensive,
              or simply too slow. You can't walk every square kilometre of the
              Amazon to track deforestation, or send a person into a cyclone to
              map flood extent — but a satellite passes over the whole planet
              every few days.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">00.5 / Applications</div>
          <h2 className="section-title">Applications of remote sensing</h2>
          <p className="section-intro" style={{ maxWidth: 760 }}>
            Remote sensing is used across environmental science, engineering,
            agriculture, and public planning.
          </p>
          <div className="app-case-grid">
            <div className="app-case">
              <div className="ac-img-wrap">
                <img
                  src="/assets/images/remote-sensing/intro/intro-app-agriculture.webp"
                  alt="Satellite view of farmland — a patchwork of rectangular fields, with some fields highlighted in bright green, yellow and orange"
                />
              </div>
              <div className="ac-body">
                <h3>Agriculture</h3>
                <ul>
                  <li>Crop-type mapping.</li>
                  <li>Crop growth and vegetation monitoring.</li>
                  <li>Drought and irrigation assessment.</li>
                  <li>Detecting crop stress.</li>
                  <li>Estimating agricultural acreage.</li>
                </ul>
                <p className="ac-caption">
                  Farmland from orbit. Differences in colour and vigour between
                  fields are the starting point for crop-type mapping and growth
                  monitoring.
                </p>
              </div>
            </div>
            <div className="app-case">
              <div className="ac-img-wrap">
                <img
                  src="/assets/images/remote-sensing/intro/intro-app-mineral-exploration.webp"
                  alt="Colour-composite satellite image of a mining and industrial area in rugged terrain, rendered in vivid false colours"
                />
              </div>
              <div className="ac-body">
                <h3>Mineral exploration</h3>
                <ul>
                  <li>Identifying hydrothermal alteration zones</li>
                  <li>Mapping structural traps</li>
                  <li>Topographic and surficial mapping</li>
                  <li>Geophysical anomaly correlation</li>
                  <li>Monitoring mining footprints</li>
                </ul>
                <p className="ac-caption">
                  A colour-enhanced view of a mineral exploration area — such
                  composites help map rock types, alteration zones and
                  structures.
                </p>
              </div>
            </div>
            <div className="app-case">
              <div className="ac-img-wrap">
                <img
                  src="/assets/images/remote-sensing/intro/intro-app-disaster-management.webp"
                  alt="False-colour satellite image showing dense green vegetation with water bodies and wet ground highlighted in bright cyan"
                />
              </div>
              <div className="ac-body">
                <h3>Disaster management</h3>
                <ul>
                  <li>Flood extent mapping.</li>
                  <li>Wildfire monitoring.</li>
                  <li>Landslide assessment.</li>
                  <li>Cyclone and storm damage assessment.</li>
                  <li>Post-disaster planning.</li>
                </ul>
                <p className="ac-caption">
                  Water and wet ground stand out sharply in this composite — the
                  kind of view used to map flood extent and assess storm damage.
                </p>
              </div>
            </div>
            <div className="app-case">
              <div className="ac-img-wrap">
                <img
                  src="/assets/images/remote-sensing/intro/intro-app-military.webp"
                  alt="High-resolution view of a building complex beside a road in arid terrain, with visible damage to one of the structures"
                />
              </div>
              <div className="ac-body">
                <h3>Military reconnaissance</h3>
                <ul>
                  <li>Intelligence gathering</li>
                  <li>Battlefield damage assessment</li>
                  <li>Terrain and mobility analysis</li>
                  <li>Border and maritime surveillance</li>
                  <li>Target identification</li>
                </ul>
                <p className="ac-caption">
                  High spatial detail of a specific site — the level of imagery
                  used for intelligence gathering, damage assessment and
                  surveillance.
                </p>
              </div>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">Beyond These</div>
            <p>
              Other applications include geology, forestry, weather forecasting,
              glaciology, oceanography, archaeology, and urban planning.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">00.6 / Trade-offs</div>
          <h2 className="section-title">
            Advantages and limitations of remote sensing
          </h2>
          <div className="adv-lim-grid">
            <div className="al-card adv">
              <h3>Advantages</h3>
              <ol>
                <li>
                  <strong>Large-area coverage:</strong> One image can cover a
                  very large region.
                </li>
                <li>
                  <strong>Repeated observations:</strong> Supports monitoring of
                  changes over time.
                </li>
                <li>
                  <strong>Access to difficult areas:</strong> Useful in
                  mountains, forests, deserts, and disaster zones.
                </li>
                <li>
                  <strong>Multispectral information:</strong> Reveals properties
                  invisible in ordinary photographs.
                </li>
                <li>
                  <strong>Efficient mapping:</strong> Can support rapid regional
                  mapping and analysis.
                </li>
                <li>
                  <strong>Historical comparison:</strong> Archived imagery helps
                  analyze long-term changes.
                </li>
                <li>
                  <strong>Integration with GIS:</strong> Supports spatial
                  analysis and decision-making.
                </li>
              </ol>
            </div>
            <div className="al-card lim">
              <h3>Limitations</h3>
              <ol>
                <li>
                  <strong>Cloud cover:</strong> Can obstruct optical
                  observations.
                </li>
                <li>
                  <strong>Resolution constraints:</strong> Small features may be
                  missed by coarse-resolution sensors.
                </li>
                <li>
                  <strong>Atmospheric interference:</strong> Scattering and
                  absorption can distort measurements.
                </li>
                <li>
                  <strong>Cost and expertise:</strong> Some high-resolution
                  datasets and advanced processing systems are expensive.
                </li>
                <li>
                  <strong>Interpretation errors:</strong> False features may
                  appear after analysis.
                </li>
                <li>
                  <strong>Ground verification:</strong> Reference observations
                  may be needed to confirm results.
                </li>
                <li>
                  <strong>Temporal limitations:</strong> A satellite may not
                  observe an area as frequently as required.
                </li>
                <li>
                  <strong>Processing challenges:</strong> Data calibration,
                  correction, classification, and accuracy assessment require
                  time.
                </li>
              </ol>
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">What's Next</div>
            <p>
              Remote sensing begins with energy. To understand why different
              surfaces look different, the next concept is electromagnetic
              radiation and its wavelengths.{" "}
              <ContentLink
                to="/remote-sensing/fundamentals"
                style={{ color: "var(--teal)" }}
              >
                Continue to RS.1 — What Is Remote Sensing? →
              </ContentLink>
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="chapter-cta">
            <div className="chapter-cta-copy">
              <div className="section-label">Check Your Understanding</div>
              <h2>Ready to test yourself?</h2>
              <p>
                The eight-question Introduction quiz and both learning
                activities now live on the Knowledge Check page, alongside the
                rest of the course. Instant feedback, per-topic scoring.
              </p>
            </div>
            <ContentLink className="chapter-cta-btn" to="/quiz">
              Take the Quiz <span aria-hidden="true">→</span>
            </ContentLink>
          </div>
        </section>
      </div>
    </>
  );
}
