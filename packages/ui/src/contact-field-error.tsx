"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  validateContact,
  type ContactBranch,
  type ContactInput,
} from "@motchi/email/validation";
import { cleanContactInput } from "./contact-input";

export function ContactFieldError({
  field,
  branch,
  initialMessage,
}: {
  field: keyof ContactInput;
  branch: ContactBranch;
  initialMessage?: string;
}) {
  const [message, setMessage] = useState(initialMessage);
  const anchor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const form = anchor.current?.closest("form");
    const input = form?.querySelector<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(`[name="${field}"]`);
    if (!form || !input) return;
    const validate = () =>
      validateContact(new FormData(form), branch).errors[field];
    const editing = (event: Event) => {
      if ((event as InputEvent).isComposing) return;
      cleanContactInput(input);
      setMessage((current) => (current ? validate() : current));
    };
    const blur = () => setMessage(validate());
    input.addEventListener("input", editing);
    input.addEventListener("change", editing);
    input.addEventListener("compositionend", editing);
    input.addEventListener("blur", blur);
    return () => {
      input.removeEventListener("input", editing);
      input.removeEventListener("change", editing);
      input.removeEventListener("compositionend", editing);
      input.removeEventListener("blur", blur);
    };
  }, [field, branch]);
  useLayoutEffect(() => {
    const input = anchor.current
      ?.closest("form")
      ?.querySelector(`[name="${field}"]`);
    if (!input) return;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    const ids = (input.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter((id) => id && id !== `${field}-error`);
    if (message) ids.push(`${field}-error`);
    if (ids.length) input.setAttribute("aria-describedby", ids.join(" "));
    else input.removeAttribute("aria-describedby");
  }, [message, field]);
  return (
    <div ref={anchor} className="contents">
      {message && (
        <p id={`${field}-error`} className="form-error-notice mt-2">
          {message}
        </p>
      )}
    </div>
  );
}
