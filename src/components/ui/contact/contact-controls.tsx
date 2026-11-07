import { RequiredMark } from "../required-mark.tsx";
import {
  contactNamePattern,
  contactContextLimit,
} from "../../../lib/config/validation.ts";
import {
  cleanContactInput,
  preventInvalidContactInput,
} from "../contact-input.ts";
import { InfoTip } from "../info-tip.tsx";
import { LuCircleAlert } from "react-icons/lu";
import type { ContactDraft } from "./contact-model.ts";
import styles from "./contact.module.css";

export function ContactOptionGroup({
  id,
  label,
  options,
  value,
  onChange,
  onBlur,
  multiple = false,
  required = false,
  showRequirement = true,
  hint,
  descriptions,
  error,
}: {
  id: string;
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  multiple?: boolean;
  required?: boolean;
  showRequirement?: boolean;
  hint?: string;
  descriptions?: Record<string, string>;
  error?: string;
}) {
  const help = hint ?? (multiple ? "Please select all that apply." : undefined);
  return (
    <fieldset
      id={`${id}-group`}
      className={styles.group}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onBlur?.();
      }}
      aria-describedby={
        [help ? `${id}-hint` : "", error ? `${id}-error` : ""]
          .filter(Boolean)
          .join(" ") || undefined
      }
    >
      <legend>
        {label} {showRequirement && required && <RequiredMark />}
      </legend>
      {help && (
        <p id={`${id}-hint`} className={styles.hint}>
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <span className={styles.errorIcon} aria-hidden="true">
            !
          </span>
          <span>{error}</span>
        </p>
      )}
      <div
        className={id === "services" ? styles.serviceOptions : styles.options}
      >
        {options.map((option, index) => (
          <label key={option} className={styles.option}>
            <input
              id={`${id}-${index}`}
              name={id}
              type={multiple ? "checkbox" : "radio"}
              value={option}
              checked={value.includes(option)}
              aria-invalid={!!error}
              aria-labelledby={`${id}-${index}-label`}
              aria-describedby={
                [
                  descriptions?.[option] ? `${id}-${index}-description` : "",
                  error ? `${id}-error` : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              onChange={() =>
                onChange(
                  multiple
                    ? value.includes(option)
                      ? value.filter((item) => item !== option)
                      : [...value, option]
                    : [option],
                )
              }
            />
            <span className={styles.optionCopy}>
              <span
                id={`${id}-${index}-label`}
                className={id === "services" ? styles.optionTitle : undefined}
              >
                {option}
              </span>
              {descriptions?.[option] && (
                <span
                  id={`${id}-${index}-description`}
                  className={styles.optionDescription}
                >
                  <span>{descriptions[option]}</span>
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function ContactField({
  field,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  autoComplete,
  required = false,
  error,
  hint,
  help,
  multiline = false,
  maxLength = contactContextLimit,
}: {
  field: keyof ContactDraft;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  help?: React.ReactNode;
  multiline?: boolean;
  maxLength?: number;
}) {
  const props = {
    id: field,
    name: field,
    value,
    required,
    onBlur,
    placeholder,
    "aria-invalid": !!error,
    "aria-describedby":
      [
        hint ? `${field}-hint` : "",
        error ? `${field}-error` : "",
        multiline ? `${field}-counter` : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    onBeforeInput: preventInvalidContactInput,
    onCompositionEnd: (
      event: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      onChange(
        cleanContactInput(event.currentTarget) ?? event.currentTarget.value,
      );
    },
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) =>
      onChange(
        (event.nativeEvent as InputEvent).isComposing
          ? event.target.value
          : (cleanContactInput(event.target) ?? event.target.value),
      ),
    className: styles.input,
  };
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelRow}>
        <label htmlFor={field}>
          {label} {required && <RequiredMark />}
        </label>
        {(help || hint) && (
          <InfoTip label={label}>{help || hint || ""}</InfoTip>
        )}
      </div>
      {hint && (
        <p id={`${field}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${field}-error`} className={styles.error}>
          <span className={styles.errorIcon} aria-hidden="true">
            !
          </span>
          <span>{error}</span>
        </p>
      )}
      {multiline ? (
        <div className={styles.textareaShell}>
          <textarea {...props} rows={5} />
          <div className={styles.characterCounter}>
            <span
              id={`${field}-counter`}
              data-limit={value.length >= maxLength}
              aria-live="off"
            >
              <span className="sr-only">Characters used: </span>
              {value.length >= maxLength && (
                <LuCircleAlert size={16} aria-hidden="true" focusable="false" />
              )}
              {value.length.toLocaleString("en-CA")} /{" "}
              {maxLength.toLocaleString("en-CA")}
            </span>
          </div>
          <span className="sr-only" role="status">
            {value.length > maxLength
              ? "Your answer is over the character limit."
              : value.length === maxLength
                ? "You've reached the character limit."
                : ""}
          </span>
        </div>
      ) : (
        <input
          {...props}
          type={type}
          autoComplete={autoComplete}
          spellCheck={type === "email" || type === "url" ? false : undefined}
          inputMode={field === "phone" ? "numeric" : undefined}
          pattern={
            field === "name"
              ? contactNamePattern
              : field === "phone"
                ? "[0-9]{1,15}"
                : undefined
          }
          minLength={field === "name" ? 2 : undefined}
          maxLength={
            field === "name"
              ? 100
              : field === "phone"
                ? 15
                : field === "email" || field === "website"
                  ? 254
                  : 150
          }
        />
      )}
    </div>
  );
}
