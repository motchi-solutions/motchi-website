import { LuArrowUp } from "react-icons/lu";
import { SiteLink } from "./site-link";
import { getSites } from "@motchi/config/env";
import { contactEmail, organization } from "@motchi/config/sites";
import type { Branch } from "@motchi/brand";
import { BranchMark } from "./branch-mark";
import { HeaderEnhancements } from "./header-enhancements";
import { Arrow, MailIcon } from "./icons";
import { MobileMenu, type NavItem } from "./mobile-menu";
import { AnimatedLink, ButtonLink, Container } from "./primitives";

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
const footerDescriptions: Record<Branch, string> = {
  solutions:
    "Websites, connected systems, and practical technology advice for your business.",
  websites:
    "Websites that reflect your business and help customers enquire, book, or buy.",
  consulting:
    "Practical advice and hands-on support for your data, AI, and business systems.",
};
export function Footer({ branch }: { branch: Branch }) {
  const family = getSites();
  return (
    <footer className="site-footer border-t border-border py-section">
      <Container>
        <div className="footer-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <BranchMark branch={branch} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {footerDescriptions[branch]}
            </p>
          </div>
          <nav aria-label="Motchi family" className="footer-group min-w-0">
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted">
              The Motchi family
            </p>
            <ul>
              {Object.entries(family).map(([key, site]) => (
                <li key={key}>
                  <AnimatedLink
                    href={key === branch ? "/" : site.url}
                    external={key !== branch}
                    className="min-h-11 text-sm"
                  >
                    {site.name}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-group min-w-0">
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted">
              Let&apos;s Talk!
            </p>
            <ButtonLink href="/contact" secondary className="mb-3">
              Contact Us
            </ButtonLink>
            <SiteLink
              className="animated-link flex min-h-12 items-center gap-3 text-sm"
              href={`mailto:${contactEmail}`}
            >
              <MailIcon />
              <span className="min-w-0 wrap-break-word">{contactEmail}</span>
            </SiteLink>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Based in {organization.location}.
              <br />
              {organization.serviceRegion}.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {organization.displayName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <AnimatedLink href="/privacy" className="min-h-11">
              Privacy
            </AnimatedLink>
            <AnimatedLink href="/contact" className="min-h-11">
              Contact
            </AnimatedLink>
            <a
              href="#page-top"
              className="inline-flex min-h-11 items-center gap-2 text-primary underline-offset-4 hover:underline focus-visible:underline"
            >
              Back to top
              <LuArrowUp
                className="interaction-arrow h-4 w-4 shrink-0"
                data-direction="up"
                aria-hidden="true"
                focusable="false"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
