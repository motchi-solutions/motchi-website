"use client";

import { useEffect, useId, useState } from "react";
import { services } from "../../content/websites/services.ts";
import { Container, SectionHeading } from "../ui/primitives.tsx";
import styles from "./services.module.css";

/* One website, read as a cross-section. Each layer opens on demand, and the
   diagram lifts the matching plane so the relationship stays visible. */
const layers = [
  {
    id: "design-development",
    label: "What customers see",
    items: [
      "Design shaped around your brand",
      "Responsive on every screen",
      "Clear pages and navigation",
      "Content in your voice",
    ],
  },
  {
    id: "full-stack-websites",
    label: "What runs behind it",
    core: true,
    items: [
      "Content & menu management",
      "APIs & integrations",
      "AI features & assistants",
      "Databases & analytics",
      "Admin & management tools",
    ],
  },
  {
    id: "booking-integrations",
    label: "What it connects to",
    items: [
      "Booking & reservation tools",
      "Enquiries & payments",
      "The tools you already use",
      "Custom integrations",
    ],
  },
  {
    id: "continued-support",
    label: "What keeps it working",
    items: [
      "Content changes",
      "Updates & technical upkeep",
      "Accessibility & speed checks",
      "Support as you grow",
    ],
  },
].map((layer) => {
  const service = services.find((item) => item.id === layer.id);
  if (!service) throw new Error(`Missing website service: ${layer.id}`);
  return { ...layer, title: service.title };
});

const number = (index: number) => String(index + 1).padStart(2, "0");

function LayerStack({
  active,
  preview,
  onSelect,
}: {
  active: number | null;
  preview: number | null;
  onSelect: (index: number) => void;
}) {
  const centres = [86, 168, 250, 332];
  const plane = (y: number) => `40,${y} 200,${y - 74} 360,${y} 200,${y + 74}`;
  return (
    <svg
      className={styles.stack}
      viewBox="0 0 420 420"
      aria-hidden="true"
      focusable="false"
    >
      {centres.slice(0, -1).map((y) => (
        <g key={`link-${y}`} className={styles.stackLink}>
          <line x1="40" y1={y} x2="40" y2={y + 82} />
          <line x1="360" y1={y} x2="360" y2={y + 82} />
          <line x1="200" y1={y + 74} x2="200" y2={y + 156} />
        </g>
      ))}
      {[...centres].reverse().map((y) => {
        const index = centres.indexOf(y);
        return (
          // biome-ignore lint/a11y/noStaticElementInteractions: Pointer shortcut duplicating the labelled accordion buttons.
          <g
            key={y}
            className={styles.layerPlane}
            data-layer={index + 1}
            data-active={active === index}
            data-preview={preview === index && active !== index}
            onClick={() => onSelect(index)}
          >
            <polygon className={styles.plane} points={plane(y)} />
            {index === 0 && (
              <g className={styles.planeDetail}>
                <polyline points="96,86 200,34 304,86" />
                <polyline points="128,94 200,58 272,94" />
              </g>
            )}
            {index === 1 && (
              <g className={styles.planeDetail}>
                <line x1="120" y1="168" x2="200" y2="128" />
                <line x1="200" y1="208" x2="280" y2="168" />
              </g>
            )}
            <text className={styles.planeNumber} x="378" y={y + 5}>
              {number(index)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Services() {
  const id = useId();
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  useEffect(() => setEnhanced(true), []);
  const toggle = (index: number) =>
    setOpen((current) => (current === index ? null : index));

  return (
    <section id="services" className={styles.services}>
      <Container>
        <SectionHeading wide title="What We Build">
          A website should look like your business and work for it, too. We
          bring the design, content, and systems together.
        </SectionHeading>
        <div className={styles.composition}>
          <div className={styles.visual}>
            <LayerStack
              active={enhanced ? open : null}
              preview={preview}
              onSelect={(index) => setOpen(index)}
            />
            <p className={styles.visualCaption}>
              Every part of your website, working together.
            </p>
          </div>
          <noscript>
            <style>
              {"[data-layer-panel]{grid-template-rows:1fr!important}"}
            </style>
          </noscript>
          <ol className={styles.layers}>
            {layers.map((layer, index) => {
              // Collapsed from the first paint, so hydration never shifts the
              // page. Without JavaScript, the noscript style opens every layer.
              const expanded = open === index;
              const hidden = enhanced && !expanded;
              return (
                <li
                  key={layer.id}
                  id={layer.id}
                  className={styles.layer}
                  data-open={expanded}
                  onPointerEnter={() => setPreview(index)}
                  onPointerLeave={() => setPreview(null)}
                >
                  <h3 className={styles.layerHeading}>
                    <button
                      type="button"
                      className={styles.layerButton}
                      aria-expanded={expanded}
                      aria-controls={`${id}-${index}`}
                      disabled={!enhanced}
                      onClick={() => toggle(index)}
                    >
                      <span className={styles.layerLabel}>
                        <span aria-hidden="true">{number(index)}</span>
                        {layer.label}
                      </span>
                      <span className={styles.layerTitle}>
                        <span className={styles.layerName}>{layer.title}</span>
                      </span>
                      {layer.core && (
                        <span className={styles.coreTag}>Core service</span>
                      )}
                      <svg
                        className={styles.chevron}
                        viewBox="0 0 20 20"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        <path d="m5 7.5 5 5 5-5" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`${id}-${index}`}
                    className={styles.panel}
                    data-layer-panel=""
                    aria-hidden={hidden}
                    inert={hidden}
                  >
                    <div className={styles.panelClip}>
                      <ul className={styles.items}>
                        {layer.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
