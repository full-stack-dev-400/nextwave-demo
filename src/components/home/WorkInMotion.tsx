"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { STUDIES } from "@/lib/work-data";
import { useDegradation } from "@/providers/DegradationProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type MotionCard = {
  id: string;
  title: string;
  category: string;
  href: string;
  image: string;
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 16L16 4M7 4h9v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkInMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useDegradation();

  const fleetStudy =
    STUDIES.find((study) => study.slug === "fleet-platform") ?? STUDIES[0];

  const posStudy =
    STUDIES.find((study) => study.slug === "retail-pos") ?? STUDIES[1];

  const fintechStudy =
    STUDIES.find((study) => study.slug === "fintech-web") ?? STUDIES[2];

  const cards = useMemo<MotionCard[]>(
    () => [
      {
        id: "01",
        title: fleetStudy.title,
        category: "Custom Software",
        href: `/work/${fleetStudy.slug}`,
        image: "/images/work/motion/fleet-cover.webp",
      },
      {
        id: "02",
        title: posStudy.title,
        category: "Retail POS",
        href: `/work/${posStudy.slug}`,
        image: "/images/work/motion/pos-cover.webp",
      },
      {
        id: "03",
        title: fintechStudy.title,
        category: "Fintech Website",
        href: `/work/${fintechStudy.slug}`,
        image: "/images/work/motion/fintech-cover.webp",
      },
      {
        id: "04",
        title: "Brand Systems",
        category: "Identity",
        href: "/work",
        image: "/images/work/motion/brand-cover.webp",
      },
      {
        id: "05",
        title: "Growth Platforms",
        category: "Acquisition",
        href: "/work",
        image: "/images/work/motion/growth-cover.webp",
      },
      {
        id: "06",
        title: "Commerce Interfaces",
        category: "E-commerce",
        href: "/work",
        image: "/images/work/motion/commerce-cover.webp",
      },
      {
        id: "07",
        title: "Software Products",
        category: "Product UI",
        href: "/work",
        image: "/images/work/motion/product-cover.webp",
      },
      {
        id: "08",
        title: "Digital Experiences",
        category: "Interactive",
        href: "/work",
        image: "/images/work/motion/experience-cover.webp",
      },
    ],
    [fleetStudy, posStudy, fintechStudy],
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion) return;

      const media = gsap.matchMedia();

media.add("(min-width: 1024px)", () => {
  const cardElements = gsap.utils.toArray<HTMLElement>(
    "[data-motion-card]",
    section,
  );

  const cardInners = gsap.utils.toArray<HTMLElement>(
    "[data-motion-card-inner]",
    section,
  );

  const descriptor = section.querySelector<HTMLElement>(
    "[data-motion-descriptor]",
  );

  const leftCopy = section.querySelector<HTMLElement>(
    "[data-motion-copy-left]",
  );

  const rightCopy = section.querySelector<HTMLElement>(
    "[data-motion-copy-right]",
  );

  const headingLines = gsap.utils.toArray<HTMLElement>(
    "[data-motion-heading-line]",
    section,
  );

  const arcLine = section.querySelector<HTMLElement>(
    "[data-motion-arc-line]",
  );

  const totalTravel = Math.max(cards.length - 1, 1);
  const progressState = { value: 0 };

  /*
   * Outer card elements are controlled only by this function.
   * Intro animation must never animate x, y, scale or rotation
   * on cardElements.
   */
  const layoutCards = (progress: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const centerX = viewportWidth * 0.58;
    const baseY = viewportHeight * 0.74;
    const spacing = Math.min(viewportWidth * 0.105, 205);
    const arcDepth = Math.min(viewportHeight * 0.058, 76);

    cardElements.forEach((card, index) => {
      const position = index - progress * totalTravel - 1.9;

      const x = centerX + position * spacing;
      const y = baseY + Math.pow(position, 2) * arcDepth;
      const rotation = position * 8;
      const distance = Math.abs(position);

      const scale = gsap.utils.clamp(
        0.72,
        1,
        1 - distance * 0.06,
      );

      const opacity = gsap.utils.clamp(
        0,
        1,
        1 - distance * 0.22,
      );

      gsap.set(card, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        rotation,
        scale,
        opacity,
        zIndex: 100 - Math.round(distance * 10),
      });
    });
  };

  /*
   * Apply the correct card position immediately.
   * This prevents cards from appearing at y: 0.
   */
  layoutCards(0);

  gsap.set(headingLines, {
    yPercent: 110,
    opacity: 0,
    rotateX: -24,
  });

  gsap.set([descriptor, leftCopy, rightCopy], {
    opacity: 0,
    y: 24,
  });

  /*
   * Animate the inner card only.
   * Outer card keeps its calculated arc position.
   */
  gsap.set(cardInners, {
    opacity: 0,
    scale: 0.9,
    y: 28,
    transformOrigin: "50% 50%",
  });

  gsap.set(arcLine, {
    opacity: 0,
    scaleX: 0.9,
    transformOrigin: "50% 50%",
  });

  const intro = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });

  intro
    .to(
      headingLines,
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.08,
      },
      0,
    )
    .to(
      descriptor,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
      },
      0.22,
    )
    .to(
      [leftCopy, rightCopy],
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
      },
      0.35,
    )
    .to(
      arcLine,
      {
        opacity: 1,
        scaleX: 1,
        duration: 1,
      },
      0.3,
    )
    .to(
      cardInners,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.05,
      },
      0.4,
    );

  /*
   * Start the intro only when the user approaches the section.
   * Previously it started immediately when the page mounted.
   */
  const introTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top 82%",
    once: true,
    onEnter: () => {
      intro.play();
    },
  });

  const motionTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=2600",
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,

    onUpdate: (self) => {
      progressState.value = self.progress;
      layoutCards(progressState.value);
    },

    onRefresh: () => {
      layoutCards(progressState.value);
    },
  });

  const handleResize = () => {
    layoutCards(progressState.value);
  };

  window.addEventListener("resize", handleResize);

  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    window.removeEventListener("resize", handleResize);

    introTrigger.kill();
    motionTrigger.kill();
    intro.kill();
  };
});

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [prefersReducedMotion, cards],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="work-in-motion"
      className="relative isolate overflow-hidden bg-[#efefed] text-[#171719]"
    >
      {/* Mobile fallback */}
      <div className="px-[var(--space-gutter)] py-[var(--space-section)] lg:hidden">
        <SectionEyebrow>/ 05 — Work in motion</SectionEyebrow>

        <h2 className="mt-6 text-[clamp(3.5rem,16vw,6rem)] font-medium leading-[0.84] tracking-[-0.07em]">
          Work in
          <br />
          motion
        </h2>

        <p className="mt-6 max-w-md text-sm leading-6 text-black/60">
          Selected screens, systems and interfaces arranged as a moving visual
          archive.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="overflow-hidden rounded-[20px] border border-black/10 bg-white"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                  {card.category}
                </p>

                <h3 className="mt-2 text-lg font-medium leading-tight tracking-[-0.03em]">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/work"
          className="mt-10 inline-flex items-center gap-4 border-b border-black/45 pb-3 font-mono text-[11px] uppercase tracking-[0.14em]"
        >
          View all work
          <ArrowIcon />
        </Link>
      </div>

      {/* Desktop animated version */}
      <div className="relative hidden h-[100svh] lg:block">
        {/* Decorative fine lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[13%] top-[8%] h-px w-[28vw] rotate-[4deg] bg-black/12" />
          <span className="absolute right-[18%] top-[25%] h-px w-[18vw] -rotate-[7deg] bg-black/12" />
        </div>

        {/* Huge heading */}
        <div className="pointer-events-none absolute inset-x-0 top-[10.5vh] z-10 flex flex-col items-center">
          <h2
            aria-label="Work in motion"
            className="text-center font-medium uppercase leading-[0.86] tracking-[-0.07em] text-[#444]"
          >
            <span className="block overflow-hidden text-[clamp(5rem,10vw,10rem)]">
              <span data-motion-heading-line className="inline-block">
                WORK IN
              </span>
            </span>

            <span className="block overflow-hidden text-[clamp(5rem,10vw,10rem)]">
              <span data-motion-heading-line className="inline-block">
                MOTION
              </span>
            </span>
          </h2>

          <p
            data-motion-descriptor
            className="mt-5 max-w-[260px] text-center font-mono text-[12px] uppercase leading-[1.45] tracking-[0.04em] text-black/58"
          >
            Exploring systems, interfaces and digital environments through
            selected work.
          </p>
        </div>

        {/* Left bottom copy */}
        <div
          data-motion-copy-left
          className="absolute bottom-[9vh] left-[3vw] z-20 max-w-[350px]"
        >
          <p className="text-[1rem] leading-[1.55] text-black/55">
            Screens, systems, product interfaces and production environments
            presented as a moving visual archive.
          </p>
        </div>

        {/* Right bottom CTA */}
        <div
          data-motion-copy-right
          className="absolute bottom-[9vh] right-[3vw] z-20"
        >
          <Link
            href="/work"
            className="group flex items-center gap-12 border-b border-black/45 pb-3 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-[#00cae0] hover:text-[#00cae0]"
          >
            View all work
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </div>

        {/* Arc guide */}
        <div
          data-motion-arc-line
          className="pointer-events-none absolute inset-x-[10vw] bottom-[18vh] z-[5] h-[34vh]"
        >
          <svg
            viewBox="0 0 1200 320"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0,290 Q600,80 1200,290"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.3"
            />
          </svg>
        </div>


{/* Cards */}
<div className="absolute inset-0 z-20">
  {cards.map((card) => (
    <Link
      key={card.id}
      href={card.href}
      data-motion-card
      className="group absolute w-[clamp(180px,14vw,245px)] will-change-transform"
    >
      <div
        data-motion-card-inner
        className="will-change-transform"
      >
        <div className="overflow-hidden rounded-[2px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="245px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>
    </section>
  );
}