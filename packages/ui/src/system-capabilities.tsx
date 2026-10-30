"use client";

import { motionMilliseconds } from "./motion-timing";
import { capabilityContent } from "./capability-content";
import { ButtonLink } from "./primitives";
import Image from "next/image";
import { logos } from "@motchi/brand";
import {
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LuChevronRight,
  LuMinus,
  LuWorkflow,
  LuLightbulb,
  LuArrowLeft,
  LuDatabase,
  LuCloud,
  LuBrainCircuit,
  LuPanelsTopLeft,
} from "react-icons/lu";

const icons = [
  LuPanelsTopLeft,
  LuBrainCircuit,
  LuDatabase,
  LuCloud,
  LuWorkflow,
];
const capabilities = capabilityContent.map((item, index) => ({
  ...item,
  icon: icons[index],
}));

type SelectionLayout = {
  rectangles: Map<number, DOMRect>;
  detailHeight: number;
  stacked: boolean;
};

function cancelAnimations(animations: Map<Element, Animation>) {
  for (const animation of animations.values()) animation.cancel();
  animations.clear();
}

export function SystemCapabilities() {
  const id = useId();
  const toolkit = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const detailPanel = useRef<HTMLElement>(null);
  const layout = useRef<SelectionLayout | null>(null);
  const movements = useRef(new Map<Element, Animation>());
  const restoreFocus = useRef<HTMLElement | null>(null);
  const [stacked, setStacked] = useState(false);
  const [changing, setChanging] = useState(false);
  const [overviewHeight, setOverviewHeight] = useState<number>();
  const [entering, setEntering] = useState<{
    index: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);
  const [returning, setReturning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [shownSelection, setShownSelection] = useState<number | null>(null);
  const fadeOpacity = useRef("1");
  const fadeOwner = useRef<number | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  useLayoutEffect(() => {
    if (!stacked || selected === null || shownSelection === null) {
      setShownSelection(selected);
      fadeOpacity.current = "1";
      fadeOwner.current = selected;
      return;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) {
      setShownSelection(selected);
      return;
    }
    const content = detailPanel.current?.querySelector<HTMLElement>(
      '.capability-detail-reveal[data-active="true"]',
    );
    if (!content || !changing) return;
    const leaving = shownSelection !== selected;
    const opacity =
      fadeOwner.current === shownSelection ? fadeOpacity.current : "0";
    fadeOwner.current = shownSelection;
    const animation = content.animate(
      leaving ? [{ opacity }, { opacity: 0 }] : [{ opacity }, { opacity: 1 }],
      {
        duration: leaving ? 180 : 360,
        easing: "ease-in-out",
        fill: "both",
      },
    );
    animation.onfinish = () => {
      if (leaving) setShownSelection(selected);
    };
    const reduce = () => {
      if (preference.matches) animation.finish();
    };
    preference.addEventListener("change", reduce);
    return () => {
      fadeOpacity.current = getComputedStyle(content).opacity;
      animation.cancel();
      preference.removeEventListener("change", reduce);
    };
  }, [selected, shownSelection, stacked, changing]);
  useEffect(() => {
    setEnhanced(true);
  }, []);
  useEffect(() => {
    if (!entering) return;
    const finish = () => {
      setSelected(entering.index);
      setEntering(null);
    };
    // Finish even if an animation is interrupted by a resize or preference change.
    const duration = motionMilliseconds(
      toolkit.current
        ? getComputedStyle(toolkit.current).getPropertyValue("--motion-toolkit")
        : "",
      800,
    );
    const timeout = window.setTimeout(finish, duration + 80);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", finish);
    window.addEventListener("resize", finish);
    return () => {
      window.clearTimeout(timeout);
      preference.removeEventListener("change", finish);
      window.removeEventListener("resize", finish);
    };
  }, [entering]);
  useEffect(() => {
    if (!returning) return;
    const previous = selected;
    const finish = () => {
      setSelected(null);
      setReturning(false);
      requestAnimationFrame(() =>
        document
          .getElementById(`${id}-${previous}`)
          ?.focus({ preventScroll: true }),
      );
    };
    const timer = window.setTimeout(finish, 180);
    return () => window.clearTimeout(timer);
  }, [returning, selected, id]);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let width = node.clientWidth;
    let stackedLayout = false;
    const updateLayout = () => {
      const next =
        getComputedStyle(node)
          .getPropertyValue("--capability-layout")
          .trim() !== "rail";
      if (next === stackedLayout) return false;
      stackedLayout = next;
      if (
        document.activeElement instanceof HTMLElement &&
        node.contains(document.activeElement)
      )
        restoreFocus.current = document.activeElement;
      setStacked(next);
      return true;
    };
    updateLayout();
    const observer = new ResizeObserver(() => {
      const layoutChanged = updateLayout();
      if (node.clientWidth === width && !layoutChanged) return;
      width = node.clientWidth;
      cancelAnimations(movements.current);
      // A changed container width gets its natural responsive layout again.
      setOverviewHeight(undefined);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || (selected === null && !entering)) return;
      event.preventDefault();
      const previous = entering?.index ?? selected;
      setEntering(null);
      setReturning(false);
      setSelected(null);
      requestAnimationFrame(() =>
        document
          .getElementById(`${id}-${previous}`)
          ?.focus({ preventScroll: true }),
      );
    };
    node.addEventListener("keydown", onEscape);
    return () => node.removeEventListener("keydown", onEscape);
  }, [entering, selected, id]);
  useEffect(() => {
    const animations = movements.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => {
      if (preference.matches) cancelAnimations(animations);
    };
    preference.addEventListener("change", reduce);
    return () => {
      preference.removeEventListener("change", reduce);
      cancelAnimations(animations);
    };
  }, []);
  useLayoutEffect(() => {
    const before = layout.current;
    layout.current = null;
    const focused = restoreFocus.current;
    restoreFocus.current = null;
    if (focused?.isConnected && document.activeElement !== focused)
      focused.focus({ preventScroll: true });
    if (selected === null) {
      cancelAnimations(movements.current);
      return;
    }
    if (
      !before ||
      before.stacked !== stacked ||
      stacked ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const animations = movements.current;
    const animate = (
      element: Element,
      frames: Keyframe[],
      duration: number,
    ) => {
      const animation = element.animate(frames, {
        duration,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      });
      animations.set(element, animation);
      animation.onfinish = () => {
        if (animations.get(element) === animation) animations.delete(element);
      };
    };
    // Read every destination before writing animation styles.
    const items = [
      ...(root.current?.querySelectorAll<HTMLElement>(".system-node") ?? []),
    ].map((element) => ({
      element,
      after: element.getBoundingClientRect(),
      before: before.rectangles.get(Number(element.dataset.capabilityIndex)),
    }));
    const panel = detailPanel.current;
    const afterHeight = panel?.getBoundingClientRect().height;
    for (const item of items) {
      if (!item.before) continue;
      const x = item.before.left - item.after.left;
      const y = item.before.top - item.after.top;
      if (
        Math.abs(x) < 0.5 &&
        Math.abs(y) < 0.5 &&
        Math.abs(item.before.width - item.after.width) < 0.5
      )
        continue;
      // Move the stable flex slots, resizing only their controls so wrapping
      // is calculated once and labels are never stretched by a scale transform.
      animate(
        item.element,
        [
          { transform: `translate(${x}px, ${y}px)` },
          { transform: "translate(0, 0)" },
        ],
        480,
      );
      const control = item.element.querySelector("button");
      if (control && Math.abs(item.before.width - item.after.width) > 0.5)
        animate(
          control,
          [
            { width: `${item.before.width}px` },
            { width: `${item.after.width}px` },
          ],
          480,
        );
    }
    if (
      panel &&
      afterHeight !== undefined &&
      Math.abs(before.detailHeight - afterHeight) > 0.5
    )
      animate(
        panel,
        [
          { height: `${before.detailHeight}px` },
          { height: `${afterHeight}px` },
        ],
        420,
      );
  }, [selected, stacked]);
  const changeSelection = (index: number) => {
    const isChange = selected !== null && selected !== index;
    if (isChange && root.current) {
      const rectangles = new Map<number, DOMRect>();
      for (const node of root.current.querySelectorAll<HTMLElement>(
        ".system-node",
      ))
        rectangles.set(
          Number(node.dataset.capabilityIndex),
          node.getBoundingClientRect(),
        );
      layout.current = {
        rectangles,
        detailHeight: detailPanel.current?.getBoundingClientRect().height ?? 0,
        stacked,
      };
      // Capture the displayed geometry before cancelling an interrupted transition.
      cancelAnimations(movements.current);
    } else layout.current = null;
    restoreFocus.current =
      document.activeElement instanceof HTMLElement &&
      root.current?.contains(document.activeElement)
        ? document.activeElement
        : null;
    setChanging(isChange);
    setSelected(index);
  };
  const returnToOverview = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const previous = selected;
      setSelected(null);
      requestAnimationFrame(() =>
        document
          .getElementById(`${id}-${previous}`)
          ?.focus({ preventScroll: true }),
      );
    } else setReturning(true);
  };
  const detail = enhanced ? (
    <section
      ref={detailPanel}
      data-changing={changing}
      onFocusCapture={() => {
        const panel = detailPanel.current;
        const content = panel?.querySelector(
          '.capability-detail-reveal[data-active="true"]',
        );
        for (const animation of [
          ...(panel?.getAnimations() ?? []),
          ...(content?.getAnimations() ?? []),
        ])
          animation.finish();
      }}
      hidden={selected === null}
      id={`${id}-detail`}
      aria-labelledby={
        selected === null
          ? undefined
          : `${id}-${stacked ? shownSelection : selected}`
      }
      aria-label={selected === null ? "Explore the toolkit" : undefined}
      className="system-capability-detail"
    >
      <button
        type="button"
        className="capability-return"
        onClick={returnToOverview}
      >
        <LuArrowLeft
          aria-hidden="true"
          className="interaction-arrow"
          data-direction="left"
        />
        <span>Back to all areas</span>
      </button>
      {capabilities.map((capability, index) => (
        <div
          key={capability.name}
          className="capability-detail-reveal"
          data-active={index === (stacked ? shownSelection : selected)}
          aria-hidden={
            index !== selected || (stacked && index !== shownSelection)
          }
          inert={index !== selected || (stacked && index !== shownSelection)}
          data-changing={changing}
        >
          <h2 className="text-h3 font-medium">{capability.heading}</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {capability.detail}
          </p>
          <ul className="capability-scope mt-4 grid gap-2 text-small leading-relaxed text-muted">
            {capability.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ButtonLink
            href={`/contact?topic=${encodeURIComponent(capability.name)}`}
            className="content-action"
          >
            {capability.action}
          </ButtonLink>
        </div>
      ))}
    </section>
  ) : null;
  const optionOrder = capabilities.map((_, index) => index);
  return (
    <div
      ref={root}
      style={{ minHeight: selected === null ? overviewHeight : 0 }}
      className="system-capabilities"
      data-enhanced={enhanced}
      data-exploring={selected !== null}
      data-entering={entering !== null}
      data-returning={returning}
      aria-busy={entering !== null}
    >
      {enhanced && (
        <p
          className="capability-instruction"
          data-dismissed={selected !== null || entering !== null}
          aria-hidden={selected !== null || entering !== null}
        >
          <LuLightbulb aria-hidden="true" />
          <span>Select an area to see how we can help.</span>
        </p>
      )}
      <div
        ref={toolkit}
        className="system-toolkit"
        style={
          entering
            ? ({
                transformOrigin: `${entering.x}px ${entering.y}px`,
                "--zoom-x": `${entering.dx}px`,
                "--zoom-y": `${entering.dy}px`,
              } as CSSProperties)
            : undefined
        }
        onAnimationEnd={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.animationName !== "capability-enter-area" ||
            !entering
          )
            return;
          setSelected(entering.index);
          setEntering(null);
        }}
      >
        <svg
          className="toolkit-paths"
          viewBox="0 0 500 420"
          fill="none"
          aria-hidden="true"
        >
          {[
            "M250 210Q100 80 80 120",
            "M250 210Q350 150 340 45",
            "M250 210Q330 290 425 175",
            "M250 210Q160 320 115 320",
            "M250 210Q310 340 360 335",
          ].map((path, index) => (
            <path
              key={path}
              d={path}
              pathLength="1"
              data-active={selected === index}
            />
          ))}
          <path
            className="toolkit-orbit"
            d="M45 230Q20 35 265 20M455 255Q430 410 230 395"
          />
          <circle cx="265" cy="20" r="3" />
          <circle cx="230" cy="395" r="4" />
        </svg>
        <div className="toolkit-anchor">
          {logos.solutions && (
            <Image
              src={logos.solutions.src}
              width={logos.solutions.width}
              height={logos.solutions.height}
              alt=""
              className="h-16 w-16"
            />
          )}
          <span className="font-semibold tracking-wide">MOTCHI</span>
          <span className="text-xs text-muted">How We Can Help</span>
        </div>
        <ul className="system-nodes" aria-label="Technology options">
          {optionOrder.map((index) => {
            const { name, detail, icon: Icon } = capabilities[index];
            const Cue = selected === index ? LuMinus : LuChevronRight;
            return (
              <li
                key={name}
                className="system-node"
                data-capability-index={index}
                data-selected={(entering?.index ?? selected) === index}
              >
                {enhanced ? (
                  <button
                    type="button"
                    id={`${id}-${index}`}
                    aria-expanded={selected === index}
                    aria-controls={`${id}-detail`}
                    onClick={(event) => {
                      if (returning) {
                        setReturning(false);
                        changeSelection(index);
                        return;
                      }
                      if (entering) {
                        setEntering(null);
                        changeSelection(index);
                        return;
                      }
                      if (selected === index) {
                        returnToOverview();
                        return;
                      }
                      if (selected === null) setChanging(false);
                      if (selected === null && root.current)
                        setOverviewHeight(
                          root.current.getBoundingClientRect().height,
                        );
                      const canZoom =
                        selected === null &&
                        !window.matchMedia("(prefers-reduced-motion: reduce)")
                          .matches;
                      const scene = toolkit.current;
                      const option = event.currentTarget.parentElement;
                      if (canZoom && scene && option) {
                        if (document.activeElement === event.currentTarget)
                          restoreFocus.current = event.currentTarget;
                        // Use layout coordinates: hover transforms must not shift the zoom target.
                        const x = option.offsetLeft + option.offsetWidth / 2;
                        const y = option.offsetTop + option.offsetHeight / 2;
                        setEntering({
                          index,
                          x,
                          y,
                          dx: scene.clientWidth / 2 - x,
                          dy: scene.clientHeight / 2 - y,
                        });
                      } else {
                        changeSelection(index);
                      }
                    }}
                    className="system-node-control"
                  >
                    <Icon aria-hidden="true" />
                    <span>{name}</span>
                    <Cue
                      aria-hidden="true"
                      data-cue={selected === index ? "collapse" : "open"}
                      className="system-node-cue"
                    />
                  </button>
                ) : (
                  <div className="system-node-control">
                    <Icon aria-hidden="true" />
                    <span>{name}</span>
                  </div>
                )}
                {!enhanced && (
                  <p className="system-fallback-detail">{detail}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {detail}
    </div>
  );
}
