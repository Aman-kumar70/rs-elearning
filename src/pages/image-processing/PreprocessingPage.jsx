import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountPreprocessing } from "@/controllers/preprocessing";

export default function PreprocessingPage() {
  usePageTitle("Radiometric & Geometric Correction — IP.2");
  useLegacyPage(mountPreprocessing);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track B · IP.2 of 5</div>
          <h1>
            Radiometric &amp; <span>Geometric Correction</span>
          </h1>
          <p className="hero-intro">
            Raw satellite data is never perfect — sensors drift, the atmosphere
            interferes, and Earth's curvature and rotation distort geometry.
            Preprocessing fixes these errors before any real analysis begins.
            Skip this step and every measurement downstream is quietly wrong.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="now" />
            <span />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">02.1 / Two Families of Error</div>
          <h2 className="section-title">What goes wrong, and why</h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                <strong>Radiometric errors</strong> corrupt the pixel{" "}
                <em>values</em> — sensor miscalibration, atmospheric haze,
                uneven illumination. <strong>Geometric errors</strong> corrupt
                pixel <em>positions</em> — Earth's rotation and curvature,
                platform attitude, terrain relief.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Radiometric errors make brightness comparisons meaningless (two
                identical fields looking different only because of striping).
                Geometric errors make location comparisons meaningless (a pixel
                that should be at 30.32°N is actually at 30.34°N) — fatal for
                change detection or GIS overlay.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                Radiometric correction models and removes the systematic error
                pattern (interpolate, subtract, normalize). Geometric correction
                fits a mathematical transformation between image coordinates and
                map coordinates using Ground Control Points, then resamples the
                image onto the correct grid.
              </p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-radiometric-errors.jpg"
                alt="Causes of radiometric errors, IIRS slide"
              />
            </div>
            <figcaption>
              Radiometric errors originate in the sensor itself (detector
              miscalibration), the atmosphere (scattering/absorption), and
              geometry of illumination (sun angle, topography).
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun — "Digital Image Processing: Basic
                Concepts," Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">02.2 / Radiometric Correction</div>
          <h2 className="section-title">Fixing pixel values</h2>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/preprocessing/dip-line-dropout.jpg"
                  alt="Line dropout error example"
                />
              </div>
              <figcaption>
                <strong>Line dropout</strong> — an entire scan line records zero
                or garbage values because a detector failed momentarily. Common
                in push-broom sensors (RS.3) when one CCD element malfunctions.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/preprocessing/dip-line-striping.jpg"
                  alt="Line striping / banding error example"
                />
              </div>
              <figcaption>
                <strong>Line striping / banding</strong> — one detector is
                systematically miscalibrated relative to the others, so every
                Nth line is consistently brighter or darker. Common in
                whisk-broom sensors (RS.3) as mirror elements wear differently.
              </figcaption>
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>fix_line_dropout.py</span>
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
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">fix_dropped_lines</span>(band,
                threshold=5):{"\n"}
                {"    "}
                <span className="c-com">
                  """Replace dead scan lines with the average of the line above
                  and below."""
                </span>
                {"\n"}
                {"    "}fixed = band.<span className="c-fn">copy</span>(){"\n"}
                {"    "}row_means = band.<span className="c-fn">mean</span>
                (axis=1){"\n"}
                {"    "}dead_rows = np.<span className="c-fn">where</span>
                (row_means &lt; threshold)[0]{"   "}
                <span className="c-com"># near-zero rows = dropped lines</span>
                {"\n"}
                {"    "}
                <span className="c-kw">for</span> r{" "}
                <span className="c-kw">in</span> dead_rows:{"\n"}
                {"        "}
                <span className="c-kw">if</span> 0 &lt; r &lt; band.shape[0] -
                1:{"\n"}
                {"            "}fixed[r] = ((band[r-1].
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>) +{"\n"}
                {"                         "}band[r+1].
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>)) / 2).
                <span className="c-fn">astype</span>(band.dtype){"\n"}
                {"    "}
                <span className="c-kw">return</span> fixed
              </code>
            </pre>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-haze-correction.jpg"
                alt="Haze correction using dark object subtraction"
              />
            </div>
            <figcaption>
              <strong>Atmospheric haze</strong> scatters extra light into the
              sensor uniformly across a scene, artificially raising every DN.
              Dark Object Subtraction (DOS) finds the darkest pixel in the image
              (theoretically should read ~0, e.g. a deep shadow or clear water
              body) and subtracts its DN from every pixel in that band.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>dark_object_subtraction.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">dark_object_subtraction</span>(band):
                {"\n"}
                {"    "}
                <span className="c-com">
                  """Simple haze correction: subtract the darkest
                  0.1th-percentile DN."""
                </span>
                {"\n"}
                {"    "}haze_value = np.<span className="c-fn">percentile</span>
                (band, 0.1){"\n"}
                {"    "}corrected = np.clip(band.
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>) - haze_value, 0,{" "}
                <span className="c-kw">None</span>){"\n"}
                {"    "}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Removed haze offset: {"{"}haze_value:.1f{"}"} DN"
                </span>
                ){"\n"}
                {"    "}
                <span className="c-kw">return</span> corrected
              </code>
            </pre>
            <div className="out"># Removed haze offset: 312.0 DN</div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-sun-angle-correction.jpg"
                alt="Sun angle correction diagram"
              />
            </div>
            <figcaption>
              <strong>Sun angle correction</strong> normalizes for the Sun's
              elevation angle at capture time, so two images of the same place
              taken in different seasons (different sun angles) become
              radiometrically comparable — essential for any change-detection or
              time-series work.
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">02.3 / Geometric Correction</div>
          <h2 className="section-title">Fixing pixel positions</h2>
          <p className="section-intro">
            Geometric distortion comes from Earth's rotation during the scan,
            sensor viewing angle, platform velocity variations, and terrain
            relief. The fix: rectify the image onto a real map coordinate
            system.
          </p>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-geometric-error-diagram.jpg"
                alt="Geometric error and correction diagram"
              />
            </div>
            <figcaption>
              Raw satellite imagery is distorted relative to a true map
              projection; rectification warps it back onto correct ground
              coordinates.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="pipeline">
            <div className="p-step">
              <div className="p-num">STEP 1</div>
              <h4>Collect GCPs</h4>
              <p>
                Ground Control Points — locations identifiable in both the image
                and a known-accurate map/GPS
              </p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 2</div>
              <h4>Fit transformation</h4>
              <p>
                Polynomial (affine) equations relating image (row,col) to map
                (x,y)
              </p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 3</div>
              <h4>Check RMS error</h4>
              <p>
                Root-mean-square error of GCP fit — should be well under 1 pixel
              </p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 4</div>
              <h4>Resample</h4>
              <p>Interpolate new pixel values onto the corrected grid</p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-ground-control-points.jpg"
                alt="Ground control points example"
              />
            </div>
            <figcaption>
              Ground Control Points (GCPs) — features precisely identifiable in
              both the raw image and a reference map (road intersections,
              bridges, field corners). More, well-distributed GCPs give a more
              reliable transformation.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Imagine stretching a slightly warped photo to match a
                known-accurate map, like fitting a wrinkled sticker onto a phone
                screen. You pin down a handful of points you're sure about —
                "this road crossing in the photo is exactly here on the map" —
                and stretch/rotate everything else to make those pins line up.
                The more pins (GCPs) you use, and the more spread out they are,
                the less wrinkled and more accurate the final fit.
              </p>
            </div>
          </div>
          <div className="section-label" style={{ marginTop: 24 }}>
            02.4 / Resampling
          </div>
          <h2 className="section-title">Filling in the new grid</h2>
          <p className="section-intro">
            Once the transformation is known, the corrected image needs pixel
            values on a brand-new grid — a process called resampling / intensity
            interpolation. Three methods dominate:
          </p>
          <div className="widget-panel">
            <h3>Resampling Sandbox</h3>
            <p className="widget-sub">
              This 5×5 grid holds real DN values. Drag the two sliders to place
              a "query point" — the location the corrected grid needs a value
              for, which almost never lands exactly on an original pixel. Watch
              how Nearest Neighbour and Bilinear disagree.
            </p>
            <div className="resample-lab">
              <svg
                viewBox="0 0 320 320"
                id="resample-svg"
                style={{ width: "100%", maxWidth: 340 }}
              />
              <div className="resample-controls">
                <div className="rc-row">
                  <label>
                    Query X position <span id="rx-val">2.30</span>
                  </label>
                  <input
                    type="range"
                    id="rx-slider"
                    min={0}
                    max={400}
                    defaultValue={230}
                  />
                </div>
                <div className="rc-row">
                  <label>
                    Query Y position <span id="ry-val">1.60</span>
                  </label>
                  <input
                    type="range"
                    id="ry-slider"
                    min={0}
                    max={400}
                    defaultValue={160}
                  />
                </div>
                <div className="resample-results">
                  <div className="resample-result nn">
                    <div className="rr-label">Nearest Neighbour</div>
                    <div className="rr-val" id="nn-result">
                      —
                    </div>
                  </div>
                  <div className="resample-result bl">
                    <div className="rr-label">Bilinear (4-pixel blend)</div>
                    <div className="rr-val" id="bl-result">
                      —
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-resampling-intro.jpg"
                alt="Intensity interpolation resampling overview"
              />
            </div>
            <figcaption>
              Once the output grid is warped and no longer lines up with the
              input pixel grid, every output cell needs a brightness value
              assigned from its nearby input pixels — that assignment process is
              resampling.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/preprocessing/dip-nearest-neighbor.jpg"
                  alt="Nearest neighbor resampling"
                />
              </div>
              <figcaption>
                <strong>Nearest Neighbour</strong> — copies the value of the
                closest original pixel. Fast, preserves original DN values
                exactly (important for classification), but can look blocky.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/preprocessing/dip-bilinear-interpolation.jpg"
                  alt="Bilinear interpolation resampling"
                />
              </div>
              <figcaption>
                <strong>Bilinear</strong> averages the 4 nearest pixels,
                producing a smoother result than nearest neighbour. Alters
                original DN values — prefer nearest neighbour before
                classification, bilinear for visual display.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/preprocessing/dip-cubic-convolution.jpg"
                  alt="Cubic convolution resampling"
                />
              </div>
              <figcaption>
                <strong>Cubic convolution</strong> uses the nearest 16 pixels
                for the smoothest result of the three methods — at the highest
                computational cost.
              </figcaption>
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Resizing a corrected image is like resizing a digital photo, and
                you're choosing how new pixels get invented.{" "}
                <strong>Nearest neighbour</strong> just copies the closest
                original pixel — blocky, but never invents a value that wasn't
                really measured. <strong>Bilinear</strong> blends the 4 closest
                pixels — smoother, like a gentle blur. <strong>Cubic</strong>{" "}
                blends 16 — smoothest of all, like a photo-editing "smart
                resize." For a map you'll look at, smoother is nicer. For data
                you're about to classify (IP.4), you want the honest, un-blended
                original values — so nearest neighbour wins there.
              </p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/preprocessing/dip-dakpathar-real-example.jpg"
                alt="Dakpathar Barrage satellite image rectification example"
              />
            </div>
            <figcaption>
              A real example: the Dakpathar Barrage satellite image before and
              after geometric rectification — note how linear features (the
              barrage itself, roads) straighten and align correctly with true
              ground geometry.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Ms. Minakshi Kumar
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>reproject_with_rasterio.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">import</span> rasterio{"\n"}
                <span className="c-kw">from</span> rasterio.warp{" "}
                <span className="c-kw">import</span>{" "}
                calculate_default_transform, reproject, Resampling{"\n"}
                {"\n"}dst_crs = <span className="c-str">"EPSG:32644"</span>
                {"   "}
                <span className="c-com"># target CRS, e.g. UTM Zone 44N</span>
                {"\n"}
                {"\n"}
                <span className="c-kw">with</span> rasterio.
                <span className="c-fn">open</span>(
                <span className="c-str">"raw_scene.tif"</span>){" "}
                <span className="c-kw">as</span> src:{"\n"}
                {"    "}transform, width, height ={" "}
                <span className="c-fn">calculate_default_transform</span>({"\n"}
                {"        "}src.crs, dst_crs, src.width, src.height,
                *src.bounds){"\n"}
                {"    "}kwargs = src.meta.<span className="c-fn">copy</span>()
                {"\n"}
                {"    "}kwargs.<span className="c-fn">update</span>(crs=dst_crs,
                transform=transform, width=width, height=height){"\n"}
                {"\n"}
                {"    "}
                <span className="c-kw">with</span> rasterio.
                <span className="c-fn">open</span>(
                <span className="c-str">"corrected_scene.tif"</span>,{" "}
                <span className="c-str">"w"</span>, **kwargs){" "}
                <span className="c-kw">as</span> dst:{"\n"}
                {"        "}
                <span className="c-kw">for</span> band{" "}
                <span className="c-kw">in</span>{" "}
                <span className="c-fn">range</span>(1, src.count + 1):{"\n"}
                {"            "}
                <span className="c-fn">reproject</span>({"\n"}
                {"                "}source=rasterio.
                <span className="c-fn">band</span>(src, band),{"\n"}
                {"                "}destination=rasterio.
                <span className="c-fn">band</span>(dst, band),{"\n"}
                {"                "}src_transform=src.transform,
                src_crs=src.crs,{"\n"}
                {"                "}dst_transform=transform, dst_crs=dst_crs,
                {"\n"}
                {"                "}resampling=Resampling.bilinear){"   "}
                <span className="c-com"># or .nearest, .cubic</span>
              </code>
            </pre>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                <strong>Radiometric errors</strong> (line dropout, striping,
                haze, sun angle) corrupt values;{" "}
                <strong>geometric errors</strong> corrupt positions — different
                problems, different fixes.
              </li>
              <li>
                Dead lines are typically patched by interpolating neighbouring
                lines; haze is removed with{" "}
                <strong>Dark Object Subtraction</strong>.
              </li>
              <li>
                Geometric correction fits a transformation from{" "}
                <strong>Ground Control Points</strong>, checked via RMS error,
                then <strong>resamples</strong> onto the correct grid.
              </li>
              <li>
                <strong>Nearest neighbour</strong> preserves original DNs (use
                before classification); <strong>bilinear/cubic</strong> smooth
                the image (use for visual display).
              </li>
              <li>
                In practice, most of this is one function call in{" "}
                <code>rasterio</code> — but knowing what it's doing tells you
                which resampling method and which correction to choose.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
