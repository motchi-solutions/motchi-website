import assert from "node:assert/strict";
import test from "node:test";

// Minimal DOM stand-ins for the browser-only helpers.
class FakeInput {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.selectionStart = value.length;
    this.selectionEnd = value.length;
  }
  setSelectionRange(start, end) {
    this.selectionStart = start;
    this.selectionEnd = end;
  }
}
globalThis.HTMLInputElement = FakeInput;
globalThis.HTMLTextAreaElement = class {};
globalThis.location = new URL("http://localhost:3000/consulting");

const { cleanContactInput, preventInvalidContactInput } =
  await import("../src/components/ui/contact-input.ts");
const { wantsSectionArrival } =
  await import("../src/components/ui/section-arrival.ts");

test("pasted names lose invalid characters and keep the caret in place", () => {
  const input = new FakeInput("name", "Mo<script>");
  input.selectionStart = input.selectionEnd = 2;
  const clean = cleanContactInput(input);
  assert.equal(input.value, clean);
  assert.ok(!clean.includes("<"));
  assert.equal(input.selectionStart, 2);
  assert.equal(cleanContactInput({}), undefined);
});

test("typed characters are filtered one at a time, never during composition", () => {
  const event = (data, isComposing = false) => {
    let prevented = false;
    return {
      target: new FakeInput("name", ""),
      nativeEvent: { data, isComposing },
      preventDefault: () => {
        prevented = true;
      },
      get prevented() {
        return prevented;
      },
    };
  };
  const invalid = event("<");
  preventInvalidContactInput(invalid);
  assert.equal(invalid.prevented, true);
  const letter = event("a");
  preventInvalidContactInput(letter);
  assert.equal(letter.prevented, false);
  const composing = event("<", true);
  preventInvalidContactInput(composing);
  assert.equal(composing.prevented, false);
});

test("only plain clicks on another page's section use the gentle arrival", () => {
  const click = {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
  };
  assert.equal(
    wantsSectionArrival(click, "/websites#pricing", undefined)?.hash,
    "#pricing",
  );
  // Same page, no hash, modified clicks, new tabs and other origins jump normally.
  assert.equal(wantsSectionArrival(click, "/consulting#faq", undefined), null);
  assert.equal(wantsSectionArrival(click, "/websites", undefined), null);
  assert.equal(
    wantsSectionArrival(
      { ...click, metaKey: true },
      "/websites#pricing",
      undefined,
    ),
    null,
  );
  assert.equal(wantsSectionArrival(click, "/websites#pricing", "_blank"), null);
  assert.equal(
    wantsSectionArrival(click, "//evil.example/#x", undefined),
    null,
  );
  assert.equal(wantsSectionArrival(click, undefined, undefined), null);
});
