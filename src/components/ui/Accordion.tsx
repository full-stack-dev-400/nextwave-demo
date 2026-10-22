"use client";

import { useState } from "react";

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Height auto-animates via a 0fr/1fr grid-template-rows trick (no JS height
 * measurement needed). The chevron is a notched square that rotates 45deg
 * into the Q-notch shape on open (Motion Spec §10).
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-b border-glass-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className="accordion-item border-t border-glass-border"
            data-open={isOpen}
          >
            <button
              type="button"
              data-hover
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[1.05rem] font-medium text-bone"
            >
              <span>{item.q}</span>
              <span className="accordion-chevron notched size-[10px] flex-none bg-ash" />
            </button>
            <div className="accordion-panel">
              <div className="accordion-panel-inner">
                <p className="max-w-[64ch] pb-6 text-[0.92rem] text-ash">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
