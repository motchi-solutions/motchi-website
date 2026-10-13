import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import solutionsManifest from "../apps/solutions/src/app/manifest.ts";
import websitesManifest from "../apps/websites/src/app/manifest.ts";
import consultingManifest from "../apps/consulting/src/app/manifest.ts";
import { sites } from "../packages/config/src/sites.ts";
import {
  siteMetadata,
  organizationSchema,
} from "../packages/config/src/metadata.ts";

const manifests = {
  solutions: solutionsManifest,
  websites: websitesManifest,
  consulting: consultingManifest,
};
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
      const bytes = readFileSync(`apps/${branch}/public${icon.src}`);
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(
        icon.sizes,
        `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,
      );
      assert.equal(icon.type, "image/png");
      assert.equal(icon.purpose, "any");
    }
    const apple = readFileSync(`apps/${branch}/src/app/apple-icon.png`);
    assert.equal(apple.readUInt32BE(16), 180);
    assert.equal(apple.readUInt32BE(20), 180);
    assert.ok(existsSync(`apps/${branch}/src/app/favicon.ico`));
    assert.match(
      readFileSync(`apps/${branch}/src/app/icon.svg`, "utf8"),
      /<svg\b/,
    );
  }
});
test("each app owns distinct favicon, Apple, scalable, and manifest artwork", () => {
  for (const suffix of [
    "src/app/icon.svg",
    "src/app/favicon.ico",
    "src/app/apple-icon.png",
    "public/web-app-manifest-192x192.png",
    "public/web-app-manifest-512x512.png",
  ]) {
    const hashes = Object.keys(manifests).map((branch) =>
      createHash("sha256")
        .update(readFileSync(`apps/${branch}/${suffix}`))
        .digest("hex"),
    );
    assert.equal(new Set(hashes).size, 3, suffix);
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
