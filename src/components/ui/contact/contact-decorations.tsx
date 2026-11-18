import styles from "./contact.module.css";
export function ContactDecorations() {
  return (
    <div className={styles.decorations} aria-hidden="true">
      <svg
        viewBox="0 0 240 200"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={styles.flowAccent}
      >
        <path
          d="M54 176V88a66 66 0 0 1 132 0v88Z"
          fill="#D4AF7C"
          fillOpacity=".3"
        />
        <path
          d="M188 18V46C188 81 62 67 62 110S188 144 188 169C188 186 144 186 106 186H24"
          transform="translate(6 4)"
          stroke="#D4AF7C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M188 18V46C188 81 62 67 62 110S188 144 188 169C188 186 144 186 106 186H24"
          stroke="#5B0202"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M62 110C62 83 126 97 126 68C126 51 160 46 188 46"
          stroke="#D4AF7C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <svg
        viewBox="0 0 220 180"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={styles.clarityAccent}
      >
        <rect
          x="100"
          y="40"
          width="104"
          height="104"
          rx="26"
          fill="#D4AF7C"
          fillOpacity=".22"
        />
        <path
          d="M82 148V54a30 30 0 0 1 30-30h90"
          stroke="#D4AF7C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M18 28C100 28 80 72 134 72H202M18 136C76 136 94 128 134 128H202"
          stroke="#D4AF7C"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M18 80C78 80 88 100 134 100H202"
          stroke="#5B0202"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
