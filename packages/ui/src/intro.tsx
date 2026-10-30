"use client";
import { motionMilliseconds } from "./motion-timing";
import { type Branch, introLogos } from "@motchi/brand";
import Image from "next/image";
import { LuKeyboard, LuMousePointerClick } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";

const branches: Branch[] = ["solutions", "websites", "consulting"];

// Root layouts persist during client navigation; each new document gets a new stage.
export function Introduction({ branch }: { branch: Branch }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const complete = useRef<() => void>(() => setVisible(false));
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeout: number | undefined;
    const finish = () => {
      removeInputs();
      document.dispatchEvent(new Event("motchi:page-reveal"));
      setVisible(false);
    };
    const animations: Animation[] = [];
    let dismissing = false;
    const dismiss = () => {
      if (dismissing) return;
      dismissing = true;
      window.clearTimeout(timeout);
      const node = stage.current;
      if (preference.matches || !node) {
        finish();
        return;
      }
      // Preserve the current aperture when cancelling the branded sequence.
      const current = getComputedStyle(node);
      const aperture = current.getPropertyValue("--intro-aperture");
      const opacity = current.opacity;
      node.style.setProperty("--intro-aperture", aperture);
      node.style.animation = "none";
      const fade = node.animate([{ opacity }, { opacity: 0 }], {
        duration: 180,
        easing: "ease-in-out",
        fill: "forwards",
      });
      animations.push(fade);
      node.dataset.introReleasing = "true";
      document.dispatchEvent(new Event("motchi:page-reveal"));
      fade.finished.then(finish, () => {});
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
      }
      dismiss();
    };
    const removeInputs = () => {
      window.clearTimeout(timeout);
      preference.removeEventListener("change", finish);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("wheel", dismiss);
    };
    complete.current = finish;
    if (preference.matches) {
      finish();
      return;
    }
    // CSS starts with server HTML and ends independently if hydration fails.
    const duration = motionMilliseconds(
      stage.current
        ? getComputedStyle(stage.current).getPropertyValue("--motion-intro")
        : "",
      2600,
    );
    const elapsed = Number(stage.current?.getAnimations()[0]?.currentTime ?? 0);
    timeout = window.setTimeout(finish, Math.max(0, duration - elapsed) + 50);
    preference.addEventListener("change", finish);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", keyboard, { once: true });
    // Wheel, touch/pointer, and keyboard cover intentional scrolling;
    // browser scroll restoration on reload must not dismiss the entry.
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    return () => {
      removeInputs();
      for (const animation of animations) animation.cancel();
    };
  }, []);
  if (!visible) return null;
  return (
    <div
      ref={stage}
      aria-hidden="true"
      className="intro-experience"
      data-intro-branch={branch}
      data-intro-dark={branch === "consulting" && pathname === "/"}
      onAnimationEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.animationName === "intro-open"
        )
          complete.current();
      }}
    >
      <div className="intro-family">
        {branches.map((key, index) => {
          const logo = introLogos[key];
          return (
            <div
              key={key}
              data-selected={key === branch}
              className="intro-identity"
              style={
                {
                  "--identity-offset": 1 - index,
                  "--identity-outward": index - 1,
                } as CSSProperties
              }
            >
              {logo && (
                <Image
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  loading="eager"
                  className="intro-monogram"
                />
              )}
              <span className="intro-parent-name">MOTCHI</span>
              <span className="intro-branch-name">
                {key[0].toUpperCase() + key.slice(1)}
              </span>
              <span className="intro-selection-line" />
            </div>
          );
        })}
      </div>
      <p className="intro-family-caption">
        Websites, consulting, and technology support.
      </p>
      <div className="intro-skip-hint">
        <p className="intro-skip-touch">
          <LuMousePointerClick aria-hidden="true" /> Tap anywhere to skip
        </p>
        <p className="intro-skip-keyboard">
          <LuKeyboard aria-hidden="true" /> Press Space or Esc to skip
        </p>
      </div>
    </div>
  );
}
