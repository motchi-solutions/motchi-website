import { type Branch, logos, palette } from "../brand.ts";
import { getSites, indexingAllowed } from "./env.ts";
import { organization, websiteBusiness, websiteStarter } from "./sites.ts";
import type { Metadata, Viewport } from "next";
export function siteMetadata(branch: Branch): Metadata {
  const family = getSites();
  const site = family[branch];
  return {
    metadataBase: new URL(site.url),
    applicationName: site.name,
    appleWebApp: { title: branch === "solutions" ? "Motchi" : site.shortName },
    creator: organization.displayName,
    publisher: organization.displayName,
    title: { default: site.name, template: `%s - ${site.name}` },
    description: site.description,
    robots: indexingAllowed() ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      title: site.name,
      description: site.description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
    },
  };
}
export const siteViewport: Viewport = { themeColor: palette.burgundy };

// Where Motchi is based and who it serves, for search results and maps.
const place = {
  address: {
    "@type": "PostalAddress",
    addressLocality: organization.location,
    addressRegion: "ON",
    addressCountry: organization.countryCode,
  },
  areaServed: [{ "@type": "City", name: organization.location }, "Worldwide"],
};

/* Structured data (JSON-LD) follows schema.org and Google Search Central's
   guidance: describe only what the page shows, with stable @id references. */
export function organizationSchema(branch: Branch) {
  const family = getSites();
  const site = family[branch];
  return {
    "@context": "https://schema.org",
    "@type": branch === "solutions" ? "Organization" : "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    ...(logos[branch]
      ? { logo: new URL(logos[branch].src, site.url).href }
      : {}),
    email: organization.contactEmail,
    ...place,
    description: site.description,
    ...(branch === "solutions"
      ? {}
      : {
          parentOrganization: {
            "@id": `${family.solutions.url}/#organization`,
          },
        }),
  };
}

/** The site itself, published by the company. */
export function websiteSchema() {
  const { solutions } = getSites();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${solutions.url}/#website`,
    name: solutions.name,
    url: solutions.url,
    inLanguage: "en-CA",
    publisher: { "@id": `${solutions.url}/#organization` },
  };
}

const priceOf = (price: string) => price.replace(/[^0-9.]/g, "");

/** The services a branch offers. Prices appear only where the site shows them. */
export function serviceCatalog(
  branch: "websites" | "consulting",
  services: readonly { name: string; description: string }[],
) {
  const site = getSites()[branch];
  const prices: Record<string, string> =
    branch === "websites"
      ? {
          Starter: priceOf(websiteStarter.price),
          Business: priceOf(websiteBusiness.price),
        }
      : {};
  return {
    "@type": "OfferCatalog",
    name: `${site.name} services`,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      ...(prices[service.name]
        ? { price: prices[service.name], priceCurrency: "CAD" }
        : {}),
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: place.areaServed,
      },
    })),
  };
}

/** A breadcrumb trail, from the home page to the current page. */
export function breadcrumbSchema(
  trail: readonly { name: string; path: string }[],
) {
  const { solutions } = getSites();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, solutions.url).href,
    })),
  };
}

// Each section has its own social preview image; other pages use the main one.
function socialImage(path: string) {
  for (const branch of ["websites", "consulting"])
    if (path === `/${branch}` || path.startsWith(`/${branch}/`))
      return `/${branch}/opengraph-image`;
  return "/opengraph-image";
}

/** Page metadata: title, description, canonical URL and social previews. Pass
    `absolute` to skip the "| Motchi ..." title suffix. */
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  { absolute = false }: { absolute?: boolean } = {},
): Metadata {
  const image = {
    url: socialImage(path),
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [image] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
