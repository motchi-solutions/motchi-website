import styles from "./landing.module.css";
export function WebsiteResponsibilities() {
  return (
    <div className={styles.agreement}>
      <h4>Agreed before we start</h4>
      <dl>
        {[
          ["Content", "Who supplies and approves text, photos, and logos."],
          ["Scope", "Pages, features, price, and how revisions work."],
          ["Support", "Domain, hosting, maintenance, and response times."],
        ].map(([title, text]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
