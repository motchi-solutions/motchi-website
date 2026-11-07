import { Container, SectionHeading } from "../ui/index.ts";
import { ContentDisclosure } from "../ui/content-disclosure.tsx";
import { engagement } from "../../content/consulting/process.ts";
import styles from "./landing.module.css";

const stages = [
  { title: "Problem", steps: engagement.slice(0, 1) },
  { title: "Decision", steps: engagement.slice(1, 3) },
  { title: "Implementation", steps: engagement.slice(3, 4) },
  { title: "Adoption", steps: engagement.slice(4, 5) },
  { title: "Support", steps: engagement.slice(5) },
];
export function Approach() {
  return (
    <section id="approach" className={styles.approach}>
      <Container>
        <SectionHeading wide title="How We Work on Consulting Projects">
          We work alongside your team through implementation, adoption, and
          continued support. Every engagement has an agreed scope and clear
          responsibilities.
        </SectionHeading>
        <ol id="consulting-process" className={styles.journey}>
          {stages.map((stage, index) => (
            <li key={stage.title}>
              <span className={styles.stageNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.steps.map((step) => step.summary).join(" ")}</p>
            </li>
          ))}
        </ol>
        <ContentDisclosure title="How each stage works">
          <dl className={styles.stageDetails}>
            {engagement.map((step) => (
              <div key={step.id}>
                <dt>{step.detailHeading}</dt>
                <dd>{step.details.join(" ")}</dd>
              </div>
            ))}
          </dl>
        </ContentDisclosure>
      </Container>
    </section>
  );
}
