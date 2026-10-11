import { type Branch, contactEmail, family, logos } from "@motchi/brand";
import Image from "next/image";
import { Introduction } from "./intro";
import { Container } from "./primitives";
export type NavItem = { label: string; href: string };
function Brand({ branch }: { branch: Branch }) {
  const logo = logos[branch];
  return (
    <a
      href="/"
      className="inline-flex min-h-12 items-center gap-3"
      aria-label={`${family[branch].name} home`}
    >
      {logo && <Image src={logo} width={42} height={42} alt="" priority />}
      <span className="brand-arrive flex flex-col">
        <span className="text-xl font-semibold tracking-tight">
          Motchi<span className="text-primary">.</span>
        </span>
        <span className="text-xs tracking-widest uppercase">{branch}</span>
      </span>
    </a>
  );
}
export function Header({
  branch,
  items,
}: {
  branch: Branch;
  items: NavItem[];
}) {
  return (
    <header className="relative z-20 border-b border-border bg-background">
      <Introduction />
      <Container>
        <div className="flex min-h-24 items-center justify-between gap-4">
          <Brand branch={branch} />
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-sm">
              {items.map((item) => (
                <li key={item.href}>
                  <a
                    className={`inline-flex min-h-12 items-center hover:text-primary ${item.href === "/contact" ? "border border-border px-5 font-semibold" : ""}`}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <details className="group relative lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 border border-border px-4 text-sm">
              Menu{" "}
              <span aria-hidden="true" className="group-open:rotate-45">
                +
              </span>
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-full mt-3 w-64 max-w-[calc(100vw-2.5rem)] border border-border bg-surface p-3 shadow-lg"
            >
              <ul>
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      className="flex min-h-12 items-center px-3 text-sm hover:bg-background"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
export function Footer({ branch }: { branch: Branch }) {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Brand branch={branch} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Practical technology.
              <br />A partner for what comes next.
            </p>
          </div>
          <nav aria-label="Motchi family">
            <p className="mb-4 text-xs font-bold tracking-widest uppercase">
              The Motchi family
            </p>
            <ul className="space-y-1">
              {Object.entries(family).map(([key, site]) => (
                <li key={key}>
                  <a
                    href={site.domain}
                    className="inline-flex min-h-10 items-center text-sm hover:underline"
                  >
                    {site.name}
                    <span className="sr-only"> website</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-4 text-xs font-bold tracking-widest uppercase">
              Let’s talk
            </p>
            <a
              className="inline-flex min-h-10 items-center text-sm underline underline-offset-4"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Proudly Canadian.
              <br />
              Working with businesses globally.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} Motchi Solutions</p>
          <div className="flex gap-6">
            <a href="/privacy" className="underline underline-offset-4">
              Privacy
            </a>
            <a href="/contact" className="underline underline-offset-4">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
