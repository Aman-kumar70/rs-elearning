import ContentLink from "@/components/ContentLink";
import usePageTitle from "@/hooks/usePageTitle";
import ThreeGlobe from "@/components/ThreeGlobe";

export default function HomePage() {
  usePageTitle("Remote Sensing & Image Processing — Interactive Guide");

  return (
    <>
      <div>
        <div className="full-hero">
          <ThreeGlobe />
          <div className="hero-content">
            <div className="hero-tag">
              IIRS-ISRO &amp; NASA ARSET Lectures · Reworked Into a Practical
              Course
            </div>
            <h1>
              Remote Sensing
              <br />
              &amp; <span>Image Processing</span>
            </h1>
            <p>
              Two tracks, one goal: understand satellites well enough to
              actually use their data. Real figures from the source lectures,
              real Python code, real applications — not just theory.
            </p>
          </div>
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <div className="line" />
          </div>
        </div>
        <section className="content-section reveal">
          <div className="section-label">Choose Your Track</div>
          <h2 className="section-title">Two tracks that build on each other</h2>
          <p className="section-intro">
            <strong>Remote Sensing</strong> is about how satellites see Earth —
            physics, orbits, sensors, resolution.{" "}
            <strong>Image Processing</strong> is about what you do with the data
            once you have it — correcting it, enhancing it, and turning pixels
            into information. Most real work needs both. Start with RS if you're
            new to the field; jump to IP if you already know the fundamentals
            and want the hands-on part.
          </p>
          <div className="track-split">
            <ContentLink
              className="track-card rs"
              to="/remote-sensing/fundamentals"
            >
              <div className="track-kicker">Track A · Intro + Six Chapters</div>
              <h2>Remote Sensing Fundamentals</h2>
              <p className="track-desc">
                How electromagnetic energy travels from the Sun to a sensor, why
                materials look different in different wavelengths, how orbits
                and resolution trade off against each other, and how to actually
                read a satellite image.
              </p>
              <div className="track-chapter-list">
                <span>
                  <b>RS.0</b> Intro to Remote Sensing
                </span>
                <span>
                  <b>RS.1</b> What Is Remote Sensing?
                </span>
                <span>
                  <b>RS.2</b> Spectral Signatures
                </span>
                <span>
                  <b>RS.3</b> Orbits &amp; Scanning
                </span>
                <span>
                  <b>RS.4</b> The Four Resolutions
                </span>
                <span>
                  <b>RS.5</b> Reading a Satellite Image
                </span>
                <span>
                  <b>RS.6</b> Satellites &amp; Free Data
                </span>
              </div>
              <div className="tc-cta">Start Track A →</div>
            </ContentLink>
            <ContentLink
              className="track-card ip"
              to="/image-processing/basics"
            >
              <div className="track-kicker">Track B · Five Chapters</div>
              <h2>Digital Image Processing</h2>
              <p className="track-desc">
                What a digital image actually is, how to fix radiometric and
                geometric errors, how to enhance and filter images, how
                classification algorithms turn pixels into land-cover maps —
                with working Python code throughout.
              </p>
              <div className="track-chapter-list">
                <span>
                  <b>IP.1</b> What Is a Digital Image?
                </span>
                <span>
                  <b>IP.2</b> Radiometric &amp; Geometric Correction
                </span>
                <span>
                  <b>IP.3</b> Enhancement, Filtering &amp; Indices
                </span>
                <span>
                  <b>IP.4</b> Classification
                </span>
                <span>
                  <b>IP.5</b> Python Lab: NDVI + Classification
                </span>
              </div>
              <div className="tc-cta">Start Track B →</div>
            </ContentLink>
          </div>
          <div className="topic-grid">
            <ContentLink className="topic-card" to="/applications">
              <div className="tc-num">★</div>
              <div
                className="tc-chip"
                style={{
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                Practical
              </div>
              <h3>Real-World Applications</h3>
              <p>
                Crop monitoring, flood mapping through clouds with SAR,
                deforestation tracking, urban growth, glacier retreat — with the
                actual bands, indices and workflow used for each, and code you
                can run.
              </p>
              <div className="tc-cta">Open →</div>
            </ContentLink>
            <ContentLink className="topic-card" to="/quiz">
              <div className="tc-num">✓</div>
              <div
                className="tc-chip"
                style={{
                  background: "var(--purple-dim)",
                  color: "var(--purple)",
                }}
              >
                Test Yourself
              </div>
              <h3>Knowledge Check</h3>
              <p>
                Questions across both tracks — fundamentals, signatures,
                resolution, preprocessing, enhancement, and classification —
                with instant feedback and a per-topic score.
              </p>
              <div className="tc-cta">Take the quiz →</div>
            </ContentLink>
          </div>
          <div className="tech-detail">
            <div className="label">About This Guide</div>
            <p>
              Content and figures are drawn from IIRS-ISRO Dehradun lecture
              material — "Fundamentals of Remote Sensing" (NASA ARSET),
              "Spectral Signatures and Image Interpretation" (Dr. Hina Pande),
              "Earth Observation Platforms and Sensors" (Shri Vinay Kumar),
              "Digital Image Processing: Basic Concepts" (Ms. Minakshi Kumar),
              and "Digital Image Processing: Image Enhancement" (Dr. Poonam S.
              Tiwari) — combined with original explanations, diagrams and
              runnable Python examples so you can move from theory to practice
              on the same page.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
