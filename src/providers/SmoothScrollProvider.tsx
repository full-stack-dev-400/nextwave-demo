"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useDegradation } from "./DegradationProvider";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { tier } = useDegradation();
  const reduced = tier === "reduced";

  const lenisRef = useRef<Lenis | null>(null);

  /*
   * Create Lenis once.
   *
   * It is recreated only when the user changes between
   * reduced-motion and normal-motion mode.
   */
  useEffect(() => {
    if (reduced) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,

      easing: (t: number) =>
        Math.min(
          1,
          1.001 - Math.pow(2, -10 * t),
        ),

      smoothWheel: true,
      syncTouch: true,
      autoResize: true,

      /*
       * Prevent old scrolling momentum from continuing
       * after clicking an internal navigation link.
       */
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;

    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleLenisScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();

      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [reduced]);

  /*
   * Reset Lenis after every route change.
   *
   * PageTransition waits:
   * 600 ms cover animation
   * + 150 ms pause
   *
   * So this runs after the new page DOM has been rendered.
   */
  useEffect(() => {
    const resetAfterNavigation = () => {
      const lenis = lenisRef.current;

      /*
       * Prevent the browser from restoring an invalid
       * scroll position from the previous page.
       */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      ScrollTrigger.clearScrollMemory("manual");

      if (!lenis) {
        ScrollTrigger.refresh(true);
        return;
      }

      /*
       * Stop any remaining previous-page momentum.
       */
      lenis.stop();

      /*
       * Recalculate the new page height.
       */
      lenis.resize();

      /*
       * Synchronize Lenis with the browser's position.
       */
      lenis.scrollTo(0, {
        immediate: true,
        force: true,
      });

      /*
       * Recalculate all ScrollTrigger start/end positions
       * using the newly rendered page.
       */
      ScrollTrigger.refresh(true);

      /*
       * Make sure Lenis is accepting wheel events again.
       */
      lenis.start();
    };

    const timeoutId = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(
          resetAfterNavigation,
        );
      });
    }, 850);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, reduced]);

  return <>{children}</>;
}