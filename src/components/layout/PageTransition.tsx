"use client";

/**
 * This effect synchronizes local state to the router's pathname/children —
 * an external navigation event, not a same-render prop mirror — and one
 * branch (reduced motion) legitimately swaps that state synchronously rather
 * than through the async cover sequence. That's exactly what effects are
 * for here, so the set-state-in-effect rule is disabled for this file.
 */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAnimate } from "framer-motion";
import { useDegradation } from "@/providers/DegradationProvider";
import { EASE_BEZIER } from "@/lib/motion-tokens";

const ROUTE_LABEL: Record<string, string> = {
  "/": "HOME",
  "/work": "WORK",
  "/services": "SERVICES",
  "/about": "ABOUT",
  "/contact": "CONTACT",
};

function labelFor(pathname: string) {
  if (ROUTE_LABEL[pathname]) return ROUTE_LABEL[pathname];
  const segment = pathname.split("/").filter(Boolean).pop();
  return segment ? segment.toUpperCase().replace(/-/g, " ") : "HOME";
}

/**
 * Type B route transition (Motion Spec §8): a cobalt cover sweeps down to
 * hide the swap, flashes the route's mono label, then sweeps off-screen to
 * reveal the new page. Reduced motion collapses to an instant swap — no
 * clip-path, no cover, per the spec's stated fallback.
 *
 * Note: this only detects transitions on pathname change. A route whose
 * props change without its pathname changing (e.g. a searchParams-only
 * update) won't trigger the cover — out of scope for a standard route swap.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { prefersReducedMotion } = useDegradation();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [label, setLabel] = useState("");
  const [shownChildren, setShownChildren] = useState(children);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) {
      setShownChildren(children);
      return;
    }
    prevPathname.current = pathname;

    if (prefersReducedMotion) {
      setShownChildren(children);
      return;
    }

    let cancelled = false;
    setLabel(labelFor(pathname));

    (async () => {
      await animate(
        scope.current,
        { clipPath: "inset(0 0 0% 0)" },
        { duration: 0.6, ease: EASE_BEZIER.inOutQuart },
      );
      if (cancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (cancelled) return;

      setShownChildren(children);
      await animate(
        scope.current,
        { clipPath: "inset(100% 0 0 0)" },
        { duration: 0.6, ease: EASE_BEZIER.inOutQuart },
      );
      if (cancelled) return;
      // Instant reset so the next transition always sweeps in from the top edge.
      animate(scope.current, { clipPath: "inset(0 0 100% 0)" }, { duration: 0 });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        ref={scope}
        style={{ clipPath: "inset(0 0 100% 0)" }}
        className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-cobalt"
      >
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-obsidian">
          / {label}
        </span>
      </div>
      {shownChildren}
    </>
  );
}
