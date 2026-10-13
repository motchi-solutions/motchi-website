import { type Branch, logos, palette } from "@motchi/brand";
import { getSites } from "./env.ts";
import { organization, sites as productionSites } from "./sites.ts";
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
