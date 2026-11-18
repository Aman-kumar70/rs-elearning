/*
 * Imperative lab controller migrated from the original static page.
 * React owns mounting and unmounting; the original canvas/widget logic is kept intact.
 */
export function mountFundamentals() {
  (function () {
    const wlSlider = document.getElementById("wl-slider");
    const ampSlider = document.getElementById("amp-slider");
    const wlVal = document.getElementById("wl-val");
    const ampVal = document.getElementById("amp-val");
    const canvas = document.getElementById("wave-canvas");
    const ctx = canvas.getContext("2d");

    function wavelengthToColor(wl) {
      let r = 0,
        g = 0,
        b = 0;
      if (wl >= 380 && wl < 440) {
        r = -(wl - 440) / (440 - 380);
        b = 1;
      } else if (wl >= 440 && wl < 490) {
        g = (wl - 440) / (490 - 440);
        b = 1;
      } else if (wl >= 490 && wl < 510) {
        g = 1;
        b = -(wl - 510) / (510 - 490);
      } else if (wl >= 510 && wl < 580) {
        r = (wl - 510) / (580 - 510);
        g = 1;
      } else if (wl >= 580 && wl < 645) {
        r = 1;
        g = -(wl - 645) / (645 - 580);
      } else if (wl >= 645 && wl <= 900) {
        r = 1;
      }
      return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
    }

    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    }
    function draw() {
      const wl = parseInt(wlSlider.value);
      const amp = parseInt(ampSlider.value);
      wlVal.textContent = wl;
      ampVal.textContent = (amp / 70).toFixed(1);
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const color = wavelengthToColor(wl);
      const cycles = 8;
      const freqPx = w / cycles;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3 * devicePixelRatio;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const period = ((wl - 380) / (900 - 380)) * (freqPx * 1.6) + freqPx * 0.5;
      for (let x = 0; x <= w; x++) {
        const y =
          h / 2 +
          Math.sin((x / period) * Math.PI * 2) * (amp / 100) * ((h / 2) * 0.75);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(120,160,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    }
    window.addEventListener("resize", () => {
      resize();
      draw();
    });
    wlSlider.addEventListener("input", draw);
    ampSlider.addEventListener("input", draw);
    resize();
    draw();
  })();

  (function () {
    const spectrumData = [
      {
        index: 0,
        abbr: "GAMMA",
        name: "Gamma Rays",
        range: "< 0.01 nm (< 10⁻¹¹ m)",
        freq: "> 30 EHz (> 3×10¹⁹ Hz)",
        energy: "> 100 keV",
        origin: "Nuclear transitions & cosmic phenomena",
        desc: "The shortest wavelength and most energetic form of electromagnetic radiation. Photons are ionizing and dangerous. They are naturally produced on Earth only by radioactive decay and high-altitude lightning strikes (Terrestrial Gamma-ray Flashes).",
        atmoClass: "blocked",
        atmoShort: "100% Blocked by Atmosphere",
        atmoDesc:
          "<strong>Completely Blocked:</strong> Gamma rays interact via photoelectric absorption, Compton scattering, and pair production in the upper atmosphere. None reach the Earth's surface.",
        uses: [
          "Astrophysical high-energy bursts",
          "Lunar & Martian surface geochemistry (gamma spectrometers)",
          "Nuclear materials monitoring",
        ],
        activeSensors: [],
        inactiveReason:
          "Earth observation satellites cannot use Gamma rays. The atmosphere is totally opaque, and photons are ionizing and destructive rather than reflective.",
      },
      {
        index: 1,
        abbr: "X-RAY",
        name: "X-Rays",
        range: "0.01 – 10 nm",
        freq: "30 PHz – 30 EHz (3×10¹⁶ – 3×10¹⁹ Hz)",
        energy: "120 eV – 120 keV",
        origin: "Inner-shell atomic transitions & deceleration",
        desc: "High-energy radiation capable of penetrating soft tissue. Solar X-rays ionize nitrogen and oxygen in the upper atmosphere (thermosphere/ionosphere), shielding the biosphere from harm.",
        atmoClass: "blocked",
        atmoShort: "100% Blocked by Atmosphere",
        atmoDesc:
          "<strong>Completely Blocked:</strong> Atmospheric molecular nitrogen (N₂) and oxygen (O₂) absorb virtually 100% of extraterrestrial X-rays before they reach the ground.",
        uses: [
          "Space astronomy (Chandra, AstroSat)",
          "Solar flare flux monitoring (GOES XRS)",
          "Medical diagnostic radiography",
        ],
        activeSensors: [],
        inactiveReason:
          "Atmosphere absorbs all incoming and surface-reflected X-rays. Earth surface features do not reflect X-rays.",
      },
      {
        index: 2,
        abbr: "UV",
        name: "Ultraviolet (UV)",
        range: "10 – 400 nm (0.01 – 0.4 µm)",
        freq: "750 THz – 30 PHz",
        energy: "3.1 – 124 eV",
        origin: "Solar emission & valence electron transitions",
        desc: "Spans UV-C (100–280 nm), UV-B (280–315 nm), and UV-A (315–400 nm). Shorter wavelengths are absorbed by stratospheric ozone (O₃). Shorter visible/UV wavelengths also undergo extreme Rayleigh scattering (proportional to 1/λ⁴), producing a dense atmospheric haze.",
        atmoClass: "blocked",
        atmoShort: "Largely Blocked / Heavy Rayleigh Scattering",
        atmoDesc:
          "<strong>Severe Atmospheric Absorption:</strong> Stratospheric ozone absorbs UV-C and UV-B. Near-UV (320–400 nm) partially penetrates but suffers intense molecular scattering, making clear surface imaging impractical.",
        uses: [
          "Stratospheric & total column Ozone (O₃) mapping",
          "Sulfur dioxide (SO₂) volcanic plume tracking",
          "Nitrogen dioxide (NO₂) tropospheric air quality",
        ],
        activeSensors: [
          {
            id: "tropomi",
            name: "Sentinel-5P (TROPOMI)",
            agency: "ESA / Copernicus",
            bands: "UV1 (270-300nm), UV2 (300-320nm)",
            note: "Monitors global ozone layer thickness and volcanic SO₂ aerosol plumes daily.",
          },
          {
            id: "omi",
            name: "Aura (OMI)",
            agency: "NASA / KNMI",
            bands: "UV1 (264-311nm), UV2 (307-383nm)",
            note: "Continuous global record of atmospheric ozone, UV index, and aerosols since 2004.",
          },
        ],
        inactiveReason:
          "Surface remote sensing avoids UV due to intense atmospheric haze. Satellites in UV operate as atmospheric sounders, looking at gas backscatter.",
      },
      {
        index: 3,
        abbr: "VISIBLE",
        name: "Visible Light",
        range: "0.4 – 0.7 µm (400 – 700 nm)",
        freq: "430 – 750 THz",
        energy: "1.8 – 3.1 eV",
        origin: "Solar irradiance peak (reflected sunlight)",
        desc: "The only region human eyes perceive: Blue (0.4–0.5 µm), Green (0.5–0.6 µm), and Red (0.6–0.7 µm). In remote sensing, red light is heavily absorbed by chlorophyll-a and b for photosynthesis, while green is reflected, giving healthy plants their characteristic green hue.",
        atmoClass: "window",
        atmoShort: "Clear Optical Atmospheric Window",
        atmoDesc:
          "<strong>Optical Atmospheric Window:</strong> High atmospheric transmission between 0.4 and 0.7 µm. Clear daylight imaging is possible, though clouds and Rayleigh scattering (blue haze) still occur.",
        uses: [
          "True-Colour RGB Natural Photography",
          "Chlorophyll absorption in Red (665 nm)",
          "Coastal bathymetry & water turbidity in Blue (490 nm)",
          "Cadastral and infrastructure mapping",
        ],
        activeSensors: [
          {
            id: "sentinel2",
            name: "Sentinel-2 MSI",
            agency: "ESA / Copernicus",
            bands:
              "B1 Coastal (443nm), B2 Blue (490nm, 10m), B3 Green (560nm, 10m), B4 Red (665nm, 10m)",
            note: "10-meter spatial resolution provides unmatched detail for public European & global land observation.",
          },
          {
            id: "landsat",
            name: "Landsat 8/9 (OLI)",
            agency: "NASA / USGS",
            bands:
              "B1 Coastal (443nm), B2 Blue (482nm), B3 Green (561nm), B4 Red (655nm, 30m)",
            note: "Calibrated 30-meter multispectral radiometric benchmark with continuous data since 1972.",
          },
          {
            id: "resourcesat",
            name: "Resourcesat-2A (LISS-IV & AWiFS)",
            agency: "ISRO",
            bands: "B2 Green (520-590nm), B3 Red (620-680nm)",
            note: "LISS-IV delivers crisp 5.8m multispectral imagery across India for crop acreage and rural planning.",
          },
          {
            id: "cartosat",
            name: "Cartosat-3",
            agency: "ISRO",
            bands:
              "Panchromatic (0.25m, 450-750nm), HRMX 4-band VIS/NIR (1.0m)",
            note: "India's highest resolution optical civilian satellite for urban infrastructure and cadastral surveys.",
          },
          {
            id: "modis",
            name: "MODIS (Terra & Aqua)",
            agency: "NASA",
            bands:
              "B1 Red (645nm, 250m), B3 Blue (469nm, 500m), B4 Green (555nm, 500m)",
            note: "Daily 1-2 day global revisit monitoring biosphere phenology and ocean color.",
          },
        ],
      },
      {
        index: 4,
        abbr: "NIR",
        name: "Near-Infrared (NIR)",
        range: "0.7 – 1.3 µm (700 – 1300 nm)",
        freq: "230 – 430 THz",
        energy: "0.95 – 1.8 eV",
        origin: "Solar reflected (spongy mesophyll scattering)",
        desc: "Completely invisible to human vision. Healthy green vegetation reflects 40–60% of NIR radiation due to multiple refractive scattering inside the spongy mesophyll leaf tissue ('NIR Plateau'). Clear deep water absorbs NIR radiation almost totally, creating razor-sharp land-water boundaries.",
        atmoClass: "window",
        atmoShort: "High Transmission Solar Window",
        atmoDesc:
          "<strong>Solar Reflectance Window:</strong> Wide transparent window between water vapor absorption bands at 0.9 µm and 1.1 µm. Outstanding contrast between vegetation, soil, and water bodies.",
        uses: [
          "Normalized Difference Vegetation Index (NDVI)",
          "Canopy biomass & physiological vigor assessment",
          "Sharp land-water boundary delineation",
          "Standard False-Colour Composites (FCC: NIR=Red, Red=Green, Green=Blue)",
        ],
        activeSensors: [
          {
            id: "sentinel2",
            name: "Sentinel-2 MSI",
            agency: "ESA / Copernicus",
            bands:
              "B5, B6, B7 (Red Edge: 705, 740, 783nm), B8 NIR (842nm, 10m), B8A Narrow NIR (865nm, 20m)",
            note: "Specialized 'Red-Edge' channels detect vegetation chlorophyll stress days before visible browning.",
          },
          {
            id: "landsat",
            name: "Landsat 8/9 (OLI)",
            agency: "NASA / USGS",
            bands: "B5 NIR (865nm, 30m)",
            note: "The primary band powering the 50-year Landsat global vegetation index archive.",
          },
          {
            id: "resourcesat",
            name: "Resourcesat-2A (LISS-III / LISS-IV / AWiFS)",
            agency: "ISRO",
            bands: "B4 NIR (770-860nm)",
            note: "Workhorse band for the FASAL agricultural forecasting project and National Forest Cover assessments.",
          },
          {
            id: "cartosat",
            name: "Cartosat-3",
            agency: "ISRO",
            bands: "HRMX B4 NIR (770-860nm, 1.0m resolution)",
            note: "Sub-meter multispectral analysis of individual tree canopies and urban micro-greenery.",
          },
          {
            id: "modis",
            name: "MODIS (Terra & Aqua)",
            agency: "NASA",
            bands: "B2 NIR (858nm, 250m resolution)",
            note: "Global 250m daily NIR band driving international drought indices and vegetation dynamics.",
          },
        ],
      },
      {
        index: 5,
        abbr: "SWIR",
        name: "Short-Wave Infrared (SWIR)",
        range: "1.3 – 3.0 µm (1300 – 3000 nm)",
        freq: "100 – 230 THz",
        energy: "0.41 – 0.95 eV",
        origin: "Solar reflected (molecular vibrations & water absorption)",
        desc: "SWIR radiation interacts directly with liquid water molecules in plant cells and soil. Water absorbs strongly at 1.4 µm and 1.9 µm. Consequently, healthy moisture-rich crops absorb SWIR, whereas dry, drought-stressed vegetation or bare dry soil reflects it brightly.",
        atmoClass: "partial",
        atmoShort: "Windows between H₂O & CO₂ Absorption Gaps",
        atmoDesc:
          "<strong>Selective Windows:</strong> Atmosphere exhibits total absorption 'notches' at 1.4 µm and 1.9 µm due to atmospheric water vapor. Satellite sensors place bands precisely in the clear windows around 1.6 µm (SWIR-1) and 2.2 µm (SWIR-2).",
        uses: [
          "Plant canopy & soil moisture (NDWI / NDMI)",
          "Burn scar delineation & Normalized Burn Ratio (NBR)",
          "Lithological mineral exploration (clays, carbonates, hydroxyl)",
          "Snow vs. White Cloud discrimination (snow absorbs SWIR, clouds reflect it)",
        ],
        activeSensors: [
          {
            id: "sentinel2",
            name: "Sentinel-2 MSI",
            agency: "ESA / Copernicus",
            bands:
              "B11 SWIR-1 (1.61 µm, 20m), B12 SWIR-2 (2.19 µm, 20m), B10 Cirrus (1.375 µm, 60m)",
            note: "Essential for post-wildfire burn severity mapping and distinguishing cirrus clouds from snowpack.",
          },
          {
            id: "landsat",
            name: "Landsat 8/9 (OLI)",
            agency: "NASA / USGS",
            bands:
              "B6 SWIR-1 (1.61 µm, 30m), B7 SWIR-2 (2.20 µm, 30m), B9 Cirrus (1.37 µm, 30m)",
            note: "B6 and B7 are standard worldwide for geological mapping and agricultural water stress.",
          },
          {
            id: "resourcesat",
            name: "Resourcesat-2A (AWiFS & LISS-III)",
            agency: "ISRO",
            bands: "B5 SWIR (1.55-1.70 µm, 23.5m / 56m)",
            note: "Critical for national drought monitoring (NADAMS) and snow cover extent in the Himalayas.",
          },
          {
            id: "modis",
            name: "MODIS (Terra & Aqua)",
            agency: "NASA",
            bands: "B6 (1.64 µm), B7 (2.13 µm)",
            note: "Provides real-time global snow and ice mapping products.",
          },
        ],
      },
      {
        index: 6,
        abbr: "TIR",
        name: "Thermal Infrared (TIR)",
        range: "3.0 – 14 µm (3000 – 14000 nm)",
        freq: "21.4 – 100 THz",
        energy: "0.089 – 0.41 eV",
        origin: "Terrestrial thermal emission (Earth's blackbody peak ~9.7 µm)",
        desc: "Unlike visible, NIR, and SWIR which record reflected sunlight, Thermal IR measures radiation directly EMITTED by the Earth's surface due to its kinetic temperature (governed by Planck's Radiation Law, Stefan-Boltzmann Law, and Wien's Law). Operates identically day or night.",
        atmoClass: "partial",
        atmoShort: "Thermal Window (8 – 14 µm)",
        atmoDesc:
          "<strong>Thermal Atmospheric Window:</strong> The atmosphere has a wide window between 8 and 14 µm (with an ozone absorption band at 9.6 µm). A secondary window exists at 3.5–4.0 µm for detecting intense thermal sources like wildfires and volcanic eruptions.",
        uses: [
          "Land Surface Temperature (LST) quantitative retrieval",
          "Urban Heat Island (UHI) microclimate modeling",
          "Wildfire & active volcanic lava hotspot tracking",
          "Sea Surface Temperature (SST) for cyclone intensity tracking",
        ],
        activeSensors: [
          {
            id: "landsat",
            name: "Landsat 8/9 (TIRS)",
            agency: "NASA / USGS",
            bands:
              "B10 TIRS-1 (10.6-11.2 µm, 100m resampled to 30m), B11 TIRS-2 (11.5-12.5 µm)",
            note: "Split-window dual thermal bands allow rigorous atmospheric correction for surface temperature.",
          },
          {
            id: "modis",
            name: "MODIS (Terra & Aqua)",
            agency: "NASA",
            bands:
              "B31 (11.0 µm, 1km), B32 (12.0 µm, 1km), B21/22 Mid-IR (3.9 µm)",
            note: "Global Sea Surface Temperature (SST) benchmark and real-time active fire detection system.",
          },
          {
            id: "insat",
            name: "INSAT-3D / 3DR (Imager)",
            agency: "ISRO",
            bands:
              "TIR-1 (10.3-11.3 µm), TIR-2 (11.5-12.5 µm), MIR (3.8-4.0 µm)",
            note: "Geostationary imager delivering thermal cloud top and surface temperature scans every 15 minutes.",
          },
        ],
      },
      {
        index: 7,
        abbr: "MICROWAVE",
        name: "Microwave / RADAR",
        range: "1 mm – 1 m (1,000 – 1,000,000 µm)",
        freq: "300 MHz – 300 GHz",
        energy: "1.24 µeV – 1.24 meV",
        origin:
          "Active coherent pulse generation (SAR) & passive microwave emission",
        desc: "Long wavelength radiation capable of completely penetrating clouds, dense haze, fog, smoke, and light rainfall. Active Synthetic Aperture Radar (SAR) transmits coherent pulses and measures the backscattered amplitude and phase, providing information on surface roughness, moisture, and dielectric properties.",
        atmoClass: "window",
        atmoShort: "All-Weather, Cloud-Penetrating Window",
        atmoDesc:
          "<strong>100% All-Weather Transparency:</strong> Rain droplets and clouds are orders of magnitude smaller than microwave wavelengths (preventing Rayleigh scattering). Operates 24/7 in total darkness or heavy storm conditions.",
        uses: [
          "All-weather emergency flood extent & disaster mapping",
          "Soil moisture and crop canopy roughness estimation",
          "Interferometric SAR (InSAR) for millimeter-level earthquake & subsidence ground displacement",
          "Polar ice sheet motion and maritime vessel detection",
        ],
        activeSensors: [
          {
            id: "sentinel1",
            name: "Sentinel-1 SAR",
            agency: "ESA / Copernicus",
            bands: "C-band (5.405 GHz / λ ≈ 5.55 cm)",
            note: "Dual-polarization (VV+VH) all-weather SAR with rapid 6-12 day global repeat and 250km swath.",
          },
          {
            id: "nisar",
            name: "NISAR (NASA-ISRO SAR)",
            agency: "NASA / ISRO",
            bands:
              "Dual L-band (1.25 GHz / 24 cm, NASA) & S-band (3.2 GHz / 9.3 cm, ISRO)",
            note: "Flagship dual-frequency polarimetric InSAR for global ecosystem biomass, cryosphere dynamics, and seismic deformation.",
          },
          {
            id: "risat",
            name: "EOS-04 / RISAT-1A",
            agency: "ISRO",
            bands: "C-band (5.35 GHz / 5.6 cm)",
            note: "Operational Indian C-band SAR specialized for kharif monsoon paddy mapping, flood tracking, and defense surveillance.",
          },
          {
            id: "alos",
            name: "ALOS-2 / ALOS-4 PALSAR-2",
            agency: "JAXA",
            bands: "L-band (1.27 GHz / λ ≈ 23.6 cm)",
            note: "Longer L-band waves penetrate forest canopies down to tree trunks and soil surface.",
          },
        ],
      },
      {
        index: 8,
        abbr: "RADIO",
        name: "Radio Waves",
        range: "> 1 m (> 1000 mm)",
        freq: "< 300 MHz",
        energy: "< 1.24 µeV",
        origin: "Oscillating electrical currents & astronomical radio sources",
        desc: "The longest waves in the electromagnetic spectrum, with very low photon energy. Standard imaging radar antennas would need to be kilometers wide to resolve ground targets at these wavelengths; however, GNSS satellite radio signals are used passively for reflectometry.",
        atmoClass: "window",
        atmoShort: "Transparent down to Ionospheric Cutoff (~10–30 MHz)",
        atmoDesc:
          "<strong>Atmospheric Transparency:</strong> The neutral atmosphere is completely transparent. Waves below ~10–30 MHz are reflected by ionospheric plasma, making low-frequency radio astronomy only possible from space.",
        uses: [
          "GNSS Reflectometry (CYGNSS constellation for ocean wind speeds through hurricanes)",
          "Telemetry, Tracking and Command (TT&C) satellite communication",
          "Cosmic radio astronomy (e.g. Giant Metrewave Radio Telescope - GMRT Pune)",
        ],
        activeSensors: [
          {
            id: "cygnss",
            name: "CYGNSS (8 Microsatellites)",
            agency: "NASA",
            bands: "GPS L1 signals of opportunity (1.575 GHz / 19 cm)",
            note: "Measures GPS radio signal forward-scatter off the sea surface to calculate cyclone wind speeds.",
          },
        ],
        inactiveReason:
          "Standard imaging Earth observation sensors are not built in VHF/HF radio bands due to diffraction limits and massive required antenna dimensions.",
      },
    ];

    // Sensor mapping to band indices
    const sensorBandMap = {
      sentinel2: [3, 4, 5],
      landsat: [3, 4, 5, 6],
      resourcesat: [3, 4, 5],
      cartosat: [3, 4],
      sentinel1: [7],
      nisar: [7],
      modis: [3, 4, 5, 6],
    };

    // DOM Elements
    const slider = document.getElementById("em-spectrum-slider");
    const bandSteps = document.querySelectorAll(".spectrum-band-step");
    const ticks = document.querySelectorAll(".slider-tick");
    const atmoQuick = document.getElementById("atmo-status-quick");
    const bName = document.getElementById("b-name");
    const bRange = document.getElementById("b-range");
    const bFreq = document.getElementById("b-freq");
    const bEnergy = document.getElementById("b-energy");
    const bOrigin = document.getElementById("b-origin");
    const bDesc = document.getElementById("b-desc");
    const bAtmoBox = document.getElementById("b-atmo-box");
    const bAtmoDesc = document.getElementById("b-atmo-desc");
    const bUses = document.getElementById("b-uses");
    const sensorsList = document.getElementById("sensors-list");
    const sensorCount = document.getElementById("active-sensor-count");
    const sensorChips = document.querySelectorAll(".sensor-chip");

    if (!slider) return;

    let activeFilterSensor = null;

    function updateSpectrumUI(index) {
      const data = spectrumData[index];
      if (!data) return;

      // Update active band steps on spectrum bar
      bandSteps.forEach((step) => {
        const stepIdx = parseInt(step.dataset.index);
        step.classList.toggle("active", stepIdx === index);
      });

      // Update slider ticks
      ticks.forEach((tick) => {
        const tickIdx = parseInt(tick.dataset.index);
        tick.classList.toggle("active", tickIdx === index);
      });

      // Update Telemetry Header
      bName.textContent = data.name;
      bRange.textContent = data.range;
      bFreq.textContent = data.freq;
      bEnergy.textContent = data.energy;
      bOrigin.textContent = data.origin;
      bDesc.textContent = data.desc;

      // Atmospheric Status Box
      bAtmoBox.className = `band-atmo-status ${data.atmoClass}`;
      bAtmoDesc.innerHTML = data.atmoDesc;
      atmoQuick.textContent = data.atmoShort;

      // Applications pills
      bUses.innerHTML = data.uses
        .map((u) => `<span class="band-use-pill">${u}</span>`)
        .join("");

      // Update Sensors List
      renderSensorsList(data);
    }

    function renderSensorsList(bandData) {
      sensorsList.innerHTML = "";

      if (bandData.activeSensors.length === 0) {
        sensorCount.textContent = "0 Active in this Band";
        sensorCount.style.background = "rgba(239, 68, 68, 0.15)";
        sensorCount.style.color = "#f87171";
        sensorCount.style.borderColor = "rgba(239, 68, 68, 0.3)";

        const emptyNotice = document.createElement("div");
        emptyNotice.className = "sensor-item";
        emptyNotice.style.borderLeft = "3px solid var(--red)";
        emptyNotice.innerHTML = `
          <div class="sensor-item-top">
            <span class="sensor-item-name" style="color:#fca5a5;">No Surface Imaging Sensors</span>
            <span class="sensor-item-agency">Physical Constraint</span>
          </div>
          <div class="sensor-item-desc">${bandData.inactiveReason}</div>
        `;
        sensorsList.appendChild(emptyNotice);
        return;
      }

      sensorCount.textContent = `${bandData.activeSensors.length} Operating Sensor${bandData.activeSensors.length > 1 ? "s" : ""}`;
      sensorCount.style.background = "var(--teal-dim)";
      sensorCount.style.color = "var(--teal)";
      sensorCount.style.borderColor = "rgba(45, 212, 191, 0.3)";

      bandData.activeSensors.forEach((s) => {
        const card = document.createElement("div");
        const isFilteredMatch = activeFilterSensor
          ? s.id === activeFilterSensor
          : true;
        card.className = `sensor-item active ${activeFilterSensor && !isFilteredMatch ? "dimmed" : ""}`;
        card.innerHTML = `
          <div class="sensor-item-top">
            <span class="sensor-item-name">${s.name}</span>
            <span class="sensor-item-agency">${s.agency}</span>
          </div>
          <div class="sensor-item-band-detail">${s.bands}</div>
          <div class="sensor-item-desc">${s.note}</div>
        `;
        sensorsList.appendChild(card);
      });
    }

    // Slider change event
    slider.addEventListener("input", (e) => {
      const idx = parseInt(e.target.value);
      updateSpectrumUI(idx);
    });

    // Clicking on spectrum bar segments
    bandSteps.forEach((step) => {
      step.addEventListener("click", () => {
        const idx = parseInt(step.dataset.index);
        slider.value = idx;
        updateSpectrumUI(idx);
      });
    });

    // Clicking on slider ticks
    ticks.forEach((tick) => {
      tick.addEventListener("click", () => {
        const idx = parseInt(tick.dataset.index);
        slider.value = idx;
        updateSpectrumUI(idx);
      });
    });

    // Sensor Quick-Filter Chips
    sensorChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const sensorKey = chip.dataset.sensor;
        if (activeFilterSensor === sensorKey) {
          // Toggle off filter
          activeFilterSensor = null;
          chip.classList.remove("active-chip");
          bandSteps.forEach((step) =>
            step.classList.remove("sensor-highlight"),
          );
        } else {
          sensorChips.forEach((c) => c.classList.remove("active-chip"));
          chip.classList.add("active-chip");
          activeFilterSensor = sensorKey;

          // Highlight operational bands on the spectrum bar
          const operationalBands = sensorBandMap[sensorKey] || [];
          bandSteps.forEach((step) => {
            const stepIdx = parseInt(step.dataset.index);
            step.classList.toggle(
              "sensor-highlight",
              operationalBands.includes(stepIdx),
            );
          });

          // Automatically slide to the first operational band if current band is not in it
          const currentIdx = parseInt(slider.value);
          if (
            !operationalBands.includes(currentIdx) &&
            operationalBands.length > 0
          ) {
            slider.value = operationalBands[0];
            updateSpectrumUI(operationalBands[0]);
            return;
          }
        }

        updateSpectrumUI(parseInt(slider.value));
      });
    });

    // Initial render on Visible Light (Index 3)
    updateSpectrumUI(3);
  })();
}
