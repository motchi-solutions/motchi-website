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
    .filter((character) => {
      const code = character.charCodeAt(0);
      return (
        (code >= 32 && code !== 127) ||
        (multiline && [9, 10, 13].includes(code))
      );
    })
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

export function hasHeaderControls(value: string): boolean {
  return Array.from(value).some(
    (character) =>
      character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
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
