"use client";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import {
  LuCircleHelp,
  LuArrowLeft,
  LuArrowRight,
  LuMousePointerClick,
} from "react-icons/lu";
import { ButtonLink, Container, Eyebrow } from "@motchi/ui/primitives";
import { products } from "@/content/products";
import { ProductAlbum } from "./product-album";
import { productGateTiming, useProductGate } from "./use-product-gate";
import styles from "./products-hero.module.css";
import hero from "./exploration-hero.module.css";

export function ProductsHero() {
  const [selected, setSelected] = useState(0);
  const [opened, setOpened] = useState(false);
  const [albumVisible, setAlbumVisible] = useState(false);
  const [albumUsed, setAlbumUsed] = useState(false);
  const display = useRef<HTMLDivElement>(null);
  const carouselSlide = useRef<HTMLDivElement>(null);
  const albumReset = useRef<(() => void) | null>(null);
  const productExit = useRef<Animation | null>(null);
  const productTransition = useRef<Animation | null>(null);
  const outgoingGate = useRef<HTMLElement | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const albumButton = useRef<HTMLButtonElement>(null);
  const selector = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(false);
  const { gate, reset, moveGate, refreshHover } = useProductGate(selected);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const product = products[selected];
  useEffect(() => {
    if (opened) {
      setAlbumVisible(true);
      return;
    }
    const timer = window.setTimeout(
      () => setAlbumVisible(false),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : productGateTiming.close,
    );
    return () => window.clearTimeout(timer);
  }, [opened]);
  useEffect(
    () => () => {
      productTransition.current?.cancel();
      productExit.current?.cancel();
      outgoingGate.current?.remove();
    },
    [],
  );
  useEffect(() => {
    if (opened) {
      const target =
        albumButton.current && !albumButton.current.disabled
          ? albumButton.current
          : back.current;
      target?.focus({ preventScroll: true });
    } else if (previousOpen.current)
      trigger.current?.focus({ preventScroll: true });
    previousOpen.current = opened;
  }, [opened]);
  const resetTilt = () => {
    display.current?.style.setProperty("--tilt-x", "0deg");
    display.current?.style.setProperty("--tilt-y", "0deg");
  };
  const choose = (index: number, direction = index > selected ? 1 : -1) => {
    if (index === selected) return;
    setAlbumUsed(false);
    albumReset.current?.();
    productTransition.current?.cancel();
    productExit.current?.cancel();
    outgoingGate.current?.remove();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const node = carouselSlide.current;
      if (!node) return;
      const distance = node.parentElement?.clientWidth ?? node.clientWidth;
      const outgoing = node.cloneNode(true) as HTMLElement;
      const originals = node.querySelectorAll<HTMLElement>("*");
      const copies = outgoing.querySelectorAll<HTMLElement>("*");
      originals.forEach((original, position) => {
        const computed = getComputedStyle(original);
        copies[position].style.transform = computed.transform;
        copies[position].style.opacity = computed.opacity;
        copies[position].style.animation = "none";
        copies[position].style.transition = "none";
      });
      outgoing.style.setProperty(
        "--spotlight-color",
        getComputedStyle(node).getPropertyValue("--spotlight-color"),
      );
      outgoing.inert = true;
      outgoing.setAttribute("aria-hidden", "true");
      outgoing.querySelectorAll("[id]").forEach((item) => {
        item.removeAttribute("id");
      });
      node.parentElement?.append(outgoing);
      outgoingGate.current = outgoing;
      const timing = {
        duration: 950,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      };
      const exit = outgoing.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(${-direction * distance}px)` },
        ],
        { ...timing, fill: "forwards" },
      );
      productExit.current = exit;
      exit.onfinish = () => outgoing.remove();
      const arrival = node.animate(
        [
          { transform: `translateX(${direction * distance}px)` },
          { transform: "translateX(0)" },
        ],
        timing,
      );
      productTransition.current = arrival;
      arrival.onfinish = () => {
        if (productTransition.current === arrival) refreshHover.current();
      };
    }
    resetTilt();
    reset.current();
    previousOpen.current = false;
    setOpened(false);
    setAlbumVisible(false);
    setSelected(index);
  };
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons) {
      resetTilt();
      return;
    }
    if (
      !product.logo ||
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(hover: hover) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const node = display.current;
    if (!node) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    );
    node.style.setProperty("--tilt-x", `${-y * 3}deg`);
    node.style.setProperty("--tilt-y", `${x * 4}deg`);
  };
  const navigateProduct = (direction: number, from = selected) => {
    const next = (from + direction + products.length) % products.length;
    choose(next, direction);
    selector.current
      ?.querySelectorAll("button")
      [next]?.focus({ preventScroll: true });
  };
  const arrowNavigation = (
    event: KeyboardEvent<HTMLButtonElement>,
    from = selected,
  ) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home" || event.key === "End") {
      const next = event.key === "Home" ? 0 : products.length - 1;
      choose(next);
      selector.current
        ?.querySelectorAll("button")
        [next]?.focus({ preventScroll: true });
    } else navigateProduct(event.key === "ArrowRight" ? 1 : -1, from);
  };
  const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
    suppressClick.current = false;
    gesture.current = null;
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      !(event.target instanceof Element)
    )
      return;
    if (
      !event.target.closest("[data-product-swipe]") ||
      event.target.closest(
        "[data-product-album], [data-gate-action=close], [data-product-navigation], a",
      )
    )
      return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };
  const moveSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5)
      event.currentTarget.setPointerCapture(event.pointerId);
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (Math.abs(dx) < 64 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
    suppressClick.current = true;
    const next =
      (selected + (dx < 0 ? 1 : -1) + products.length) % products.length;
    choose(next, dx < 0 ? 1 : -1);
    selector.current
      ?.querySelectorAll("button")
      [next]?.focus({ preventScroll: true });
  };
  return (
    <section className={`${styles.hero} ${hero.hero} border-b border-border`}>
      <Container>
        <div className={`${styles.layout} ${hero.frame}`}>
          <header className={`page-introduction ${hero.introduction}`}>
            <Eyebrow>Motchi Products</Eyebrow>
            <h1 className="text-h2 font-medium tracking-tight">
              A Look at What's Next
            </h1>
            <p className="mt-3 max-w-reading leading-relaxed text-muted">
              We're making room for ideas that could bring a little fun to
              everyday life or do something useful for our community. These are
              projects we're excited to share with you as they take shape.
            </p>
          </header>

          <div
            className={styles.showcase}
            onPointerDownCapture={startSwipe}
            onPointerMoveCapture={moveSwipe}
            onPointerUpCapture={finishSwipe}
            onPointerCancel={() => {
              gesture.current = null;
            }}
            onClickCapture={(event) => {
              if (suppressClick.current) {
                suppressClick.current = false;
                if (event.detail > 0) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }}
          >
            <div
              role="tablist"
              aria-label="Choose a product to explore"
              ref={selector}
              className={styles.selector}
              data-entry-reveal=""
              data-product-swipe=""
            >
              {products.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  id={`product-tab-${index}`}
                  tabIndex={selected === index ? 0 : -1}
                  aria-selected={selected === index}
                  aria-controls="product-spotlight"
                  onKeyDown={(event) => arrowNavigation(event, index)}
                  onClick={() => choose(index)}
                >
                  <span className={styles.number} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <p className={styles.swipeHint}>
              Swipe left or right on the gate to explore another product.
            </p>
            <div
              id="product-spotlight"
              role="tabpanel"
              aria-labelledby={`product-tab-${selected}`}
              className={styles.spotlight}
            >
              <div className={styles.copy} data-entry-reveal="">
                <div
                  key={product.name}
                  className={styles.copyReveal}
                  data-active="true"
                >
                  <div className={styles.productHeading}>
                    <h2 className="text-h2 font-medium tracking-tight">
                      {product.name}
                    </h2>
                    <p className={styles.status}>
                      <span aria-hidden="true" />
                      {product.status}
                    </p>
                  </div>
                  <p className="mt-4 max-w-lg leading-relaxed text-muted">
                    {product.description}
                  </p>
                </div>
              </div>
              <div
                className={styles.stage}
                data-entry-reveal=""
                data-product={selected}
                data-open={opened}
                data-product-swipe=""
                onPointerMove={tilt}
                onPointerLeave={resetTilt}
                onPointerCancel={resetTilt}
              >
                <button
                  type="button"
                  className={`${styles.productArrow} ${styles.previousProduct}`}
                  data-product-navigation=""
                  aria-label="Previous product"
                  onKeyDown={arrowNavigation}
                  aria-controls="product-spotlight"
                  onClick={() =>
                    choose(
                      (selected - 1 + products.length) % products.length,
                      -1,
                    )
                  }
                >
                  <LuArrowLeft
                    className="interaction-arrow"
                    data-direction="left"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className={`${styles.productArrow} ${styles.nextProduct}`}
                  data-product-navigation=""
                  aria-label="Next product"
                  onKeyDown={arrowNavigation}
                  aria-controls="product-spotlight"
                  onClick={() => choose((selected + 1) % products.length, 1)}
                >
                  <LuArrowRight
                    className="interaction-arrow"
                    data-direction="right"
                    aria-hidden="true"
                  />
                </button>
                <div ref={carouselSlide} className={styles.carouselSlide}>
                  <div className={styles.arch} aria-hidden="true" />
                  <div
                    ref={display}
                    id="product-album"
                    className={styles.display}
                    data-open={opened || albumVisible}
                    hidden={!opened && !albumVisible}
                    inert={!opened}
                    aria-hidden={!opened}
                  >
                    <ProductAlbum
                      resetRef={albumReset}
                      key={product.name}
                      name={product.name}
                      active={opened}
                      onBrowse={() => setAlbumUsed(true)}
                      buttonRef={albumButton}
                      onNavigate={navigateProduct}
                      onClose={() => {
                        moveGate.current(0);
                        setOpened(false);
                      }}
                    />
                  </div>
                  <div ref={gate} className={styles.gate} data-open={opened}>
                    <span className={styles.gateLeft} aria-hidden="true">
                      <span className={styles.doorContent}>
                        {product.logo ? (
                          <Image
                            src={product.logo.src}
                            alt=""
                            width={product.logo.width}
                            height={product.logo.height}
                            sizes="(max-width: 767px) 120px, 160px"
                            priority
                            draggable={false}
                            className={styles.doorLogo}
                          />
                        ) : (
                          <LuCircleHelp className={styles.doorIcon} />
                        )}
                      </span>
                      <span className={styles.gateHandle} />
                    </span>
                    <span className={styles.gateRight} aria-hidden="true">
                      <span className={styles.doorContent}>
                        <span className={styles.doorTitle}>{product.name}</span>
                        <span className={styles.doorStatus}>
                          {product.status}
                        </span>
                      </span>
                      <span className={styles.gateHandle} />
                    </span>
                    <button
                      ref={trigger}
                      type="button"
                      hidden={opened}
                      data-gate-action="open"
                      className={styles.gateTrigger}
                      aria-expanded={opened}
                      aria-controls="product-album"
                      aria-label={`Open ${product.name} preview`}
                      onKeyDown={arrowNavigation}
                      onClick={() => {
                        resetTilt();
                        moveGate.current(78);
                        setOpened(true);
                      }}
                    >
                      <span className={styles.gateHint}>
                        <LuMousePointerClick aria-hidden="true" />
                        <span>Click to see what's inside</span>
                      </span>
                    </button>
                    <button
                      ref={back}
                      type="button"
                      hidden={!opened}
                      data-gate-action="close"
                      className={styles.gateBack}
                      onKeyDown={(event) => {
                        arrowNavigation(event);
                        if (event.key === "Escape") {
                          event.preventDefault();
                          moveGate.current(0);
                          setOpened(false);
                        }
                      }}
                      onClick={() => {
                        resetTilt();
                        moveGate.current(0);
                        setOpened(false);
                      }}
                    >
                      <LuArrowLeft
                        className="interaction-arrow"
                        data-direction="left"
                        aria-hidden="true"
                      />
                      <span>Back to gate</span>
                    </button>
                  </div>
                  <div className={styles.platform} aria-hidden="true" />
                  <div className={styles.floor} aria-hidden="true" />
                </div>
                <p
                  id="product-browse-hint"
                  className={styles.previewHint}
                  hidden={!opened || albumUsed || !product.logo}
                >
                  <LuMousePointerClick aria-hidden="true" />
                  <span className={styles.tapHint}>Tap or swipe to browse</span>
                  <span className={styles.clickHint}>
                    Click or drag to browse
                  </span>
                </p>
              </div>
              <div className={styles.productActions} data-entry-reveal="">
                <div key={product.name} className={styles.copyReveal}>
                  <ButtonLink href="/contact?topic=Products">
                    {product.logo
                      ? `Ask About ${product.name}`
                      : "Ask About Our Products"}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <noscript>
          <div className={styles.fallback}>
            <h2 className="text-h3 font-semibold">{products[1].name}</h2>
            <p className="mt-3 text-muted">{products[1].description}</p>
            <p className="mt-2 text-sm text-muted">{products[1].status}</p>
            <ButtonLink
              href="/contact?topic=Products"
              className="content-action"
            >
              Ask About Our Products
            </ButtonLink>
          </div>
        </noscript>
      </Container>
    </section>
  );
}
