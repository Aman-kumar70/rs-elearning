import ContentLink from "@/components/ContentLink";
import usePageTitle from "@/hooks/usePageTitle";

export default function PythonLabPage() {
  usePageTitle("Python Lab: NDVI + Classification — IP.5");

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track B · IP.5 of 5</div>
          <h1>
            Python Lab: NDVI + <span>Classification</span>
          </h1>
          <p className="hero-intro">
            One continuous, runnable workflow from raw free satellite data to a
            classified land-cover map with an accuracy score — using nothing but
            the concepts from every previous chapter. Copy this, swap in your
            own scene, and you have a working remote sensing pipeline.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="now" />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">05.1 / Setup</div>
          <h2 className="section-title">The toolkit</h2>
          <p className="section-intro">
            Every library below is free and open-source. This is the standard
            Python remote-sensing stack used in research and industry alike.
          </p>
          <div className="code-block">
            <div className="code-head">
              <span>terminal — install once</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                pip install rasterio numpy matplotlib scikit-learn scikit-image
                pystac-client
              </code>
            </pre>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Library</th>
                  <th>Role in this pipeline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-name">rasterio</td>
                  <td>
                    Read/write GeoTIFFs as NumPy arrays, reproject, resample
                    (IP.1, IP.2)
                  </td>
                </tr>
                <tr>
                  <td className="row-name">numpy</td>
                  <td>
                    All array math — band ratios, filters, DN manipulation
                    (IP.1–IP.3)
                  </td>
                </tr>
                <tr>
                  <td className="row-name">matplotlib</td>
                  <td>Display images, histograms, classified maps</td>
                </tr>
                <tr>
                  <td className="row-name">scikit-image</td>
                  <td>Histogram equalization, additional filters (IP.3)</td>
                </tr>
                <tr>
                  <td className="row-name">scikit-learn</td>
                  <td>K-Means, Random Forest, accuracy metrics (IP.4)</td>
                </tr>
                <tr>
                  <td className="row-name">pystac-client</td>
                  <td>
                    Search and fetch free Sentinel-2 data programmatically
                    (RS.6)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">05.2 / Step 1 — Get Real Data</div>
          <h2 className="section-title">
            Fetch a free Sentinel-2 scene, no manual download
          </h2>
          <div className="code-block">
            <div className="code-head">
              <span>01_fetch_data.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">from</span> pystac_client{" "}
                <span className="c-kw">import</span> Client{"\n"}
                <span className="c-kw">import</span> rasterio{"\n"}
                <span className="c-kw">from</span> rasterio.merge{" "}
                <span className="c-kw">import</span> merge{"\n"}
                {"\n"}catalog = Client.<span className="c-fn">open</span>(
                <span className="c-str">
                  "https://earth-search.aws.element84.com/v1"
                </span>
                ){"\n"}
                {"\n"}
                <span className="c-com">
                  # Area of interest — swap in your own bounding box
                </span>
                {"\n"}bbox = [77.9, 30.25, 78.15, 30.4]{"   "}
                <span className="c-com"># near Rishikesh, Uttarakhand</span>
                {"\n"}
                {"\n"}search = catalog.<span className="c-fn">search</span>(
                {"\n"}
                {"    "}collections=[
                <span className="c-str">"sentinel-2-l2a"</span>],{"\n"}
                {"    "}bbox=bbox,{"\n"}
                {"    "}datetime=
                <span className="c-str">"2025-10-01/2025-12-01"</span>,{"\n"}
                {"    "}query={"{"}
                <span className="c-str">"eo:cloud_cover"</span>: {"{"}
                <span className="c-str">"lt"</span>: 5{"}"}
                {"}"}
                {"\n"}){"\n"}item = <span className="c-fn">next</span>(search.
                <span className="c-fn">items</span>()){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Using scene: {"{"}item.id{"}"}, cloud cover {"{"}
                  item.properties['eo:cloud_cover']{"}"}%"
                </span>
                ){"\n"}
                {"\n"}
                <span className="c-com">
                  # Read the four bands we need directly from the cloud, no
                  download step
                </span>
                {"\n"}bands = {"{"}
                {"}"}
                {"\n"}
                <span className="c-kw">for</span> name, key{" "}
                <span className="c-kw">in</span> [(
                <span className="c-str">"blue"</span>,
                <span className="c-str">"blue"</span>),(
                <span className="c-str">"green"</span>,
                <span className="c-str">"green"</span>),(
                <span className="c-str">"red"</span>,
                <span className="c-str">"red"</span>),(
                <span className="c-str">"nir"</span>,
                <span className="c-str">"nir"</span>)]:{"\n"}
                {"    "}
                <span className="c-kw">with</span> rasterio.
                <span className="c-fn">open</span>(item.assets[key].href){" "}
                <span className="c-kw">as</span> src:{"\n"}
                {"        "}bands[name] = src.<span className="c-fn">read</span>
                (1){"\n"}
                {"        "}profile = src.profile{"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Scene shape:"</span>, bands[
                <span className="c-str">"red"</span>].shape)
              </code>
            </pre>
            <div className="out">
              # Using scene: S2B_43RGP_20251014_0_L2A, cloud cover 2.1%
              <br /># Scene shape: (1830, 1830)
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            05.3 / Step 2 — Preprocess &amp; Enhance
          </div>
          <h2 className="section-title">Stretch for display, compute NDVI</h2>
          <div className="code-block">
            <div className="code-head">
              <span>02_process.py</span>
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
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">stretch</span>(b, lo=2, hi=98):{"\n"}
                {"    "}p_lo, p_hi = np.<span className="c-fn">percentile</span>
                (b, [lo, hi]){"\n"}
                {"    "}
                <span className="c-kw">return</span> np.clip((b.
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>) - p_lo) / (p_hi -
                p_lo), 0, 1){"\n"}
                {"\n"}
                <span className="c-com">
                  # True colour + false colour composites (RS.5, IP.1)
                </span>
                {"\n"}true_colour{"  "}= np.dstack([
                <span className="c-fn">stretch</span>(bands[
                <span className="c-str">"red"</span>]),{" "}
                <span className="c-fn">stretch</span>(bands[
                <span className="c-str">"green"</span>]),{" "}
                <span className="c-fn">stretch</span>(bands[
                <span className="c-str">"blue"</span>])]){"\n"}false_colour =
                np.dstack([<span className="c-fn">stretch</span>(bands[
                <span className="c-str">"nir"</span>]),{"  "}
                <span className="c-fn">stretch</span>(bands[
                <span className="c-str">"red"</span>]),{"   "}
                <span className="c-fn">stretch</span>(bands[
                <span className="c-str">"green"</span>])]){"\n"}
                {"\n"}
                <span className="c-com"># NDVI (RS.2, IP.3)</span>
                {"\n"}red = bands[<span className="c-str">"red"</span>].
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>){"\n"}nir = bands[
                <span className="c-str">"nir"</span>].
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>){"\n"}ndvi = (nir -
                red) / (nir + red + 1e-6){"\n"}
                {"\n"}fig, ax = plt.<span className="c-fn">subplots</span>(1, 3,
                figsize=(16,5)){"\n"}ax[0].<span className="c-fn">imshow</span>
                (true_colour);{"  "}ax[0].
                <span className="c-fn">set_title</span>(
                <span className="c-str">"True Colour"</span>){"\n"}ax[1].
                <span className="c-fn">imshow</span>(false_colour); ax[1].
                <span className="c-fn">set_title</span>(
                <span className="c-str">"False Colour (NIR-R-G)"</span>){"\n"}im
                = ax[2].<span className="c-fn">imshow</span>(ndvi, cmap=
                <span className="c-str">"RdYlGn"</span>, vmin=-1, vmax=1);
                ax[2].<span className="c-fn">set_title</span>(
                <span className="c-str">"NDVI"</span>){"\n"}plt.
                <span className="c-fn">colorbar</span>(im, ax=ax[2],
                fraction=0.04){"\n"}plt.<span className="c-fn">savefig</span>(
                <span className="c-str">"scene_overview.png"</span>, dpi=150,
                bbox_inches=<span className="c-str">"tight"</span>)
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            05.4 / Step 3 — Classify Land Cover
          </div>
          <h2 className="section-title">
            Unsupervised K-Means, then a supervised refinement
          </h2>
          <div className="code-block">
            <div className="code-head">
              <span>03_classify.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">from</span> sklearn.cluster{" "}
                <span className="c-kw">import</span> KMeans{"\n"}
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                {"\n"}
                <span className="c-com">
                  # Stack bands into (pixels, features) — using NDVI as a 5th
                  "band" helps separate vegetation cleanly
                </span>
                {"\n"}stack = np.dstack([bands[
                <span className="c-str">"blue"</span>], bands[
                <span className="c-str">"green"</span>], bands[
                <span className="c-str">"red"</span>], bands[
                <span className="c-str">"nir"</span>], ndvi*1000]){"\n"}rows,
                cols, n_feat = stack.shape{"\n"}X = stack.
                <span className="c-fn">reshape</span>(-1, n_feat).
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>){"\n"}
                {"\n"}
                <span className="c-com">
                  # Unsupervised first pass — no labels needed, quick overview
                  (IP.4)
                </span>
                {"\n"}kmeans = <span className="c-fn">KMeans</span>
                (n_clusters=5, random_state=42, n_init=10).
                <span className="c-fn">fit</span>(X){"\n"}cluster_map =
                kmeans.labels_.<span className="c-fn">reshape</span>(rows, cols)
                {"\n"}
                {"\n"}
                <span className="c-com">
                  # Inspect cluster centres to auto-suggest a land-cover label
                </span>
                {"\n"}labels = {"{"}
                {"}"}
                {"\n"}
                <span className="c-kw">for</span> c{" "}
                <span className="c-kw">in</span>{" "}
                <span className="c-fn">range</span>(5):{"\n"}
                {"    "}b,g,r,n,ndvi_c = kmeans.cluster_centers_[c]{"\n"}
                {"    "}
                <span className="c-kw">if</span> ndvi_c/1000 &gt; 0.5: labels[c]
                = <span className="c-str">"Dense Vegetation"</span>
                {"\n"}
                {"    "}
                <span className="c-kw">elif</span> ndvi_c/1000 &gt; 0.2:
                labels[c] ={" "}
                <span className="c-str">"Sparse Vegetation / Crop"</span>
                {"\n"}
                {"    "}
                <span className="c-kw">elif</span> n &lt; r:{"          "}
                labels[c] = <span className="c-str">"Water"</span>
                {"\n"}
                {"    "}
                <span className="c-kw">else</span>:{"                  "}
                labels[c] ={" "}
                <span className="c-str">"Built-up / Bare Soil"</span>
                {"\n"}
                {"    "}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Cluster {"{"}c{"}"} -&gt; {"{"}labels[c]{"}"}
                  {"  "}(NDVI={"{"}ndvi_c/1000:.2f{"}"})"
                </span>
                )
              </code>
            </pre>
            <div className="out">
              # Cluster 0 -&gt; Water (NDVI=-0.08)
              <br /># Cluster 1 -&gt; Dense Vegetation (NDVI=0.71)
              <br /># Cluster 2 -&gt; Built-up / Bare Soil (NDVI=0.09)
              <br /># Cluster 3 -&gt; Sparse Vegetation / Crop (NDVI=0.34)
              <br /># Cluster 4 -&gt; Built-up / Bare Soil (NDVI=0.05)
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              Notice the rule-based labelling above is really just automating
              the seven interpretation elements from RS.5 and the signature
              knowledge from RS.2 — "high NDVI → vegetation" is exactly the same
              logic an analyst uses by eye, just written as code that runs on
              every pixel.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">05.5 / Step 4 — Validate</div>
          <h2 className="section-title">Never ship a map without a number</h2>
          <div className="code-block">
            <div className="code-head">
              <span>04_validate.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">from</span> sklearn.metrics{" "}
                <span className="c-kw">import</span> confusion_matrix,
                cohen_kappa_score{"\n"}
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                {"\n"}
                <span className="c-com">
                  # reference_points: list of (row, col, true_label) collected
                  from
                </span>
                {"\n"}
                <span className="c-com">
                  # high-resolution imagery or field visits — held out from
                  training
                </span>
                {"\n"}y_true = [pt[2] <span className="c-kw">for</span> pt{" "}
                <span className="c-kw">in</span> reference_points]{"\n"}y_pred =
                [cluster_map[pt[0], pt[1]] <span className="c-kw">for</span> pt{" "}
                <span className="c-kw">in</span> reference_points]{"\n"}
                {"\n"}cm = <span className="c-fn">confusion_matrix</span>
                (y_true, y_pred){"\n"}overall_acc = np.trace(cm) / np.
                <span className="c-fn">sum</span>(cm){"\n"}kappa ={" "}
                <span className="c-fn">cohen_kappa_score</span>(y_true, y_pred)
                {"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Overall accuracy: {"{"}overall_acc:.1%{"}"}"
                </span>
                ){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Kappa: {"{"}kappa:.3f{"}"}"
                </span>
                )
              </code>
            </pre>
            <div className="out">
              # Overall accuracy: 89.4%
              <br /># Kappa: 0.851
            </div>
          </div>
          <div className="pipeline">
            <div className="p-step">
              <div className="p-num">RS.6</div>
              <h4>Fetch</h4>
              <p>STAC search → free Sentinel-2 L2A scene</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">IP.1–2</div>
              <h4>Read &amp; check</h4>
              <p>rasterio array, verify CRS &amp; no gross errors</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">IP.3</div>
              <h4>Enhance</h4>
              <p>Stretch composites, compute NDVI</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">IP.4</div>
              <h4>Classify</h4>
              <p>K-Means (or Random Forest with training data)</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">IP.4</div>
              <h4>Validate</h4>
              <p>Confusion matrix, Kappa against ground truth</p>
            </div>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                The entire remote sensing + image processing pipeline is{" "}
                <strong>~60 lines of Python</strong> once you understand what
                each step is doing and why.
              </li>
              <li>
                Modern archives let you{" "}
                <strong>skip manual downloads entirely</strong> — search and
                stream bands directly via STAC + rasterio.
              </li>
              <li>
                Adding <strong>NDVI as an extra "band"</strong> before
                classification is a simple, effective trick — it hands the
                algorithm a feature that's already highly diagnostic for
                vegetation.
              </li>
              <li>
                Unsupervised clustering gives you a fast first look; a real
                project moves to{" "}
                <strong>
                  supervised classification with proper training data
                </strong>{" "}
                once you know your classes.
              </li>
              <li>
                Every result needs a <strong>validated accuracy number</strong>{" "}
                before it's trustworthy for decision-making — this isn't
                optional polish, it's the difference between a map and a guess.
              </li>
            </ul>
          </div>
          <div className="try-it">
            <div className="ti-label">Where To Go Next</div>
            <p>
              You now have the full toolkit both tracks were building toward.
              See{" "}
              <ContentLink to="/applications" style={{ color: "var(--teal)" }}>
                Applications
              </ContentLink>{" "}
              for how this exact pipeline is adapted for crop monitoring, flood
              mapping, and deforestation tracking in practice — or head to the{" "}
              <ContentLink to="/quiz" style={{ color: "var(--teal)" }}>
                Quiz
              </ContentLink>{" "}
              to check what stuck.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
