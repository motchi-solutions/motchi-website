export const contactContextLimit = 2000;
export const contactNamePattern =
  "[\\p{L}\\p{M}]+(?:[ '\\u2019\\-][\\p{L}\\p{M}]+)*";
// Filter characters, not incomplete values: structure is checked on blur/submit.
export function filterContactCharacters(field: string, value: string): string {
  if (field === "name") return value.replace(/[^\p{L}\p{M} '\u2019-]/gu, "");
  if (field === "email")
    return value.replace(/[^a-zA-Z0-9!#$%&'*+/=?^_`{|}~@.-]/g, "");
  if (field === "website") return value.replace(/\s/g, "");
  if (field === "phone" || field === "phoneCountryCode")
    return value.replace(/\D/g, "");
  const multiline = field === "context" || field === "message";
  return Array.from(value)
    .filter(
      (character) => !isUnsafeCharacter(character.charCodeAt(0), multiline),
    )
    .join("");
}
export function isContactName(value: string): boolean {
  const name = value.trim().normalize("NFC");
  const length = Array.from(name).length;
  return (
    length >= 2 &&
    length <= 100 &&
    new RegExp(`^(?:${contactNamePattern})$`, "u").test(name)
  );
}

/** Control and direction-changing characters no contact field needs: C0
    controls and DEL, C1 controls, line/paragraph separators, and bidi
    embeddings, overrides and isolates (which can visually reorder text in
    the notification email). Tab, LF and CR are allowed only when multiline. */
export function isUnsafeCharacter(code: number, multiline = false): boolean {
  if (multiline && (code === 9 || code === 10 || code === 13)) return false;
  return (
    code < 32 ||
    (code >= 127 && code <= 159) ||
    code === 0x2028 ||
    code === 0x2029 ||
    (code >= 0x202a && code <= 0x202e) ||
    (code >= 0x2066 && code <= 0x2069)
  );
}
export function hasHeaderControls(value: string): boolean {
  return Array.from(value).some((character) =>
    isUnsafeCharacter(character.charCodeAt(0)),
  );
}
export function isEmail(value: string): boolean {
  if (value.length > 254 || hasHeaderControls(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (
    local.length > 64 ||
    !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i.test(
      local,
    )
  )
    return false;
  const labels = domain.split(".");
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
    )
  );
}
