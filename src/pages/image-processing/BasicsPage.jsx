import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountBasics } from "@/controllers/basics";

export default function BasicsPage() {
  usePageTitle("What Is a Digital Image? — IP.1");
  useLegacyPage(mountBasics);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track B · IP.1 of 5</div>
          <h1>
            What Is a <span>Digital Image?</span>
          </h1>
          <p className="hero-intro">
            Everything in this track — correction, enhancement, classification —
            operates on one underlying object: a grid of numbers. Understand
            that grid, in code, and the rest of Digital Image Processing stops
            feeling abstract.
          </p>
          <div className="chapter-progress">
            <span className="now" />
            <span />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">01.1 / The Core Idea</div>
          <h2 className="section-title">
            An image is a grid of numbers, nothing more
          </h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                A digital image is a two-dimensional array of pixels ("picture
                elements"), where each pixel holds a Digital Number (DN)
                proportional to the energy the sensor recorded at that ground
                location. A multispectral image is several such grids stacked
                together — one per band.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Because numbers can be processed by algorithms. Once a satellite
                scene is "just" a NumPy array, every technique in this course —
                contrast stretching, filtering, NDVI, classification — becomes
                ordinary array arithmetic you can run and inspect.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                Satellite images are usually distributed as GeoTIFFs — files
                that store both the pixel grid <em>and</em> the geographic
                metadata (coordinate system, resolution, extent) needed to place
                every pixel on the map. Python's <code>rasterio</code> library
                reads them directly into NumPy arrays.
              </p>
            </div>
          </div>
          <div className="widget-panel">
            <h3>Pixel &amp; Band Inspector</h3>
            <p className="widget-sub">
              This 8×8 grid is a tiny multispectral "scene" — water, vegetation,
              soil and a road. Click any pixel to see its actual DN values in
              each band, and how those four numbers combine into what you'd see
              on screen.
            </p>
            <div className="band-inspector">
              <div className="bi-grid" id="bi-grid" />
              <div className="bi-panel">
                <div className="bi-title">Selected pixel</div>
                <div className="bi-region" id="bi-region">
                  Click a pixel →
                </div>
                <div className="bi-bars" id="bi-bars" />
                <div className="bi-swatches">
                  <div className="bi-swatch-wrap">
                    <div className="bi-swatch" id="bi-swatch-true" />
                    <div className="bi-swatch-label">
                      True Colour
                      <br />
                      (R-G-B)
                    </div>
                  </div>
                  <div className="bi-swatch-wrap">
                    <div className="bi-swatch" id="bi-swatch-false" />
                    <div className="bi-swatch-label">
                      False Colour
                      <br />
                      (NIR-R-G)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/basics/dip-what-is-digital-image.jpg"
                alt="What is a digital image, IIRS lecture slide"
              />
            </div>
            <figcaption>
              The building blocks: a digital image is made of square pixels
              arranged in rows and columns; a multispectral image stacks several
              single-band images into one "cube."
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun — "Digital Image Processing: Basic
                Concepts," Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>open_image.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">import</span> rasterio{"\n"}
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                {"\n"}
                <span className="c-kw">with</span> rasterio.
                <span className="c-fn">open</span>(
                <span className="c-str">"sentinel2_scene.tif"</span>){" "}
                <span className="c-kw">as</span> src:{"\n"}
                {"    "}image = src.<span className="c-fn">read</span>()
                {"              "}
                <span className="c-com"># shape: (bands, rows, cols)</span>
                {"\n"}
                {"    "}profile = src.profile{"          "}
                <span className="c-com">
                  # CRS, transform, dtype, nodata...
                </span>
                {"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Shape:"</span>, image.shape)
                {"          "}
                <span className="c-com">
                  # e.g. (4, 2048, 2048) — 4 bands, 2048x2048 pixels
                </span>
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Data type:"</span>, image.dtype)
                {"       "}
                <span className="c-com">
                  # e.g. uint16 — this is the radiometric resolution
                </span>
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"DN range:"</span>, image.
                <span className="c-fn">min</span>(),{" "}
                <span className="c-str">"–"</span>, image.
                <span className="c-fn">max</span>()){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"CRS:"</span>, profile[
                <span className="c-str">"crs"</span>]){"          "}
                <span className="c-com"># the coordinate reference system</span>
                {"\n"}
                {"\n"}
                <span className="c-com">
                  # A single pixel's spectral signature: DN in every band, at
                  row=500, col=800
                </span>
                {"\n"}pixel_signature = image[:, 500, 800]{"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Pixel signature:"</span>,
                pixel_signature)
              </code>
            </pre>
            <div className="out">
              # Shape: (4, 2048, 2048)
              <br /># Data type: uint16
              <br /># DN range: 0 – 10847
              <br /># CRS: EPSG:32644
              <br /># Pixel signature: [412 623 388 3140]
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">DN vs. Physical Units</div>
            <p>
              A raw DN is <em>not</em> a physical measurement by itself — it's
              whatever integer the sensor's electronics produced for that photon
              count, scaled by the bit depth (RS.4). Level-2 / L2A products have
              already been converted to physically meaningful units (surface
              reflectance, typically scaled 0–10000 to keep integers), which is
              exactly why RS.6 told you to always reach for L2 data.
            </p>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                A raw DN is like a photo's brightness slider value in an editing
                app — "72" doesn't mean anything on its own; it depends on that
                camera, that lighting, that app's scale. Surface reflectance
                (L2) is more like a percentage: "this surface reflects 23% of
                the light that hit it," a fact about the <em>ground</em>, not
                about the sensor. That's why you can compare L2 reflectance
                values from two completely different satellites, but comparing
                raw DNs from two different sensors is meaningless.
              </p>
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            01.2 / Bands, Stacks &amp; Composites
          </div>
          <h2 className="section-title">
            Turning a stack of grey grids into colour
          </h2>
          <p className="section-intro">
            Each band on its own is a greyscale image. Colour only appears once
            you choose three bands and assign them to your display's Red, Green
            and Blue channels. Which three bands you choose is a deliberate
            decision — not just "how it looks," but which physical property you
            want to see (RS.5 covered why NIR→red false colour is so common).
          </p>
          <div className="code-block">
            <div className="code-head">
              <span>make_composite.py</span>
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
                  # image bands, in order: [Blue, Green, Red, NIR]
                </span>
                {"\n"}blue, green, red, nir = image[0], image[1], image[2],
                image[3]{"\n"}
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">normalize</span>(band):{"\n"}
                {"    "}
                <span className="c-kw">return</span> np.clip((band - np.
                <span className="c-fn">percentile</span>(band, 2)) /{"\n"}
                {"                   "}(np.
                <span className="c-fn">percentile</span>(band, 98) - np.
                <span className="c-fn">percentile</span>(band, 2)), 0, 1){"\n"}
                {"\n"}
                <span className="c-com">
                  # True colour: R-G-B mapped normally
                </span>
                {"\n"}true_colour = np.dstack([
                <span className="c-fn">normalize</span>(red),{" "}
                <span className="c-fn">normalize</span>(green),{" "}
                <span className="c-fn">normalize</span>(blue)]){"\n"}
                {"\n"}
                <span className="c-com">
                  # False colour infrared: NIR-R-G — vegetation glows red
                </span>
                {"\n"}false_colour = np.dstack([
                <span className="c-fn">normalize</span>(nir),{" "}
                <span className="c-fn">normalize</span>(red),{" "}
                <span className="c-fn">normalize</span>(green)]){"\n"}
                {"\n"}fig, ax = plt.<span className="c-fn">subplots</span>(1, 2,
                figsize=(12,6)){"\n"}ax[0].<span className="c-fn">imshow</span>
                (true_colour);{"  "}ax[0].
                <span className="c-fn">set_title</span>(
                <span className="c-str">"True Colour (R-G-B)"</span>){"\n"}
                ax[1].<span className="c-fn">imshow</span>(false_colour); ax[1].
                <span className="c-fn">set_title</span>(
                <span className="c-str">"False Colour (NIR-R-G)"</span>)
              </code>
            </pre>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              Notice the <code>normalize()</code> function above clips to the
              2nd–98th percentile instead of the true min/max. That's not
              arbitrary — it's exactly the <strong>contrast stretch</strong>{" "}
              concept you'll formalize in IP.3. A handful of very bright or very
              dark outlier pixels would otherwise wash out the whole display.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">01.3 / Vector vs Raster</div>
          <h2 className="section-title">One more distinction worth knowing</h2>
          <div className="card-grid">
            <div className="info-card">
              <div
                className="icon"
                style={{
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                ▦
              </div>
              <h3>Raster Data</h3>
              <p>
                A grid of cells, each with a value — satellite imagery,
                elevation models, classified land-cover maps. Great for
                continuous phenomena (temperature, reflectance) and for anything
                a sensor directly measures. Everything in this course is raster.
              </p>
            </div>
            <div className="info-card">
              <div
                className="icon"
                style={{ background: "var(--teal-dim)", color: "var(--teal)" }}
              >
                ✦
              </div>
              <h3>Vector Data</h3>
              <p>
                Points, lines and polygons with attached attributes — a road
                network, administrative boundaries, field parcels. Great for
                discrete, well-defined objects. You'll often overlay vector
                boundaries (a district outline, a farm parcel) on top of raster
                imagery for analysis.
              </p>
            </div>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                A digital image is a <strong>grid of pixels</strong>, each
                holding a DN; a multispectral image stacks one grid per band.
              </li>
              <li>
                Satellite imagery ships as <strong>GeoTIFF</strong>, readable
                directly into a NumPy array with <code>rasterio</code> — pixel
                values <em>and</em> geographic location together.
              </li>
              <li>
                Raw DN ≠ physical reflectance — Level-2 products give you
                calibrated, comparable values.
              </li>
              <li>
                Colour composites are a <strong>choice</strong> of three bands
                mapped to R-G-B — true colour vs false colour serve different
                purposes.
              </li>
              <li>
                Raster (grids, what this whole course works with) and vector
                (points/lines/polygons) are the two fundamental GIS data models.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
