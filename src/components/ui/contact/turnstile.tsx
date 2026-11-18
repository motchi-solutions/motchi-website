"use client";

/* Cloudflare Turnstile bot check for the contact form's Review step.

   A Managed widget with appearance "interaction-only" runs invisibly and
   shows a checkbox only when Cloudflare is unsure about the visitor. The
   token is single-use and lasts 5 minutes: Turnstile refreshes expired tokens
   itself, and the form calls reset() after every attempt.

   Sources: Cloudflare Turnstile client-side rendering and widget
   configurations (https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/).
   No cookies are set (pre-clearance is off). */

import {
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./contact.module.css";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const scriptUrl =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("Turnstile unavailable"));
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("Turnstile unavailable"));
    };
    document.head.append(script);
  });
  return loading;
}

export type TurnstileHandle = { reset: () => void };

export function Turnstile({
  siteKey,
  onToken,
  ref,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  ref?: Ref<TurnstileHandle>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const latest = useRef(onToken);
  latest.current = onToken;
  const [problem, setProblem] = useState(false);

  useImperativeHandle(ref, () => ({
    reset() {
      latest.current("");
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !container.current) return;
        widget.current = api.render(container.current, {
          sitekey: siteKey,
          action: "contact",
          appearance: "interaction-only",
          size: "flexible",
          theme: "light",
          callback: (token: string) => {
            setProblem(false);
            latest.current(token);
          },
          "expired-callback": () => latest.current(""),
          "error-callback": () => {
            latest.current("");
            // Turnstile retries on its own; say so only if it keeps failing.
            setProblem(true);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setProblem(true);
      });
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
      latest.current("");
    };
  }, [siteKey]);

  return (
    <div className={styles.turnstile}>
      <div ref={container} />
      {problem && (
        <p className={styles.hint} role="status">
          We couldn't run our quick spam check. If this keeps happening, please
          turn off any content blocker for this page or email us.
        </p>
      )}
    </div>
  );
}
