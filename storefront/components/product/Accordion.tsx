"use client";

import { useId, useState, type ReactNode } from "react";
import { Collapsible } from "./Collapsible";

// Figma Accordion Row (14:2815): "+" becomes "–", the body eases open over 200ms,
// and only one row in the group is open at a time. Bodies are rendered on the
// server and passed in; this component only owns which one is open.
export type AccordionItem = { title: string; content: ReactNode };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${id}-panel-${i}`;
        return (
          <div key={item.title} className="border-b border-ink">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-5 py-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span className="w-4 shrink-0 text-caption opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-button-l">{item.title}</span>
                <span aria-hidden className="text-button-l">
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            {/* Indented to line up with the title, not the number. */}
            <Collapsible
              open={isOpen}
              id={panelId}
              role="region"
              aria-label={item.title}
              className="pl-9"
            >
              <div className="pb-6">{item.content}</div>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}
