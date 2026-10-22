"use client";

import { useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDegradation } from "@/providers/DegradationProvider";

type Variant = "primary" | "cobalt" | "ghost";

export const BUTTON_VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-bone text-obsidian hover:shadow-[var(--glow-cobalt)]",
  cobalt: "bg-cobalt text-bone hover:shadow-[var(--glow-cobalt)]",
  ghost: "bg-transparent text-bone border border-glass-border hover:border-cobalt",
};

export const BUTTON_BASE_CLASS =
  "inline-flex items-center gap-2 rounded-full px-6 py-[0.7rem] font-medium transition-[box-shadow,border-color,background] duration-fast ease-out-expo";

/** Micro-interactions §10: pull toward the cursor within 40px, capped at 6px. */
const MAGNETIC_REACH = 40;
const MAGNETIC_CAP = 6;

// motion.a's event props (onAnimationStart, onDrag, ...) collide with the
// native anchor's DOM event types of the same name — omit them since this
// component doesn't use them.
type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface ButtonProps extends NativeAnchorProps {
  variant?: Variant;
  magnetic?: boolean;
  /** Cursor label shown while hovering, e.g. "VIEW". */
  label?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  magnetic = variant !== "ghost",
  label,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const { isTouch, prefersReducedMotion } = useDegradation();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.4 });
  const hovered = useRef(false);

  const active = magnetic && !isTouch && !prefersReducedMotion;

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(rect.width, rect.height) / 2 + MAGNETIC_REACH;
      if (dist < reach) {
        const pull = (1 - dist / reach) * MAGNETIC_CAP;
        const angle = Math.atan2(dy, dx);
        x.set(Math.cos(angle) * pull);
        y.set(Math.sin(angle) * pull - (hovered.current ? 2 : 0));
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, x, y]);

  return (
    <motion.a
      ref={ref}
      data-hover
      data-label={label}
      style={active ? { x: springX, y: springY } : undefined}
      onMouseEnter={() => {
        hovered.current = true;
      }}
      onMouseLeave={() => {
        hovered.current = false;
        if (active) {
          x.set(0);
          y.set(0);
        }
      }}
      className={`${BUTTON_BASE_CLASS} ${BUTTON_VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
