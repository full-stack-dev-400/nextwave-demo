"use client";

import { useEffect, useRef } from "react";
import { useDegradation } from "@/providers/DegradationProvider";

/**
 * Motion Spec §9. Dot + trailing ring (lerp 0.18). Any [data-hover] element
 * triggers the hover state; [data-label] additionally shows a mono label
 * ("VIEW", "DRAG"). Fully disabled on touch and reduced-motion tiers —
 * a fake cursor on mobile, or one that ignores a stated preference, is a bug.
 */
export function CustomCursor() {
  const { isTouch, prefersReducedMotion } = useDegradation();
  // Touch and reduced-motion are hard, independent rules (Motion Spec §9) —
  // not routed through the FPS-driven degradation tier.
  const active = !isTouch && !prefersReducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      document.body.removeAttribute("data-cursor");
      return;
    }
    document.body.setAttribute("data-cursor", "custom");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      label.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const ringLoop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(ringLoop);
    };
    raf = requestAnimationFrame(ringLoop);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.("[data-hover]");
      if (!target) return;
      document.body.classList.add("hovering");
      const labelText = target.getAttribute("data-label");
      if (labelText) {
        document.body.classList.add("labeling");
        label.textContent = labelText;
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.("[data-hover]");
      if (!target) return;
      document.body.classList.remove("hovering", "labeling");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.removeAttribute("data-cursor");
      document.body.classList.remove("hovering", "labeling");
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label" />
    </>
  );
}
