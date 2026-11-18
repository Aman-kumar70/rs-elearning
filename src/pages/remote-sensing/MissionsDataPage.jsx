import ContentLink from "@/components/ContentLink";
import usePageTitle from "@/hooks/usePageTitle";

export default function MissionsDataPage() {
  usePageTitle("Satellites & Free Data — RS.6");

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track A · RS.6 of 6</div>
          <h1>
            Satellites &amp; <span>Free Data</span>
          </h1>
          <p className="hero-intro">
            The theory means nothing until you can get real data in your hands.
            This chapter closes Track A with the major missions worth knowing,
            and — critically — exactly where to download real satellite imagery
            for free, today, with code.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="now" />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">06.1 / Global Missions</div>
          <h2 className="section-title">Major Earth observation satellites</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Agency</th>
                  <th>Country</th>
                  <th>Launched</th>
                  <th>Spatial Res.</th>
                  <th>Key Feature</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-name">Landsat 9</td>
                  <td>NASA / USGS</td>
                  <td>USA</td>
                  <td className="mono">2021</td>
                  <td className="mono-teal">30m / 15m PAN</td>
                  <td>50+ years of continuous Earth observation since 1972</td>
                </tr>
                <tr>
                  <td className="row-name">Sentinel-2</td>
                  <td>ESA</td>
                  <td>Europe</td>
                  <td className="mono">2015</td>
                  <td className="mono-teal">10m</td>
                  <td>13 spectral bands, 5-day revisit with twin satellites</td>
                </tr>
                <tr>
                  <td className="row-name">Sentinel-1</td>
                  <td>ESA</td>
                  <td>Europe</td>
                  <td className="mono">2014</td>
                  <td className="mono-teal">5-20m</td>
                  <td>C-band SAR — sees through clouds, day or night</td>
                </tr>
                <tr>
                  <td className="row-name">SPOT 6/7</td>
                  <td>Airbus</td>
                  <td>France</td>
                  <td className="mono">2012/14</td>
                  <td className="mono-teal">1.5m / 1m PAN</td>
                  <td>Off-nadir viewing, stereo capability</td>
                </tr>
                <tr>
                  <td className="row-name">IKONOS</td>
                  <td>DigitalGlobe</td>
                  <td>USA</td>
                  <td className="mono">1999</td>
                  <td className="mono-teal">1m PAN</td>
                  <td>
                    First commercial satellite with near-photographic quality
                  </td>
                </tr>
                <tr>
                  <td className="row-name">WorldView-3</td>
                  <td>Maxar</td>
                  <td>USA</td>
                  <td className="mono">2014</td>
                  <td className="mono-teal">0.31m</td>
                  <td>Highest resolution commercial satellite, 29 bands</td>
                </tr>
                <tr>
                  <td className="row-name">MODIS (Terra/Aqua)</td>
                  <td>NASA</td>
                  <td>USA</td>
                  <td className="mono">1999/02</td>
                  <td className="mono-teal">250m-1km</td>
                  <td>Daily global coverage, 36 spectral bands</td>
                </tr>
                <tr>
                  <td className="row-name">ALOS-2</td>
                  <td>JAXA</td>
                  <td>Japan</td>
                  <td className="mono">2014</td>
                  <td className="mono-teal">1-3m</td>
                  <td>
                    L-band SAR — forest penetration, deformation monitoring
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="section-label" style={{ marginTop: 8 }}>
            06.2 / India's Sensor Family
          </div>
          <h2 className="section-title">
            LISS, AWiFS &amp; PAN — resolution as a strategy
          </h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Full Name</th>
                  <th>Resolution</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-name">LISS-III</td>
                  <td>Linear Imaging Self-Scanning</td>
                  <td className="mono-teal">23.5 m</td>
                  <td>Land use, agriculture (~Landsat TM equivalent)</td>
                </tr>
                <tr>
                  <td className="row-name">LISS-IV</td>
                  <td>Linear Imaging Self-Scanning</td>
                  <td className="mono-teal">5.8 m</td>
                  <td>Detailed crop mapping, urban monitoring</td>
                </tr>
                <tr>
                  <td className="row-name">AWiFS</td>
                  <td>Advanced Wide Field Sensor</td>
                  <td className="mono-teal">56 m</td>
                  <td>
                    Frequent, wide-area vegetation monitoring (5-day revisit)
                  </td>
                </tr>
                <tr>
                  <td className="row-name">PAN</td>
                  <td>Panchromatic</td>
                  <td className="mono-teal">5.8 – 0.25 m</td>
                  <td>High-resolution mapping, cartography</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="tech-detail">
            <div className="label">How the Family Works Together</div>
            <p>
              Monitoring crop health across India: <strong>AWiFS (56m)</strong>{" "}
              images the whole country every 5 days — spot problems early.{" "}
              <strong>LISS-III (23.5m)</strong> gives district-level detail.{" "}
              <strong>LISS-IV (5.8m)</strong> zooms into specific problem areas.{" "}
              <strong>PAN</strong> (sub-metre) identifies individual farm
              boundaries. This multi-resolution strategy is the backbone of
              India's EO programme design — exactly the resolution trade-off
              from RS.4, deliberately engineered around.
            </p>
          </div>
          <h3 style={{ margin: "32px 0 16px", fontSize: "1.3rem" }}>
            🇮🇳 ISRO Timeline
          </h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-card">
                <div className="tl-year">1988</div>
                <div className="tl-name">IRS-1A</div>
                <div className="tl-desc">
                  India's first operational RS satellite. LISS-I (72m) and
                  LISS-II (36m).
                </div>
                <div className="tl-res">72m / 36m</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-card">
                <div className="tl-year">2005</div>
                <div className="tl-name">CARTOSAT-1</div>
                <div className="tl-desc">
                  First Indian satellite with along-track stereo imaging for 3D
                  terrain mapping.
                </div>
                <div className="tl-res">2.5m PAN stereo</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-card">
                <div className="tl-year">2012</div>
                <div className="tl-name">RISAT-1</div>
                <div className="tl-desc">
                  India's first indigenous SAR satellite — sees through clouds,
                  critical during monsoon.
                </div>
                <div className="tl-res">C-SAR</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-card">
                <div className="tl-year">2019</div>
                <div className="tl-name">Cartosat-3</div>
                <div className="tl-desc">
                  India's highest resolution satellite. PAN at 0.25m.
                </div>
                <div className="tl-res">0.25m PAN</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-card">
                <div className="tl-year">2025</div>
                <div className="tl-name">NISAR (NASA-ISRO)</div>
                <div className="tl-desc">
                  Joint L+S band SAR for ecosystem monitoring, ice dynamics,
                  natural hazards.
                </div>
                <div className="tl-res">L+S SAR</div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">06.3 / Getting Real Data — Free</div>
          <h2 className="section-title">
            Where to download satellite imagery today
          </h2>
          <p className="section-intro">
            Most satellite data is free — no fee, no special access, just
            registration. This is the step most tutorials skip and where most
            beginners get stuck.
          </p>
          <div className="data-source-grid">
            <ContentLink
              className="data-card"
              to="https://bhoonidhi.nrsc.gov.in"
              target="_blank"
              rel="noopener"
            >
              <div className="badge">Free · India</div>
              <h3>Bhoonidhi (NRSC)</h3>
              <p>
                ISRO's official data portal. IRS, Cartosat, Resourcesat, RISAT
                data. Free for registered users.
              </p>
              <div className="url">bhoonidhi.nrsc.gov.in</div>
            </ContentLink>
            <ContentLink
              className="data-card"
              to="https://earthexplorer.usgs.gov"
              target="_blank"
              rel="noopener"
            >
              <div className="badge">Free · USA</div>
              <h3>USGS EarthExplorer</h3>
              <p>
                The largest free archive. Landsat (since 1972), Sentinel-2,
                MODIS. Search by location, date, cloud cover.
              </p>
              <div className="url">earthexplorer.usgs.gov</div>
            </ContentLink>
            <ContentLink
              className="data-card"
              to="https://browser.dataspace.copernicus.eu"
              target="_blank"
              rel="noopener"
            >
              <div className="badge">Free · Europe</div>
              <h3>Copernicus Data Space</h3>
              <p>
                ESA's portal for Sentinel-1 (radar), Sentinel-2 (optical),
                Sentinel-3. 5-day global revisit.
              </p>
              <div className="url">dataspace.copernicus.eu</div>
            </ContentLink>
            <ContentLink
              className="data-card"
              to="https://earthengine.google.com"
              target="_blank"
              rel="noopener"
            >
              <div className="badge">Free · Google</div>
              <h3>Google Earth Engine</h3>
              <p>
                Petabytes of data pre-loaded in the cloud. Write code to process
                imagery without downloading anything.
              </p>
              <div className="url">earthengine.google.com</div>
            </ContentLink>
          </div>
          <div className="tech-detail">
            <div className="label">
              Processing Levels — What "L2A" Actually Means
            </div>
            <p>
              Data ships at different processing stages. <strong>L0/L1</strong>:
              raw or minimally-processed telemetry — not geo-referenced,
              essentially engineering data. <strong>L2</strong>: converted to a
              geophysical quantity (surface reflectance), calibrated and
              geo-referenced — the level you generally want for analysis.{" "}
              <strong>L3/L4</strong>: mapped onto a uniform grid,
              quality-controlled, sometimes combined with models (e.g. NDVI
              composites). For almost any project, look for "L2A" (Sentinel-2)
              or "Collection 2 Level-2" (Landsat) — atmospherically corrected,
              ready to use.
            </p>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Think of a supermarket meal kit. <strong>L0/L1</strong> is raw
                ingredients straight from the farm — flour, eggs, raw wheat —
                technically food, but you can't eat it yet. <strong>L2</strong>{" "}
                is a meal kit with pre-measured, washed, calibrated ingredients
                — ready to cook, comparable across brands.{" "}
                <strong>L3/L4</strong> is the fully cooked, plated meal — just
                serve it. Almost nobody wants raw wheat (L0/L1); almost
                everybody wants at least the meal kit (L2) or better.
              </p>
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>search_and_download.py — programmatic access via STAC</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-com">
                  # Most modern archives (Copernicus, USGS, Planetary Computer)
                  expose a
                </span>
                {"\n"}
                <span className="c-com">
                  # STAC (SpatioTemporal Asset Catalog) API — searchable without
                  a browser.
                </span>
                {"\n"}
                <span className="c-kw">from</span> pystac_client{" "}
                <span className="c-kw">import</span> Client{"\n"}
                {"\n"}catalog = Client.<span className="c-fn">open</span>(
                <span className="c-str">
                  "https://earth-search.aws.element84.com/v1"
                </span>
                ){"\n"}
                {"\n"}search = catalog.<span className="c-fn">search</span>(
                {"\n"}
                {"    "}collections=[
                <span className="c-str">"sentinel-2-l2a"</span>],{"           "}
                <span className="c-com">
                  # atmospherically corrected, analysis-ready
                </span>
                {"\n"}
                {"    "}bbox=[76.7, 30.6, 77.4, 31.2],{"          "}
                <span className="c-com">
                  # [min_lon, min_lat, max_lon, max_lat] — e.g. Dehradun
                </span>
                {"\n"}
                {"    "}datetime=
                <span className="c-str">"2025-10-01/2025-12-31"</span>,{"\n"}
                {"    "}query={"{"}
                <span className="c-str">"eo:cloud_cover"</span>: {"{"}
                <span className="c-str">"lt"</span>: 10{"}"}
                {"}"}
                {"   "}
                <span className="c-com"># &lt; 10% cloud cover only</span>
                {"\n"}){"\n"}
                {"\n"}items = <span className="c-fn">list</span>(search.
                <span className="c-fn">items</span>()){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Found {"{"}len(items){"}"} scenes"
                </span>
                ){"\n"}
                {"\n"}
                <span className="c-com">
                  # Each item exposes direct links to individual bands (COG
                  format)
                </span>
                {"\n"}best = items[0]{"\n"}red_url = best.assets[
                <span className="c-str">"red"</span>].href{"\n"}nir_url =
                best.assets[<span className="c-str">"nir"</span>].href{"\n"}
                <span className="c-fn">print</span>(red_url)
              </code>
            </pre>
            <div className="out">
              # Found 14 scenes
              <br /># https://.../S2B_.../B04.tif
            </div>
          </div>
          <div className="pipeline">
            <div className="p-step">
              <div className="p-num">STEP 1</div>
              <h4>Register</h4>
              <p>Free account on EarthExplorer or Copernicus</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 2</div>
              <h4>Search area</h4>
              <p>Draw a box, or pass a bbox in code</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 3</div>
              <h4>Filter</h4>
              <p>Date range + cloud cover &lt; 10%</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 4</div>
              <h4>Download L2A/L2</h4>
              <p>GeoTIFF bands + metadata</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num">STEP 5</div>
              <h4>Open in Python</h4>
              <p>
                rasterio, QGIS, or Earth Engine — this is where Track B picks up
              </p>
            </div>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                <strong>Landsat</strong> gives the longest continuous record
                (since 1972); <strong>Sentinel-1/2</strong> give free, frequent
                optical + all-weather radar.
              </li>
              <li>
                India's sensor family (AWiFS → LISS-III → LISS-IV → PAN) spans
                56m down to 0.25m by design, not accident.
              </li>
              <li>
                Satellite data is <strong>free</strong> from Bhoonidhi, USGS,
                and Copernicus — registration only.
              </li>
              <li>
                Look for <strong>Level-2A / Level-2</strong> products —
                atmospherically corrected and ready to analyze.
              </li>
              <li>
                Modern archives are <strong>programmatically searchable</strong>{" "}
                via STAC APIs — no browser required, and this is exactly how
                you'll fetch data in the Python Lab (IP.5).
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
