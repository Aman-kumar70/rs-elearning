/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountPreprocessing() {
  (function () {
    // 5x5 grid of DN values, deliberately with a bright "river" cutting through
    const DN = [
      [120, 128, 60, 118, 122],
      [126, 58, 62, 124, 130],
      [60, 64, 66, 68, 132],
      [64, 68, 200, 204, 136],
      [66, 202, 208, 210, 140],
    ];
    const N = 5;
    const svg = document.getElementById("resample-svg");
    const pad = 20,
      cell = (320 - 2 * pad) / N;

    function drawGrid() {
      let s = "";
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const v = DN[r][c];
          const x = pad + c * cell,
            y = pad + r * cell;
          s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="rgb(${v},${v},${v})" stroke="#0a0e22" stroke-width="1.5" id="rc-${r}-${c}"/>`;
          const textColor = v > 140 ? "#111" : "#eee";
          s += `<text x="${x + cell / 2}" y="${y + cell / 2 + 4}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="${textColor}">${v}</text>`;
        }
      }
      svg.innerHTML = s;
    }
    drawGrid();

    const rxSlider = document.getElementById("rx-slider");
    const rySlider = document.getElementById("ry-slider");
    const rxVal = document.getElementById("rx-val");
    const ryVal = document.getElementById("ry-val");
    const nnResult = document.getElementById("nn-result");
    const blResult = document.getElementById("bl-result");

    function update() {
      // slider 0-400 maps to grid coord 0-4 (in cell units)
      const gx = parseInt(rxSlider.value) / 100;
      const gy = parseInt(rySlider.value) / 100;
      rxVal.textContent = gx.toFixed(2);
      ryVal.textContent = gy.toFixed(2);

      const clamp = (v) => Math.max(0, Math.min(N - 1, v));
      // Nearest neighbour
      const nr = clamp(Math.round(gy)),
        nc = clamp(Math.round(gx));
      const nnVal = DN[nr][nc];

      // Bilinear
      const c0 = clamp(Math.floor(gx)),
        c1 = clamp(Math.ceil(gx));
      const r0 = clamp(Math.floor(gy)),
        r1 = clamp(Math.ceil(gy));
      const fx = gx - Math.floor(gx),
        fy = gy - Math.floor(gy);
      const top = DN[r0][c0] * (1 - fx) + DN[r0][c1] * fx;
      const bot = DN[r1][c0] * (1 - fx) + DN[r1][c1] * fx;
      const blVal = top * (1 - fy) + bot * fy;

      nnResult.textContent = nnVal;
      blResult.textContent = blVal.toFixed(1);

      drawGrid();
      // highlight
      const nnCell = document.getElementById(`rc-${nr}-${nc}`);
      if (nnCell)
        (nnCell.setAttribute("stroke", "#f5a623"),
          nnCell.setAttribute("stroke-width", "3"));
      [
        [r0, c0],
        [r0, c1],
        [r1, c0],
        [r1, c1],
      ].forEach(([r, c]) => {
        const el = document.getElementById(`rc-${r}-${c}`);
        if (el && el.getAttribute("stroke") !== "#f5a623") {
          el.setAttribute("stroke", "#2dd4bf");
          el.setAttribute("stroke-width", "2.5");
        }
      });
      // query point marker
      const px = pad + gx * cell,
        py = pad + gy * cell;
      svg.innerHTML += `<circle cx="${px}" cy="${py}" r="6" fill="#fff" stroke="#000" stroke-width="1.5"/>`;
    }

    rxSlider.addEventListener("input", update);
    rySlider.addEventListener("input", update);
    update();
  })();
}
