/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountClassification() {
  (function () {
    const svg = document.getElementById("scatter-svg");
    const W = 600,
      H = 320,
      padL = 50,
      padB = 36,
      padT = 16,
      padR = 16;
    const clusters = [
      { color: "#3b82f6", name: "Water", cx: 60, cy: 270, spread: 22, n: 35 },
      { color: "#4ade80", name: "Forest", cx: 140, cy: 70, spread: 28, n: 45 },
      { color: "#f5a623", name: "Urban", cx: 330, cy: 200, spread: 30, n: 40 },
      { color: "#a78bfa", name: "Crop", cx: 220, cy: 110, spread: 26, n: 40 },
    ];
    function rnd(mean, spread) {
      return (
        mean + (Math.random() + Math.random() + Math.random() - 1.5) * spread
      );
    }
    let s = "";
    s += `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#5a6789"/>`;
    s += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#5a6789"/>`;
    s += `<text x="${W / 2}" y="${H - 8}" fill="#8893b5" font-size="11" text-anchor="middle" font-family="JetBrains Mono">Red band DN &rarr;</text>`;
    s += `<text x="16" y="${H / 2}" fill="#8893b5" font-size="11" text-anchor="middle" font-family="JetBrains Mono" transform="rotate(-90 16 ${H / 2})">NIR band DN &rarr;</text>`;
    clusters.forEach((cl) => {
      for (let i = 0; i < cl.n; i++) {
        const x = Math.max(
          padL + 4,
          Math.min(W - padR - 4, rnd(cl.cx, cl.spread) + padL - 20),
        );
        const y = Math.max(
          padT + 4,
          Math.min(H - padB - 4, rnd(cl.cy, cl.spread)),
        );
        s += `<circle cx="${x}" cy="${y}" r="3.5" fill="${cl.color}" fill-opacity="0.75"/>`;
      }
    });
    let legendX = padL;
    clusters.forEach((cl) => {
      s += `<circle cx="${legendX}" cy="${16}" r="5" fill="${cl.color}"/>`;
      s += `<text x="${legendX + 10}" y="20" fill="#c9d4f0" font-size="11" font-family="JetBrains Mono">${cl.name}</text>`;
      legendX += 90;
    });
    svg.innerHTML = s;
  })();
}
