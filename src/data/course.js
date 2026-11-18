export const RS_TRACK = [
  {
    path: "/remote-sensing/intro",
    short: "Introduction",
    title: "Intro to Remote Sensing",
    num: "RS.0",
  },
  {
    path: "/remote-sensing/fundamentals",
    short: "Fundamentals",
    title: "What Is Remote Sensing?",
    num: "RS.1",
  },
  {
    path: "/remote-sensing/signatures",
    short: "Signatures",
    title: "Spectral Signatures",
    num: "RS.2",
  },
  {
    path: "/remote-sensing/platforms",
    short: "Platforms",
    title: "Orbits & Scanning",
    num: "RS.3",
  },
  {
    path: "/remote-sensing/resolution",
    short: "Resolution",
    title: "The Four Resolutions",
    num: "RS.4",
  },
  {
    path: "/remote-sensing/interpretation",
    short: "Interpretation",
    title: "Reading a Satellite Image",
    num: "RS.5",
  },
  {
    path: "/remote-sensing/missions-data",
    short: "Missions & Data",
    title: "Satellites & Free Data",
    num: "RS.6",
  },
];

export const IP_TRACK = [
  {
    path: "/image-processing/basics",
    short: "Digital Images",
    title: "What Is a Digital Image?",
    num: "IP.1",
  },
  {
    path: "/image-processing/preprocessing",
    short: "Preprocessing",
    title: "Radiometric & Geometric Correction",
    num: "IP.2",
  },
  {
    path: "/image-processing/enhancement",
    short: "Enhancement",
    title: "Contrast, Filtering & Indices",
    num: "IP.3",
  },
  {
    path: "/image-processing/classification",
    short: "Classification",
    title: "Turning Pixels Into Classes",
    num: "IP.4",
  },
  {
    path: "/image-processing/python-lab",
    short: "Python Lab",
    title: "A Real NDVI + Classification Workflow",
    num: "IP.5",
  },
];

export const ALL_PAGES = [
  { path: "/", short: "Home", title: "Home", num: null, track: null },
  ...RS_TRACK.map((page) => ({ ...page, track: "rs" })),
  ...IP_TRACK.map((page) => ({ ...page, track: "ip" })),
  {
    path: "/applications",
    short: "Applications",
    title: "Real-World Applications",
    num: null,
    track: null,
  },
  {
    path: "/quiz",
    short: "Quiz",
    title: "Knowledge Check",
    num: null,
    track: null,
  },
];

export const LEGACY_ROUTES = {
  "/index.html": "/",
  "/pages/remote-sensing/intro.html": "/remote-sensing/intro",
  "/pages/remote-sensing/fundamentals.html": "/remote-sensing/fundamentals",
  "/pages/remote-sensing/signatures.html": "/remote-sensing/signatures",
  "/pages/remote-sensing/platforms.html": "/remote-sensing/platforms",
  "/pages/remote-sensing/resolution.html": "/remote-sensing/resolution",
  "/pages/remote-sensing/interpretation.html": "/remote-sensing/interpretation",
  "/pages/remote-sensing/missions-data.html": "/remote-sensing/missions-data",
  "/pages/image-processing/basics.html": "/image-processing/basics",
  "/pages/image-processing/preprocessing.html":
    "/image-processing/preprocessing",
  "/pages/image-processing/enhancement.html": "/image-processing/enhancement",
  "/pages/image-processing/classification.html":
    "/image-processing/classification",
  "/pages/image-processing/python-lab.html": "/image-processing/python-lab",
  "/pages/applications.html": "/applications",
  "/pages/quiz.html": "/quiz",
};

export function getPageByPath(path) {
  return ALL_PAGES.find((page) => page.path === path);
}

export function getPrevNext(path) {
  const index = ALL_PAGES.findIndex((page) => page.path === path);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ALL_PAGES[index - 1] : null,
    next: index < ALL_PAGES.length - 1 ? ALL_PAGES[index + 1] : null,
  };
}

export function getTrackForPath(path) {
  return [
    ...RS_TRACK.map((page) => ({ ...page, track: "rs" })),
    ...IP_TRACK.map((page) => ({ ...page, track: "ip" })),
  ].find((page) => page.path === path);
}
