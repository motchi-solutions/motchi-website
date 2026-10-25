"use client";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { LuPanelsTopLeft, LuSparkles } from "react-icons/lu";
import { productSketches } from "@/content/product-concepts";
import styles from "./products-hero.module.css";

export function ProductAlbum({
  name,
  active,
  buttonRef,
  onClose,
  onNavigate,
  onBrowse,
}: {
  name: string;
  active: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate: (direction: number) => void;
  onBrowse: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [used, setUsed] = useState(false);
  const [turn, setTurn] = useState(0);
  const page = useRef<HTMLSpanElement>(null);
  const leaving = useRef<Animation | null>(null);
  const looseCard = useRef<HTMLElement | null>(null);
  const browsing = useRef(false);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    dx: number;
    moving: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const settling = useRef<Animation | null>(null);
  useEffect(
    () => () => {
      leaving.current?.cancel();
      settling.current?.cancel();
      looseCard.current?.remove();
    },
    [],
  );
  const sketches = productSketches[name] ?? [];
  const count = sketches.length;
  const sketch = sketches[index];
  const title =
    sketch?.title ??
    (name === "Pop Tips" ? "First designs coming soon" : "More to share soon");
  const next = async (direction = 1, advance = 1) => {
    if (browsing.current || count < 2) return;
    browsing.current = true;
    setUsed(true);
    onBrowse();
    settling.current?.cancel();
    if (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      page.current
    ) {
      const card = page.current.cloneNode(true) as HTMLElement;
      card.setAttribute("aria-hidden", "true");
      card.inert = true;
      card.classList.add(styles.looseCard);
      card.style.animation = "none";
      card.style.transform = getComputedStyle(page.current).transform;
      page.current.parentElement?.parentElement?.append(card);
      looseCard.current = card;
      const distance = page.current.clientWidth * 1.12 * direction;
      setIndex((value) => (value + advance + count) % count);
      setTurn((value) => value + 1);
      leaving.current = card.animate(
        [
          { transform: card.style.transform },
          {
            transform: `translateX(${distance}px) translateY(-4px) rotate(${5 * direction}deg)`,
          },
        ],
        { duration: 650, easing: "ease-in-out", fill: "forwards" },
      );
      try {
        await leaving.current.finished;
        // Change depth only after the card has cleared the stack.
        card.style.zIndex = "0";
        leaving.current = card.animate(
          [
            {
              transform: `translateX(${distance}px) translateY(-4px) rotate(${5 * direction}deg)`,
            },
            {
              transform: "translateX(0) translateY(8px) scaleX(0.96) rotate(0)",
            },
          ],
          { duration: 650, easing: "ease-in-out", fill: "forwards" },
        );
        await leaving.current.finished;
      } catch {
        // Cancellation on unmount still removes the temporary card below.
      }
      card.remove();
      looseCard.current = null;
    } else {
      setIndex((value) => (value + advance + count) % count);
      setTurn((value) => value + 1);
    }
    browsing.current = false;
  };
  const restore = () => {
    const node = page.current;
    if (!node) return;
    const transform = getComputedStyle(node).transform;
    node.style.removeProperty("transform");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    settling.current = node.animate([{ transform }, { transform: "none" }], {
      duration: 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };
  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0 || browsing.current) return;
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      moving: false,
    };
  };
  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current;
    const node = page.current;
    if (!start || start.id !== event.pointerId || !node) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.moving) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        suppressClick.current = true;
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
      if (Math.abs(dx) < 8) return;
      start.moving = true;
      settling.current?.cancel();
      node.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    }
    start.dx = dx;
    suppressClick.current = true;
    event.preventDefault();
    node.style.transform = `translateX(${dx}px) rotate(${Math.max(-10, Math.min(10, dx / 24))}deg)`;
  };
  const endDrag = (
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== event.pointerId || !start.moving) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (
      !cancelled &&
      Math.abs(start.dx) >=
        Math.min(64, (page.current?.clientWidth ?? 240) * 0.25)
    ) {
      void next(start.dx < 0 ? -1 : 1, start.dx < 0 ? 1 : -1);
    } else restore();
  };
  if (!count) {
    return (
      <div className={styles.staticPreview} data-product-static="">
        <LuSparkles aria-hidden="true" />
        <p className={styles.staticTitle}>Good things are taking shape.</p>
        <p>Made for our community. More to come.</p>
      </div>
    );
  }
  return (
    <div className={styles.album} data-active={active} data-used={used}>
      <div className={styles.albumNudge}>
        <button
          ref={buttonRef}
          type="button"
          data-product-album=""
          className={styles.albumButton}
          disabled={!active || count < 2}
          aria-describedby={active ? "product-browse-hint" : undefined}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={(event) => endDrag(event)}
          onPointerCancel={(event) => endDrag(event, true)}
          onLostPointerCapture={(event) => {
            // Touch initially captures the image. Its capture transfer bubbles
            // through this button and must not cancel the new button capture.
            if (event.target === event.currentTarget) endDrag(event, true);
          }}
          onClick={(event) => {
            if (suppressClick.current && event.detail > 0) {
              suppressClick.current = false;
              return;
            }
            void next();
          }}
          onKeyDown={(event) => {
            if (
              !event.altKey &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey &&
              (event.key === "ArrowLeft" || event.key === "ArrowRight")
            ) {
              event.preventDefault();
              onNavigate(event.key === "ArrowRight" ? 1 : -1);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              onClose();
            }
          }}
          aria-label={
            count > 1
              ? `Next preview. ${index + 1} of ${count}: ${title}`
              : title
          }
        >
          <span
            ref={page}
            key={`${index}-${turn}`}
            className={styles.albumPage}
            data-tone={sketch?.tone}
          >
            <span className={styles.albumArt}>
              {sketch ? (
                <Image
                  src={sketch.src}
                  width={sketch.width}
                  height={sketch.height}
                  alt={sketch.alt}
                  sizes="(max-width: 767px) 180px, 240px"
                  draggable={false}
                />
              ) : (
                <LuPanelsTopLeft
                  className={styles.albumPlaceholder}
                  aria-hidden="true"
                />
              )}
            </span>
            <span className={styles.albumCaption}>{title}</span>
          </span>
        </button>
      </div>
      {count > 1 && (
        <span className={styles.albumCount} aria-live="polite">
          {index + 1} / {count}
        </span>
      )}
    </div>
  );
}
