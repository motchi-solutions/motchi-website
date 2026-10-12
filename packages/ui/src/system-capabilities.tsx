"use client";

import { useEffect, useId, useState } from "react";
import {
  LuWorkflow,
  LuDatabase,
  LuCloud,
  LuBrainCircuit,
  LuPanelsTopLeft,
} from "react-icons/lu";

const capabilities = [
  {
    name: "Websites",
    detail: "Built around how your business actually works.",
    icon: LuPanelsTopLeft,
  },
  {
    name: "AI",
    detail: "Practical assistance for tasks that benefit from it.",
    icon: LuBrainCircuit,
  },
  {
    name: "Data",
    detail: "Information your team can understand and use.",
    icon: LuDatabase,
  },
  {
    name: "Cloud",
    detail: "Reliable systems without unnecessary complexity.",
    icon: LuCloud,
  },
  {
    name: "Automation",
    detail: "Less repetitive work. More time for what matters.",
    icon: LuWorkflow,
  },
] as const;

export function SystemCapabilities() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return (
    <div className="system-capabilities" data-enhanced={enhanced}>
      <ul className="system-nodes" aria-label="Technology options">
        {capabilities.map(({ name, detail, icon: Icon }, index) => (
          <li
            key={name}
            className="system-node"
            data-selected={selected === index}
          >
            {enhanced ? (
              <button
                type="button"
                id={`${id}-${index}`}
                aria-pressed={selected === index}
                aria-controls={`${id}-detail`}
                onFocus={() => setSelected(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelected(index);
                }}
                onClick={() => setSelected(index)}
                className="system-node-control"
              >
                <Icon aria-hidden="true" />
                <span>{name}</span>
              </button>
            ) : (
              <div className="system-node-control">
                <Icon aria-hidden="true" />
                <span>{name}</span>
              </div>
            )}
            {!enhanced && <p className="system-fallback-detail">{detail}</p>}
          </li>
        ))}
      </ul>
      {enhanced && (
        <section
          id={`${id}-detail`}
          aria-labelledby={`${id}-${selected}`}
          className="system-capability-detail"
        >
          <p>{capabilities[selected].detail}</p>
        </section>
      )}
    </div>
  );
}
