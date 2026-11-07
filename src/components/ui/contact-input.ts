import type { FormEvent } from "react";
import { filterContactCharacters } from "../../lib/config/validation.ts";

function editable(
  target: EventTarget | null,
): target is HTMLInputElement | HTMLTextAreaElement {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
  );
}

export function preventInvalidContactInput(event: FormEvent) {
  if (!editable(event.target)) return;
  const native = event.nativeEvent as InputEvent;
  if (
    native.isComposing ||
    !native.data ||
    Array.from(native.data).length !== 1
  )
    return;
  if (!filterContactCharacters(event.target.name, native.data))
    event.preventDefault();
}

// Fallback for paste, drop, autofill, and mobile input. Keep the caret where it was.
export function cleanContactInput(
  target: EventTarget | null,
): string | undefined {
  if (!editable(target)) return;
  const value = target.value;
  const clean = filterContactCharacters(target.name, value);
  if (clean !== value) {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    target.value = clean;
    if (start !== null && end !== null) {
      target.setSelectionRange(
        filterContactCharacters(target.name, value.slice(0, start)).length,
        filterContactCharacters(target.name, value.slice(0, end)).length,
      );
    }
  }
  return clean;
}
