"use client";
import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
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
  resetRef,
}: {
  name: string;
  active: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate: (direction: number) => void;
  onBrowse: () => void;
  resetRef: RefObject<(() => void) | null>;
}) {
  const [index, setIndex] = useState(0);
  const [used, setUsed] = useState(false);
  const [turn, setTurn] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(1);
  const preview = useRef<HTMLSpanElement>(null);
  const promotion = useRef<string | null>(null);
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
    offset: number;
    time: number;
    previous: number;
    velocity: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const settling = useRef<Animation | null>(null);
  const generation = useRef(0);
  useEffect(() => {
    const reset = () => {
      generation.current += 1;
      leaving.current?.cancel();
      settling.current?.cancel();
      preview.current?.getAnimations().forEach((animation) => {
        animation.cancel();
      });
      preview.current?.style.removeProperty("transform");
      looseCard.current?.remove();
      looseCard.current = null;
      browsing.current = false;
      promotion.current = null;
      drag.current = null;
      page.current?.style.removeProperty("transform");
      page.current?.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    };
    resetRef.current = reset;
    return () => {
      reset();
      if (resetRef.current === reset) resetRef.current = null;
    };
  }, [resetRef]);
  useEffect(() => {
    if (!active) resetRef.current?.();
  }, [active, resetRef]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (preference.matches) resetRef.current?.();
    };
    preference.addEventListener("change", settle);
    return () => preference.removeEventListener("change", settle);
  }, [resetRef]);
  const sketches = productSketches[name] ?? [];
  const count = sketches.length;
  const sketch = sketches[index];
  const upcoming = sketches[previewIndex % count];
  const previous = sketches[(index - 1 + count) % count];
  const previewTransform = (distance: number) => {
    const progress = Math.min(
      1,
      Math.abs(distance) / ((page.current?.clientWidth ?? 240) * 0.85),
    );
    return `translateY(${4 * (1 - progress)}px) scale(${0.98 + progress * 0.02})`;
  };
  useLayoutEffect(() => {
    if (page.current?.dataset.albumFrame !== `${index}-${turn}`) return;
    const from = promotion.current;
    promotion.current = null;
    if (
      !from ||
      !page.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    settling.current = page.current.animate(
      [{ transform: from }, { transform: "none" }],
      { duration: 520, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
  }, [index, turn]);
  const title =
    sketch?.title ??
    (name === "Pop Tips" ? "First designs coming soon" : "More to share soon");
  const interruptTurn = () => {
    generation.current += 1;
    leaving.current?.cancel();
    looseCard.current?.remove();
    looseCard.current = null;
    browsing.current = false;
  };
  const next = async (direction = 1, advance = 1) => {
    if (count < 2) return;
    if (browsing.current) interruptTurn();
    browsing.current = true;
    const sequence = generation.current;
    setUsed(true);
    onBrowse();
    const presented = page.current
      ? getComputedStyle(page.current).transform
      : "none";
    const nextIndex = (index + advance + count) % count;
    promotion.current = preview.current
      ? getComputedStyle(preview.current).transform
      : null;
    settling.current?.cancel();
    preview.current?.getAnimations().forEach((animation) => {
      animation.cancel();
    });
    preview.current?.style.removeProperty("transform");
    setPreviewIndex((nextIndex + 1) % count);
    if (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      page.current
    ) {
      const card = page.current.cloneNode(true) as HTMLElement;
      card.setAttribute("aria-hidden", "true");
      card.inert = true;
      card.classList.add(styles.looseCard);
      card.style.animation = "none";
      card.style.transform = presented;
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
        {
          duration: 480,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          fill: "forwards",
        },
      );
      try {
        await leaving.current.finished;
        if (sequence !== generation.current || !card.isConnected) return;
        // Change depth only after the card has cleared the stack.
        card.style.zIndex = "0";
        leaving.current = card.animate(
          [
            {
              transform: `translateX(${distance}px) translateY(-4px) rotate(${5 * direction}deg)`,
            },
            {
              offset: 0.2,
              transform: `translateX(${distance * 0.82}px) translateY(-14px) scale(0.99) rotate(${3 * direction}deg)`,
            },
            {
              offset: 0.72,
              transform: `translateX(${-distance * 0.025}px) translateY(9px) scale(0.96) rotate(${-0.6 * direction}deg)`,
            },
            {
              transform: "translateX(0) translateY(8px) scale(0.96) rotate(0)",
            },
          ],
          {
            duration: 760,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards",
          },
        );
        await leaving.current.finished;
      } catch {
        // Cancellation on unmount still removes the temporary card below.
      }
      card.remove();
      if (looseCard.current === card) looseCard.current = null;
    } else {
      setIndex((value) => (value + advance + count) % count);
      setTurn((value) => value + 1);
    }
    if (sequence === generation.current) browsing.current = false;
  };
  const restore = (velocity = 0) => {
    const node = page.current;
    if (!node) return;
    const transform = getComputedStyle(node).transform;
    const distance = new DOMMatrix(transform).m41;
    node.style.removeProperty("transform");
    const rear = preview.current;
    rear?.style.removeProperty("transform");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Critically damped release: retain the drag's position and velocity,
    // then decelerate into the stack without a hard reversal.
    const speed = Math.max(-1200, Math.min(1200, velocity));
    const frames = Array.from({ length: 46 }, (_, step) => {
      const time = (step / 45) * 0.76;
      const x =
        (distance + (speed + 12 * distance) * time) * Math.exp(-12 * time);
      return {
        transform:
          step === 45
            ? "none"
            : `translateX(${x}px) rotate(${Math.max(-10, Math.min(10, x / 24))}deg)`,
      };
    });
    frames[0] = { transform };
    settling.current = node.animate(frames, {
      duration: 760,
      easing: "linear",
    });
    rear?.animate(
      frames.map((frame) => ({
        transform: previewTransform(new DOMMatrix(frame.transform).m41),
      })),
      { duration: 760, easing: "linear" },
    );
  };
  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    if (browsing.current) interruptTurn();
    suppressClick.current = false;
    const node = page.current;
    const transform = node ? getComputedStyle(node).transform : "none";
    const offset = new DOMMatrix(transform).m41;
    settling.current?.cancel();
    node?.getAnimations().forEach((animation) => {
      animation.cancel();
    });
    if (node) node.style.transform = transform;
    const rear = preview.current;
    if (rear) {
      const rearTransform = getComputedStyle(rear).transform;
      rear.getAnimations().forEach((animation) => {
        animation.cancel();
      });
      rear.style.transform = rearTransform;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: offset,
      moving: false,
      offset,
      time: event.timeStamp,
      previous: offset,
      velocity: 0,
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
        restore();
        suppressClick.current = true;
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
      if (Math.abs(dx) < 8) return;
      start.moving = true;
      setUsed(true);
      onBrowse();
      settling.current?.cancel();
      node.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    }
    const distance = start.offset + dx;
    const elapsed = event.timeStamp - start.time;
    if (elapsed > 0) {
      start.velocity = ((distance - start.previous) / elapsed) * 1000;
      start.time = event.timeStamp;
      start.previous = distance;
    }
    start.dx = distance;
    const target = (index + (distance < 0 ? 1 : -1) + count) % count;
    setPreviewIndex(target);
    if (preview.current)
      preview.current.style.transform = previewTransform(distance);
    suppressClick.current = true;
    event.preventDefault();
    node.style.transform = `translateX(${distance}px) rotate(${Math.max(-10, Math.min(10, distance / 24))}deg)`;
  };
  const endDrag = (
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== event.pointerId) return;
    if (!start.moving) {
      if (Math.abs(start.offset) > 0.5) restore();
      return;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (
      !cancelled &&
      Math.abs(start.dx) >=
        Math.min(64, (page.current?.clientWidth ?? 240) * 0.25)
    ) {
      void next(start.dx < 0 ? -1 : 1, start.dx < 0 ? 1 : -1);
    } else restore(event.timeStamp - start.time < 80 ? start.velocity : 0);
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
        {upcoming && (
          <span
            ref={preview}
            className={`${styles.albumPage} ${styles.albumPreview}`}
            data-tone={upcoming.tone}
            data-album-preview=""
            aria-hidden="true"
          >
            <span className={styles.albumArt}>
              <Image
                src={upcoming.src}
                width={upcoming.width}
                height={upcoming.height}
                alt=""
                sizes="(max-width: 1023px) 208px, 280px"
                loading="eager"
                draggable={false}
              />
            </span>
            <span className={styles.albumCaption}>{upcoming.title}</span>
          </span>
        )}
        {count > 2 && previous && (
          <span hidden aria-hidden="true">
            <Image
              src={previous.src}
              width={previous.width}
              height={previous.height}
              alt=""
              sizes="(max-width: 1023px) 208px, 280px"
              loading="eager"
            />
          </span>
        )}
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
            data-album-frame={`${index}-${turn}`}
            className={styles.albumPage}
            data-tone={sketch?.tone}
            data-art-motion={sketch?.motion}
          >
            <span className={styles.albumArt}>
              {sketch ? (
                <Image
                  src={sketch.src}
                  width={sketch.width}
                  height={sketch.height}
                  alt={sketch.alt}
                  sizes="(max-width: 1023px) 208px, 280px"
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
