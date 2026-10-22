"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MorphState } from "./morph-states";

// R3F/three are dynamically imported and excluded from the initial JS bundle —
// LCP and TBT are measured before this chunk exists (CLAUDE.md §5, §10).
const CoreScene = dynamic(() => import("./CoreScene"), { ssr: false });

export function Core({
  morphState = "lattice",
  className,
}: {
  morphState?: MorphState;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }}>
      <CoreScene morphState={morphState} paused={!visible} />
    </div>
  );
}
