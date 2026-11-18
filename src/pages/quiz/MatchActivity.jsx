import { useState } from "react";
import { MATCH_PAIRS, shuffleCopy } from "@/data/activities";

function resultClasses(result) {
  return `act-result${result ? ` show ${result.status}` : ""}`;
}

export default function MatchActivity() {
  const [rightItems] = useState(() =>
    shuffleCopy(MATCH_PAIRS.map((pair) => pair.func)),
  );
  const [pairOfLeft, setPairOfLeft] = useState(() =>
    Array(MATCH_PAIRS.length).fill(null),
  );
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [leftMarks, setLeftMarks] = useState(() =>
    Array(MATCH_PAIRS.length).fill(null),
  );
  const [rightMarks, setRightMarks] = useState(() =>
    Array(MATCH_PAIRS.length).fill(null),
  );
  const [result, setResult] = useState(null);

  const clearMarks = () => {
    setLeftMarks(Array(MATCH_PAIRS.length).fill(null));
    setRightMarks(Array(MATCH_PAIRS.length).fill(null));
    setResult(null);
  };

  const leftPartner = (leftIndex) => pairOfLeft[leftIndex];
  const rightPartner = (rightIndex) => pairOfLeft.indexOf(rightIndex);

  const selectLeft = (index) => {
    clearMarks();
    const next = pairOfLeft.slice();
    if (next[index] !== null) next[index] = null;
    setPairOfLeft(next);
    setSelectedLeft((current) => (current === index ? null : index));
  };

  const selectRight = (index) => {
    clearMarks();
    const next = pairOfLeft.slice();

    if (selectedLeft !== null) {
      if (next[selectedLeft] !== null) next[selectedLeft] = null;
      const existingLeft = next.indexOf(index);
      if (existingLeft !== -1) next[existingLeft] = null;
      next[selectedLeft] = index;
      setPairOfLeft(next);
      setSelectedLeft(null);
      return;
    }

    const existingLeft = next.indexOf(index);
    if (existingLeft !== -1) {
      next[existingLeft] = null;
      setPairOfLeft(next);
    }
  };

  const check = () => {
    if (pairOfLeft.includes(null)) {
      setLeftMarks(Array(MATCH_PAIRS.length).fill(null));
      setRightMarks(Array(MATCH_PAIRS.length).fill(null));
      setResult({
        status: "partial",
        text: "Match all six components before checking.",
      });
      return;
    }

    const nextLeftMarks = Array(MATCH_PAIRS.length).fill(null);
    const nextRightMarks = Array(MATCH_PAIRS.length).fill(null);
    let correct = 0;

    pairOfLeft.forEach((rightIndex, leftIndex) => {
      const ok = rightItems[rightIndex] === MATCH_PAIRS[leftIndex].func;
      nextLeftMarks[leftIndex] = ok ? "correct" : "wrong";
      nextRightMarks[rightIndex] = ok ? "correct" : "wrong";
      if (ok) correct += 1;
    });

    setLeftMarks(nextLeftMarks);
    setRightMarks(nextRightMarks);
    setResult(
      correct === MATCH_PAIRS.length
        ? { status: "ok", text: "All six matches are correct." }
        : {
            status: "partial",
            text: `${correct} of ${MATCH_PAIRS.length} matches are correct — adjust the rest and check again.`,
          },
    );
  };

  const reset = () => {
    setPairOfLeft(Array(MATCH_PAIRS.length).fill(null));
    setSelectedLeft(null);
    setLeftMarks(Array(MATCH_PAIRS.length).fill(null));
    setRightMarks(Array(MATCH_PAIRS.length).fill(null));
    setResult(null);
  };

  const leftClass = (index) => {
    const partner = leftPartner(index);
    return [
      "match-item",
      selectedLeft === index ? "selected" : "",
      partner !== null ? "paired" : "",
      leftMarks[index] ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const rightClass = (index) => {
    const partner = rightPartner(index);
    return [
      "match-item",
      partner !== -1 ? "paired" : "",
      rightMarks[index] ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="widget-panel">
      <h3>Activity 2 — Match the component</h3>
      <p className="widget-sub">
        Connect each component to its function: click a component on the left,
        then click its function on the right. Then check your matches.
      </p>
      <div className="match-grid">
        <div className="match-col" id="matchLeft">
          {MATCH_PAIRS.map((pair, index) => (
            <div
              className={leftClass(index)}
              key={pair.component}
              onClick={() => selectLeft(index)}
            >
              <span className="mi-name">{pair.component}</span>
              <span className="mi-badge">
                {leftPartner(index) !== null ? index + 1 : ""}
              </span>
            </div>
          ))}
        </div>
        <div className="match-col" id="matchRight">
          {rightItems.map((text, index) => {
            const partner = rightPartner(index);
            return (
              <div
                className={rightClass(index)}
                key={text}
                onClick={() => selectRight(index)}
              >
                <span className="mi-name">{text}</span>
                <span className="mi-badge">
                  {partner !== -1 ? partner + 1 : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="widget-actions">
        <button
          type="button"
          className="act-btn primary"
          id="matchCheck"
          onClick={check}
        >
          Check matches
        </button>
        <button
          type="button"
          className="act-btn"
          id="matchReset"
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <div className={resultClasses(result)} id="matchResult">
        {result?.text}
      </div>
    </div>
  );
}
