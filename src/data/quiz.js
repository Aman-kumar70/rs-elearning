export const quizTopics = [
  {
    title: "Track A — Intro to Remote Sensing",
    desc: "RS.0: the definition, the six-component process, and why remote sensing matters",
    questions: [
      {
        q: "What is remote sensing?",
        options: [
          "Collecting information by physically touching an object",
          "Collecting information without physically touching an object",
          "Studying only objects in space",
          "Measuring temperature with a thermometer",
        ],
        correct: 1,
        feedback: "Correct answer: B.",
      },
      {
        q: "What does a remote sensing system detect or measure?",
        options: [
          "Electromagnetic energy",
          "Only sound waves",
          "Only visible light",
          "Soil weight",
        ],
        correct: 0,
        feedback: "Correct answer: A.",
      },
      {
        q: "Which is the main source of energy for most optical satellite images?",
        options: ["The Moon", "Earth's core", "The Sun", "Artificial lighting"],
        correct: 2,
        feedback: "Correct answer: C.",
      },
      {
        q: "When radiation passes through the atmosphere, it may be scattered or absorbed.",
        options: ["True", "False"],
        correct: 0,
        feedback: "Correct answer: A. True",
      },
      {
        q: "What can Earth's surface do to incoming energy?",
        options: [
          "Only absorb it",
          "Only reflect it",
          "Absorb, reflect, transmit, or emit it",
          "Convert all of it into visible light",
        ],
        correct: 2,
        feedback: "Correct answer: C.",
      },
      {
        q: "Scientists want to monitor deforestation in the Amazon but cannot visit every location. Why is remote sensing useful?",
        options: [
          "It requires visiting every tree",
          "It allows large areas to be monitored without visiting every location",
          "It prevents deforestation automatically",
          "It works only in cities",
        ],
        correct: 1,
        feedback: "Correct answer: B.",
      },
      {
        q: "Field verification can help confirm whether an interpretation of a satellite image is accurate.",
        options: ["True", "False"],
        correct: 0,
        feedback: "Correct answer: A. True",
      },
      {
        q: "Why may field verification be necessary?",
        options: [
          "To confirm that image interpretations are accurate",
          "To prevent satellites from orbiting",
          "To eliminate all electromagnetic radiation",
          "To replace every satellite image",
        ],
        correct: 0,
        feedback: "Correct answer: A.",
      },
    ],
  },
  {
    title: "Track A — Remote Sensing Fundamentals",
    desc: "RS.1–RS.4: EM radiation, spectrum, signatures, orbits, resolution",
    questions: [
      {
        q: "What is the simplest definition of remote sensing?",
        options: [
          "Flying a drone to take aerial photos",
          "Obtaining information about an object from a distance",
          "Using radar to detect aircraft",
          "Measuring temperature with a thermometer",
        ],
        correct: 1,
        feedback:
          "Correct! Remote sensing is any method of gathering information about an object without physical contact.",
      },
      {
        q: "Why do healthy plants appear bright RED in false-colour (NIR→red) imagery?",
        options: [
          "The satellite adds red colouring to vegetation",
          "Plants strongly reflect near-infrared light, displayed as red",
          "Red is the only wavelength satellites detect",
          "Chlorophyll is naturally red",
        ],
        correct: 1,
        feedback:
          "Exactly! Chlorophyll absorbs visible red but strongly reflects NIR. Assigning NIR to the red display channel makes vegetation glow.",
      },
      {
        q: "What is the key advantage of an active sensor (like RADAR) over a passive sensor?",
        options: [
          "Higher resolution images",
          "Works day or night and penetrates clouds",
          "Cheaper to build",
          "Only sees visible light",
        ],
        correct: 1,
        feedback:
          "Right! Active sensors provide their own energy, typically in microwave, which penetrates clouds and works regardless of sunlight.",
      },
      {
        q: "A geostationary satellite orbits at what altitude and period?",
        options: [
          "700-800 km, 90 minutes",
          "36,000 km, 24 hours",
          "400 km, 45 minutes",
          "150 km, 30 minutes",
        ],
        correct: 1,
        feedback:
          "Right! At ~36,000 km, orbital period matches Earth's 24-hour rotation, so it appears to hover over one spot.",
      },
      {
        q: "If a sensor has 8-bit radiometric resolution, how many grey levels can it distinguish?",
        options: ["8", "64", "256", "1024"],
        correct: 2,
        feedback: "Correct! 2⁸ = 256 grey levels (0–255).",
      },
      {
        q: "Which is NOT one of the four resolution types in remote sensing?",
        options: ["Spatial", "Spectral", "Chromatic", "Radiometric"],
        correct: 2,
        feedback:
          "Right! The four are spatial, spectral, radiometric, and temporal — 'chromatic' isn't one of them.",
      },
    ],
  },
  {
    title: "Track A — Interpretation, Missions & Data",
    desc: "RS.5–RS.6: reading images, satellites, free data sources",
    questions: [
      {
        q: "Which of the following is NOT one of the seven elements of image interpretation?",
        options: ["Tone", "Pattern", "Latitude", "Association"],
        correct: 2,
        feedback:
          "Right! The seven are Tone, Shape, Size, Pattern, Texture, Shadow, and Association.",
      },
      {
        q: "Which satellite mission provides the HIGHEST spatial resolution from India?",
        options: [
          "IRS-1A (1988)",
          "RESOURCESAT-2A",
          "Cartosat-3 (2019)",
          "OCEANSAT-2",
        ],
        correct: 2,
        feedback:
          "That's right! Cartosat-3 provides 0.25m panchromatic resolution.",
      },
      {
        q: "Which portal provides FREE Indian satellite data (IRS, Cartosat, Resourcesat)?",
        options: [
          "Google Maps",
          "Bhoonidhi (NRSC)",
          "Bing Maps",
          "OpenStreetMap",
        ],
        correct: 1,
        feedback:
          "Correct! Bhoonidhi (bhoonidhi.nrsc.gov.in) is ISRO's official free data portal.",
      },
      {
        q: "Which processing level of satellite data is generally EASIEST to use for analysis?",
        options: [
          "Level 0 — raw instrument data",
          "Level 1 — time-referenced telemetry",
          "Level 2 — atmospherically corrected (e.g. L2A)",
          "None — all levels are equally usable",
        ],
        correct: 2,
        feedback:
          "Right! L2/L2A products are calibrated and atmospherically corrected — ready to analyze.",
      },
    ],
  },
  {
    title: "Track B — Image Basics & Preprocessing",
    desc: "IP.1–IP.2: digital images, radiometric & geometric correction",
    questions: [
      {
        q: "In a NumPy array read by rasterio, what does the shape (4, 2048, 2048) represent?",
        options: [
          "4 images of 2048x2048 pixels each, unrelated",
          "4 bands, each 2048 rows x 2048 columns",
          "2048 bands of 4x4 pixels",
          "A single band at 4 different zoom levels",
        ],
        correct: 1,
        feedback:
          "Correct! rasterio returns arrays shaped (bands, rows, cols).",
      },
      {
        q: "What causes 'line dropout' in a satellite image?",
        options: [
          "Too much sunlight",
          "A detector element fails, producing a blank/garbage scan line",
          "The image was compressed incorrectly",
          "Cloud cover",
        ],
        correct: 1,
        feedback:
          "Right! A failed detector (common in push-broom sensors) produces a dead scan line.",
      },
      {
        q: "What does Dark Object Subtraction correct for?",
        options: [
          "Geometric distortion",
          "Radiometric error from atmospheric haze",
          "Missing scan lines",
          "Sensor calibration drift over years",
        ],
        correct: 1,
        feedback:
          "Correct! It assumes the darkest pixel should read ~0, and subtracts that offset (caused by haze scattering) from every pixel.",
      },
      {
        q: "Which resampling method should you use BEFORE classification, to preserve original DN values?",
        options: [
          "Bilinear interpolation",
          "Cubic convolution",
          "Nearest neighbour",
          "Any of the above — they're equivalent",
        ],
        correct: 2,
        feedback:
          "Right! Nearest neighbour copies the original DN exactly, rather than blending values — important before classification.",
      },
    ],
  },
  {
    title: "Track B — Enhancement & Classification",
    desc: "IP.3–IP.5: contrast, filtering, indices, classification, Python",
    questions: [
      {
        q: "What is NDVI and which bands does it use?",
        options: [
          "A water quality index using blue and green bands",
          "A vegetation index computed from NIR and red bands",
          "A thermal index using TIR bands",
          "A radar index using microwave bands",
        ],
        correct: 1,
        feedback:
          "NDVI = (NIR − Red) / (NIR + Red). Healthy vegetation has high NDVI.",
      },
      {
        q: "In spatial filtering, what kind of kernel produces a smoothing (low-pass) effect?",
        options: [
          "A kernel with negative values around a large positive centre",
          "A uniform kernel of equal positive weights (e.g. all 1s)",
          "A kernel that sums to zero",
          "Any 3x3 kernel, regardless of values",
        ],
        correct: 1,
        feedback:
          "Correct! A uniform kernel simply averages neighbouring pixels, smoothing the image.",
      },
      {
        q: "What does Principal Component Analysis (PCA) do to a multi-band image?",
        options: [
          "Adds more spectral bands",
          "Rotates axes to produce decorrelated components ranked by variance explained",
          "Corrects geometric distortion",
          "Classifies pixels into land-cover types",
        ],
        correct: 1,
        feedback:
          "Right! PCA finds new axes along which the data varies most, decorrelating bands that are often highly correlated.",
      },
      {
        q: "What's the key difference between supervised and unsupervised classification?",
        options: [
          "Supervised needs labelled training samples; unsupervised groups pixels by similarity with no prior labels",
          "Unsupervised is always more accurate",
          "Supervised only works on radar images",
          "There is no real difference",
        ],
        correct: 0,
        feedback:
          "Correct! Supervised classification learns from training samples you provide; unsupervised clustering (like K-Means) finds groups on its own.",
      },
      {
        q: "In a confusion matrix, what does 'Producer's Accuracy' measure for a given class?",
        options: [
          "Of all pixels the map calls that class, what % are correct (row-wise)",
          "Of all true reference pixels of that class, what % were correctly classified (column-wise)",
          "The total number of pixels in that class",
          "The Kappa coefficient for that class alone",
        ],
        correct: 1,
        feedback:
          "Right! Producer's accuracy is column-wise: how well the true class was captured. User's accuracy is the row-wise equivalent.",
      },
    ],
  },
];

export const totalQuizQuestions = quizTopics.reduce(
  (total, topic) => total + topic.questions.length,
  0,
);
