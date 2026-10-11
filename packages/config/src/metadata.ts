import { type Branch, family } from "@motchi/brand";
import type { Metadata } from "next";
export function siteMetadata(branch: Branch): Metadata {
  const site = family[branch];
  return {
    metadataBase: new URL(site.domain),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
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
  const site = family[branch];
  return {
    "@context": "https://schema.org",
    "@type": branch === "solutions" ? "Organization" : "ProfessionalService",
    "@id": `${site.domain}/#organization`,
    name: site.name,
    url: site.domain,
    email: "contact@motchi.ca",
    description: site.description,
    ...(branch === "solutions"
      ? {}
      : {
          parentOrganization: {
            "@type": "Organization",
            name: family.solutions.name,
            url: family.solutions.domain,
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
