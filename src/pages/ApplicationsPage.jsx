import usePageTitle from "@/hooks/usePageTitle";

export default function ApplicationsPage() {
  usePageTitle("Real-World Applications");

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Both Tracks · Applied</div>
          <h1>
            Real-World <span>Applications</span>
          </h1>
          <p className="hero-intro">
            Every case study below uses the exact concepts from both tracks —
            nothing new to learn, just applied to a real problem. Each includes
            the bands/indices used and the actual workflow, so you can adapt it
            to your own area of interest.
          </p>
        </header>
        <section className="content-section reveal">
          <div className="section-label">Case Study 1</div>
          <span className="app-track-pill ip">RS.2 + IP.3</span>
          <h2 className="section-title">Crop Health &amp; Yield Monitoring</h2>
          <p className="section-intro">
            Farmers and agencies track crop vigour across entire regions using
            time-series NDVI — the vegetation signature from RS.2, applied as a
            repeated measurement rather than a single snapshot.
          </p>
          <div className="tech-detail">
            <div className="label">Workflow</div>
            <p>
              Fetch a cloud-free Sentinel-2 or Resourcesat AWiFS scene every
              5–16 days through a growing season → compute NDVI per date (IP.3)
              → stack into a time series per field → compare against historical
              averages or neighbouring fields to flag stress early, often weeks
              before it's visible on the ground (because NIR reflectance drops
              before visible colour changes — RS.2).
            </p>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>ndvi_timeseries.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">import</span> pandas{" "}
                <span className="c-kw">as</span> pd{"\n"}
                {"\n"}results = []{"\n"}
                <span className="c-kw">for</span> date, scene{" "}
                <span className="c-kw">in</span> scenes_by_date.items():{"\n"}
                {"    "}ndvi = (scene[<span className="c-str">"nir"</span>] -
                scene[<span className="c-str">"red"</span>]) / (scene[
                <span className="c-str">"nir"</span>] + scene[
                <span className="c-str">"red"</span>] + 1e-6){"\n"}
                {"    "}field_mean = ndvi[field_mask].
                <span className="c-fn">mean</span>(){"   "}
                <span className="c-com">
                  # field_mask = boolean array of the farm boundary
                </span>
                {"\n"}
                {"    "}results.append({"{"}
                <span className="c-str">"date"</span>: date,{" "}
                <span className="c-str">"mean_ndvi"</span>: field_mean{"}"})
                {"\n"}
                {"\n"}df = pd.<span className="c-fn">DataFrame</span>(results).
                <span className="c-fn">sort_values</span>(
                <span className="c-str">"date"</span>){"\n"}df.
                <span className="c-fn">plot</span>(x=
                <span className="c-str">"date"</span>, y=
                <span className="c-str">"mean_ndvi"</span>, title=
                <span className="c-str">
                  "Field NDVI Over the Growing Season"
                </span>
                )
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">Case Study 2</div>
          <span className="app-track-pill rs">RS.1 + RS.3</span>
          <h2 className="section-title">Flood Mapping Through Cloud Cover</h2>
          <p className="section-intro">
            Floods happen during monsoons and storms — exactly when optical
            satellites are blind (RS.1: passive sensors need clear sky and
            sunlight). SAR (active microwave, RS.3) sees straight through cloud,
            rain, and darkness, which is why RISAT and Sentinel-1 are the
            standard tools for flood response.
          </p>
          <div className="tech-detail">
            <div className="label">Workflow</div>
            <p>
              SAR measures backscatter — how much of the sent radar pulse
              bounces back. Calm open water acts like a mirror, reflecting the
              pulse away from the sensor (very low backscatter, appears dark).
              Land and vegetation scatter the pulse back diffusely (bright).
              Compare a flood-event SAR image against a pre-flood baseline of
              the same area: newly dark pixels = newly flooded land.
            </p>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>sar_flood_delta.py</span>
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
                <span className="c-com">
                  # Both images: Sentinel-1 VV backscatter, in dB, same area
                </span>
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">flood_extent</span>(pre_event_db,
                during_event_db, threshold_db=-3):{"\n"}
                {"    "}change = during_event_db - pre_event_db{"\n"}
                {"    "}
                <span className="c-com">
                  # A sharp drop in backscatter = surface became smooth = likely
                  flooded
                </span>
                {"\n"}
                {"    "}flood_mask = change &lt; threshold_db{"\n"}
                {"    "}flooded_area_km2 = flood_mask.
                <span className="c-fn">sum</span>() * (10*10) / 1e6{"   "}
                <span className="c-com"># 10m pixels -&gt; km²</span>
                {"\n"}
                {"    "}
                <span className="c-kw">return</span> flood_mask,
                flooded_area_km2{"\n"}
                {"\n"}mask, area = <span className="c-fn">flood_extent</span>
                (pre_flood, during_flood){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Estimated flooded area: {"{"}area:.1f{"}"} km²"
                </span>
                )
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">Case Study 3</div>
          <span className="app-track-pill ip">IP.3 + IP.4</span>
          <h2 className="section-title">
            Deforestation &amp; Land-Cover Change Detection
          </h2>
          <p className="section-intro">
            Classify the same area at two different dates (IP.4), then compare
            pixel by pixel — any pixel that flips from "Forest" to "Bare Soil /
            Cleared" between classifications is flagged as loss.
          </p>
          <div className="code-block">
            <div className="code-head">
              <span>change_detection.py</span>
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
                <span className="c-com">
                  # classified_2020, classified_2025: same-extent classified
                  maps, same class scheme
                </span>
                {"\n"}FOREST, CLEARED = 1, 3{"\n"}
                {"\n"}deforestation_mask = (classified_2020 == FOREST) &amp;
                (classified_2025 == CLEARED){"\n"}pixel_area_ha = (30*30) /
                10000{"   "}
                <span className="c-com">
                  # 30m Landsat pixel -&gt; hectares
                </span>
                {"\n"}lost_hectares = deforestation_mask.
                <span className="c-fn">sum</span>() * pixel_area_ha{"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Forest lost 2020→2025: {"{"}lost_hectares:,.0f{"}"} hectares"
                </span>
                )
              </code>
            </pre>
            <div className="out"># Forest lost 2020→2025: 4,812 hectares</div>
          </div>
          <div className="tech-detail">
            <div className="label">Why Long-Running Missions Matter</div>
            <p>
              This is exactly why Landsat's 50+ year continuous archive (RS.6)
              is irreplaceable — comparable, calibrated imagery going back to
              1972 means you can build a deforestation timeline decades long,
              using consistently processed data rather than piecing together
              incompatible sensors.
            </p>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">Case Study 4</div>
          <span className="app-track-pill rs">RS.2 + RS.4</span>
          <h2 className="section-title">Himalayan Glacier Retreat</h2>
          <p className="section-intro">
            Glacier boundaries are mapped using the snow/ice spectral signature
            (RS.2) — high visible reflectance, sharp drop-off in SWIR —
            automated with a simple band-ratio threshold (the Normalized
            Difference Snow Index, structurally identical to NDVI but using
            Green and SWIR bands instead of NIR and Red).
          </p>
          <div className="formula-box">
            <div className="formula">
              NDSI = (Green − SWIR) / (Green + SWIR)
            </div>
            <div className="formula-note">
              NDSI &gt; 0.4 is the conventional threshold for "snow/ice."
              Comparing glacier-boundary area across decades of Landsat imagery
              (RS.4: choosing 30m spatial resolution matched to the multi-decade
              temporal resolution needed) is the standard method for tracking
              retreat.
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">Case Study 5</div>
          <span className="app-track-pill ip">IP.2 + IP.3</span>
          <h2 className="section-title">Urban Growth Mapping</h2>
          <p className="section-intro">
            City planners track built-up area expansion the same way as
            deforestation, but in reverse — classifying "Built-up" instead of
            "Forest" across a multi-decade Landsat time series, geometrically
            corrected (IP.2) so every year's map aligns to the same pixel grid,
            letting simple subtraction reveal exactly where new construction
            occurred.
          </p>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              Every case study above reuses the same five ingredients: (1) pick
              the right bands based on the signature you care about, (2)
              preprocess and enhance, (3) compute an index or classify, (4)
              compare across time or space, (5) validate. That pattern — not any
              single algorithm — is the actual skill this course teaches.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
