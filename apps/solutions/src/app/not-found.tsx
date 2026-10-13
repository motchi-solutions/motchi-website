import { ButtonLink, Container, Eyebrow } from "@motchi/ui";
export default function NotFound() {
  return (
    <Container className="py-section">
      <Eyebrow>404</Eyebrow>
      <h1 className="text-h2">This Page Couldn't Be Found.</h1>
      <p className="my-6 text-muted">
        Explore Motchi or contact us if you need a hand.
      </p>
      <ButtonLink href="/">Back to Home</ButtonLink>
    </Container>
  );
}
