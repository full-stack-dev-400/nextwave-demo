"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * The degradation ladder (CLAUDE.md §10):
 * Full -> Mobile (hover:none) -> Low-GPU (FPS probe) -> Reduced (prefers-reduced-motion).
 * Reduced-motion is an accessibility preference and always wins; the FPS probe
 * can additionally downgrade a desktop session to "low-gpu" live at runtime.
 */
export type DegradationTier = "full" | "mobile" | "low-gpu" | "reduced";

interface DegradationState {
  tier: DegradationTier;
  prefersReducedMotion: boolean;
  isTouch: boolean;
  lowPower: boolean;
}

const DegradationContext = createContext<DegradationState>({
  tier: "full",
  prefersReducedMotion: false,
  isTouch: false,
  lowPower: false,
});

const FPS_PROBE_MS = 2000;
const FPS_THRESHOLD = 45;

function computeTier(
  prefersReducedMotion: boolean,
  lowPower: boolean,
  isTouch: boolean,
): DegradationTier {
  if (prefersReducedMotion) return "reduced";
  if (lowPower) return "low-gpu";
  if (isTouch) return "mobile";
  return "full";
}

export function DegradationProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(hover: none)");

    const syncReduce = () => setPrefersReducedMotion(reduceQuery.matches);
    const syncTouch = () => setIsTouch(touchQuery.matches);
    syncReduce();
    syncTouch();

    reduceQuery.addEventListener("change", syncReduce);
    touchQuery.addEventListener("change", syncTouch);
    return () => {
      reduceQuery.removeEventListener("change", syncReduce);
      touchQuery.removeEventListener("change", syncTouch);
    };
  }, []);

  useEffect(() => {
    // Reduced-motion is already the floor; no need to spend a probe on it.
    if (prefersReducedMotion) return;

    let raf = 0;
    let frames = 0;
    let cancelled = false;
    const start = performance.now();

    const tick = (now: number) => {
      frames++;
      const elapsed = now - start;
      if (elapsed >= FPS_PROBE_MS) {
        const avgFps = (frames * 1000) / elapsed;
        if (!cancelled && avgFps < FPS_THRESHOLD) setLowPower(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  const value = useMemo<DegradationState>(
    () => ({
      tier: computeTier(prefersReducedMotion, lowPower, isTouch),
      prefersReducedMotion,
      isTouch,
      lowPower,
    }),
    [prefersReducedMotion, isTouch, lowPower],
  );

  return (
    <DegradationContext.Provider value={value}>
      {children}
    </DegradationContext.Provider>
  );
}

export function useDegradation() {
  return useContext(DegradationContext);
}
