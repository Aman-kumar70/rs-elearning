import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountSignatures } from "@/controllers/signatures";

export default function SignaturesPage() {
  usePageTitle("Spectral Signatures — RS.2");
  useLegacyPage(mountSignatures);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.2 of 6</div>
          <h1>
            Spectral <span>Signatures</span>
          </h1>
          <p className="hero-intro">
            Every material on Earth has a light "fingerprint" — the unique way
            it reflects and absorbs energy across wavelengths. Learn to read
            these curves and you can tell a satellite image what it's looking
            at, without ever visiting the place.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="now" />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">02.1 / The Concept</div>
          <h2 className="section-title">A "fingerprint" made of light</h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                A spectral signature (or spectral reflectance curve) is a plot
                of a material's reflectance (%) against wavelength. Vegetation,
                water, soil and snow each trace a distinctive curve — that shape{" "}
                <em>is</em> the identity of the material.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Because it's how automated classification works. A computer
                can't "see" a forest the way you do — but it can compare a
                pixel's reflectance pattern across bands to known signatures and
                decide "this pixel is vegetation" with no human ever looking at
                the image.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                Multispectral sensors record reflectance in several discrete
                bands (blue, green, red, NIR, SWIR...). Plotting the DN value of
                a pixel across those bands approximates its spectral curve — the
                more bands, the more precise the fingerprint (hyperspectral
                sensors use hundreds).
              </p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/signatures/sig-vegetation-ideal-curve.jpg"
                alt="Ideal spectral reflectance curve of healthy vegetation, from IIRS lecture"
              />
            </div>
            <figcaption>
              The classic "peak-and-valley" curve of healthy vegetation: low
              reflectance in blue and red (chlorophyll absorption), a small
              green peak (why plants look green), and a sharp jump into the
              near-infrared.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun — "Spectral Signatures and Image
                Interpretation," Dr. Hina Pande
              </span>
            </figcaption>
          </div>
          <div className="sig-visualizer-card">
            <div className="sig-viz-header">
              <div>
                <h3>Interactive Spectral Reflectance Laboratory</h3>
                <p>
                  Compare reflectance fingerprints across wavelengths from
                  visible light (0.4 µm) to short-wave infrared (2.4 µm). Check
                  and uncheck curves to observe where they intersect and differ.
                </p>
              </div>
            </div>
            {/* Checkbox Toggle Controls */}
            <div className="sig-controls-panel">
              <span className="sig-ctrl-title">Active Curves:</span>
              <label
                className="sig-checkbox-label veg active"
                htmlFor="chk-veg"
              >
                <input type="checkbox" id="chk-veg" defaultChecked />
                <span className="sig-chk-indicator" />
                <span>Healthy Vegetation</span>
              </label>
              <label
                className="sig-checkbox-label soil active"
                htmlFor="chk-soil"
              >
                <input type="checkbox" id="chk-soil" defaultChecked />
                <span className="sig-chk-indicator" />
                <span>Dry Bare Soil</span>
              </label>
              <label
                className="sig-checkbox-label water active"
                htmlFor="chk-water"
              >
                <input type="checkbox" id="chk-water" defaultChecked />
                <span className="sig-chk-indicator" />
                <span>Clear Water</span>
              </label>
              <label className="sig-checkbox-label turbid" htmlFor="chk-turbid">
                <input type="checkbox" id="chk-turbid" />
                <span className="sig-chk-indicator" />
                <span>Turbid / Sediment Water</span>
              </label>
              <label
                className="sig-checkbox-label stressed"
                htmlFor="chk-stressed"
              >
                <input type="checkbox" id="chk-stressed" />
                <span className="sig-chk-indicator" />
                <span>Stressed Vegetation</span>
              </label>
            </div>
            {/* Spectral Band Region Strip */}
            <div className="sig-band-strip">
              <div className="sig-band-region vis">Visible (0.4 – 0.7 µm)</div>
              <div className="sig-band-region nir">
                Near-Infrared / NIR (0.7 – 1.3 µm)
              </div>
              <div className="sig-band-region swir1">
                SWIR-1 (1.55 – 1.75 µm)
              </div>
              <div className="sig-band-region swir2">
                SWIR-2 (2.08 – 2.35 µm)
              </div>
            </div>
            {/* Chart Canvas Container */}
            <div className="sig-chart-wrapper">
              <canvas id="sig-chart" />
            </div>
            {/* Dynamic Intersections & Differences Inspector */}
            <div className="sig-analysis-grid" id="sig-analysis-grid">
              <div className="sig-insight-card" id="card-rededge">
                <div className="sig-insight-head">
                  <div className="sig-insight-title">🌱 Red-Edge Crossover</div>
                  <span className="sig-insight-tag">λ ≈ 0.69 – 0.72 µm</span>
                </div>
                <div className="sig-insight-body">
                  <strong>Vegetation crosses Soil:</strong> In the red band
                  (0.66 µm), vegetation reflects only ~5% while soil reflects
                  ~25%. At the Red-Edge, vegetation surges upward by over 40%,
                  intersecting soil at ~0.70 µm and leaving it far behind. This
                  extreme contrast powers <strong>NDVI</strong>.
                </div>
              </div>
              <div className="sig-insight-card" id="card-nirgap">
                <div className="sig-insight-head">
                  <div className="sig-insight-title">
                    ⚡ Maximum NIR Separation
                  </div>
                  <span className="sig-insight-tag">λ ≈ 0.80 – 0.90 µm</span>
                </div>
                <div className="sig-insight-body">
                  <strong>Maximum distance between all 3 curves:</strong>{" "}
                  Vegetation reaches its peak reflectance (~50%), Soil sits at
                  ~33%, and Water plummets to &lt;1% (total absorption). This
                  makes NIR the cleanest band for automated
                  land-water-vegetation segmentation.
                </div>
              </div>
              <div className="sig-insight-card" id="card-swirwater">
                <div className="sig-insight-head">
                  <div className="sig-insight-title">
                    💧 SWIR Water Absorption Dips
                  </div>
                  <span className="sig-insight-tag">
                    λ ≈ 1.4 µm &amp; 1.9 µm
                  </span>
                </div>
                <div className="sig-insight-body">
                  <strong>Moisture Absorption Valleys:</strong> Deep troughs
                  appear in the vegetation curve at 1.4 µm and 1.9 µm due to
                  liquid water inside leaf cells. Dry bare soil shows no sharp
                  dips, providing a quantitative measure of canopy moisture
                  (NDWI).
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">02.2 / Vegetation</div>
          <h2 className="section-title">
            Why healthy plants glow in the infrared
          </h2>
          <p className="section-intro">
            A leaf's cell structure — spongy mesophyll tissue full of air
            pockets — scatters near-infrared light back out extremely
            efficiently, while chlorophyll absorbs blue and red light for
            photosynthesis. Stressed, dying, or sparse vegetation loses this NIR
            reflectance dramatically before it ever turns visibly yellow or
            brown — which is why NIR-based indices can detect crop stress before
            a farmer walking the field would notice it.
          </p>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-needleleaf-broadleaf.jpg"
                  alt="Needle-leaf vs broad-leaf canopy reflectance"
                />
              </div>
              <figcaption>
                Needle-leaf (coniferous) canopies reflect noticeably less NIR
                than broad-leaf (deciduous) canopies — leaf shape and internal
                structure change the signature even within "vegetation."
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-healthy-infected-plants.jpg"
                  alt="Healthy vs infected/stressed plants reflectance curve"
                />
              </div>
              <figcaption>
                Healthy vs. stressed/infected plants: the stressed curve drops
                sharply in the NIR plateau well before any visible colour change
                appears — the basis for early crop-disease and drought
                detection.
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">
              NDVI — Turning the Curve Into One Number
            </div>
            <p>
              The steep rise from red to NIR is so diagnostic that it's been
              condensed into a single index used almost everywhere in
              agriculture and ecology: the{" "}
              <strong>Normalized Difference Vegetation Index</strong>.
            </p>
          </div>
          <div className="formula-box">
            <div className="formula">NDVI = (NIR − Red) / (NIR + Red)</div>
            <div className="formula-note">
              Ranges from −1 to +1. Dense healthy vegetation: 0.6–0.9.
              Sparse/stressed vegetation: 0.2–0.5. Bare soil: near 0. Water:
              negative. You'll compute this yourself with real satellite data in
              the Image Processing track.
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>plot_signature.py</span>
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
                <span className="c-kw">import</span> matplotlib.pyplot{" "}
                <span className="c-kw">as</span> plt{"\n"}
                {"\n"}
                <span className="c-com">
                  # Approximate reflectance (%) at 5 representative wavelengths
                  (µm)
                </span>
                {"\n"}wavelengths = [0.48, 0.56, 0.66, 0.86, 1.65]{"   "}
                <span className="c-com"># Blue, Green, Red, NIR, SWIR</span>
                {"\n"}vegetation{"  "}= [4, 9, 5, 45, 22]{"\n"}dry_soil{"    "}=
                [16, 20, 24, 32, 38]{"\n"}water{"       "}= [7, 5, 3, 1, 0.5]
                {"\n"}
                {"\n"}plt.plot(wavelengths, vegetation,{" "}
                <span className="c-str">'o-'</span>, color=
                <span className="c-str">'green'</span>,{"  "}label=
                <span className="c-str">'Vegetation'</span>){"\n"}
                plt.plot(wavelengths, dry_soil,{"   "}
                <span className="c-str">'o-'</span>, color=
                <span className="c-str">'saddlebrown'</span>, label=
                <span className="c-str">'Dry soil'</span>){"\n"}
                plt.plot(wavelengths, water,{"      "}
                <span className="c-str">'o-'</span>, color=
                <span className="c-str">'blue'</span>,{"  "}label=
                <span className="c-str">'Water'</span>){"\n"}plt.xlabel(
                <span className="c-str">'Wavelength (µm)'</span>); plt.ylabel(
                <span className="c-str">'Reflectance (%)'</span>){"\n"}
                plt.legend(); plt.title(
                <span className="c-str">'Spectral Reflectance Curves'</span>)
                {"\n"}plt.savefig(
                <span className="c-str">'signatures.png'</span>, dpi=150)
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">02.3 / Soil, Water &amp; Snow</div>
          <h2 className="section-title">
            The other three signatures you'll see constantly
          </h2>
          <div className="card-grid">
            <div className="info-card">
              <div
                className="icon"
                style={{
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                🟤
              </div>
              <h3>Soil</h3>
              <p>
                Soil's curve is smoother than vegetation's — no sharp
                chlorophyll dips. Five properties control it, in order of
                importance: <strong>moisture</strong> (wet soil is darker/lower
                reflectance across all wavelengths), organic content,
                structure/texture, iron oxide content (raises reflectance in the
                red, lowers it in green), and surface roughness.
              </p>
            </div>
            <div className="info-card">
              <div
                className="icon"
                style={{ background: "var(--blue-dim)", color: "var(--blue)" }}
              >
                💧
              </div>
              <h3>Water</h3>
              <p>
                Water absorbs NIR and SWIR almost completely — reflectance
                beyond ~0.9 µm is close to zero. This is actually useful: NIR
                bands are the easiest way to draw a clean water/land boundary.
                In the visible range, clear water reflects a little blue-green;
                turbid (sediment-loaded) water reflects more; algae-rich water
                shows a green reflectance peak from chlorophyll.
              </p>
            </div>
            <div className="info-card">
              <div
                className="icon"
                style={{
                  background: "var(--purple-dim)",
                  color: "var(--purple)",
                }}
              >
                ❄️
              </div>
              <h3>Snow</h3>
              <p>
                Fresh snow has very high visible reflectance (up to 80%) but
                drops off in SWIR. Grain size (which increases with age), liquid
                water content (melting snow reflects less), and contamination
                (soot, dust) all shift the curve — so SWIR bands are used to
                distinguish old snow from fresh snow, not just visible
                brightness.
              </p>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-soil-moisture-curve.jpg"
                  alt="Soil moisture effect on reflectance curve"
                />
              </div>
              <figcaption>
                Wet soil vs. dry soil: moisture lowers reflectance across the
                whole curve without changing its shape — the single biggest
                factor in how bright or dark bare ground appears in any image.
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-water-reflectance.jpg"
                  alt="Water spectral reflectance behaviour"
                />
              </div>
              <figcaption>
                Water's reflectance collapses to near-zero beyond the visible
                range — the sharp visible/NIR contrast at a shoreline is exactly
                why NIR is the easiest band for mapping water bodies.
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/signatures/sig-landsat-multiband-real.jpg"
                alt="Same scene imaged in different Landsat bands"
              />
            </div>
            <figcaption>
              The same landscape, imaged in seven different bands (0.45 µm
              through 2.35 µm). Notice how features that are invisible or
              low-contrast in one band become obvious in another — that's the
              spectral signature at work, band by band.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Hina Pande
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/signatures/sig-band-table-applications.jpg"
                alt="Landsat band table with principal applications"
              />
            </div>
            <figcaption>
              A practical band-selection reference: which wavelength range to
              reach for depending on what you're trying to see — coastal water
              clarity, vegetation vigour, soil/vegetation moisture, mineral
              discrimination, or thermal anomalies.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Hina Pande
              </span>
            </figcaption>
          </div>
          {/* AUTHENTIC SATELLITE DATA: TRUE COLOR VS FALSE COLOR COMPOSITE (FCC) */}
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-truecolor-natural.jpg"
                  alt="Landsat True Color Natural RGB composite"
                />
              </div>
              <figcaption>
                <strong>
                  True-Colour Composite (Bands 3, 2, 1 as R, G, B):
                </strong>{" "}
                Replicates human eye perception. Vegetation appears green, soil
                is brown/tan, and water is blue. Notice that subtle differences
                between healthy crops and stressed trees are difficult to
                distinguish.
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/signatures/sig-falsecolor-fcc.jpg"
                  alt="Landsat Standard False Color Infrared FCC composite"
                />
              </div>
              <figcaption>
                <strong>
                  Standard False-Colour Composite (Bands 4, 3, 2 as R, G, B):
                </strong>{" "}
                Assigns high-reflectance Near-Infrared (Band 4) to the Red
                channel. Healthy vegetation glows intense scarlet red; turbid
                water turns cyan-blue; deep clear water turns pitch black.
                <span className="fig-credit">
                  Source: IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              Pick any two materials from the interactive chart above and
              predict which single band would separate them most cleanly — i.e.
              where the vertical gap between their curves is largest. That's
              exactly the logic band ratios and vegetation indices are built on
              (see IP.3, Enhancement).
            </p>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                Every material has a distinctive{" "}
                <strong>spectral reflectance curve</strong> — its identity in
                light.
              </li>
              <li>
                <strong>Vegetation</strong>: low in blue/red (chlorophyll
                absorption), small green peak, sharp NIR jump. Stress shows up
                as an NIR drop before visible colour change.
              </li>
              <li>
                <strong>NDVI = (NIR − Red)/(NIR + Red)</strong> condenses the
                vegetation signature into one comparable number.
              </li>
              <li>
                <strong>Soil</strong> reflectance is dominated by moisture
                content; <strong>water</strong> absorbs almost all NIR/SWIR;{" "}
                <strong>snow</strong> is bright in visible but distinguishable
                by age in SWIR.
              </li>
              <li>
                Classification algorithms (Track B, IP.4) work by comparing a
                pixel's measured signature to known reference signatures.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
