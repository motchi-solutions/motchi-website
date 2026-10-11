import type { Branch } from "@motchi/brand";
import { getSites } from "./env.ts";
import { organization, sites as productionSites } from "./sites.ts";
import type { Metadata } from "next";
export function siteMetadata(branch: Branch): Metadata {
  const family = getSites();
  const site = family[branch];
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    robots:
      site.url === productionSites[branch].url
        ? undefined
        : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: site.name,
      title: site.name,
      description: site.description,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: site.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: ["/opengraph-image"],
    },
    icons: { icon: "/icon.svg" },
  };
}
export function organizationSchema(branch: Branch) {
  const family = getSites();
  const site = family[branch];
  return {
    "@context": "https://schema.org",
    "@type": branch === "solutions" ? "Organization" : "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: organization.contactEmail,
    areaServed: organization.serviceRegion,
    description: site.description,
    ...(branch === "solutions"
      ? {}
      : {
          parentOrganization: {
            "@type": "Organization",
            name: family.solutions.name,
            url: family.solutions.url,
          },
        }),
  };
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
