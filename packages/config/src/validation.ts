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
