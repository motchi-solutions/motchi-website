"use client";

import { type ReactNode, useEffect, useId, useState } from "react";

/* Shared question-and-answer disclosures. Panels open with an interruptible
   grid-row transition; collapsed answers are inert so keyboard focus skips
   them. Without JavaScript every answer stays open. */
export function DisclosureList({
  items,
}: {
  items: readonly { title: string; content: ReactNode }[];
}) {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return (
    <div className="grid gap-1 border-t border-border pt-1">
      <noscript>
        <style>
          {"[data-disclosure-panel]{grid-template-rows:1fr!important}"}
        </style>
      </noscript>
      {items.map((item) => (
        <Disclosure key={item.title} title={item.title} enhanced={enhanced}>
          {item.content}
        </Disclosure>
      ))}
    </div>
  );
}

function Disclosure({
  title,
  children,
  enhanced,
}: {
  title: string;
  children: ReactNode;
  enhanced: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const hidden = enhanced && !open;
  return (
    <div
      data-open={open}
      className="group rounded-(--radius-panel) border-b border-border transition-[background-color,border-color,box-shadow] duration-(--motion-hover) ease-(--ease-hover) data-[open=true]:border-transparent data-[open=true]:bg-surface data-[open=true]:shadow-[0_1px_2px_rgb(23_19_19/0.05),0_18px_40px_-24px_rgb(91_2_2/0.35)] motion-reduce:transition-none"
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 rounded-(--radius-panel) px-3 py-4 text-start text-lg font-medium text-foreground transition-colors duration-(--motion-hover) ease-(--ease-hover) hover:text-(--active) group-data-[open=false]:hover:bg-(--active-tint) active:bg-(--active-tint-strong) active:duration-100 aria-expanded:text-(--active) motion-reduce:transition-none sm:px-5"
        >
          <span className="min-w-0">{title}</span>
          <span
            aria-hidden="true"
            className="relative grid size-9 shrink-0 place-items-center rounded-full border border-border text-(--active) transition-[background-color,border-color,color,rotate] duration-(--motion-hover) ease-(--ease-hover) group-hover:border-(--active) group-data-[open=true]:rotate-180 group-data-[open=true]:border-(--active) group-data-[open=true]:bg-(--active) group-data-[open=true]:text-(--active-foreground) motion-reduce:transition-none"
          >
            <span className="relative size-3.5 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:rounded-full after:bg-current after:transition-transform after:duration-(--motion-hover) after:ease-(--ease-hover) group-data-[open=true]:after:scale-y-0 motion-reduce:after:transition-none" />
          </span>
        </button>
      </h3>
      <div
        id={id}
        data-disclosure-panel=""
        inert={hidden}
        aria-hidden={hidden || undefined}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--motion-hover) ease-(--ease-hover) group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="max-w-[42rem] px-3 pb-6 text-body leading-relaxed text-muted sm:px-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
