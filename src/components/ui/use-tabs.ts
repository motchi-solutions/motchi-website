"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";

/* WAI-ARIA tabs with roving focus: arrow keys (both axes), Home and End move
   between tabs, and the chosen tab scrolls into view in an overflowing list.
   Selection follows focus, as recommended when panels render instantly.
   Source: WAI-ARIA Authoring Practices, Tabs pattern
   (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). */
export function useTabs(count: number, initial = 0) {
  const id = useId();
  const [selected, setSelected] = useState(initial);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number, focus = false) {
    const next = (index + count) % count;
    setSelected(next);
    const tab = tabs.current[next];
    if (focus) tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  }

  const panelId = (index: number) => `${id}-panel-${index}`;
  const tabId = (index: number) => `${id}-tab-${index}`;

  return {
    selected,
    select,
    // Selects without moving focus or scrolling, for selection that follows
    // another control, such as a swiped carousel.
    setSelected,
    tabId,
    panelId,
    tabProps: (index: number, controls = panelId(index)) => ({
      ref: (element: HTMLButtonElement | null) => {
        tabs.current[index] = element;
      },
      type: "button" as const,
      role: "tab",
      id: tabId(index),
      "aria-selected": selected === index,
      "aria-controls": controls,
      tabIndex: selected === index ? 0 : -1,
      onClick: () => select(index),
      onKeyDown,
    }),
  };
}
