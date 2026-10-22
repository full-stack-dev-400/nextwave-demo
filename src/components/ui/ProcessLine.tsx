"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDegradation } from "@/providers/DegradationProvider";
import { Reveal } from "@/components/motion/Reveal";

gsap.registerPlugin(ScrollTrigger);

export const PROCESS_STEPS = [
  { n: "01", title: "Discover", desc: "We scope the real problem before writing a line of code." },
  { n: "02", title: "Design", desc: "Systems and interfaces, prototyped and tested with you." },
  { n: "03", title: "Engineer", desc: "Clean, documented, production-grade builds — weekly demos." },
  { n: "04", title: "Ship + support", desc: "Launch, then a support tier that keeps it fast and current." },
];

/**
 * The cobalt line-draw + 4-step grid (Motion Spec §6, wireframes: "same
 * pattern as Home S5 — consistency over novelty"). Shared between the
 * Home process section and every service page's approach section.
 */
export function ProcessLine({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useDegradation();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    if (prefersReducedMotion) {
      gsap.set(line, { scaleX: 1 });
      return;
    }

    gsap.set(line, { scaleX: 0 });
    const ctx = gsap.context(() => {
      gsap.to(line, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={sectionRef} className={className}>
      <div className="relative h-[2px] w-full bg-glass-border">
        <div ref={lineRef} className="absolute inset-y-0 left-0 w-full origin-left bg-cobalt" />
      </div>

      <Reveal group stagger={0.06} className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step) => (
          <div key={step.n}>
            <div className="font-mono text-[0.8rem] tracking-[0.1em] text-cobalt">{step.n}</div>
            <h3 className="mb-2 mt-3 font-display text-[1.35rem] font-medium tracking-[-0.01em] text-bone">
              {step.title}
            </h3>
            <p className="text-[0.88rem] text-ash">{step.desc}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
