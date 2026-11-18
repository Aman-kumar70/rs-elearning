import usePageTitle from "@/hooks/usePageTitle";
import { useLegacyPage } from "@/legacy/useLegacyPage";
import { mountClassification } from "@/controllers/classification";

export default function ClassificationPage() {
  usePageTitle("Turning Pixels Into Classes — IP.4");
  useLegacyPage(mountClassification);

  return (
    <>
      <div>
        <header className="page-hero">
          <div className="chapter-badge">Track B · IP.4 of 5</div>
          <h1>
            Turning Pixels <span>Into Classes</span>
          </h1>
          <p className="hero-intro">
            This is the payoff of everything so far: turning a corrected,
            enhanced grid of numbers into a map that says "this pixel is forest,
            this one is water, this one is urban" — automatically, across
            millions of pixels, using the spectral signatures from RS.2.
          </p>
          <div className="chapter-progress">
            <span className="done" />
            <span className="done" />
            <span className="done" />
            <span className="now" />
            <span />
          </div>
        </header>
        <section className="content-section reveal">
          <div className="section-label">04.1 / The Core Idea</div>
          <h2 className="section-title">
            Classification is nearest-neighbour matching in spectral space
          </h2>
          <div className="www-grid">
            <div className="www-card what">
              <div className="www-label">What</div>
              <p>
                Image classification assigns every pixel to one of a fixed set
                of land-cover classes (water, forest, urban, agriculture...)
                based on its spectral signature — the DN values across all
                available bands, treated as a point in multi-dimensional
                "spectral space."
              </p>
            </div>
            <div className="www-card why">
              <div className="www-label">Why</div>
              <p>
                Because a visually interpreted map (RS.5) doesn't scale — you
                can't manually label every pixel across a whole country,
                repeated every season. Classification automates exactly the kind
                of tone/pattern judgement a human interpreter makes, at
                planetary scale.
              </p>
            </div>
            <div className="www-card how">
              <div className="www-label">How</div>
              <p>
                Every pixel's band values are treated as a vector. The algorithm
                either compares that vector to known reference signatures you
                provide (<strong>supervised</strong>), or groups similar vectors
                together without any prior labels and lets you name the
                resulting clusters afterward (<strong>unsupervised</strong>).
              </p>
            </div>
          </div>
          <div className="widget-panel">
            <h3>Spectral Space, Visualized</h3>
            <p className="widget-sub">
              Each dot is one pixel, plotted by its Red-band DN (x-axis) and
              NIR-band DN (y-axis) — exactly the two-band version of what a
              classifier does with many bands at once. Notice how land-cover
              types naturally cluster.
            </p>
            <svg
              viewBox="0 0 600 320"
              id="scatter-svg"
              style={{
                width: "100%",
                background: "var(--surface-2)",
                borderRadius: 12,
              }}
            />
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">04.2 / Supervised vs Unsupervised</div>
          <h2 className="section-title">Two opposite starting points</h2>
          <div className="card-grid">
            <div className="info-card">
              <div
                className="icon"
                style={{
                  background: "var(--amber-dim)",
                  color: "var(--amber)",
                }}
              >
                🎯
              </div>
              <h3>Supervised Classification</h3>
              <p>
                You start by defining <strong>training samples</strong> — pixels
                you (or ground-truth data) know belong to each class. The
                algorithm learns the statistical signature of each class from
                those samples, then classifies every remaining pixel by
                comparing it to those learned signatures.
              </p>
              <p
                style={{
                  marginTop: 10,
                  fontSize: "0.85rem",
                  color: "var(--text-faint)",
                }}
              >
                Common algorithms: Maximum Likelihood, Minimum Distance, Support
                Vector Machine, Random Forest.
              </p>
            </div>
            <div className="info-card">
              <div
                className="icon"
                style={{ background: "var(--teal-dim)", color: "var(--teal)" }}
              >
                🧩
              </div>
              <h3>Unsupervised Classification</h3>
              <p>
                No training samples needed. The algorithm groups pixels purely
                by spectral similarity into a chosen number of clusters (K). You
                examine the resulting clusters afterward and assign each one a
                meaningful land-cover label.
              </p>
              <p
                style={{
                  marginTop: 10,
                  fontSize: "0.85rem",
                  color: "var(--text-faint)",
                }}
              >
                Common algorithms: K-Means, ISODATA.
              </p>
            </div>
          </div>
          <div className="pipeline">
            <div className="p-step">
              <div className="p-num">SUPERVISED</div>
              <h4>1. Define classes</h4>
              <p>Decide what you're mapping: water, forest, crop, urban...</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num"> </div>
              <h4>2. Collect training pixels</h4>
              <p>Draw sample regions of known class on the image</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num"> </div>
              <h4>3. Train classifier</h4>
              <p>Model learns each class's spectral statistics</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num"> </div>
              <h4>4. Classify all pixels</h4>
              <p>Every pixel assigned to its most likely class</p>
            </div>
            <div className="p-arrow">→</div>
            <div className="p-step">
              <div className="p-num"> </div>
              <h4>5. Assess accuracy</h4>
              <p>Compare against independent ground truth</p>
            </div>
          </div>
          <div className="tech-detail">
            <div className="label">
              Maximum Likelihood — the Classic Supervised Algorithm
            </div>
            <p>
              Maximum Likelihood Classification assumes each class's pixels form
              a (multivariate) Gaussian cluster in spectral space, defined by a
              mean vector and covariance matrix estimated from training samples.
              For any new pixel, it computes the <em>probability</em> that pixel
              belongs to each class given those Gaussian distributions, and
              assigns the class with highest probability — accounting not just
              for distance to the class mean, but how "spread out" and
              correlated that class's bands tend to be.
            </p>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                <strong>Supervised</strong> classification is like sorting a
                basket of laundry when someone has already shown you five
                example red shirts, five blue shirts, and five towels — you
                learn what each pile "looks like" first, then sort the rest.{" "}
                <strong>Unsupervised</strong> is sorting the same basket with no
                examples at all — you just group items that look similar to each
                other, ending up with piles you then have to inspect and label
                yourself ("oh, this pile is all towels"). Maximum Likelihood
                specifically doesn't just ask "which pile's average shirt do I
                look most like" — it also considers how much each pile's items
                typically vary, the way you'd expect more variation among "blue
                shirts" than among "white towels."
              </p>
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>supervised_classification.py</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <pre>
              <code>
                <span className="c-kw">from</span> sklearn.ensemble{" "}
                <span className="c-kw">import</span> RandomForestClassifier
                {"\n"}
                <span className="c-kw">import</span> numpy{" "}
                <span className="c-kw">as</span> np{"\n"}
                {"\n"}
                <span className="c-com">
                  # X_train: (n_samples, n_bands) — DN values of labelled
                  training pixels
                </span>
                {"\n"}
                <span className="c-com">
                  # y_train: (n_samples,){"         "}— class labels, e.g.
                  0=water 1=forest 2=urban 3=crop
                </span>
                {"\n"}
                {"\n"}clf = <span className="c-fn">RandomForestClassifier</span>
                (n_estimators=200, random_state=42){"\n"}clf.
                <span className="c-fn">fit</span>(X_train, y_train){"\n"}
                {"\n"}
                <span className="c-com">
                  # Reshape the full image from (bands, rows, cols) to (pixels,
                  bands) for prediction
                </span>
                {"\n"}bands, rows, cols = image.shape{"\n"}X_all = image.
                <span className="c-fn">reshape</span>(bands, -1).T{"\n"}
                {"\n"}predicted = clf.<span className="c-fn">predict</span>
                (X_all){"\n"}classified_map = predicted.
                <span className="c-fn">reshape</span>(rows, cols){"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-str">"Class pixel counts:"</span>, np.
                <span className="c-fn">bincount</span>(predicted))
              </code>
            </pre>
            <div className="out">
              # Class pixel counts: [ 84213 512040 91887 358120]
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>unsupervised_kmeans.py</span>
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
                {"\n"}X_all = image.<span className="c-fn">reshape</span>(bands,
                -1).T{"\n"}
                {"\n"}kmeans = <span className="c-fn">KMeans</span>
                (n_clusters=6, random_state=42, n_init=10){"\n"}clusters =
                kmeans.<span className="c-fn">fit_predict</span>(X_all){"\n"}
                cluster_map = clusters.<span className="c-fn">reshape</span>
                (rows, cols){"\n"}
                {"\n"}
                <span className="c-com">
                  # Inspect each cluster's mean spectral signature to decide
                  what it represents
                </span>
                {"\n"}
                <span className="c-kw">for</span> c{" "}
                <span className="c-kw">in</span>{" "}
                <span className="c-fn">range</span>(6):{"\n"}
                {"    "}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Cluster {"{"}c{"}"} mean signature: {"{"}
                  kmeans.cluster_centers_[c]{"}"}"
                </span>
                )
              </code>
            </pre>
            <div className="out">
              # Cluster 0 mean signature: [ 210 340 180 3480] ← looks like
              vegetation
              <br /># Cluster 3 mean signature: [ 620 610 590 310] ← looks like
              bare soil/urban
            </div>
          </div>
        </section>
        <section className="content-section reveal">
          <div className="section-label">04.3 / Accuracy Assessment</div>
          <h2 className="section-title">
            A classified map is worthless without a number attached
          </h2>
          <p className="section-intro">
            Never trust an unchecked classification. Accuracy assessment
            compares the classified map against independent, trustworthy
            reference points (field visits, high-resolution imagery, existing
            verified maps) — usually withheld from training — and summarizes
            agreement in a <strong>confusion matrix</strong>.
          </p>
          <div className="confusion-wrap">
            <table className="confusion-matrix">
              <tbody>
                <tr>
                  <th className="corner">
                    Reference →<br />
                    Classified ↓
                  </th>
                  <th>Water</th>
                  <th>Forest</th>
                  <th>Urban</th>
                  <th>Crop</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <th>Water</th>
                  <td className="diag">48</td>
                  <td className="off">0</td>
                  <td className="off">1</td>
                  <td className="off">0</td>
                  <td>49</td>
                </tr>
                <tr>
                  <th>Forest</th>
                  <td className="off">0</td>
                  <td className="diag">142</td>
                  <td className="off">3</td>
                  <td className="off">8</td>
                  <td>153</td>
                </tr>
                <tr>
                  <th>Urban</th>
                  <td className="off">2</td>
                  <td className="off">1</td>
                  <td className="diag">61</td>
                  <td className="off">4</td>
                  <td>68</td>
                </tr>
                <tr>
                  <th>Crop</th>
                  <td className="off">0</td>
                  <td className="off">6</td>
                  <td className="off">2</td>
                  <td className="diag">122</td>
                  <td>130</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>50</td>
                  <td>149</td>
                  <td>67</td>
                  <td>134</td>
                  <td>400</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="formula-box">
            <div className="formula">
              Overall Accuracy = Σ(diagonal) / Total = 373/400 = 93.25%
            </div>
            <div className="formula-note">
              <strong>Producer's accuracy</strong> (per column): of all true
              Forest reference points, what % were correctly classified as
              Forest? <strong>User's accuracy</strong> (per row): of all pixels
              the map calls Forest, what % are actually Forest on the ground?{" "}
              <strong>Kappa coefficient</strong> goes further, correcting
              overall accuracy for the agreement expected by pure chance.
            </div>
          </div>
          <div className="plain-english">
            <div className="pe-icon">💡</div>
            <div className="pe-body">
              <div className="pe-label">Plain English</div>
              <p>
                Overall accuracy is like a test score — how many you got right
                out of the total. But imagine a test where 90% of answers were
                "True" — you could score 90% just by guessing "True" every time,
                without knowing anything. <strong>Kappa</strong> asks the harder
                question: "how much better did the classifier do than random
                guessing would have scored, given how common each class already
                is?" A Kappa near 1.0 means genuinely skillful classification; a
                Kappa near 0 means it's barely beating a coin flip, even if the
                raw accuracy number looked impressive.
              </p>
            </div>
          </div>
          <div className="code-block">
            <div className="code-head">
              <span>accuracy_assessment.py</span>
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
                classification_report, cohen_kappa_score{"\n"}
                {"\n"}
                <span className="c-com">
                  # y_true, y_pred: class labels at independent, withheld
                  reference points
                </span>
                {"\n"}cm = <span className="c-fn">confusion_matrix</span>
                (y_true, y_pred){"\n"}kappa ={" "}
                <span className="c-fn">cohen_kappa_score</span>(y_true, y_pred)
                {"\n"}
                {"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">classification_report</span>(y_true,
                y_pred,{"\n"}
                {"      "}target_names=[<span className="c-str">"Water"</span>,
                <span className="c-str">"Forest"</span>,
                <span className="c-str">"Urban"</span>,
                <span className="c-str">"Crop"</span>])){"\n"}
                <span className="c-fn">print</span>(
                <span className="c-fn">f</span>
                <span className="c-str">
                  "Kappa coefficient: {"{"}kappa:.3f{"}"}"
                </span>
                )
              </code>
            </pre>
            <div className="out">
              # Water precision 0.98 recall 0.96 f1-score 0.97
              <br />
              # Forest precision 0.93 recall 0.95 f1-score 0.94
              <br />
              # ...
              <br /># Kappa coefficient: 0.902
            </div>
          </div>
          <div className="try-it">
            <div className="ti-label">Try It Yourself</div>
            <p>
              In the confusion matrix above, Forest and Crop are confused with
              each other more than with Water or Urban (6 + 8
              misclassifications). That makes spectral sense — both are
              vegetation, occupying nearby regions of spectral space (RS.2).
              Adding a SWIR band, a texture measure, or a time-series (crops
              change faster than forest) typically resolves exactly this kind of
              confusion.
            </p>
          </div>
          <div className="key-takeaways">
            <div className="kt-label">Key Takeaways</div>
            <ul>
              <li>
                Classification assigns every pixel to a class using its position
                in <strong>spectral space</strong> — the multi-band equivalent
                of the signature charts from RS.2.
              </li>
              <li>
                <strong>Supervised</strong> classification needs labelled
                training samples; <strong>unsupervised</strong> (K-Means,
                ISODATA) groups pixels by similarity with no prior labels.
              </li>
              <li>
                <strong>Maximum Likelihood</strong> is the classic statistical
                supervised method; modern workflows often use Random Forest or
                SVM instead.
              </li>
              <li>
                A classified map is meaningless without{" "}
                <strong>accuracy assessment</strong> against independent
                reference data — overall accuracy, producer's/user's accuracy,
                and Kappa.
              </li>
              <li>
                Classes that are spectrally similar (e.g. forest vs. crop) are
                the ones most often confused — more bands, texture, or
                time-series data usually help.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
