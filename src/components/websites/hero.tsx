import { Fragment } from "react";
import { DrawnMonogram } from "./drawn-monogram.tsx";
import { ButtonLink, Container, HeroBrand } from "../ui/index.ts";
import styles from "./hero.module.css";

const captionWords = ["From", "sketch", "to", "finished", "website."].map(
  (word, position) => ({
    word,
    stage: position < 2 ? "sketch" : "finish",
    letters: Array.from(word, (character, offset) => ({
      character,
      id: `${word}-${offset}`,
    })),
  }),
);

export function Hero() {
  return (
    <section id="overview" className={styles.hero}>
      <Container>
        <div className={styles.composition}>
          <div className={styles.introduction}>
            <HeroBrand branch="websites" className={styles.identity} />
            <h1>Websites Built Around Your Business.</h1>
            <p className={styles.copy}>
              We design and build around your customers and budget, with
              maintenance options for support after launch.
            </p>
            <div className={styles.actions}>
              <ButtonLink href="#work">Explore Our Work</ButtonLink>
              <ButtonLink href="#enquiry" secondary>
                Start a Project
              </ButtonLink>
            </div>
          </div>
          <div
            className={styles.artwork}
            data-monogram-artwork
            aria-hidden="true"
          >
            <div className={styles.artHeading}>
              <span>Designed with purpose.</span>
              <span>Built to work.</span>
            </div>
            <div className={styles.drawing}>
              <div className={styles.layoutLines} />
              <DrawnMonogram />
            </div>
            <div className={styles.artFoot}>
              <p className={styles.sketchCaption}>
                {captionWords.map((part, position) => (
                  <Fragment key={part.word}>
                    {position > 0 && " "}
                    <span className={styles.captionWord}>
                      {part.letters.map((letter) => (
                        <span
                          key={letter.id}
                          className={styles.captionGlyph}
                          data-caption-stage={part.stage}
                        >
                          {letter.character}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </p>
              <div className={styles.artLabels}>
                <span>Design</span>
                <span>Development</span>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
