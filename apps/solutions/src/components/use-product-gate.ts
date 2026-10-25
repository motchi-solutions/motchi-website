"use client";
import { useEffect, useRef } from "react";
import styles from "./products-hero.module.css";

export function useProductGate() {
  const gate = useRef<HTMLDivElement>(null);
  const reset = useRef<() => void>(() => {});
  const moveGate = useRef<(angle: number, pulse?: boolean) => void>(() => {});
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
    let generation = 0;
    let closing = false;
    let committed = false;
    const stop = () => {
      generation += 1;
      closing = false;
      committed = false;
      for (const animation of motion.values()) animation.cancel();
      motion.clear();
    };
    reset.current = stop;
    node.dataset.motion = "true";
    const move = (angle: number, pulse = false) => {
      if (angle === 78) committed = true;
      closing = angle === 0;
      const version = ++generation;
      doors.forEach((door, index) => {
        if (!door) return;
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
            duration: angle === 0 ? 1400 : angle === 6 ? 600 : 850,
            easing:
              angle === 0
                ? "cubic-bezier(0.4, 0, 0.2, 1)"
                : "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );
        motion.set(door, animation);
        animation.onfinish = () => {
          if (version === generation && angle === 0) {
            closing = false;
            committed = false;
          }
          if (!pulse || version !== generation || preference.matches) return;
          const breathing = door.animate(
            [
              { transform: `rotateY(${sign * 6}deg)` },
              { transform: `rotateY(${sign * 10}deg)` },
              { transform: `rotateY(${sign * 6}deg)` },
            ],
            {
              duration: 2400,
              easing: "ease-in-out",
              iterations: Infinity,
              fill: "both",
            },
          );
          motion.set(door, breathing);
          animation.cancel();
        };
      });
    };
    moveGate.current = move;
    const isOpen = () => node.dataset.open === "true";
    const active = () => Boolean(trigger?.matches(":hover, :focus-visible"));
    const enter = () => {
      if (
        !committed &&
        !closing &&
        !isOpen() &&
        window.matchMedia("(hover: hover)").matches
      )
        move(6, true);
    };
    const leave = () => {
      if (!committed && !closing && !isOpen() && !active()) move(0);
    };
    const focus = (event: FocusEvent) => {
      if (
        event.target instanceof Element &&
        event.target.matches(":focus-visible")
      )
        enter();
    };
    const blur = () => queueMicrotask(leave);
    trigger?.addEventListener("pointerenter", enter);
    trigger?.addEventListener("pointerleave", leave);
    node.addEventListener("focusin", focus);
    node.addEventListener("focusout", blur);
    preference.addEventListener("change", stop);
    return () => {
      stop();
      delete node.dataset.motion;
      trigger?.removeEventListener("pointerenter", enter);
      trigger?.removeEventListener("pointerleave", leave);
      node.removeEventListener("focusin", focus);
      node.removeEventListener("focusout", blur);
      preference.removeEventListener("change", stop);
    };
  }, []);
  return { gate, reset, moveGate };
}
