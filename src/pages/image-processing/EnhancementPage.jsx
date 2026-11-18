import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountEnhancement } from "@/controllers/enhancement";

export default function EnhancementPage() {
  usePageTitle("Enhancement, Filtering & Indices — IP.3");
  useLegacyPage(mountEnhancement);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track B · IP.3 of 5</div>
          <h1>
            Enhancement, Filtering <span>&amp; Indices</span>
          </h1>
          <p className="hero-intro">
            Preprocessing fixes errors; enhancement makes correct data easier to
            interpret — for a human eye or a downstream algorithm. This is the
            longest chapter in the course because it's the one you'll use
            constantly: contrast stretching, spatial filters, band ratios,
            vegetation indices, and PCA.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="now" />
            <span />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">03.1 / Contrast Enhancement</div>
          <h2 className="section-title">
            Most raw imagery uses only a sliver of its dynamic range
          </h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                Contrast stretching remaps a narrow range of DN values onto the
                full display range (0–255), so subtle differences become
                visible. Raw sensor data — especially 11/12-bit imagery
                displayed on an 8-bit screen — usually occupies only a small,
                low-contrast slice of the possible range.
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Because a human eye (and many algorithms) can't distinguish DN
                512 from DN 515 when both display as nearly the same shade of
                grey. Stretching those two values apart makes real, meaningful
                differences in the data visible.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                A linear transformation function maps input DN to output DN.
                Min-max stretch uses the image's actual min/max;
                percentage-cutoff and standard-deviation stretches ignore
                extreme outlier pixels for a more robust result; non-linear
                stretches (logarithmic, histogram equalization) redistribute
                contrast unevenly on purpose.
              </p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-minmax-stretch-formula.jpg"
                alt="Min-max stretch transfer function and worked table"
              />
            </div>
            <figcaption>
              The min-max stretch transfer function plotted (Y = aX + b)
              alongside a worked numeric table — the same linear remap you'll
              see coded as one line of NumPy below.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-minmax-stretch-example.jpg"
                alt="Min-max stretch worked example with real DN values"
              />
            </div>
            <figcaption>
              A worked min-max stretch: original DN values (left) are linearly
              remapped to fill 0–255, visibly increasing contrast between values
              that were previously nearly indistinguishable.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun — "Digital Image Processing: Image
                Enhancement," Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="formula-box">
            <div className="formula">
              DN<sub>out</sub> = (DN<sub>in</sub> − Min) / (Max − Min) × 255
            </div>
            <div className="formula-note">
              Linear min-max stretch. Min/Max can come from the true image
              extremes, a fixed percentile cutoff (e.g. 2%–98%, ignoring
              outliers), or the mean ± n standard deviations — each variant
              trades robustness against extreme pixels for how aggressively it
              stretches the "typical" range.
            </div>
          </div>
          <div className="widget-panel stretch-lab">
            <h3>Contrast Stretch Lab</h3>
            <p className="widget-sub">
              This histogram is a real-looking low-contrast image — every DN
              crammed into a narrow band. Drag the cutoff sliders and watch the
              stretch formula spread that narrow band across the full 0–255
              range.
            </p>
            <svg
              viewBox="0 0 600 160"
              className="histogram-svg"
              id="hist-svg"
            />
            <div className="stretch-controls">
              <div>
                <label>
                  Low cutoff (Min){" "}
                  <span className="val" id="lo-val">
                    90
                  </span>
                </label>
                <input
                  type="range"
                  id="lo-slider"
                  min={0}
                  max={254}
                  defaultValue={90}
                />
              </div>
              <div>
                <label>
                  High cutoff (Max){" "}
                  <span className="val" id="hi-val">
                    165
                  </span>
                </label>
                <input
                  type="range"
                  id="hi-slider"
                  min={1}
                  max={255}
                  defaultValue={165}
                />
              </div>
            </div>
            <div className="stretch-strips">
              <div className="stretch-strip-row">
                <div className="ssr-label">Original</div>
                <div className="stretch-strip" id="strip-before" />
              </div>
              <div className="stretch-strip-row">
                <div className="ssr-label">Stretched</div>
                <div className="stretch-strip" id="strip-after" />
              </div>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-before-after-contrast.jpg"
                alt="Before and after effects of contrast stretching, real satellite image"
              />
            </div>
            <figcaption>
              Before and after: the same scene, before stretching (flat,
              low-contrast) and after (features clearly separable) — this single
              operation often does more for visual interpretability than
              anything else in this chapter.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-histogram-equalization.jpg"
                alt="Histogram equalization explanation"
              />
            </div>
            <figcaption>
              <strong>Histogram equalization</strong> — a non-linear stretch
              that redistributes DN values so the output histogram is as uniform
              (flat) as possible, automatically giving the most contrast to the
              most populated brightness ranges. Can be too aggressive for
              imagery with important information in dark shadow or bright cloud
              areas.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-colaba-mumbai-example.jpg"
                alt="Colaba Mumbai real histogram equalization example"
              />
            </div>
            <figcaption>
              Real example — Colaba, Mumbai: original image and histogram (left)
              vs. equalized image and histogram (right). The equalized histogram
              is visibly flatter, and urban/coastal detail becomes far easier to
              distinguish.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>contrast_stretch.py</span>
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
                <span className="c-kw">from</span> skimage{" "}
                <span className="c-kw">import</span> exposure{"\n"}
                {"\n"}
                <span className="c-kw">def</span>{" "}
                <span className="c-fn">linear_stretch</span>(band, low_pct=2,
                high_pct=98):{"\n"}
                {"    "}lo, hi = np.<span className="c-fn">percentile</span>
                (band, [low_pct, high_pct]){"\n"}
                {"    "}stretched = np.clip((band - lo) / (hi - lo), 0, 1) * 255
                {"\n"}
                {"    "}
                <span className="c-kw">return</span> stretched.
                <span className="c-fn">astype</span>(
                <span className="c-str">"uint8"</span>){"\n"}
                {"\n"}
                <span className="c-com">
                  # Histogram equalization — one line with scikit-image
                </span>
                {"\n"}equalized = exposure.
                <span className="c-fn">equalize_hist</span>(band){"\n"}
                {"\n"}
                <span className="c-com">
                  # CLAHE — adaptive equalization, avoids over-amplifying noise
                  in flat regions
                </span>
                {"\n"}clahe = exposure.
                <span className="c-fn">equalize_adapthist</span>(band / band.
                <span className="c-fn">max</span>(), clip_limit=0.03)
              </code>
            </pre>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-density-slicing.jpg"
                alt="Density slicing real example"
              />
            </div>
            <figcaption>
              <strong>Density slicing</strong> — a related, even simpler
              technique: instead of a smooth stretch, the continuous grey range
              is sliced into discrete intervals, each shown as a flat colour.
              It's the fastest way to make a single band (like a thermal band)
              instantly readable, at the cost of losing fine gradation within
              each slice.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">03.2 / Spatial Filtering</div>
          <h2 className="section-title">
            Convolution: the operation behind every filter
          </h2>
          <p className="section-intro">
            Spatial filters change a pixel's value based on its neighbours,
            using a small moving window ("kernel" or "mask"). This single
            mechanism — convolution — implements smoothing, sharpening, noise
            removal, and edge detection, just by changing the numbers in the
            kernel.
          </p>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-convolution-process1.jpg"
                  alt="Convolution process step 1, kernel placed on window"
                />
              </div>
              <figcaption>
                A small kernel (e.g. 3×3) is placed over each pixel
                neighbourhood in turn.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-convolution-process2.jpg"
                  alt="Convolution process step 2, weighted sum computed"
                />
              </div>
              <figcaption>
                Each neighbouring DN is multiplied by the corresponding kernel
                weight, and the results are summed — that sum becomes the new
                central pixel's value.
              </figcaption>
            </div>
          </div>
          <div className="formula-box">
            <div className="formula">
              BV<sub>out</sub> = ΣΣ (kernel × window) ÷ Σ(kernel)
            </div>
            <div className="formula-note">
              The heart of spatial filtering — a weighted average of a pixel's
              neighbourhood. A uniform kernel of all 1s produces smoothing; a
              kernel with negative side-weights and a large positive centre
              produces sharpening.
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Imagine asking each pixel "what do you think your new value
                should be?" and it answers by polling its neighbours and
                averaging their opinions — that's smoothing (blur). Now imagine
                it instead asks "how different am I from my neighbours?" and
                boosts itself when it disagrees strongly with them — that's edge
                detection (it lights up exactly where things change fast, like a
                coastline or a road edge, and stays quiet everywhere flat and
                uniform).
              </p>
            </div>
          </div>
          <div className="widget-panel">
            <h3>Convolution Playground</h3>
            <p className="widget-sub">
              This 6×6 grid has a bright region meeting a dark one — like a
              river bank or a field boundary. Pick a kernel, then click any
              interior pixel to see its 3×3 neighbourhood and watch the output
              value computed live.
            </p>
            <div className="conv-kernel-picker" id="conv-kernel-picker">
              <div className="conv-kernel-btn active" data-k="identity">
                Identity
              </div>
              <div className="conv-kernel-btn" data-k="smooth">
                Smooth (Low-pass)
              </div>
              <div className="conv-kernel-btn" data-k="sharpen">
                Sharpen (High-pass)
              </div>
              <div className="conv-kernel-btn" data-k="edge">
                Edge Detect
              </div>
            </div>
            <div className="conv-lab">
              <div className="conv-grid" id="conv-grid" />
              <div className="conv-readout">
                <div className="conv-readout" id="conv-formula-wrap">
                  <div className="cr-formula" id="cr-formula">
                    Click a pixel (not on the outer edge) to compute its
                    filtered value.
                  </div>
                  <div className="cr-result" id="cr-result" />
                </div>
              </div>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-lowpass-mean-filter.jpg"
                  alt="Low pass mean filter results at different kernel sizes"
                />
              </div>
              <figcaption>
                <strong>Low-pass (smoothing) filter</strong> — averages
                neighbours, suppressing high-frequency detail and noise. Larger
                kernels (3×3 → 5×5 → 7×7) blur progressively more.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-highpass-filtering.jpg"
                  alt="High pass filtering example"
                />
              </div>
              <figcaption>
                <strong>High-pass (sharpening) filter</strong> — accentuates
                rapid local changes, making edges and fine detail more prominent
                at the cost of amplifying noise.
              </figcaption>
            </div>
          </div>
          <div className="figure-row">
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-edge-detection-zerosum.jpg"
                  alt="Edge detection zero-sum kernel example"
                />
              </div>
              <figcaption>
                <strong>Edge detection</strong> kernels sum to zero — flat,
                uniform regions output near-zero, while sharp brightness
                transitions (edges) produce strong positive or negative
                responses.
              </figcaption>
            </div>
            <div className="figure">
              <div className="figure-img-wrap">
                <img
                  src="/assets/images/image-processing/enhancement/enh-edge-detectors-compare.jpg"
                  alt="Comparison of Roberts, Sobel, Prewitt edge detectors"
                />
              </div>
              <figcaption>
                Different edge-detector kernels (Roberts, Sobel, Prewitt) each
                weight neighbouring pixels differently — producing similar but
                distinguishable edge maps from the same source image.
              </figcaption>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-sobel-operator.jpg"
                alt="Sobel operator formula and kernels"
              />
            </div>
            <figcaption>
              The Sobel operator — separate horizontal and vertical kernels are
              convolved independently, then combined (X² + Y²)^0.5 to give edge
              magnitude regardless of orientation.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>spatial_filters.py</span>
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
                <span className="c-kw">from</span> scipy.ndimage{" "}
                <span className="c-kw">import</span> convolve, sobel{"\n"}
                {"\n"}
                <span className="c-com">
                  # Low-pass 3x3 mean filter — smoothing
                </span>
                {"\n"}mean_kernel = np.<span className="c-fn">ones</span>((3,3))
                / 9{"\n"}smoothed = <span className="c-fn">convolve</span>(band,
                mean_kernel){"\n"}
                {"\n"}
                <span className="c-com"># High-pass sharpening kernel</span>
                {"\n"}sharpen_kernel = np.array([[ 0,-1, 0],{"\n"}
                {"                            "}[-1, 5,-1],{"\n"}
                {"                            "}[ 0,-1, 0]]){"\n"}sharpened ={" "}
                <span className="c-fn">convolve</span>(band, sharpen_kernel)
                {"\n"}
                {"\n"}
                <span className="c-com">
                  # Sobel edge detection — magnitude of gradient in X and Y
                </span>
                {"\n"}edges_x = <span className="c-fn">sobel</span>(band,
                axis=0){"\n"}edges_y = <span className="c-fn">sobel</span>(band,
                axis=1){"\n"}edge_magnitude = np.
                <span className="c-fn">hypot</span>(edges_x, edges_y)
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">
            03.3 / Band Math — Ratios &amp; Indices
          </div>
          <h2 className="section-title">
            Combining bands reveals what single bands hide
          </h2>
          <p className="section-intro">
            Band ratios divide one band by another, pixel-by-pixel. This cancels
            out effects that influence all bands roughly equally (topographic
            shading, seasonal illumination differences) while amplifying the
            specific spectral contrast between the two chosen bands (RS.2).
          </p>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-band-ratio-example.jpg"
                alt="Band ratio real geological example"
              />
            </div>
            <figcaption>
              Real example — geological mapping by band ratio: ratio images
              using different band pairs (3/1, 5/7, 5/4) each highlight
              different mineral/rock boundaries invisible in any single band.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-vegetation-indices.jpg"
                alt="Vegetation indices NDVI RVI TVI real example"
              />
            </div>
            <figcaption>
              The most common vegetation indices — Ratio Vegetation Index (RVI =
              NIR/Red), NDVI, and Transformed Vegetation Index — applied to a
              real scene, each producing a slightly different but strongly
              correlated vegetation-vigour map.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>compute_ndvi.py</span>
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
                {"\n"}red = image[2].<span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>){"\n"}nir = image[3].
                <span className="c-fn">astype</span>(
                <span className="c-str">"float32"</span>){"\n"}
                {"\n"}ndvi = (nir - red) / (nir + red + 1e-6){"     "}
                <span className="c-com"># epsilon avoids divide-by-zero</span>
                {"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Mean NDVI: {"{"}ndvi.mean():.3f{"}"}"
                </span>
                ){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Healthy vegetation pixels (NDVI&gt;0.5): {"{"}
                  (ndvi&gt;0.5).sum(){"}"}"
                </span>
                ){"\n"}
                {"\n"}plt.<span className="c-fn">imshow</span>(ndvi, cmap=
                <span className="c-str">"RdYlGn"</span>, vmin=-1, vmax=1){"\n"}
                plt.<span className="c-fn">colorbar</span>(label=
                <span className="c-str">"NDVI"</span>)
              </code>
            </pre>
            <div className="out">
              # Mean NDVI: 0.412
              <br /># Healthy vegetation pixels (NDVI&gt;0.5): 184,302
            </div>
          </div>
          <div className="widget-panel">
            <h3>NDVI Calculator</h3>
            <p className="widget-sub">
              Slide the Red and NIR DN values and watch NDVI update live — this
              is exactly the formula above, running on two numbers instead of
              two whole bands.
            </p>
            <div className="ndvi-calc">
              <div className="ndvi-sliders">
                <label>
                  Red band DN{" "}
                  <span className="val" id="ndvi-red-val">
                    45
                  </span>
                </label>
                <input
                  type="range"
                  id="ndvi-red-slider"
                  min={0}
                  max={255}
                  defaultValue={45}
                />
                <label>
                  NIR band DN{" "}
                  <span className="val" id="ndvi-nir-val">
                    180
                  </span>
                </label>
                <input
                  type="range"
                  id="ndvi-nir-slider"
                  min={0}
                  max={255}
                  defaultValue={180}
                />
              </div>
              <div className="ndvi-readout">
                <div className="ndvi-value" id="ndvi-value">
                  0.60
                </div>
                <div className="ndvi-gauge-wrap">
                  <div className="ndvi-gauge-track">
                    <div className="ndvi-gauge-pointer" id="ndvi-pointer" />
                  </div>
                </div>
                <div className="ndvi-label-tag" id="ndvi-tag">
                  Healthy vegetation
                </div>
              </div>
            </div>
          </div>
          <div className="section-label" style={{ marginTop: 8 }}>
            03.4 / Principal Component Analysis
          </div>
          <h2 className="section-title">
            Compressing correlated bands into independent ones
          </h2>
          <p className="section-intro">
            Adjacent spectral bands are often highly correlated — a bright pixel
            in the red band is usually bright in green too. PCA finds new axes
            (principal components) along which the data varies most,
            decorrelating the bands. PC1 typically captures overall brightness;
            later components often isolate subtle features buried in the
            correlation.
          </p>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-pca-intro.jpg"
                alt="PCA graphical conceptualization"
              />
            </div>
            <figcaption>
              Graphically, PCA rotates the coordinate axes so the new Band 1'
              captures maximum variance, and Band 2' (orthogonal to it) captures
              the remaining variance not explained by Band 1'.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Imagine packing a suitcase where most of your clothes are
                variations on "blue jeans" — lots of near-duplicate information.
                PCA is like repacking that suitcase so the first bag holds
                everything the outfits have in common (mostly: "these are jeans"
                = PC1, usually overall brightness), and the second bag holds
                only what's left over and genuinely different between outfits
                (PC2, PC3...). You haven't lost anything — you've just
                reorganized so the interesting, non-repetitive differences are
                easier to find instead of buried under repetition.
              </p>
            </div>
          </div>
          <div className="figure">
            <div className="figure-img-wrap">
              <img
                src="/assets/images/image-processing/enhancement/enh-pca-real-example.jpg"
                alt="PCA real example PC1 PC3 color composite"
              />
            </div>
            <figcaption>
              Real PCA output: PC1 (mostly brightness/topography), PC3, and a
              false-colour composite built from three principal components —
              subtle features invisible in the raw bands often become visible in
              the later PCs.
              <span className="fig-credit">
                Source: IIRS-ISRO Dehradun, Dr. Poonam S. Tiwari
              </span>
            </figcaption>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>pca_bands.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">from</span> sklearn.decomposition{" "}
                <span className="c-kw">import</span> PCA{"\n"}
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                {"\n"}bands, rows, cols = image.shape{"\n"}pixels = image.
                <span className="c-fn">reshape</span>(bands, -1).T{"        "}
                <span className="c-com"># shape: (rows*cols, bands)</span>
                {"\n"}
                {"\n"}pca = <span className="c-fn">PCA</span>
                (n_components=bands){"\n"}components = pca.
                <span className="c-fn">fit_transform</span>(pixels){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Variance explained per PC:"</span>,
                pca.explained_variance_ratio_){"\n"}
                {"\n"}pc_image = components.T.
                <span className="c-fn">reshape</span>(bands, rows, cols){"  "}
                <span className="c-com"># back to image shape</span>
              </code>
            </pre>
            <div className="out">
              # Variance explained per PC: [0.891 0.081 0.021 0.007]
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              In the output above, PC1 alone explains 89% of the variance across
              four bands — that's the "correlated brightness" everything shares.
              PC2 through PC4 hold the remaining 11%, but that's often exactly
              where the interesting, band-specific differences live. This is why
              PCA is a common step before classification (IP.4): fewer,
              decorrelated inputs, same information.
            </p>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                <strong>Contrast stretching</strong> remaps a narrow DN range to
                the full display range — linear (min-max, percentile-cutoff,
                std-dev) or non-linear (log, histogram equalization).
              </li>
              <li>
                <strong>Spatial filtering</strong> is convolution with a kernel:
                uniform kernels smooth (low-pass), centre-weighted kernels
                sharpen (high-pass), zero-sum kernels detect edges (Sobel,
                Roberts, Prewitt).
              </li>
              <li>
                <strong>Band ratios</strong> cancel shared effects (topography,
                illumination) and amplify the spectral contrast between two
                chosen bands — the basis of NDVI and geological ratio mapping.
              </li>
              <li>
                <strong>PCA</strong> decorrelates bands into independent
                components ranked by variance explained, often revealing detail
                buried by inter-band correlation.
              </li>
              <li>
                All of this is ordinary array math — every technique above is a
                handful of lines with NumPy, SciPy, scikit-image, or
                scikit-learn.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
