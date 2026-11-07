"use client";
import { useEffect, useRef } from "react";
import styles from "./products-hero.module.css";

export const productGateTiming = { peek: 240, close: 420, open: 850 } as const;

export function useProductGate(product: number) {
  const gate = useRef<HTMLDivElement>(null);
  const reset = useRef<() => void>(() => {});
  const moveGate = useRef<(angle: number) => void>(() => {});
  const refreshHover = useRef<() => void>(() => {});
  const pointer = useRef<{ x: number; y: number } | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: A new product reuses the doors; reset their motion and restore stationary hover for that product.
  useEffect(() => {
    const node = gate.current;
    if (!node) return;
    const trigger = node.querySelector<HTMLElement>("[data-gate-action=open]");
    const doors = [
      node.querySelector(`.${styles.gateLeft}`),
      node.querySelector(`.${styles.gateRight}`),
    ];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = new Map<Element, Animation>();
    let committed = false;
    const stop = () => {
      committed = false;
      for (const animation of motion.values()) animation.cancel();
      motion.clear();
    };
    reset.current = stop;
    node.dataset.motion = "true";
    const move = (angle: number) => {
      committed = angle === 78;
      doors.forEach((door, index) => {
        if (!door) return;
        // Retarget from the displayed value, including during a closing motion.
        const computed = getComputedStyle(door);
        const current = computed.transform;
        const opacity = computed.opacity;
        motion.get(door)?.cancel();
        motion.delete(door);
        if (preference.matches) return;
        const sign = index === 0 ? -1 : 1;
        const animation = door.animate(
          [
            { transform: current, opacity },
            {
              transform: `rotateY(${sign * angle}deg)`,
              opacity: angle === 78 ? 0 : 1,
            },
          ],
          {
            duration:
              angle === 0
                ? productGateTiming.close
                : angle === 6
                  ? productGateTiming.peek
                  : productGateTiming.open,
            easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
            fill: "both",
          },
        );
        motion.set(door, animation);
      });
    };
    moveGate.current = move;
    const isOpen = () => node.dataset.open === "true";
    const active = () => {
      if (trigger?.matches(":focus-visible")) return true;
      if (!pointer.current) return Boolean(trigger?.matches(":hover"));
      const target = document.elementFromPoint(
        pointer.current.x,
        pointer.current.y,
      );
      return Boolean(target && trigger?.contains(target));
    };
    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse")
        pointer.current = { x: event.clientX, y: event.clientY };
    };
    const enter = () => {
      if (
        !committed &&
        !isOpen() &&
        window.matchMedia("(hover: hover)").matches
      )
        move(6);
    };
    refreshHover.current = () => {
      if (active()) enter();
    };
    const leave = () => {
      if (!committed && !isOpen() && !active()) move(0);
    };
    const pointerEnter = (event: PointerEvent) => {
      trackPointer(event);
      enter();
    };
    const pointerLeave = (event: PointerEvent) => {
      // pointerleave runs before the window pointermove for the same move.
      trackPointer(event);
      leave();
    };
    const focus = (event: FocusEvent) => {
      if (
        event.target instanceof Element &&
        event.target.matches(":focus-visible")
      )
        enter();
    };
    const blur = () => queueMicrotask(leave);
    const updatePreference = () => {
      stop();
      if (!preference.matches && active()) enter();
    };
    window.addEventListener("pointermove", trackPointer, { passive: true });
    trigger?.addEventListener("pointerenter", pointerEnter);
    trigger?.addEventListener("pointerleave", pointerLeave);
    node.addEventListener("focusin", focus);
    node.addEventListener("focusout", blur);
    preference.addEventListener("change", updatePreference);
    // A switched product can inherit the same stationary pointer/focus.
    if (active()) enter();
    return () => {
      stop();
      delete node.dataset.motion;
      window.removeEventListener("pointermove", trackPointer);
      trigger?.removeEventListener("pointerenter", pointerEnter);
      trigger?.removeEventListener("pointerleave", pointerLeave);
      node.removeEventListener("focusin", focus);
      node.removeEventListener("focusout", blur);
      preference.removeEventListener("change", updatePreference);
    };
  }, [product]);
  return { gate, reset, moveGate, refreshHover };
}
