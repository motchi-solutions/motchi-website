import type { Branch } from "../../lib/brand.ts";
import { Container } from "./primitives.tsx";
import { Skeleton } from "./skeleton.tsx";
import styles from "./route-loading.module.css";

function CopySkeleton() {
  return (
    <div className={styles.copy}>
      <Skeleton className={styles.title} />
      <Skeleton className={`${styles.title} ${styles.short}`} />
      <div className={styles.lines}>
        <Skeleton className={styles.line} />
        <Skeleton className={styles.line} />
        <Skeleton className={`${styles.line} ${styles.short}`} />
      </div>
      <div className={styles.actions}>
        <Skeleton className={styles.action} />
        <Skeleton className={styles.action} />
      </div>
    </div>
  );
}

export function RouteLoading({ branch = "solutions" }: { branch?: Branch }) {
  return (
    <section
      className={styles.loading}
      data-loading-branch={branch}
      data-branch={branch}
      aria-busy="true"
      aria-label="Page content"
    >
      <span role="status" className="sr-only">
        Loading page content...
      </span>
      <div className={styles.hero} aria-hidden="true">
        <Container>
          {branch === "solutions" ? (
            <>
              <div className={styles.companyTitle}>
                <Skeleton className={styles.title} />
                <Skeleton className={styles.line} />
              </div>
              <div className={styles.grid}>
                <Skeleton className={styles.visual} />
                <CopySkeleton />
              </div>
            </>
          ) : (
            <div className={styles.grid}>
              <CopySkeleton />
              {branch === "websites" ? (
                <div className={styles.collage}>
                  <Skeleton className={styles.desktop} />
                  <Skeleton className={styles.phone} />
                  <Skeleton className={styles.project} />
                </div>
              ) : (
                <div className={styles.aside}>
                  <Skeleton className={styles.line} />
                  <Skeleton className={styles.title} />
                  <Skeleton className={styles.title} />
                  <Skeleton className={`${styles.line} ${styles.short}`} />
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
      <div className={styles.following} aria-hidden="true">
        <Container>
          <Skeleton className={styles.sectionTitle} />
          <Skeleton className={styles.line} />
        </Container>
      </div>
    </section>
  );
}
