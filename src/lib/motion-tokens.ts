// CSS-flavored tokens, for use in globals.css / inline style strings / GSAP (which
// also accepts a CSS cubic-bezier() string).
export const EASE = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOutQuart: "cubic-bezier(0.76, 0, 0.24, 1)",
  linear: "linear",
} as const;

// Framer Motion's `ease` transition prop wants bezier control points as a
// tuple, not a CSS cubic-bezier() string — same curves as EASE above.
export const EASE_BEZIER = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

// GSAP-flavored expo-out, matched to EASE.outExpo for scroll-linked / JS-driven motion.
export const EASE_FN = {
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
} as const;

export const DUR = {
  fast: 0.35,
  base: 0.8,
  slow: 1.4,
} as const;

export const STAGGER = {
  min: 0.06,
  max: 0.08,
} as const;
