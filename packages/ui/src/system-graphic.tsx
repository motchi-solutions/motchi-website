import { getSites } from "@motchi/config/env";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";
import { SiteLink } from "./site-link";
import { SystemCapabilities } from "./system-capabilities";

export function SystemGraphic() {
  const sites = getSites();
  return (
    <Reveal className="system-reveal">
      <div className="motchi-playground">
        <h2 className="playground-caption">
          Where could technology make your day easier?
        </h2>
        <SystemCapabilities />
        <ul className="system-branches">
          {[
            { name: "Websites", href: sites.websites.url },
            { name: "Consulting", href: sites.consulting.url },
            { name: "Products", href: "/products" },
          ].map(({ name, href }) => (
            <li key={name}>
              <SiteLink href={href} className="system-branch">
                <span>{name}</span>
                <Arrow external={href !== "/products"} />
              </SiteLink>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">Products are in progress.</p>
      </div>
    </Reveal>
  );
}
