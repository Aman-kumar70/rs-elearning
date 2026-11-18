import Chart from "chart.js/auto";

/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountSignatures() {
  (function () {
    const wavelengths = [
      "0.40",
      "0.45",
      "0.50",
      "0.55",
      "0.60",
      "0.65",
      "0.68",
      "0.72",
      "0.75",
      "0.80",
      "0.85",
      "0.90",
      "1.00",
      "1.10",
      "1.20",
      "1.30",
      "1.40",
      "1.50",
      "1.65",
      "1.80",
      "1.90",
      "2.00",
      "2.20",
      "2.40",
    ];

    // Real spectral reflectance data (%) based on IIRS-ISRO Dr. Hina Pande lecture
    const vegData = [
      4, 5, 7, 12, 8, 5, 7, 26, 42, 48, 50, 48, 46, 44, 42, 35, 14, 24, 30, 20,
      8, 14, 18, 10,
    ];
    const soilData = [
      12, 14, 17, 19, 22, 25, 26, 28, 30, 32, 33, 34, 36, 37, 39, 40, 38, 41,
      43, 44, 42, 44, 42, 40,
    ];
    const waterData = [
      5.5, 6.0, 5.0, 4.0, 3.0, 2.0, 1.5, 1.0, 0.7, 0.5, 0.3, 0.2, 0.1, 0.1, 0.1,
      0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ];
    const turbidData = [
      6.0, 8.5, 12.0, 14.0, 12.5, 10.0, 7.5, 5.0, 3.5, 2.0, 1.2, 0.8, 0.4, 0.2,
      0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ];
    const stressedData = [
      6.0, 8.0, 10.0, 14.0, 13.0, 12.0, 14.0, 20.0, 24.0, 27.0, 28.0, 27.0,
      26.0, 25.0, 24.0, 22.0, 18.0, 28.0, 35.0, 26.0, 15.0, 22.0, 25.0, 16.0,
    ];

    const ctx = document.getElementById("sig-chart");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: wavelengths,
        datasets: [
          {
            label: "Healthy Vegetation",
            data: vegData,
            borderColor: "#4ade80",
            backgroundColor: "rgba(74, 222, 128, 0.08)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#4ade80",
            hidden: false,
          },
          {
            label: "Dry Bare Soil",
            data: soilData,
            borderColor: "#f5a623",
            backgroundColor: "rgba(245, 166, 35, 0.06)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#f5a623",
            hidden: false,
          },
          {
            label: "Clear Water",
            data: waterData,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56, 189, 248, 0.08)",
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#38bdf8",
            hidden: false,
          },
          {
            label: "Turbid / Sediment Water",
            data: turbidData,
            borderColor: "#2dd4bf",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [5, 4],
            tension: 0.35,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: "#2dd4bf",
            hidden: true,
          },
          {
            label: "Stressed Vegetation",
            data: stressedData,
            borderColor: "#f43f5e",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [6, 4],
            tension: 0.35,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: "#f43f5e",
            hidden: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#111938",
            titleColor: "#f5a623",
            bodyColor: "#e6ebf5",
            borderColor: "rgba(120, 160, 255, 0.3)",
            borderWidth: 1,
            padding: 12,
            titleFont: { family: "JetBrains Mono", size: 12 },
            bodyFont: { family: "JetBrains Mono", size: 11 },
            callbacks: {
              title: function (items) {
                return `Wavelength: ${items[0].label} µm`;
              },
              label: function (context) {
                return ` ${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(120, 160, 255, 0.08)",
            },
            ticks: {
              color: "#8893b5",
              font: { family: "JetBrains Mono", size: 10 },
              maxRotation: 0,
              callback: function (val, idx) {
                const wl = wavelengths[idx];
                return idx % 2 === 0 ? `${wl} µm` : "";
              },
            },
            title: {
              display: true,
              text: "Wavelength (µm) →",
              color: "#8893b5",
              font: { family: "JetBrains Mono", size: 11 },
            },
          },
          y: {
            min: 0,
            max: 60,
            grid: {
              color: "rgba(120, 160, 255, 0.08)",
            },
            ticks: {
              color: "#8893b5",
              font: { family: "JetBrains Mono", size: 10 },
              stepSize: 10,
              callback: function (v) {
                return v + "%";
              },
            },
            title: {
              display: true,
              text: "Spectral Reflectance (%)",
              color: "#8893b5",
              font: { family: "JetBrains Mono", size: 11 },
            },
          },
        },
      },
    });

    // Checkbox controls handling
    const toggles = [
      { id: "chk-veg", datasetIdx: 0 },
      { id: "chk-soil", datasetIdx: 1 },
      { id: "chk-water", datasetIdx: 2 },
      { id: "chk-turbid", datasetIdx: 3 },
      { id: "chk-stressed", datasetIdx: 4 },
    ];

    function updateAnalysisCards() {
      const vegOn = document.getElementById("chk-veg")?.checked;
      const soilOn = document.getElementById("chk-soil")?.checked;
      const waterOn = document.getElementById("chk-water")?.checked;

      const cardRedEdge = document.getElementById("card-rededge");
      const cardNirGap = document.getElementById("card-nirgap");
      const cardSwirWater = document.getElementById("card-swirwater");

      if (cardRedEdge)
        cardRedEdge.style.opacity = vegOn && soilOn ? "1" : "0.45";
      if (cardNirGap)
        cardNirGap.style.opacity = vegOn && waterOn ? "1" : "0.45";
      if (cardSwirWater) cardSwirWater.style.opacity = vegOn ? "1" : "0.45";
    }

    toggles.forEach((t) => {
      const input = document.getElementById(t.id);
      if (!input) return;

      input.addEventListener("change", (e) => {
        const parentLabel = input.closest(".sig-checkbox-label");
        if (parentLabel) {
          parentLabel.classList.toggle("active", e.target.checked);
        }
        chart.setDatasetVisibility(t.datasetIdx, e.target.checked);
        chart.update();
        updateAnalysisCards();
      });
    });

    updateAnalysisCards();
  })();

  return () => {
    document.querySelectorAll("canvas").forEach((canvas) => {
      const chart = Chart.getChart(canvas);
      if (chart) chart.destroy();
    });
  };
}
