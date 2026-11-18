/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountBasics() {
  (function () {
    const SIZE = 8;
    // Region DN profiles: [Blue, Green, Red, NIR] roughly matching RS.2 signatures
    const REGIONS = {
      water: { name: "Water", dn: [60, 45, 25, 8], rgb: [30, 60, 110] },
      vegetation: {
        name: "Vegetation",
        dn: [35, 90, 45, 195],
        rgb: [40, 110, 50],
      },
      soil: { name: "Dry Soil", dn: [95, 115, 135, 155], rgb: [150, 120, 85] },
      urban: {
        name: "Road / Urban",
        dn: [110, 112, 118, 100],
        rgb: [120, 120, 125],
      },
    };
    function regionFor(r, c) {
      if (c < 2 && r > 2 && r < 6) return "water"; // river strip
      if (r < 3) return "vegetation";
      if (r >= 5 && c >= 5) return "urban";
      return "soil";
    }
    function jitter(v) {
      return Math.max(
        0,
        Math.min(255, Math.round(v + (Math.random() * 16 - 8))),
      );
    }

    const grid = document.getElementById("bi-grid");
    const cellsData = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const region = regionFor(r, c);
        const base = REGIONS[region];
        const dn = base.dn.map(jitter);
        cellsData.push({ r, c, region, dn });
        const cell = document.createElement("div");
        cell.className = "bi-cell";
        const rgb = base.rgb;
        cell.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        cell.dataset.idx = cellsData.length - 1;
        grid.appendChild(cell);
      }
    }

    const bandMeta = [
      { label: "B", name: "Blue", color: "#3b82f6" },
      { label: "G", name: "Green", color: "#4ade80" },
      { label: "R", name: "Red", color: "#f87171" },
      { label: "N", name: "NIR", color: "#a78bfa" },
    ];

    function selectCell(idx) {
      document
        .querySelectorAll(".bi-cell")
        .forEach((el) => el.classList.remove("selected"));
      grid.children[idx].classList.add("selected");
      const d = cellsData[idx];
      document.getElementById("bi-region").textContent =
        REGIONS[d.region].name + ` — row ${d.r}, col ${d.c}`;

      const barsEl = document.getElementById("bi-bars");
      barsEl.innerHTML = d.dn
        .map(
          (v, i) => `
        <div class="bi-bar-col">
          <div class="bi-bar-val">${v}</div>
          <div class="bi-bar" style="height:${((v / 255) * 100).toFixed(0)}%; background:${bandMeta[i].color};"></div>
          <div class="bi-bar-label" style="color:${bandMeta[i].color};">${bandMeta[i].label}</div>
        </div>`,
        )
        .join("");

      const [b, g, r, n] = d.dn;
      document.getElementById("bi-swatch-true").style.background =
        `rgb(${r},${g},${b})`;
      document.getElementById("bi-swatch-false").style.background =
        `rgb(${n},${r},${g})`;
    }

    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".bi-cell");
      if (!cell) return;
      selectCell(parseInt(cell.dataset.idx));
    });

    selectCell(20); // pre-select a vegetation pixel
  })();
}
