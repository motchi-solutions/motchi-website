"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getContactDraftKey,
  hasContactProgress,
  initialDraft,
  parseContactDraft,
  type ContactDraft,
  type SavedContactDraft,
} from "./contact-model.ts";

import type { Branch } from "../../../lib/brand.ts";
import type { ContactEntry } from "./contact-entry.ts";
type SaveState = "idle" | "saving" | "saved" | "error";
export function useContactDraft(
  topic?: string,
  branch: Branch = "solutions",
  entry?: ContactEntry,
) {
  const contactDraftKey = getContactDraftKey(branch);
  const [draft, setDraft] = useState(
    () => entry?.draft ?? initialDraft(topic, branch),
  );
  const [step, setStep] = useState(entry?.step ?? 0);
  const [ready, setReady] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<SavedContactDraft | null>(
    null,
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [edited, setEdited] = useState(false);
  const [savingEnabled, setSavingEnabled] = useState(false);
  const snapshot = useRef({ draft, step, edited: false, savingEnabled: false });
  const savedSignature = useRef("");
  const mounted = useRef(false);
  const allowLeave = useRef(false);
  const flush = useCallback(() => {
    const current = snapshot.current;
    if (!current.edited) return true;
    if (!current.savingEnabled) return !hasContactProgress(current.draft);
    const signature = JSON.stringify({
      draft: current.draft,
      step: current.step,
    });
    if (signature === savedSignature.current) return true;
    try {
      if (hasContactProgress(current.draft)) {
        localStorage.setItem(
          contactDraftKey,
          JSON.stringify({
            version: 1,
            branch,
            updatedAt: Date.now(),
            step: current.step,
            draft: current.draft,
          }),
        );
      } else localStorage.removeItem(contactDraftKey);
      savedSignature.current = signature;
      if (mounted.current)
        setSaveState(hasContactProgress(current.draft) ? "saved" : "idle");
      return true;
    } catch {
      if (mounted.current) setSaveState("error");
      return false;
    }
  }, [contactDraftKey, branch]);
  useEffect(() => {
    mounted.current = true;
    try {
      const raw = localStorage.getItem(contactDraftKey);
      const saved = parseContactDraft(raw, Date.now(), branch);
      if (saved) setPendingDraft(saved);
      else if (raw) localStorage.removeItem(contactDraftKey);
    } catch {
      setSaveState("error");
    }
    setReady(true);
    return () => {
      mounted.current = false;
      flush();
    };
  }, [flush, branch, contactDraftKey]);
  useEffect(() => {
    if (!ready || pendingDraft) return;
    snapshot.current = { draft, step, edited, savingEnabled };
    if (!edited || !savingEnabled) return;
    const signature = JSON.stringify({ draft, step });
    if (signature === savedSignature.current) return;
    setSaveState("saving");
    const timer = window.setTimeout(flush, 500);
    return () => window.clearTimeout(timer);
  }, [draft, step, edited, savingEnabled, pendingDraft, ready, flush]);
  useEffect(() => {
    if (!edited || pendingDraft) return;
    const hide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    const leaving = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const url = new URL(link.href);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        (url.origin === location.origin &&
          url.pathname === location.pathname &&
          url.search === location.search)
      )
        return;
      if (!flush()) {
        if (
          !window.confirm(
            snapshot.current.savingEnabled
              ? "Your latest changes could not be saved. Leave this page and lose those changes?"
              : "Your progress is not being saved. Leave this page and lose your answers?",
          )
        ) {
          event.preventDefault();
          event.stopPropagation();
        } else allowLeave.current = true;
      }
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", flush);
    document.addEventListener("click", leaving, true);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("click", leaving, true);
    };
  }, [edited, pendingDraft, flush]);
  useEffect(() => {
    if (!edited || pendingDraft || (savingEnabled && saveState === "saved"))
      return;
    const unload = (event: BeforeUnloadEvent) => {
      if (!allowLeave.current && !flush()) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [edited, pendingDraft, savingEnabled, saveState, flush]);
  function updateDraft<K extends keyof ContactDraft>(
    key: K,
    value: ContactDraft[K],
  ) {
    allowLeave.current = false;
    setEdited(true);
    setDraft((current) => ({ ...current, [key]: value }));
  }
  function changeStep(value: number) {
    allowLeave.current = false;
    setStep(value);
    setEdited(true);
  }
  function resume() {
    if (!pendingDraft) return;
    setSavingEnabled(true);
    setDraft(pendingDraft.draft);
    setStep(pendingDraft.step);
    setPendingDraft(null);
    setEdited(true);
  }
  function clear(restartFromEntry = false) {
    try {
      localStorage.removeItem(contactDraftKey);
    } catch {
      setSaveState("error");
      return false;
    }
    const empty =
      restartFromEntry && entry ? entry.draft : initialDraft(undefined, branch);
    const restartStep = restartFromEntry ? (entry?.step ?? 0) : 0;
    snapshot.current = {
      draft: empty,
      step: restartStep,
      edited: false,
      savingEnabled: false,
    };
    savedSignature.current = "";
    setPendingDraft(null);
    setDraft(empty);
    setStep(restartStep);
    setEdited(false);
    setSavingEnabled(false);
    setSaveState("idle");
    return true;
  }
  function toggleSaving(enabled: boolean) {
    if (!enabled) {
      try {
        localStorage.removeItem(contactDraftKey);
      } catch {
        setSaveState("error");
        return;
      }
    }
    snapshot.current = { ...snapshot.current, savingEnabled: enabled };
    savedSignature.current = "";
    setSavingEnabled(enabled);
    setSaveState("idle");
    if (enabled && hasContactProgress(draft)) setEdited(true);
  }
  return {
    draft,
    step,
    updateDraft,
    changeStep,
    ready,
    pendingDraft,
    saveState,
    savingEnabled,
    toggleSaving,
    resume,
    clear,
    flush,
  };
}
