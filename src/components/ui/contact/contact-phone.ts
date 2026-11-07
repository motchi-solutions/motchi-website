import { AsYouType } from "libphonenumber-js/min";
export function isPhoneCallingCode(value: string) {
  if (!/^[0-9]{1,3}$/.test(value)) return false;
  const input = new AsYouType();
  input.input(`+${value}`);
  return input.getCallingCode() === value;
}
export function splitInternationalPhone(value: string) {
  const normalized = value.trim().replace(/^00/, "+");
  const input = new AsYouType();
  input.input(normalized);
  const countryCode = input.getCallingCode();
  const digits = normalized.replace(/\D/g, "");
  return countryCode
    ? { countryCode, number: digits.slice(countryCode.length) }
    : null;
}
export function formatPhone(countryCode: string, number: string) {
  if (!number) return "";
  if (!countryCode) return number;
  const input = new AsYouType();
  const formatted = input.input(`+${countryCode}${number}`);
  return formatted.startsWith(`+${countryCode} `)
    ? formatted.slice(countryCode.length + 2)
    : number;
}
