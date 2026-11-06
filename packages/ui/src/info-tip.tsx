"use client";
import { useState, type ReactNode } from "react";
import { LuInfo } from "react-icons/lu";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";

export function InfoTip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 12 }),
      shift({ padding: 12, crossAxis: true }),
      size({
        padding: 12,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(0, Math.min(288, availableWidth))}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
  });
  const hover = useHover(context, {
    mouseOnly: true,
    move: false,
    handleClose: safePolygon(),
    delay: { open: 100, close: 100 },
  });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 300,
    initial: { opacity: 0, transform: "translateY(4px)" },
    open: { opacity: 1, transform: "translateY(0)" },
    close: { opacity: 0, transform: "translateY(4px)" },
  });
  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className="info-tip-trigger"
        aria-label={`More information about ${label}`}
        {...getReferenceProps()}
      >
        <LuInfo size={18} aria-hidden="true" />
      </button>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="info-tip-positioner"
            style={{
              ...floatingStyles,
              // Positioning resets on close; keep the last position visible for the exit fade.
              visibility: isPositioned || !open ? "visible" : "hidden",
              pointerEvents: open ? "auto" : "none",
            }}
            aria-hidden={!open}
            {...getFloatingProps()}
          >
            <div
              className="info-tip-content"
              style={{
                ...styles,
                transitionTimingFunction: "var(--ease-hover)",
              }}
            >
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
