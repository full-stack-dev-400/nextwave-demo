"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDegradation } from "@/providers/DegradationProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-enter reveal — GSAP's job per the division of labor (CLAUDE.md §2:
 * "scroll-driven → GSAP"). Fades + lifts once when crossing into view.
 * `group` staggers direct children instead of animating one block.
 */
export function Reveal({
  children,
  group = false,
  y = 40,
  stagger = 0.07,
  className,
}: {
  children: ReactNode;
  group?: boolean;
  y?: number;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useDegradation();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    const targets = group ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: group ? stagger : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [group, y, stagger, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
