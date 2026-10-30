import assert from "node:assert/strict";
import test from "node:test";
import { motionMilliseconds } from "../packages/ui/src/motion-timing.ts";

test("motion timing handles CSS optimizer seconds and authored milliseconds equally", () => {
  assert.equal(motionMilliseconds("2600ms", 0), 2600);
  assert.equal(motionMilliseconds("2.6s", 0), 2600);
  assert.equal(motionMilliseconds(".28s", 0), 280);
  assert.equal(motionMilliseconds(" 560ms ", 0), 560);
  assert.equal(motionMilliseconds("0s", 999), 0);
});

test("missing or malformed motion tokens use a bounded fallback", () => {
  for (const value of ["", "NaN", "infinite", "-2s", "2600", "2.6seconds"])
    assert.equal(motionMilliseconds(value, 560), 560);
});
