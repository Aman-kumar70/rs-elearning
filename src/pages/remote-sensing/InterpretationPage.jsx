import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountInterpretation } from "@/controllers/interpretation";

export default function InterpretationPage() {
  usePageTitle("Reading a Satellite Image — RS.5");
  useLegacyPage(mountInterpretation);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.5 of 6</div>
          <h1>
            Reading a <span>Satellite Image</span>
          </h1>
          <p className="hero-intro">
            Before you ever run an algorithm, a trained analyst can identify
            most features in a satellite image with the naked eye — using the
            same seven visual clues photo-interpreters have used since aerial
            photography began. This is the skill that makes every other chapter
            useful.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="now" />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">05.1 / The Seven Elements</div>
          <h2 className="section-title">
            The detective clues of image interpretation
          </h2>
          <p className="section-intro">
            Interpretation is the act of examining images to identify objects
            and judge their significance — turning raw pixels into information.
            It's built on comparing what you see against what you already know,
            using seven recurring visual elements.
          </p>
          <div className="interp-grid">
            <div className="interp-card">
              <div className="num">01 / TONE</div>
              <h3>Tone</h3>
              <p>
                The relative brightness or colour of an object. The most
                fundamental element — without tonal difference, none of the
                others would be visible.
              </p>
              <div className="example">
                <strong>Example:</strong> Water is typically dark in NIR; dry
                sand is bright across most bands.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">02 / SHAPE</div>
              <h3>Shape</h3>
              <p>
                The general form, structure or outline of an individual object —
                often the first clue to what something is.
              </p>
              <div className="example">
                <strong>Example:</strong> A perfectly straight line is almost
                always man-made (road, canal, runway); a meandering line is
                usually a natural river.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">03 / SIZE</div>
              <h3>Size</h3>
              <p>
                A function of scale — always judge relative to other objects and
                to the known scale of the image.
              </p>
              <div className="example">
                <strong>Example:</strong> A large rectangular building suggests
                a factory or warehouse; a small one suggests a house.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">04 / PATTERN</div>
              <h3>Pattern</h3>
              <p>
                The spatial arrangement of repeated objects — orderly repetition
                produces a distinctive, recognisable signature.
              </p>
              <div className="example">
                <strong>Example:</strong> Evenly spaced orchard trees or
                regularly spaced houses in a subdivision.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">05 / TEXTURE</div>
              <h3>Texture</h3>
              <p>
                The frequency of tonal change within an area — one of the most
                important elements for distinguishing features, especially in
                radar imagery.
              </p>
              <div className="example">
                <strong>Example:</strong> Forest canopy = coarse, mottled
                texture; still water = smooth, uniform texture.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">06 / SHADOW</div>
              <h3>Shadow</h3>
              <p>
                Reveals the profile and relative height of a target — sometimes
                the only clue to an object's true 3D shape.
              </p>
              <div className="example">
                <strong>Example:</strong> A tower and a flat parking lot marking
                might look identical from directly above; their shadows are
                completely different.
              </div>
            </div>
            <div className="interp-card">
              <div className="num">07 / ASSOCIATION</div>
              <h3>Association</h3>
              <p>
                The relationship between an object and its surroundings —
                proximity to other recognisable features that helps confirm
                identification.
              </p>
              <div className="example">
                <strong>Example:</strong> A school is typically associated with
                playgrounds and sports fields; a factory with rail sidings or
                loading docks.
              </div>
            </div>
          </div>
          {/* Interactive Element Detective */}
          <div className="detective-card">
            <div className="detective-header">
              <div className="detective-title">
                <span className="detective-icon">🔍</span>
                <span>
                  Element Detective — Click a feature to identify its elements
                </span>
              </div>
              <div className="detective-badge" id="det-score-badge">
                0 / 6 found
              </div>
            </div>
            <div className="detective-body">
              <canvas id="detectiveCanvas" width={720} height={400} />
              <div className="detective-panel" id="detectivePanel">
                <div className="dp-placeholder">
                  <div className="dp-icon">👆</div>
                  <div className="dp-text">
                    Click any feature in the scene to analyse it
                  </div>
                </div>
              </div>
            </div>
            <div className="detective-footer">
              <div className="det-legend">
                <span className="det-el-chip" data-el="tone">
                  TONE
                </span>
                <span className="det-el-chip" data-el="shape">
                  SHAPE
                </span>
                <span className="det-el-chip" data-el="size">
                  SIZE
                </span>
                <span className="det-el-chip" data-el="pattern">
                  PATTERN
                </span>
                <span className="det-el-chip" data-el="texture">
                  TEXTURE
                </span>
                <span className="det-el-chip" data-el="shadow">
                  SHADOW
                </span>
                <span className="det-el-chip" data-el="association">
                  ASSOC.
                </span>
              </div>
              <button className="det-reset-btn">↺ Reset Scene</button>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-size-example.jpg"
                alt="Size interpretation example, real image"
              />
              <figcaption>
                Size in context — a racetrack is identified partly by absolute
                size, and confirmed relative to the highway and buildings beside
                it.
                <span className="fig-credit">
                  IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-pattern-example.jpg"
                alt="Pattern interpretation example, real image"
              />
              <figcaption>
                Pattern — evenly spaced orchard rows and grid-planned housing
                are two classic, instantly recognisable spatial patterns.
                <span className="fig-credit">
                  IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-texture-example.jpg"
                alt="Texture interpretation example, real image"
              />
              <figcaption>
                Texture — abrupt tonal mottling versus smooth uniformity; this
                is especially diagnostic in radar imagery where "colour" as we
                know it doesn't exist.
                <span className="fig-credit">
                  IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
            <div className="figure">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-shadow-example.jpg"
                alt="Shadow interpretation example, real image"
              />
              <figcaption>
                Shadow — the only element that reveals height and profile
                directly, turning a flat image into an implicitly 3D one.
                <span className="fig-credit">
                  IIRS-ISRO Dehradun, Dr. Hina Pande
                </span>
              </figcaption>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-association-example.jpg"
                alt="Association interpretation example, real image"
              />
            </div>
            <figcaption>
              Association — features are identified not in isolation but by what
              surrounds them: a runway is confirmed by aircraft, hangars, and
              terminal buildings nearby.
              <span className="fig-credit">
                IIRS-ISRO Dehradun, Dr. Hina Pande
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            05.2 / True Colour vs False Colour
          </div>
          <h2 className="section-title">
            Why satellite images often look "wrong"
          </h2>
          <p className="section-intro">
            A normal colour photograph maps blue-green-red light to
            blue-green-red on your screen — matching human vision. A{" "}
            <strong>false-colour composite</strong> instead assigns a
            non-visible band (usually NIR) to one of the display channels, most
            commonly displaying NIR as red. This is deliberate: it exploits
            vegetation's strong NIR reflectance to make vegetation leap out in
            vivid red, at the cost of no longer looking "natural."
          </p>
          {/* False Colour Band Compositor */}
          <div className="compositor-card">
            <div className="comp-header">
              <div className="comp-title">
                🎨 Interactive Band Compositor — Drag or Tap Bands to RGB
                Display Guns
              </div>
              <div className="comp-presets">
                <button
                  type="button"
                  className="comp-preset-btn active"
                  data-preset="true"
                >
                  Natural Colour (R·G·B)
                </button>
                <button
                  type="button"
                  className="comp-preset-btn"
                  data-preset="fcc"
                >
                  Standard False Colour (NIR·R·G)
                </button>
                <button
                  type="button"
                  className="comp-preset-btn"
                  data-preset="swir"
                >
                  SWIR Agriculture (SWIR·NIR·R)
                </button>
                <button
                  type="button"
                  className="comp-preset-btn"
                  data-preset="snow"
                >
                  Snow vs Cloud (SWIR·NIR·G)
                </button>
                <button
                  type="button"
                  className="comp-preset-btn"
                  data-preset="geology"
                >
                  Geology &amp; Rock (SWIR2·SWIR1·R)
                </button>
              </div>
            </div>
            <div className="comp-body">
              <div className="comp-left">
                <div className="comp-channel-row">
                  <div className="comp-channel-label red-ch">R</div>
                  <div
                    className="comp-channel-slot"
                    id="slot-r"
                    data-channel="r"
                  >
                    <div
                      className="comp-band-pill assigned"
                      data-band="red"
                      draggable="true"
                    >
                      Band 4 · Red (665 nm)
                    </div>
                  </div>
                </div>
                <div className="comp-channel-row">
                  <div className="comp-channel-label green-ch">G</div>
                  <div
                    className="comp-channel-slot"
                    id="slot-g"
                    data-channel="g"
                  >
                    <div
                      className="comp-band-pill assigned"
                      data-band="green"
                      draggable="true"
                    >
                      Band 3 · Green (560 nm)
                    </div>
                  </div>
                </div>
                <div className="comp-channel-row">
                  <div className="comp-channel-label blue-ch">B</div>
                  <div
                    className="comp-channel-slot"
                    id="slot-b"
                    data-channel="b"
                  >
                    <div
                      className="comp-band-pill assigned"
                      data-band="blue"
                      draggable="true"
                    >
                      Band 2 · Blue (490 nm)
                    </div>
                  </div>
                </div>
                <div className="comp-band-pool-wrap">
                  <div className="comp-pool-title">
                    Available Bands (Drag or Click to Swap):
                  </div>
                  <div className="comp-band-pool" id="bandPool" />
                </div>
                <div className="comp-interpretation" id="compInterpretation">
                  <div className="comp-int-title">
                    Operational Interpretation:
                  </div>
                  <div className="comp-int-text" id="compIntText">
                    Vegetation appears green, water appears blue — matching
                    everyday visual experience.
                  </div>
                </div>
              </div>
              <div className="comp-right">
                <canvas id="compositorCanvas" width={340} height={300} />
                <div className="comp-legend" id="compLegend" />
              </div>
            </div>
          </div>
          {/* COMPREHENSIVE FALSE COLOUR THEORY & PHYSICAL MECHANISMS */}
          <div className="tech-detail">
            <div className="label">
              The Physics of Additive RGB Display Synthesis
            </div>
            <p>
              Satellite sensors do not take "colour photographs" — they measure
              reflected electromagnetic energy in discrete spectral intervals
              and record them as{" "}
              <strong>grayscale Digital Numbers (DN: 0–255)</strong>. A computer
              monitor creates all colours through{" "}
              <strong>additive synthesis</strong> using three physical display
              channels: <strong>Red</strong>, <strong>Green</strong>, and{" "}
              <strong>Blue</strong>. Any three satellite bands can be loaded
              into these three guns. When the bands match human vision (Red→Red,
              Green→Green, Blue→Blue), you get a{" "}
              <strong>True Colour Composite</strong>. When non-visible bands
              (such as Near-Infrared or Shortwave-Infrared) are routed into
              visible display guns, you produce a{" "}
              <strong>False Colour Composite (FCC)</strong>.
            </p>
          </div>
          <div className="plain-english">
            <div className="pe-icon">🌿</div>
            <div className="pe-body">
              <div className="pe-label">The Core Question</div>
              <p>
                <strong>
                  Why is healthy vegetation bright red in Standard False Colour?
                </strong>
                <br />
                In a Standard False Colour Composite (CIR / Standard FCC), space
                agencies assign:
                <br />•{" "}
                <strong>Near-Infrared (NIR) Band → Red Display Gun</strong>
                <br />• <strong>Visible Red Band → Green Display Gun</strong>
                <br />• <strong>Visible Green Band → Blue Display Gun</strong>
                <br />
                Healthy plant leaves contain chlorophyll, which absorbs 90–95%
                of visible red light for photosynthesis. However, the spongy
                mesophyll cell structure strongly reflects 40–50% of incoming
                Near-Infrared light to prevent thermal overheating. Routing
                high-intensity NIR into the monitor's Red gun while almost no
                light is sent to the Green gun causes vigorous vegetation to
                blaze in <strong>vibrant crimson red</strong>. If foliage
                suffers drought, pest disease, or dies, the mesophyll collapses
                and NIR reflection plummets, causing the red color to fade to
                dull pink or brown long before human eyes see visible wilting.
              </p>
            </div>
          </div>
          {/* DEFINITIVE FALSE COLOUR INTERPRETATION KEY TABLE */}
          <div className="table-wrap">
            <div style={{ marginBottom: 12 }}>
              <h3
                style={{ fontSize: "1.15rem", color: "#fff", marginBottom: 4 }}
              >
                Standard False Colour (NIR · Red · Green) Interpretation Key
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-dim)",
                  margin: 0,
                }}
              >
                The universal remote sensing field guide for interpreting
                Standard FCC satellite imagery (Landsat Band 4,3,2 / Landsat-8
                Band 5,4,3 / Sentinel-2 Band 8,4,3 / IRS LISS-III Band 3,2,1):
              </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Earth Surface Target</th>
                  <th>Standard FCC Display Colour</th>
                  <th>Physical / Spectral Mechanism</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-name">
                    Dense Healthy Vegetation (Forests, Vigorous Crops)
                  </td>
                  <td style={{ color: "#f87171", fontWeight: 600 }}>
                    Bright Red to Deep Crimson
                  </td>
                  <td>
                    Massive NIR scatter by internal spongy mesophyll → High Red
                    gun DN (~200+); strong visible red absorption by chlorophyll
                    → Low Green gun DN (~25).
                  </td>
                </tr>
                <tr>
                  <td className="row-name">
                    Sparse / Stressed Vegetation, Grassland &amp; Scrub
                  </td>
                  <td style={{ color: "#fb923c", fontWeight: 600 }}>
                    Pale Pink, Tan to Mottled Red
                  </td>
                  <td>
                    Reduced leaf cell density lowers NIR reflectance; dry soil
                    background reflectance mixes into the pixel.
                  </td>
                </tr>
                <tr>
                  <td className="row-name">
                    Clear Deep Water (Lakes, Reservoirs, Open Ocean)
                  </td>
                  <td style={{ color: "#38bdf8", fontWeight: 600 }}>
                    Dark Navy Blue to Jet Black
                  </td>
                  <td>
                    Pure water absorbs nearly 100% of NIR and SWIR radiation,
                    and most visible red. Near-zero radiance enters any gun (DN
                    ≈ 0–5).
                  </td>
                </tr>
                <tr>
                  <td className="row-name">
                    Turbid / Silt-Laden Water (Rivers, Coastal Plumes)
                  </td>
                  <td style={{ color: "#2dd4bf", fontWeight: 600 }}>
                    Cyan to Powder Light Blue
                  </td>
                  <td>
                    Suspended mineral silt and clay scatter visible Green and
                    Red light into the Green and Blue display guns, while NIR
                    remains absorbed.
                  </td>
                </tr>
                <tr>
                  <td className="row-name">
                    Bare Dry Soil &amp; Fallow Fields
                  </td>
                  <td style={{ color: "#fbbf24", fontWeight: 600 }}>
                    Light Brown, Yellow-Grey to White
                  </td>
                  <td>
                    Dry mineral soils exhibit monotonic, steadily rising
                    reflectance from visible to NIR, illuminating all three guns
                    roughly equally.
                  </td>
                </tr>
                <tr>
                  <td className="row-name">Moist / Saturated Soil</td>
                  <td style={{ color: "#a3a3a3", fontWeight: 600 }}>
                    Dark Brown to Dark Greyish-Black
                  </td>
                  <td>
                    Pore water in soil absorbs Near-Infrared energy, drastically
                    lowering overall scene brightness across all channels.
                  </td>
                </tr>
                <tr>
                  <td className="row-name">
                    Urban Built-Up Areas, Concrete &amp; Asphalt
                  </td>
                  <td style={{ color: "#93c5fd", fontWeight: 600 }}>
                    Cyan, Silvery-Grey to Steel Blue
                  </td>
                  <td>
                    Asphalt and concrete reflect evenly across visible Green and
                    Red channels with low-to-medium NIR, producing a
                    characteristic cyan-grey tone.
                  </td>
                </tr>
                <tr>
                  <td className="row-name">Snow &amp; Glacial Ice</td>
                  <td style={{ color: "#ffffff", fontWeight: 600 }}>
                    Brilliant Bright White
                  </td>
                  <td>
                    Extremely high albedo across all visible and NIR bands
                    saturates all three display guns (R=255, G=255, B=255).
                  </td>
                </tr>
                <tr>
                  <td className="row-name">Cloud Cover &amp; Fog</td>
                  <td style={{ color: "#ffffff", fontWeight: 600 }}>
                    Brilliant Bright White
                  </td>
                  <td>
                    Liquid water droplets in dense clouds scatter all optical
                    wavelengths equally. Casts distinct black cloud shadows to
                    the west/northwest.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* COMMON SATELLITE BAND COMBINATIONS GUIDE */}
          <div className="tech-detail" style={{ marginTop: 24 }}>
            <div className="label">
              Major Operational Band Combinations in Space Agencies
            </div>
            <p>
              Beyond Standard False Colour, operational remote sensing workflows
              use specialized combinations tailored to specific physical
              phenomena:
              <br />• <strong>
                Natural / True Colour (Red, Green, Blue):
              </strong>{" "}
              Sentinel-2 (4,3,2) · Landsat-8/9 (4,3,2) · Landsat-7 (3,2,1).
              Matches human vision for public communication and coastal water
              clarity.
              <br />•{" "}
              <strong>
                Standard False Colour / CIR (NIR, Red, Green):
              </strong>{" "}
              Sentinel-2 (8,4,3) · Landsat-8/9 (5,4,3) · IRS LISS-III (3,2,1).
              The gold standard for vegetation biomass, forest cover, and crop
              health.
              <br />• <strong>SWIR Agriculture (SWIR-1, NIR, Red):</strong>{" "}
              Sentinel-2 (11,8,4) · Landsat-8/9 (6,5,4). Sharpens crop vigor,
              soil moisture dynamics, and exposes fresh wildfire burn scars in
              charcoal/red.
              <br />•{" "}
              <strong>
                Snow vs. Cloud Discrimination (SWIR-1, NIR, Green):
              </strong>{" "}
              Sentinel-2 (11,8,3) · Landsat-8/9 (6,5,3). Ice absorbs SWIR
              (turning snow bright cyan/blue), while clouds reflect SWIR
              (remaining brilliant white), effortlessly resolving snowfields
              from cloud tops.
              <br />•{" "}
              <strong>
                Geology &amp; Mineralogy (SWIR-2, SWIR-1, Red):
              </strong>{" "}
              Sentinel-2 (12,11,4) · Landsat-8/9 (7,6,4). Exposes hydrothermal
              alteration minerals, quartzite, and fault lines invisible in
              natural color.
            </p>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-truecolor-falsecolor.jpg"
                alt="True colour vs false colour infrared comparison, real imagery"
              />
            </div>
            <figcaption>
              Side by side: a true-colour image looks like an ordinary aerial
              photo. A colour-infrared (false-colour) image maps NIR→red,
              red→green, green→blue — healthy vegetation becomes vivid red,
              water goes dark blue/black, and subtle vegetation stress becomes
              far easier to spot.
              <span className="fig-credit">
                IIRS-ISRO Dehradun, Dr. Hina Pande
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/remote-sensing/interpretation/interp-stromboli-thermal.jpg"
                alt="Mid-infrared thermal image of Stromboli volcano"
              />
            </div>
            <figcaption>
              A mid-infrared image of Stromboli Island — thermal bands reveal
              the volcano's heat signature, information completely invisible in
              true colour.
              <span className="fig-credit">
                IIRS-ISRO Dehradun, Dr. Hina Pande
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            05.3 / Putting It Together — Real Scenes
          </div>
          <h2 className="section-title">Reading real satellite images</h2>
          <p className="section-intro">
            Here's the payoff: applying all seven elements at once to identify
            real features in real IRS and SPOT imagery, the way an IIRS-trained
            analyst would.
          </p>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/interpretation/interp-saudi-irrigation-circles.jpg"
                  alt="Circular irrigation patterns in Saudi Arabia, IRS LISS-III"
                />
              </div>
              <figcaption>
                Saudi Arabia, IRS-1C LISS-III. The perfectly circular features (
                <strong>shape</strong> + <strong>pattern</strong>) are
                centre-pivot sprinkler irrigation systems. Red = cropped land,
                dark = fallow — the colour alone (tone) tells you which fields
                are currently in use.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/interpretation/interp-goa-india.jpg"
                  alt="Goa, India IRS multispectral image"
                />
              </div>
              <figcaption>
                Goa &amp; Terekhol, India, IRS-1D LISS-III. Sediment plumes from
                the Zuari and Mandovi rivers show as distinct pale patches (
                <strong>tone</strong>); the Dabolim airport runway is a sharp
                straight line (<strong>shape</strong>) confirmed by{" "}
                <strong>association</strong> with terminal buildings.
              </figcaption>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/interpretation/interp-sunderbans.jpg"
                  alt="Sunderbans mangroves, IRS WiFS image"
                />
              </div>
              <figcaption>
                Sunderbans, West Bengal, IRS-1C WiFS. Waters near the coast
                appear light blue in the shallows; mangroves show bright red
                (dense vegetation, high NIR); river-borne sediment disperses
                visibly into the sea (<strong>tone</strong> gradients revealing
                a process, not just an object).
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/remote-sensing/interpretation/interp-dhaka.jpg"
                  alt="Dhaka, Bangladesh, IRS LISS-III+PAN image"
                />
              </div>
              <figcaption>
                Dhaka, Bangladesh, IRS-1C LISS-III+PAN merged. The stadium and
                city airport's distinctive "b"-shaped runway are both
                identifiable purely from <strong>shape</strong> at this
                resolution.
              </figcaption>
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              Next time you open Google Earth or NASA Worldview, pick any
              unfamiliar feature and work through the seven elements in order:
              tone, shape, size, pattern, texture, shadow, association. You'll
              be surprised how often you can identify something — an airport, a
              mine, a reservoir, a farm — without any external information at
              all.
            </p>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                Image interpretation relies on seven visual elements:{" "}
                <strong>
                  tone, shape, size, pattern, texture, shadow, association
                </strong>
                .
              </li>
              <li>
                <strong>Tone</strong> is foundational — without
                brightness/colour contrast none of the other elements would be
                visible at all.
              </li>
              <li>
                <strong>False-colour composites</strong> (commonly NIR→red)
                trade "natural" appearance for dramatically better vegetation
                and water discrimination.
              </li>
              <li>
                Interpretation accuracy depends on the analyst's training,
                knowledge of the area, and the quality/resolution of the
                imagery.
              </li>
              <li>
                These same principles — especially texture and tone — are
                exactly what classification algorithms (IP.4) try to encode
                mathematically.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
