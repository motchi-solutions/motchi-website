"use client";
import { InfoTip } from "../info-tip.tsx";
import { useState } from "react";
import { formatPhone, splitInternationalPhone } from "./contact-phone.ts";
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
    const international = /^(\+|00)/.test(text);
    const parsed = international ? splitInternationalPhone(text) : null;
    if (international && !parsed) {
      setPasteError("Please enter a valid country code.");
      return;
    }
    const digits = text.replace(/\D/g, "");
    const next = parsed ?? {
      countryCode: target === "countryCode" ? digits : countryCode,
      number: target === "number" ? digits : number,
    };
    if (next.countryCode.length > 3 || next.number.length > 12) {
      setPasteError("Please enter a valid phone number.");
      return;
    }
    setPasteError("");
    onChange(next);
  }
  const message = pasteError || countryCodeError || error;
  return (
    <fieldset
      className={`${styles.field} ${styles.phoneField}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEditing(false);
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
              maxLength={3}
              value={countryCode}
              placeholder="1"
              aria-invalid={!!(pasteError || countryCodeError)}
              aria-describedby={`phone-hint${message ? " phone-error" : ""}`}
              onPaste={(event) => paste(event, "countryCode")}
              onChange={(event) => {
                setPasteError("");
                onChange({
                  countryCode: event.target.value.replace(/\D/g, ""),
                  number,
                });
              }}
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
            maxLength={editing ? 12 : undefined}
            value={editing ? number : formatPhone(countryCode, number)}
            placeholder="416 555 0123"
            aria-invalid={!!(pasteError || error)}
            aria-describedby={`phone-hint${message ? " phone-error" : ""}`}
            onFocus={() => setEditing(true)}
            onBlur={() => setEditing(false)}
            onPaste={(event) => paste(event, "number")}
            onChange={(event) => {
              setPasteError("");
              onChange({
                countryCode,
                number: event.target.value.replace(/\D/g, ""),
              });
            }}
            className={styles.input}
          />
        </div>
      </div>
    </fieldset>
  );
}
