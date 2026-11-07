import styles from "./landing.module.css";
export function WebsiteResponsibilities() {
  return (
    <div className={styles.agreement}>
      <h4>Agreed Before Work Starts</h4>
      <dl>
        {[
          [
            "Content & Ownership",
            "Who supplies and approves copy, photographs, logos, and project information.",
          ],
          [
            "Scope & Review",
            "Pages, customer flows, pricing, revisions, and how feedback and changes are agreed.",
          ],
          [
            "Launch & Support",
            "Who manages the domain, hosting, and connected tools, plus maintenance coverage, costs, and response times.",
          ],
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
