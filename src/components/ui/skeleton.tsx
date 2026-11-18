import styles from "./skeleton.module.css";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`${styles.skeleton} ${className}`} />
  );
}
