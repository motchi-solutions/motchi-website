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
import robots from "../src/app/robots.ts";
import { publicRoutes } from "../src/lib/config/navigation.ts";
import { contactMessage } from "../src/lib/email/feedback.ts";
import { contactOptionLabel } from "../src/components/ui/contact/contact-config.ts";

test("page metadata carries the section's social image and optional absolute title", () => {
  const work = pageMetadata("Our Portfolio", "Work.", "/websites/work");
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

test("robots blocks crawling unless launched on the production origin", (t) => {
  const restore = { ...process.env };
  t.after(() => {
    process.env = restore;
  });
  // Off production, or before launch, everything stays out.
  assert.deepEqual(robots().rules, { userAgent: "*", disallow: "/" });
  process.env.ALLOW_INDEXING = "true";
  assert.deepEqual(robots().rules, { userAgent: "*", disallow: "/" });
  // Production origin plus the launch flag allows crawling, except the API.
  process.env.SOLUTIONS_URL = "https://motchi.ca";
  assert.deepEqual(robots().rules, {
    userAgent: "*",
    allow: "/",
    disallow: "/api/",
  });
  assert.equal(siteMetadata("solutions").robots, undefined);
  assert.match(robots().sitemap, /^https:\/\/motchi\.ca\/sitemap\.xml$/);
});

test("security headers deny framing, sniffing and unexpected origins", () => {
  const headers = Object.fromEntries(
    securityHeaders.map(({ key, value }) => [key, value]),
  );
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  const policy = headers["Content-Security-Policy"];
  for (const directive of [
    "default-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ])
    assert.ok(policy.includes(directive), directive);
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
    { name: "Our Portfolio", path: "/websites/work" },
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
