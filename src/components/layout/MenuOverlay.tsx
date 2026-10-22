"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDegradation } from "@/providers/DegradationProvider";
import { EASE_BEZIER } from "@/lib/motion-tokens";

export interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

/**
 * The one theatrical navigation moment (Motion Spec §7). Panel wipes via
 * clip-path, links masked-rise with a 60ms stagger. Reduced motion collapses
 * to a plain opacity crossfade — still a complete, usable experience.
 */
export function MenuOverlay({
  links,
  onClose,
}: {
  links: NavItem[];
  onClose: () => void;
}) {
  const { prefersReducedMotion } = useDegradation();

  const panelVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { clipPath: "inset(0 0 100% 0)" },
        visible: { clipPath: "inset(0 0 0% 0)" },
        exit: { clipPath: "inset(0 0 100% 0)" },
      };

  const allLinks: NavItem[] = [...links, { href: "/contact", label: "Start a project" }];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
      transition={{ duration: prefersReducedMotion ? 0.2 : 1.4, ease: EASE_BEZIER.inOutQuart }}
      className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-1 overflow-y-auto bg-obsidian px-[var(--space-gutter)] py-24"
    >
      {allLinks.map((link, i) => (
        <div key={link.href} className="w-full">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{
                duration: 0.8,
                delay: prefersReducedMotion ? 0 : i * 0.06,
                ease: EASE_BEZIER.outExpo,
              }}
            >
              <Link
                href={link.href}
                data-hover
                onClick={onClose}
                className="font-display text-[clamp(2rem,7vw,4.2rem)] font-medium tracking-[-0.02em] text-bone"
              >
                <span className="mr-4 font-mono text-[0.8rem] text-ash">
                  / 0{i + 1}
                </span>
                {link.label}
              </Link>
            </motion.div>
          </div>

          {link.children && (
            <div className="mb-3 mt-1 flex flex-wrap gap-x-6 gap-y-1 pl-[3.2rem]">
              {link.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  data-hover
                  onClick={onClose}
                  className="font-mono text-[0.76rem] uppercase tracking-[0.06em] text-ash transition-colors duration-fast hover:text-cobalt"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        data-hover
        onClick={onClose}
        className="absolute right-[var(--space-gutter)] top-6 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ash"
      >
        Close
      </button>
    </motion.div>
  );
}
