import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  breadcrumbSchema,
  organizationSchema,
  pageMetadata,
  serviceCatalog,
  siteMetadata,
  websiteSchema,
} from "../src/lib/config/metadata.ts";
import { sites } from "../src/lib/config/sites.ts";
import { securityHeaders } from "../src/lib/config/security.ts";
import { localDevOrigins } from "../src/lib/config/dev-origins.ts";
import sitemap from "../src/app/sitemap.ts";
import robots, { linkPreviewAgents } from "../src/app/robots.ts";
import { publicRoutes } from "../src/lib/config/navigation.ts";
import { contactMessage } from "../src/lib/email/feedback.ts";
import { contactOptionLabel } from "../src/components/ui/contact/contact-config.ts";

test("page metadata carries the section's social image and optional absolute title", () => {
  const work = pageMetadata("Our portfolio", "Work.", "/websites/work");
  assert.equal(work.openGraph.images[0].url, "/websites/opengraph-image");
  assert.equal(work.openGraph.images[0].width, 1200);
  assert.deepEqual(work.twitter.images, ["/websites/opengraph-image"]);
  assert.equal(
    pageMetadata("About", "About.", "/about").openGraph.images[0].url,
    "/opengraph-image",
  );
  assert.deepEqual(
    pageMetadata("Home - Motchi", "x", "/", { absolute: true }).title,
    {
      absolute: "Home - Motchi",
    },
  );
});

test("page metadata sets the title, description and canonical path everywhere", () => {
  const meta = pageMetadata("Consulting", "Advice and support.", "/consulting");
  assert.equal(meta.title, "Consulting");
  assert.equal(meta.alternates.canonical, "/consulting");
  assert.equal(meta.openGraph.url, "/consulting");
  assert.equal(meta.openGraph.description, "Advice and support.");
  assert.equal(meta.twitter.card, "summary_large_image");
});

test("site metadata names each branch and indexes only the production origin", () => {
  for (const branch of ["solutions", "websites", "consulting"]) {
    const meta = siteMetadata(branch);
    assert.equal(meta.title.template, `%s - ${sites[branch].name}`);
    assert.equal(meta.openGraph.locale, "en_CA");
    // Tests run off the production origin, so pages must not be indexed.
    assert.deepEqual(meta.robots, { index: false, follow: false });
  }
});

test("structured data describes the family and its service branches", () => {
  const family = organizationSchema("solutions");
  assert.equal(family["@type"], "Organization");
  assert.equal(family.parentOrganization, undefined);
  for (const branch of ["websites", "consulting"]) {
    const schema = organizationSchema(branch);
    assert.equal(schema["@type"], "ProfessionalService");
    assert.equal(schema.parentOrganization["@id"], family["@id"]);
    assert.match(schema["@id"], /\/#organization$/);
    assert.ok(schema.email.includes("@"));
  }
});

test("the sitemap lists every public route on one origin", () => {
  const urls = sitemap().map((entry) => new URL(entry.url));
  assert.deepEqual(
    urls.map((url) => url.pathname),
    publicRoutes,
  );
  assert.equal(new Set(urls.map((url) => url.origin)).size, 1);
});

test("robots blocks search crawling unless indexing is allowed on the production origin", (t) => {
  const restore = { ...process.env };
  t.after(() => {
    process.env = restore;
  });
  // Search engines stay out; link previews in messages and social posts
  // still work.
  const blocked = [
    { userAgent: linkPreviewAgents, allow: "/", disallow: "/api/" },
    { userAgent: "*", disallow: "/" },
  ];
  assert.deepEqual(robots().rules, blocked);
  for (const agent of ["Twitterbot", "facebookexternalhit", "LinkedInBot"])
    assert.ok(linkPreviewAgents.includes(agent), agent);
  process.env.VERCEL_ENV = "production";
  process.env.SITE_URL = "https://staging.motchi.example";
  assert.deepEqual(robots().rules, blocked);
  // Vercel Production on the production origin allows crawling, except the API.
  process.env.SITE_URL = "https://www.motchi.ca";
  assert.deepEqual(robots().rules, {
    userAgent: "*",
    allow: "/",
    disallow: "/api/",
  });
  assert.equal(siteMetadata("solutions").robots, undefined);
  assert.match(robots().sitemap, /^https:\/\/www\.motchi\.ca\/sitemap\.xml$/);
});

test("security headers deny framing, sniffing and unexpected origins", () => {
  const headers = Object.fromEntries(
    securityHeaders.map(({ key, value }) => [key, value]),
  );
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["Cross-Origin-Opener-Policy"], "same-origin");
  const policy = headers["Content-Security-Policy"];
  for (const directive of [
    "default-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    // Cloudflare Turnstile, and nothing else, may frame or script in.
    "frame-src https://challenges.cloudflare.com",
  ])
    assert.ok(policy.includes(directive), directive);
  assert.match(
    policy,
    /script-src 'self' 'unsafe-inline' https:\/\/challenges\.cloudflare\.com/,
  );
  assert.match(headers["Permissions-Policy"], /camera=\(\)/);
});

test("development origins are only allowed in development", () => {
  assert.deepEqual(localDevOrigins(), []);
});

test("contact status messages exist only for known statuses", () => {
  assert.match(contactMessage("sent"), /2-3 business days/);
  assert.equal(contactMessage("unknown"), undefined);
  assert.equal(contactMessage(undefined), undefined);
  assert.equal(contactMessage("toString"), undefined);
});

test("saved contact answers show their current wording", () => {
  assert.equal(contactOptionLabel("Not Sure Yet"), "I'm not sure");
  assert.equal(contactOptionLabel("Online Search"), "Online search");
  assert.equal(contactOptionLabel("Databricks"), "Databricks");
});

// AGENTS.md: authored copy uses ASCII quotes, hyphens and periods. Symbols
// such as the copyright sign and the progress checkmark are not punctuation.
test("source copy uses ASCII punctuation", () => {
  const allowed = new Set(
    [0xa9, 0x2713].map((code) => String.fromCodePoint(code)),
  );
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(tsx?|mjs)$/.test(name)) files.push(path);
    }
  };
  walk("src");
  const found = files.flatMap((file) =>
    [...readFileSync(file, "utf8")]
      .filter((character) => character > "\u007f" && !allowed.has(character))
      .map(
        (character) => `${file}: U+${character.codePointAt(0).toString(16)}`,
      ),
  );
  assert.deepEqual([...new Set(found)], []);
});

test("structured data links the website, services and breadcrumbs to the company", () => {
  const site = websiteSchema();
  assert.equal(site["@type"], "WebSite");
  assert.equal(site.publisher["@id"], organizationSchema("solutions")["@id"]);
  const company = organizationSchema("solutions");
  assert.equal(company.address.addressLocality, "Toronto");
  assert.equal(company.address.addressCountry, "CA");

  const catalog = serviceCatalog("websites", [
    { name: "Starter", description: "a" },
    { name: "Advanced", description: "b" },
  ]);
  assert.equal(catalog.itemListElement[0].price, "149");
  assert.equal(catalog.itemListElement[0].priceCurrency, "CAD");
  // No price is published where the site shows none.
  assert.equal(catalog.itemListElement[1].price, undefined);
  assert.equal(catalog.itemListElement[1].itemOffered["@type"], "Service");

  const trail = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Our portfolio", path: "/websites/work" },
  ]);
  assert.deepEqual(
    trail.itemListElement.map((item) => [
      item.position,
      new URL(item.item).pathname,
    ]),
    [
      [1, "/"],
      [2, "/websites/work"],
    ],
  );
});

test("analytics run only on Vercel Production and send page paths with campaign tags only", async () => {
  const { analyticsEnabled, anonymousPageUrl } =
    await import("../src/lib/config/analytics.ts");
  assert.equal(analyticsEnabled("production"), true);
  for (const environment of [undefined, "", "preview", "development"])
    assert.equal(analyticsEnabled(environment), false);
  assert.equal(
    anonymousPageUrl(
      "https://www.motchi.ca/websites/contact?status=failed&ref=AB12CD34#contact-form",
    ),
    "https://www.motchi.ca/websites/contact",
  );
  assert.equal(
    anonymousPageUrl("https://www.motchi.ca/"),
    "https://www.motchi.ca/",
  );
  assert.equal(
    anonymousPageUrl(
      "https://www.motchi.ca/websites?utm_source=vietbites&utm_medium=referral&utm_campaign=client-footer&email=a%40b.c&ref=X#top",
    ),
    "https://www.motchi.ca/websites?utm_source=vietbites&utm_medium=referral&utm_campaign=client-footer",
  );
  assert.equal(
    anonymousPageUrl(
      `https://www.motchi.ca/?utm_source=${"x".repeat(100)}&utm_term=`,
    ),
    `https://www.motchi.ca/?utm_source=${"x".repeat(64)}`,
  );
});

test("the host redirect is left to Vercel, so no app rule can loop against it", async () => {
  const { default: config } = await import("../next.config.ts");
  const redirects = await config.redirects();
  assert.ok(redirects.every((rule) => !rule.has));
});

test("every public page shares an absolute www preview image on Open Graph and X", () => {
  for (const route of publicRoutes) {
    const metadata = pageMetadata("Title", "Description", route);
    const image = new URL(
      metadata.openGraph.images[0].url,
      sites.solutions.url,
    );
    assert.equal(image.origin, "https://www.motchi.ca", route);
    assert.match(
      image.pathname,
      /^(\/websites|\/consulting)?\/opengraph-image$/,
    );
    assert.equal(metadata.twitter.images[0], metadata.openGraph.images[0].url);
    assert.equal(metadata.twitter.card, "summary_large_image");
  }
});
