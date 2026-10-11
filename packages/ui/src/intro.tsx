"use client";
import { sites as family } from "@motchi/config/sites";
import { type Branch, introLogos } from "@motchi/brand";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const branches: Branch[] = ["solutions", "websites", "consulting"];
export function Introduction({ branch }: { branch: Branch }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      performance.now() > 3500
    )
      return;
    try {
      if (sessionStorage.getItem("motchi-introduced")) return;
      sessionStorage.setItem("motchi-introduced", "yes");
    } catch {
      return;
    }
    setPlay(true);
  }, []);
  useEffect(() => {
    if (!play) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => setPlay(false);
    if (preference.matches) {
      stop();
      return;
    }
    // CSS owns the choreography; JS only bounds its lifetime and respects intent.
    const timeout = window.setTimeout(stop, 1600);
    preference.addEventListener("change", stop);
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("keydown", stop, { once: true });
    window.addEventListener("scroll", stop, { once: true, passive: true });
    return () => {
      window.clearTimeout(timeout);
      preference.removeEventListener("change", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("scroll", stop);
    };
  }, [play]);
  if (!play) return null;
  return (
    <div
      aria-hidden="true"
      className="intro-experience"
      data-intro-branch={branch}
    >
      <div className="intro-family">
        {branches.map((key, index) => {
          const logo = introLogos[key];
          return (
            <div
              key={key}
              data-selected={key === branch}
              className="intro-identity"
              style={{ "--identity-offset": 1 - index } as CSSProperties}
            >
              {logo ? (
                <Image
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="mx-auto h-12 w-auto object-contain sm:h-20"
                />
              ) : (
                <span className="block text-h3 font-semibold tracking-tight sm:text-h2">
                  Motchi<span className="text-primary">.</span>
                </span>
              )}
              <span className="mt-3 block text-caption font-semibold sm:text-small">
                {family[key].name.replace("Motchi ", "")}
              </span>
              <span className="intro-selection-line" />
            </div>
          );
        })}
      </div>
      <p className="intro-family-caption">One Family. A Shared Approach.</p>
    </div>
  );
}
