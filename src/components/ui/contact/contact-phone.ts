import { AsYouType } from "libphonenumber-js/min";
// North American numbering plan: used when no country code is given.
export const defaultPhoneCountryCode = "1";
export const phoneNumberMaxDigits = 12;
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
// Typing, autofill and paste all arrive here. A value that starts with "+" or
// "00" carries its own country code; otherwise only the digits are kept and
// the current country code stays (or defaults to +1 once a number exists).
export function readPhoneEntry(
  raw: string,
  current: { countryCode: string; number: string },
  target: "countryCode" | "number",
): { countryCode: string; number: string } | null {
  const text = raw.trim();
  if (/^(?:\+|00)/.test(text) && /\d/.test(text.replace(/^00/, ""))) {
    const parsed = splitInternationalPhone(text);
    // "+1" alone in the country code box is just a country code.
    if (parsed && (parsed.number || target === "countryCode"))
      return {
        countryCode: parsed.countryCode,
        number: parsed.number || current.number,
      };
    if (!parsed && text.replace(/\D/g, "").length > 3) return null;
  }
  const digits = text.replace(/\D/g, "");
  if (target === "countryCode") {
    // A full number autofilled into the country code box is split instead;
    // an extra typed digit is simply ignored.
    if (digits.length >= 7) return splitInternationalPhone(`+${digits}`);
    return { countryCode: digits.slice(0, 3), number: current.number };
  }
  const number = digits.slice(0, phoneNumberMaxDigits);
  return {
    countryCode:
      number && !current.number && !current.countryCode
        ? defaultPhoneCountryCode
        : current.countryCode,
    number,
  };
}
export function formatPhone(countryCode: string, number: string) {
  if (!number) return "";
  const code = countryCode || defaultPhoneCountryCode;
  if (code === "1" && /^\d{10}$/.test(number))
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  const input = new AsYouType();
  const formatted = input.input(`+${code}${number}`);
  return formatted.startsWith(`+${code} `)
    ? formatted.slice(code.length + 2)
    : number;
}
export function formatInternationalPhone(countryCode: string, number: string) {
  if (!number) return "";
  return `+${countryCode || defaultPhoneCountryCode} ${formatPhone(countryCode, number)}`;
}
