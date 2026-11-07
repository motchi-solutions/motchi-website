import styles from "./products-hero.module.css";

export function ProductConceptSketch({
  kind,
}: {
  kind: "intro" | "steps" | "result";
}) {
  return (
    <svg
      viewBox="0 0 240 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={styles.sketch}
    >
      <rect x="10" y="10" width="220" height="130" rx="8" />
      <path d="M10 32h220M23 21h2m7 0h2m7 0h2" />
      {kind === "intro" ? (
        <>
          <circle cx="120" cy="60" r="13" />
          <path d="M120 54v7m0 5v1M68 87h104M83 96h74" />
          <rect x="91" y="109" width="58" height="14" rx="3" />
        </>
      ) : kind === "steps" ? (
        <>
          <path d="M59 73h122M75 104h90M89 114h62" />
          {[59, 120, 181].map((x, index) => (
            <g key={x}>
              <circle
                cx={x}
                cy="73"
                r="12"
                className={index === 1 ? styles.sketchAccent : undefined}
              />
              <text x={x} y="77" textAnchor="middle">
                {index + 1}
              </text>
            </g>
          ))}
        </>
      ) : (
        <>
          <circle cx="120" cy="64" r="16" />
          <path d="m111 64 6 6 12-13M75 96h90M90 105h60" />
          <rect x="91" y="117" width="58" height="10" rx="3" />
        </>
      )}
    </svg>
  );
}
