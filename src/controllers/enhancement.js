/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountEnhancement() {
  /* ---------- Contrast Stretch Lab ---------- */
  (function () {
    // Synthetic low-contrast histogram: DN values clustered around 90-165
    const bins = 32;
    const counts = [];
    for (let i = 0; i < bins; i++) {
      const dn = (i / bins) * 255;
      const gauss = Math.exp(-Math.pow(dn - 128, 2) / (2 * 30 * 30));
      counts.push(Math.max(2, Math.round(gauss * 100 + Math.random() * 6)));
    }
    const maxCount = Math.max(...counts);
    const svg = document.getElementById("hist-svg");
    const W = 600,
      H = 160,
      padB = 20,
      padT = 6;
    function drawHist(lo, hi) {
      let s = "";
      const bw = W / bins;
      for (let i = 0; i < bins; i++) {
        const dn = (i / bins) * 255;
        const h = (counts[i] / maxCount) * (H - padB - padT);
        const x = i * bw,
          y = H - padB - h;
        const inRange = dn >= lo && dn <= hi;
        s += `<rect x="${x + 1}" y="${y}" width="${bw - 2}" height="${h}" fill="${inRange ? "#2dd4bf" : "#3a4266"}" opacity="${inRange ? 0.9 : 0.5}"/>`;
      }
      // cutoff lines
      const loX = (lo / 255) * W,
        hiX = (hi / 255) * W;
      s += `<line x1="${loX}" y1="0" x2="${loX}" y2="${H - padB}" stroke="#f5a623" stroke-width="2"/>`;
      s += `<line x1="${hiX}" y1="0" x2="${hiX}" y2="${H - padB}" stroke="#f5a623" stroke-width="2"/>`;
      s += `<line x1="0" y1="${H - padB}" x2="${W}" y2="${H - padB}" stroke="#5a6789" stroke-width="1"/>`;
      svg.innerHTML = s;
    }
    const loSlider = document.getElementById("lo-slider");
    const hiSlider = document.getElementById("hi-slider");
    const loVal = document.getElementById("lo-val");
    const hiVal = document.getElementById("hi-val");
    const stripBefore = document.getElementById("strip-before");
    const stripAfter = document.getElementById("strip-after");

    function gradientStops(stretchFn) {
      const stops = [];
      for (let i = 0; i <= 20; i++) {
        const dn = (i / 20) * 255;
        const out = stretchFn(dn);
        stops.push(`rgb(${out},${out},${out}) ${((i / 20) * 100).toFixed(0)}%`);
      }
      return stops.join(",");
    }

    function update() {
      let lo = parseInt(loSlider.value),
        hi = parseInt(hiSlider.value);
      if (lo >= hi) {
        hi = lo + 1;
        hiSlider.value = hi;
      }
      loVal.textContent = lo;
      hiVal.textContent = hi;
      drawHist(lo, hi);
      // Original strip: shows raw DN as-is (mostly mid-grey, low contrast)
      stripBefore.style.background = `linear-gradient(to right, ${gradientStops((dn) => Math.round(dn))})`;
      // Stretched strip: apply the min-max formula
      stripAfter.style.background = `linear-gradient(to right, ${gradientStops(
        (dn) => {
          const v = Math.max(0, Math.min(255, ((dn - lo) / (hi - lo)) * 255));
          return Math.round(v);
        },
      )})`;
    }
    loSlider.addEventListener("input", update);
    hiSlider.addEventListener("input", update);
    update();
  })();

  /* ---------- Convolution Playground ---------- */
  (function () {
    const N = 6;
    // Bright/dark boundary running diagonally
    const DN = [
      [40, 45, 42, 210, 215, 208],
      [38, 44, 46, 205, 212, 210],
      [42, 40, 48, 200, 206, 214],
      [44, 46, 50, 44, 208, 212],
      [40, 42, 48, 46, 50, 206],
      [38, 44, 46, 48, 52, 48],
    ];
    const KERNELS = {
      identity: {
        m: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0],
        ],
        norm: 1,
        label: "Identity (no change)",
      },
      smooth: {
        m: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        norm: 9,
        label: "Smooth — uniform 3×3 mean",
      },
      sharpen: {
        m: [
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0],
        ],
        norm: 1,
        label: "Sharpen — centre-weighted",
      },
      edge: {
        m: [
          [-1, -1, -1],
          [-1, 8, -1],
          [-1, -1, -1],
        ],
        norm: 1,
        label: "Edge detect — zero-sum kernel",
      },
    };
    let activeKernel = "identity";
    let selected = null;

    const grid = document.getElementById("conv-grid");
    function render() {
      grid.innerHTML = "";
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const v = DN[r][c];
          const cell = document.createElement("div");
          cell.className = "conv-cell";
          const isBorder = r === 0 || c === 0 || r === N - 1 || c === N - 1;
          if (!isBorder) cell.classList.add("selectable");
          cell.style.background = `rgb(${v},${v},${v})`;
          cell.style.color = v > 140 ? "#1a1f30" : "#eee";
          cell.textContent = v;
          cell.dataset.r = r;
          cell.dataset.c = c;
          if (selected && selected.r === r && selected.c === c)
            cell.classList.add("center");
          else if (
            selected &&
            Math.abs(selected.r - r) <= 1 &&
            Math.abs(selected.c - c) <= 1
          )
            cell.classList.add("neighbor");
          grid.appendChild(cell);
        }
      }
    }
    function compute(r, c) {
      const k = KERNELS[activeKernel];
      let sum = 0,
        terms = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const val = DN[r + dr][c + dc];
          const weight = k.m[dr + 1][dc + 1];
          sum += val * weight;
          if (weight !== 0)
            terms.push(`${weight >= 0 ? "+" : ""}${weight}×${val}`);
        }
      }
      const result = Math.max(0, Math.min(255, Math.round(sum / k.norm)));
      document.getElementById("cr-formula").innerHTML =
        `<strong>${k.label}</strong><br>Output = (${terms.join(" ")}) ${k.norm !== 1 ? "&divide; " + k.norm : ""}`;
      document.getElementById("cr-result").textContent = `= ${result}`;
    }
    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".conv-cell.selectable");
      if (!cell) return;
      selected = { r: parseInt(cell.dataset.r), c: parseInt(cell.dataset.c) };
      render();
      compute(selected.r, selected.c);
    });
    document.querySelectorAll(".conv-kernel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".conv-kernel-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeKernel = btn.dataset.k;
        if (selected) compute(selected.r, selected.c);
      });
    });
    render();
  })();

  /* ---------- NDVI Calculator ---------- */
  (function () {
    const redSlider = document.getElementById("ndvi-red-slider");
    const nirSlider = document.getElementById("ndvi-nir-slider");
    const redVal = document.getElementById("ndvi-red-val");
    const nirVal = document.getElementById("ndvi-nir-val");
    const ndviValue = document.getElementById("ndvi-value");
    const pointer = document.getElementById("ndvi-pointer");
    const tag = document.getElementById("ndvi-tag");

    function update() {
      const red = parseInt(redSlider.value),
        nir = parseInt(nirSlider.value);
      redVal.textContent = red;
      nirVal.textContent = nir;
      const ndvi = (nir - red) / (nir + red + 1e-6);
      ndviValue.textContent = ndvi.toFixed(2);
      const pct = ((ndvi + 1) / 2) * 100;
      pointer.style.left = pct + "%";
      let label, color;
      if (ndvi < 0) {
        label = "Water / non-vegetated";
        color = "#7c2d12";
      } else if (ndvi < 0.2) {
        label = "Bare soil / built-up";
        color = "#a16207";
      } else if (ndvi < 0.5) {
        label = "Sparse / stressed vegetation";
        color = "#65a30d";
      } else {
        label = "Healthy, dense vegetation";
        color = "#16a34a";
      }
      tag.textContent = label;
      tag.style.background = color + "33";
      tag.style.color = color;
      ndviValue.style.color = color;
    }
    redSlider.addEventListener("input", update);
    nirSlider.addEventListener("input", update);
    update();
  })();
}
