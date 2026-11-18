import { useState } from "react";
import { PROCESS_ORDER, shuffleCopy } from "@/data/activities";

function resultClasses(result) {
  return `act-result${result ? ` show ${result.status}` : ""}`;
}

export default function OrderActivity() {
  const [items, setItems] = useState(() => shuffleCopy(PROCESS_ORDER));
  const [marks, setMarks] = useState(() =>
    Array(PROCESS_ORDER.length).fill(null),
  );
  const [result, setResult] = useState(null);

  const clearResult = () => {
    setMarks(Array(PROCESS_ORDER.length).fill(null));
    setResult(null);
  };

  const move = (index, direction) => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    clearResult();
  };

  const check = () => {
    let correct = 0;
    const nextMarks = items.map((item, index) => {
      const ok = item === PROCESS_ORDER[index];
      if (ok) correct += 1;
      return ok;
    });
    setMarks(nextMarks);

    if (correct === PROCESS_ORDER.length) {
      setResult({
        status: "ok",
        text: "Correct — the process runs: Energy source → Atmosphere → Target interaction → Sensor → Data processing → Interpretation.",
      });
    } else {
      setResult({
        status: "partial",
        text: `${correct} of ${PROCESS_ORDER.length} steps are in the right position — keep adjusting.`,
      });
    }
  };

  const shuffle = () => {
    let next;
    do {
      next = shuffleCopy(PROCESS_ORDER);
    } while (next.join("|") === PROCESS_ORDER.join("|"));
    setItems(next);
    clearResult();
  };

  return (
    <div className="widget-panel">
      <h3>Activity 1 — Arrange the Remote Sensing process</h3>
      <p className="widget-sub">
        The six stages below are out of order. Move them until the sequence is
        correct, then check your answer.
      </p>
      <ul className="order-list" id="orderList">
        {items.map((name, index) => {
          const mark = marks[index];
          const className = `order-item${mark === true ? " pos-ok" : ""}${mark === false ? " pos-bad" : ""}`;
          return (
            <li className={className} key={name}>
              <span className="oi-name">{name}</span>
              <span className="oi-btns">
                <button
                  type="button"
                  className="oi-btn"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, "up")}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="oi-btn"
                  aria-label="Move down"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, "down")}
                >
                  ▼
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="widget-actions">
        <button
          type="button"
          className="act-btn primary"
          id="orderCheck"
          onClick={check}
        >
          Check order
        </button>
        <button
          type="button"
          className="act-btn"
          id="orderShuffle"
          onClick={shuffle}
        >
          Shuffle
        </button>
      </div>
      <div className={resultClasses(result)} id="orderResult">
        {result?.text}
      </div>
    </div>
  );
}
