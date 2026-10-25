import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { projects } from "../apps/websites/src/content/projects.ts";

const publicRoot = new URL("../apps/websites/public/", import.meta.url);
test("approved project assets exist and configured PNG dimensions match the files", async () => {
  for (const project of projects) {
    for (const slot of ["desktop", "mobile", "logo"]) {
      const asset = project.media[slot];
      assert.ok(asset, `${project.id}: missing ${slot}`);
      assert.ok(asset.src.startsWith(`/media/projects/${project.id}/`));
      const bytes = await readFile(new URL(asset.src.slice(1), publicRoot));
      if (asset.src.endsWith(".png")) {
        assert.deepEqual(
          [...bytes.subarray(0, 8)],
          [137, 80, 78, 71, 13, 10, 26, 10],
        );
        assert.equal(asset.width, bytes.readUInt32BE(16));
        assert.equal(asset.height, bytes.readUInt32BE(20));
      } else {
        const viewBox = bytes.toString().match(/viewBox="0 0 (\d+) (\d+)"/);
        assert.ok(viewBox, `${asset.src}: missing SVG viewBox`);
        assert.equal(asset.width, Number(viewBox[1]));
        assert.equal(asset.height, Number(viewBox[2]));
      }
      if (slot === "logo") assert.equal(asset.alt, "");
      else
        assert.ok(
          asset.alt.length > 40,
          `${asset.src}: useful description required`,
        );
    }
  }
});
