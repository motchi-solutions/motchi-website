"use client";
import { InfoTip } from "../info-tip.tsx";
import { useState } from "react";
import {
  defaultPhoneCountryCode,
  formatPhone,
  phoneNumberMaxDigits,
  readPhoneEntry,
} from "./contact-phone.ts";
import styles from "./contact.module.css";
export function ContactPhoneField({
  countryCode,
  number,
  error,
  countryCodeError,
  onChange,
  onBlur,
}: {
  countryCode: string;
  number: string;
  error?: string;
  countryCodeError?: string;
  onChange: (value: { countryCode: string; number: string }) => void;
  onBlur: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [pasteError, setPasteError] = useState("");
  function paste(
    event: React.ClipboardEvent<HTMLInputElement>,
    target: "countryCode" | "number",
  ) {
    const text = event.clipboardData.getData("text").trim();
    event.preventDefault();
    if (!/^(?:\+|00)?[\d\s().-]+$/.test(text)) {
      setPasteError("Please enter a valid phone number.");
      return;
    }
    const next = readPhoneEntry(text, { countryCode, number }, target);
    if (!next) {
      setPasteError("Please enter a valid country code.");
      return;
    }
    if (
      next.countryCode.length > 3 ||
      next.number.length > phoneNumberMaxDigits
    ) {
      setPasteError("Please enter a valid phone number.");
      return;
    }
    setPasteError("");
    onChange(next);
  }
  // Typing and browser autofill both arrive as change events. Autofill often
  // supplies a full international number such as +14165550123.
  function change(raw: string, target: "countryCode" | "number") {
    setPasteError("");
    const next = readPhoneEntry(raw, { countryCode, number }, target);
    if (next) onChange(next);
    else
      onChange({
        countryCode:
          target === "countryCode"
            ? raw.replace(/\D/g, "").slice(0, 3)
            : countryCode,
        number,
      });
  }
  const message = pasteError || countryCodeError || error;
  return (
    <fieldset
      className={`${styles.field} ${styles.phoneField}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEditing(false);
          // A number without a country code is treated as North American.
          if (number && !countryCode)
            onChange({ countryCode: defaultPhoneCountryCode, number });
          onBlur();
        }
      }}
      aria-describedby={`phone-hint${message ? " phone-error" : ""}`}
    >
      <legend>
        <span className={styles.phoneLegendRow}>
          Phone number
          <InfoTip label="Phone number">
            You can paste a full phone number into either box. We'll separate
            the country code and format your number. Country codes can have up
            to 3 digits, and your number up to 12.
          </InfoTip>
        </span>
      </legend>
      <p id="phone-hint" className={styles.hint}>
        You can paste a full phone number.
      </p>
      {message && (
        <p id="phone-error" className={styles.error}>
          <span className={styles.errorIcon} aria-hidden="true">
            !
          </span>
          <span>{message}</span>
        </p>
      )}
      <div className={styles.phoneInputs}>
        <div>
          <label htmlFor="phone-country-code" className={styles.phoneSubLabel}>
            Country code
          </label>
          <div className={styles.countryCodeInput}>
            <span aria-hidden="true">+</span>
            <input
              id="phone-country-code"
              name="phoneCountryCode"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-country-code"
              value={countryCode}
              placeholder="1"
              aria-invalid={!!(pasteError || countryCodeError)}
              aria-describedby={`phone-hint${message ? " phone-error" : ""}`}
              onPaste={(event) => paste(event, "countryCode")}
              onChange={(event) => change(event.target.value, "countryCode")}
              className={styles.input}
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className={styles.phoneSubLabel}>
            Your number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={editing ? number : formatPhone(countryCode, number)}
            placeholder="(416) 555-0123"
            aria-invalid={!!(pasteError || error)}
            aria-describedby={`phone-hint${message ? " phone-error" : ""}`}
            onFocus={() => setEditing(true)}
            onBlur={() => setEditing(false)}
            onPaste={(event) => paste(event, "number")}
            onChange={(event) => change(event.target.value, "number")}
            className={styles.input}
          />
        </div>
      </div>
    </fieldset>
  );
}
