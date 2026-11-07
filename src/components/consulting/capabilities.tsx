import { Container, SectionHeading } from "../ui/index.ts";
import { capabilities } from "../../content/consulting/capabilities.ts";
import styles from "./landing.module.css";

const groups = [
  { title: "AI and data", ids: ["ai", "data-analytics"] },
  {
    title: "Platforms and connected systems",
    ids: ["databricks", "website-digital"],
  },
  {
    title: "Technology decisions and implementation",
    ids: ["technology-strategy", "implementation-adoption"],
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className={styles.capabilities}>
      <Container>
        <SectionHeading wide title="AI, Data, and Technology Services">
          Sometimes the answer is a new system. Sometimes it's a better use of
          what you already have. The business problem leads the conversation.
        </SectionHeading>
        <div className={styles.groups}>
          {groups.map((group) => (
            <div className={styles.capabilityGroup} key={group.title}>
              <h3>{group.title}</h3>
              <div className={styles.capabilityPair}>
                {group.ids.map((id) => {
                  const capability = capabilities.find(
                    (item) => item.id === id,
                  );
                  if (!capability) return null;
                  return (
                    <article
                      id={capability.id}
                      className={styles.capability}
                      key={capability.id}
                    >
                      <h4>{capability.title}</h4>
                      <p className={styles.problem}>{capability.problem}</p>
                      <p className={styles.description}>
                        {capability.description}
                      </p>
                      <ul className={styles.areas}>
                        {capability.areas.map((area) => (
                          <li key={area}>{area}</li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
