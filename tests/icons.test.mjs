import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import solutionsManifest from "../src/app/manifest.ts";
import { sites } from "../src/lib/config/sites.ts";
import {
  siteMetadata,
  organizationSchema,
} from "../src/lib/config/metadata.ts";

const manifests = { solutions: solutionsManifest };
test("manifest identities match supplied PNG dimensions and honest icon purposes", () => {
  for (const [branch, makeManifest] of Object.entries(manifests)) {
    const manifest = makeManifest();
    assert.equal(manifest.name, sites[branch].name);
    assert.equal(
      manifest.short_name,
      branch === "solutions" ? "Motchi" : sites[branch].shortName,
    );
    assert.equal(manifest.start_url, "/");
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.background_color, "#F4F0E6");
    assert.equal(manifest.theme_color, "#5B0202");
    for (const icon of manifest.icons) {
      const bytes = readFileSync(`public${icon.src}`);
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(
        icon.sizes,
        `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
      );
      assert.equal(icon.type, "image/png");
      assert.equal(icon.purpose, "any");
    }
    const apple = readFileSync(`src/app/apple-icon.png`);
    assert.equal(apple.readUInt32BE(16), 180);
    assert.equal(apple.readUInt32BE(20), 180);
    assert.ok(existsSync(`src/app/favicon.ico`));
    assert.match(readFileSync(`src/app/icon.svg`, "utf8"), /<svg\b/);
  }
});
test("metadata keeps domains and schema environment-aware without duplicate file icons", () => {
  const original = process.env.SOLUTIONS_URL;
  try {
    process.env.SOLUTIONS_URL = "https://preview.motchi.example";
    const metadata = siteMetadata("solutions");
    assert.equal(metadata.metadataBase.href, "https://preview.motchi.example/");
    assert.equal(metadata.applicationName, "Motchi Solutions");
    assert.equal(metadata.title.template, "%s | Motchi Solutions");
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.icons, undefined);
    assert.equal(metadata.openGraph.images, undefined);
    assert.equal(
      organizationSchema("solutions").url,
      "https://preview.motchi.example",
    );
  } finally {
    if (original === undefined) delete process.env.SOLUTIONS_URL;
    else process.env.SOLUTIONS_URL = original;
  }
});
