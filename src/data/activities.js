export const PROCESS_ORDER = [
  "Energy source",
  "Atmosphere",
  "Target interaction",
  "Sensor",
  "Data processing",
  "Interpretation",
];

export const MATCH_PAIRS = [
  { component: "Sun", func: "Provides energy" },
  { component: "Atmosphere", func: "Scatters or absorbs radiation" },
  {
    component: "Target",
    func: "Reflects, absorbs, transmits, or emits energy",
  },
  { component: "Sensor", func: "Measures energy" },
  { component: "Processing", func: "Converts measurements into usable data" },
  { component: "Analyst", func: "Interprets the information" },
];

export function shuffleCopy(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
