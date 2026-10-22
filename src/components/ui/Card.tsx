"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Notched glass card (Brand Board "components", CLAUDE.md §3 Q-notch).
 * Radial cobalt glow follows the cursor via CSS custom properties —
 * a "simple hover" effect, so CSS renders it; JS only feeds the coordinate.
 */
export function Card({
  children,
  className = "",
  notch = true,
}: {
  children: ReactNode;
  className?: string;
  notch?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`card rounded-lg px-7 py-8 ${notch ? "notched" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
