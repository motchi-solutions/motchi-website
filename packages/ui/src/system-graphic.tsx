import { getSites } from "@motchi/config/env";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";
import { SiteLink } from "./site-link";
import { SystemCapabilities } from "./system-capabilities";

export function SystemGraphic() {
  const sites = getSites();
  return (
    <Reveal className="system-reveal">
      <div className="motchi-system bg-secondary text-inverse">
        <svg
          className="system-contour"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 500V100H600M0 400H600M100 600V0M500 600V0M0 600Q300 0 600 600"
            stroke="currentColor"
          />
        </svg>
        <p className="relative text-xs tracking-wide text-accent">
          ONE CONNECTED APPROACH
        </p>
        <ol className="system-journey">
          <li className="system-stage">
            <span className="system-marker" aria-hidden="true">
              01
            </span>
            <p className="text-lg font-semibold">Your business need.</p>
            <p className="mt-1 text-sm text-inverse/70">
              Understand the work before choosing the tools.
            </p>
          </li>
          <li className="system-stage">
            <span className="system-marker" aria-hidden="true">
              02
            </span>
            <p className="text-sm font-semibold">Choose what helps.</p>
            <SystemCapabilities />
          </li>
          <li className="system-stage">
            <span className="system-marker" aria-hidden="true">
              03
            </span>
            <p className="text-sm font-semibold">Put it to work.</p>
            <p className="mt-1 text-sm text-inverse/70">
              Build, connect, and help your team adopt it.
            </p>
            <ul className="system-branches">
              {[
                { name: "Websites", href: sites.websites.url },
                { name: "Consulting", href: sites.consulting.url },
                { name: "Products", href: "#products" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <SiteLink href={href} className="system-branch">
                    {name}
                    <Arrow external={href !== "#products"} />
                  </SiteLink>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-inverse/60">
              Products are in progress.
            </p>
          </li>
          <li className="system-stage">
            <span className="system-marker" aria-hidden="true">
              04
            </span>
            <p className="text-sm font-semibold">Stay involved.</p>
            <p className="mt-1 text-sm text-inverse/70">
              Support what we deliver. Improve as needs change.
            </p>
          </li>
        </ol>
      </div>
    </Reveal>
  );
}
