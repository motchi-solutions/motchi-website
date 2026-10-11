import { SiteLink } from "./site-link";
import { getSites } from "@motchi/config/env";
import { contactEmail, organization } from "@motchi/config/sites";
import type { Branch } from "@motchi/brand";
import { BranchMark } from "./branch-mark";
import { HeaderEnhancements } from "./header-enhancements";
import { Arrow, MailIcon } from "./icons";
import { Introduction } from "./intro";
import { MobileMenu, type NavItem } from "./mobile-menu";
import { AnimatedLink, Container } from "./primitives";

export type { NavItem } from "./mobile-menu";
export function Header({
  branch,
  items,
}: {
  branch: Branch;
  items: NavItem[];
}) {
  return (
    <header
      data-header
      data-scrolled="false"
      className="site-header sticky top-0 z-30 border-b border-border bg-background"
    >
      <HeaderEnhancements />
      <Introduction branch={branch} />
      <Container>
        <div className="flex min-h-24 items-center justify-between gap-4">
          <BranchMark branch={branch} />
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-sm">
              {items.map((item) => (
                <li key={item.href}>
                  <SiteLink
                    className={`nav-link inline-flex min-h-12 items-center ${item.href === "/contact" ? "nav-contact gap-4 border border-border px-5 font-semibold" : ""}`}
                    href={item.href}
                  >
                    {item.label}
                    {item.href === "/contact" && <Arrow />}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <MobileMenu items={items} />
        </div>
      </Container>
    </header>
  );
}
export function Footer({ branch }: { branch: Branch }) {
  const family = getSites();
  return (
    <footer className="border-t border-border py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BranchMark branch={branch} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Understand the problem.
              <br />
              Build what fits. Stay available.
            </p>
          </div>
          <nav aria-label="Motchi family">
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted">
              The Motchi family
            </p>
            <ul>
              {Object.entries(family).map(([key, site]) => (
                <li key={key}>
                  <AnimatedLink
                    href={site.url}
                    external
                    className="min-h-11 text-sm"
                  >
                    {site.name}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted">
              A conversation, first
            </p>
            <SiteLink
              className="animated-link inline-flex min-h-12 items-center gap-3 text-sm"
              href={`mailto:${contactEmail}`}
            >
              <MailIcon />
              <span>{contactEmail}</span>
            </SiteLink>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Based in {organization.locationLabel}.
              <br />
              {organization.serviceRegion}.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {organization.displayName}
          </p>
          <div className="flex gap-6">
            <AnimatedLink href="/privacy" className="min-h-11">
              Privacy
            </AnimatedLink>
            <AnimatedLink href="/contact" className="min-h-11">
              Contact
            </AnimatedLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}
