"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDegradation } from "@/providers/DegradationProvider";

gsap.registerPlugin(ScrollTrigger);

/** Counts up once on scroll-enter (Motion Spec §12: counters are GSAP's job). */
export function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useDegradation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    el.textContent = "0";
    const counter = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: to,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          const rounded = Math.ceil(counter.val);
          el.textContent = rounded >= to ? `${to}${suffix}` : `${rounded}`;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [to, suffix, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-none tracking-[-0.03em] text-bone"
    >
      0
    </div>
  );
}
