import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { navigation, publicRoutes } from "../packages/brand/src/navigation.ts";

test("public navigation resolves to real pages included in each sitemap", () => {
  for (const [branch, items] of Object.entries(navigation)) {
    assert.equal(new Set(items.map((item) => item.href)).size, items.length);
    for (const item of items) {
      const url = new URL(item.href, "https://motchi.test");
      assert.equal(url.origin, "https://motchi.test");
      assert.ok(
        publicRoutes[branch].includes(url.pathname),
        `${branch}: ${item.href} missing from sitemap`,
      );
    }
    for (const route of publicRoutes[branch]) {
      const page = resolve(`apps/${branch}/src/app/${route}/page.tsx`);
      assert.ok(existsSync(page), `${branch}: missing ${route}`);
      const content = readFileSync(page, "utf8");
      assert.match(
        content,
        /metadata|generateMetadata/,
        `${branch}: metadata for ${route}`,
      );
    }
  }
});
