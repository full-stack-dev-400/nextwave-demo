import type { ReactNode } from "react";

/** Mono section label with the signal-dot bullet (Brand Board "Color" rule: signal is punctuation only). */
export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-[0.7rem] font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ash">
      <span className="size-[7px] flex-none rounded-full bg-signal" />
      {children}
    </div>
  );
}
