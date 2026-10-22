"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { Core } from "@/components/core/Core";
import { useDegradation } from "@/providers/DegradationProvider";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import type { MorphState } from "@/components/core/morph-states";

interface ServiceDef {
  id: string;
  state: MorphState;
  name: string;
  shortName: string;
  href: string;
  summary: string;
  outcome: string;
  capabilities: string[];
  pipeline: string[];
}

const SERVICES: ServiceDef[] = [
  {
    id: "SVC-01",
    state: "lattice",
    name: "Web Development",
    shortName: "Web",
    href: "/services/web-development",
    summary:
      "Fast, accessible websites and web applications engineered like digital products.",
    outcome:
      "A stable, conversion-ready platform designed to perform across devices, markets and future growth.",
    capabilities: [
      "Next.js and React",
      "WordPress and WooCommerce",
      "CMS and API integrations",
      "Performance and accessibility",
    ],
    pipeline: [
      "Discover",
      "Architect",
      "Design",
      "Engineer",
      "Optimize",
    ],
  },
  {
    id: "SVC-02",
    state: "assembling",
    name: "Custom Software",
    shortName: "Software",
    href: "/services/custom-software",
    summary:
      "Purpose-built software shaped around how your business actually operates.",
    outcome:
      "A maintainable system that replaces fragmented workflows, manual operations and disconnected tools.",
    capabilities: [
      "Business workflow automation",
      "Custom dashboards",
      "Database architecture",
      "Third-party integrations",
    ],
    pipeline: [
      "Diagnose",
      "Map",
      "Model",
      "Build",
      "Validate",
    ],
  },
  {
    id: "SVC-03",
    state: "grid",
    name: "POS Software",
    shortName: "POS",
    href: "/services/pos-software",
    summary:
      "Connected point-of-sale systems for transactions, stock, staff and operational reporting.",
    outcome:
      "A reliable operational system that keeps selling even when connectivity becomes unstable.",
    capabilities: [
      "Offline transaction mode",
      "UAE VAT compliance",
      "Inventory management",
      "Staff and reporting controls",
    ],
    pipeline: [
      "Configure",
      "Connect",
      "Transact",
      "Synchronize",
      "Report",
    ],
  },
  {
    id: "SVC-04",
    state: "surface",
    name: "UI/UX & Design",
    shortName: "Interface",
    href: "/services/ui-ux-design",
    summary:
      "Clear digital interfaces that make complex systems easier to understand and operate.",
    outcome:
      "An interface system that feels natural, consistent and usable without unnecessary learning.",
    capabilities: [
      "User journey mapping",
      "Wireframes and prototypes",
      "Design systems",
      "Accessibility and usability",
    ],
    pipeline: [
      "Research",
      "Structure",
      "Prototype",
      "Test",
      "Refine",
    ],
  },
  {
    id: "SVC-05",
    state: "waveform",
    name: "Digital Growth",
    shortName: "Growth",
    href: "/services/digital-marketing",
    summary:
      "Performance marketing, technical SEO and lifecycle systems built around measurable signals.",
    outcome:
      "A connected growth engine that tracks acquisition, conversion, retention and optimization.",
    capabilities: [
      "Performance campaigns",
      "Technical SEO",
      "Landing-page optimization",
      "Lifecycle email automation",
    ],
    pipeline: [
      "Measure",
      "Target",
      "Launch",
      "Optimize",
      "Scale",
    ],
  },
];

const HEADING_FIRST = "Five disciplines.";
const HEADING_SECOND = "One standard.";
const FULL_HEADING = `${HEADING_FIRST} ${HEADING_SECOND}`;

export function ServicesScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingStartedRef = useRef(false);

  const {
    tier,
    prefersReducedMotion,
  } = useDegradation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionVisible, setSectionVisible] =
    useState(false);
  const [typedHeading, setTypedHeading] =
    useState("");

  const pinEnabled = tier === "full";
  const activeService = SERVICES[activeIndex];

  /*
   * Detect the section entering the viewport.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setSectionVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.03,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Type the main section heading once.
   */
  useEffect(() => {
    if (
      !sectionVisible ||
      headingStartedRef.current
    ) {
      return;
    }

    headingStartedRef.current = true;

    if (prefersReducedMotion) {
      setTypedHeading(FULL_HEADING);
      return;
    }

    let characterIndex = 0;

    const typingInterval = window.setInterval(() => {
      characterIndex += 1;

      setTypedHeading(
        FULL_HEADING.slice(0, characterIndex),
      );

      if (
        characterIndex >= FULL_HEADING.length
      ) {
        window.clearInterval(typingInterval);
      }
    }, 68);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [sectionVisible, prefersReducedMotion]);

  /*
   * Desktop scroll progress.
   *
   * CSS owns the sticky layout.
   * This passive listener only calculates which service
   * should currently be active.
   */
  useEffect(() => {
    if (!pinEnabled) {
      return;
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let animationFrame = 0;

    const updateActiveService = () => {
      window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(
        () => {
          const rect =
            section.getBoundingClientRect();

          const scrollableDistance =
            section.offsetHeight -
            window.innerHeight;

          if (scrollableDistance <= 0) {
            return;
          }

          const travelled = -rect.top;

          const progress = Math.max(
            0,
            Math.min(
              1,
              travelled / scrollableDistance,
            ),
          );

          const nextIndex = Math.min(
            SERVICES.length - 1,
            Math.floor(
              progress * SERVICES.length,
            ),
          );

          setActiveIndex((currentIndex) =>
            currentIndex === nextIndex
              ? currentIndex
              : nextIndex,
          );
        },
      );
    };

    window.addEventListener(
      "scroll",
      updateActiveService,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateActiveService,
    );

    updateActiveService();

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      window.removeEventListener(
        "scroll",
        updateActiveService,
      );

      window.removeEventListener(
        "resize",
        updateActiveService,
      );
    };
  }, [pinEnabled]);

  /*
   * Select a service manually.
   *
   * Desktop moves to that service's scroll position.
   * Mobile changes the displayed dossier directly.
   */
  const selectService = (index: number) => {
    setActiveIndex(index);

    if (!pinEnabled) {
      return;
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const sectionTop =
      window.scrollY +
      section.getBoundingClientRect().top;

    const scrollableDistance =
      section.offsetHeight -
      window.innerHeight;

    const targetProgress =
      SERVICES.length === 1
        ? 0
        : index / (SERVICES.length - 1);

    const targetPosition =
      sectionTop +
      scrollableDistance * targetProgress;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth",
    });
  };

  const firstLineTyped = typedHeading.slice(
    0,
    Math.min(
      typedHeading.length,
      HEADING_FIRST.length,
    ),
  );

  const secondLineStart =
    HEADING_FIRST.length + 1;

  const secondLineTyped =
    typedHeading.length > secondLineStart
      ? typedHeading.slice(secondLineStart)
      : "";

  const typingSecondLine =
    typedHeading.length >
    HEADING_FIRST.length;

  const progress =
    ((activeIndex + 1) / SERVICES.length) *
    100;

  /*
   * Mobile / reduced-motion / low-GPU layout.
   */
  if (!pinEnabled) {
    return (
        <section
          ref={sectionRef}
          className="services-section relative overflow-hidden border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]"
        >
        <div className="relative z-10 mx-auto max-w-[1280px]">
          <SectionEyebrow>
            / 03 — What we build
          </SectionEyebrow>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h2
              aria-label={FULL_HEADING}
              className="min-h-[1.9em] max-w-[19ch] font-mono text-[clamp(2.1rem,3.2vw,3.35rem)] font-medium leading-[0.98] tracking-[-0.04em] text-bone"
            >
              <span className="block min-h-[0.96em]">
                {firstLineTyped}

                {!typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="services-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>

              <span className="block min-h-[0.96em] text-cobalt">
                {secondLineTyped}

                {typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="services-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>

            <p className="max-w-[48ch] text-[1rem] leading-[1.7] text-ash">
              Different disciplines, engineered
              through the same process: understand
              the system, remove friction and build
              for long-term operation.
            </p>
          </div>

          {/* Mobile service selector */}
          <div className="mt-12 overflow-x-auto border-y border-glass-border">
            <div className="flex min-w-max">
              {SERVICES.map((service, index) => {
                const active =
                  activeIndex === index;

                return (
                  <button
                    key={service.id}
                    type="button"
                    data-hover
                    aria-pressed={active}
                    onClick={() =>
                      selectService(index)
                    }
                    className={`min-w-[132px] border-r border-glass-border px-5 py-5 text-left font-mono text-[0.62rem] uppercase tracking-[0.11em] transition-colors duration-fast ${
                      active
                        ? "bg-cobalt text-bone"
                        : "text-ash hover:bg-glass hover:text-bone"
                    }`}
                  >
                    <span className="block opacity-60">
                      0{index + 1}
                    </span>

                    <span className="mt-2 block">
                      {service.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile engineering dossier */}
          <div
            className="services-stage relative mt-8 overflow-hidden rounded-[24px] border border-glass-border bg-[rgba(22,24,28,0.64)]"
            style={
              {
                "--service-progress": `${progress}%`,
              } as CSSProperties
            }
          >
            <div className="relative h-[280px] border-b border-glass-border">
              <div className="services-core-orbit pointer-events-none absolute left-1/2 top-1/2 size-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-glass-border" />

              

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5"
              >
                <Core
                  morphState={
                    activeService.state
                  }
                  className="h-full w-full"
                />
              </div>

              <span className="absolute left-5 top-5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ash">
                {activeService.id}
              </span>

              <span className="absolute right-5 top-5 flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.12em] text-signal">
                <span className="size-[5px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                Active
              </span>
            </div>

              <div
                key={activeService.id}
                className="service-dossier-enter flex min-h-0 flex-col overflow-hidden px-7 pb-8 pt-6"
              >
              <h3 className="font-display text-[clamp(2rem,8vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-bone">
                {activeService.name}
              </h3>

              <p className="mt-5 text-[0.96rem] leading-[1.7] text-ash">
                {activeService.summary}
              </p>

              <div className="mt-7">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.13em] text-cobalt">
                  Capabilities
                </span>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeService.capabilities.map(
                    (capability) => (
                      <div
                        key={capability}
                        className="border border-glass-border bg-glass px-4 py-3 font-mono text-[0.58rem] uppercase tracking-[0.09em] text-bone"
                      >
                        {capability}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-7">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.13em] text-cobalt">
                  Intended output
                </span>

                <p className="mt-3 text-[0.9rem] leading-[1.65] text-ash">
                  {activeService.outcome}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {activeService.pipeline.map(
                  (step, index) => (
                    <span
                      key={step}
                      className="font-mono text-[0.54rem] uppercase tracking-[0.1em] text-ash"
                    >
                      0{index + 1} {step}
                      {index <
                        activeService.pipeline
                          .length -
                          1 && (
                        <span className="ml-2 text-cobalt">
                          →
                        </span>
                      )}
                    </span>
                  ),
                )}
              </div>

              <Link
                href={activeService.href}
                data-hover
                data-label="OPEN"
                className="mt-8 inline-flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-bone transition-colors duration-fast hover:text-signal"
              >
                Open service specification
                <span>↗</span>
              </Link>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-glass-border">
              <span className="services-stage-progress absolute inset-y-0 left-0 bg-gradient-to-r from-cobalt to-signal" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /*
   * Desktop sticky experience.
   */
  return (
  <section
    ref={sectionRef}
    className="services-section relative h-[500vh] border-t border-glass-border"
  >
    <div className="sticky top-0 h-[100svh] overflow-hidden px-[var(--space-gutter)]">
      <div className="relative z-10 mx-auto grid h-full max-w-[1280px] grid-rows-[auto_minmax(0,1fr)_auto] gap-y-4 pb-4 pt-[clamp(3rem,6vh,4.5rem)]">
          {/* Heading */}
          <div className="grid shrink-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <SectionEyebrow>
                / 03 — What we build
              </SectionEyebrow>

              <h2
                aria-label={FULL_HEADING}
                className="min-h-[1.9em] max-w-[18ch] font-mono text-[clamp(2rem,3.8vw,4rem)] font-medium leading-[0.96] tracking-[-0.045em] text-bone"
              >
                <span className="block min-h-[0.96em]">
                  {firstLineTyped}

                  {!typingSecondLine && (
                    <span
                      aria-hidden="true"
                      className="services-heading-cursor text-signal"
                    >
                      |
                    </span>
                  )}
                </span>

                <span className="block min-h-[0.96em] text-cobalt">
                  {secondLineTyped}

                  {typingSecondLine && (
                    <span
                      aria-hidden="true"
                      className="services-heading-cursor text-signal"
                    >
                      |
                    </span>
                  )}
                </span>
              </h2>
            </div>

            <div className="pb-2 lg:justify-self-end">
              <p className="max-w-[50ch] text-[0.9rem] leading-[1.65] text-ash">
                Scroll through five disciplines.
                Each one follows the same engineering
                standard: structure first, execution
                second, measurable output always.
              </p>

              <div className="mt-4 flex items-center justify-between gap-5 border-t border-glass-border pt-3 font-mono text-[0.47rem] uppercase tracking-[0.1em] text-ash">
                <span>
                  Active module /{" "}
                  {activeService.id}
                </span>

                <span className="text-signal">
                  {String(
                    activeIndex + 1,
                  ).padStart(2, "0")}
                  /0{SERVICES.length}
                </span>
              </div>
            </div>
          </div>

          {/* Main dossier area */}
         <div className="grid min-h-0 grid-cols-[250px_minmax(0,1fr)] gap-5">
            {/* Service selector */}
            <div className="grid min-h-0 grid-rows-5 border-y border-glass-border">
              {SERVICES.map((service, index) => {
                const active =
                  activeIndex === index;

                return (
                  <button
                    key={service.id}
                    type="button"
                    data-hover
                    aria-pressed={active}
                    onClick={() =>
                      selectService(index)
                    }
                    className={`group relative flex min-h-0 items-center border-b border-glass-border px-4 text-left transition-colors duration-base last:border-b-0 ${
                      active
                        ? "bg-[rgba(0,202,224,0.1)]"
                        : "hover:bg-glass"
                    }`}
                  >
                    <span
                      className={`w-10 shrink-0 font-mono text-[0.52rem] tracking-[0.1em] transition-colors duration-base ${
                        active
                          ? "text-signal"
                          : "text-ash"
                      }`}
                    >
                      0{index + 1}
                    </span>

                    <span
                      className={`font-display font-medium leading-[1.05] tracking-[-0.02em] transition-all duration-base ${
                        active
                          ? "translate-x-1 text-[1.4rem] text-bone"
                          : "text-[1.08rem] text-ash group-hover:text-bone"
                      }`}
                    >
                      {service.name}
                    </span>

                    <span
                      className={`absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-cobalt transition-transform duration-base ${
                        active
                          ? "scale-y-100"
                          : "scale-y-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active service dossier */}
<div
  className="services-stage relative min-h-0 overflow-hidden rounded-[24px] border border-glass-border bg-[rgba(22,24,28,0.6)]"
  style={
    {
      "--service-progress": `${progress}%`,
    } as CSSProperties
  }
>
  <div className="grid h-full grid-cols-[0.38fr_0.62fr]">
    {/* Simplified Core visual */}
    <div className="relative min-h-0 overflow-hidden border-r border-glass-border">
      <div className="services-core-orbit pointer-events-none absolute left-1/2 top-1/2 size-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-glass-border" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8"
      >
        <Core
          morphState={activeService.state}
          className="h-full w-full"
        />
      </div>

      <span className="absolute left-5 top-5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
        {activeService.id}
      </span>

      <span className="absolute right-5 top-5 flex items-center gap-2 font-mono text-[0.48rem] uppercase tracking-[0.1em] text-signal">
        <span className="size-[5px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
        Active
      </span>

      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-glass-border pt-4 font-mono text-[0.43rem] uppercase tracking-[0.09em] text-ash">
        <span>Requirement</span>
        <span>System</span>
      </div>
    </div>

    {/* Clean dossier content */}
    <div
      key={activeService.id}
      className="service-dossier-enter flex min-h-0 flex-col p-4"
    >
      {/* <div className="flex items-center justify-between gap-5">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-cobalt">
          Engineering dossier
        </span>

        <span className="font-mono text-[0.46rem] uppercase tracking-[0.1em] text-ash">
          {String(activeIndex + 1).padStart(2, "0")}
          /0{SERVICES.length}
        </span>
      </div> */}

      <h3 className="mt-6 max-w-[16ch] font-display text-[clamp(2rem,2.6vw,2.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-bone">
        {activeService.name}
      </h3>

      <p className="mt-4 max-w-[58ch] text-[0.9rem] leading-[1.65] text-ash">
        {activeService.summary}
      </p>

      {/* Capabilities */}
      <div className="mt-6">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-cobalt">
          Core capabilities
        </span>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {activeService.capabilities.map(
            (capability, index) => (
              <div
                key={capability}
                className="service-capability flex min-h-[54px] items-center border border-glass-border bg-[rgba(242,240,234,0.025)] px-4 py-3"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <span className="mr-3 font-mono text-[0.44rem] text-signal">
                  0{index + 1}
                </span>

                <span className="font-mono text-[0.51rem] uppercase leading-[1.4] tracking-[0.07em] text-bone">
                  {capability}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Outcome */}
      <div className="mt-6 border-l-2 border-signal/70 bg-[rgba(216,216,211,0.025)] px-5 py-4">
        <span className="font-mono text-[0.47rem] uppercase tracking-[0.11em] text-signal">
          Designed outcome
        </span>

        <p className="mt-2 max-w-[58ch] text-[0.82rem] leading-[1.6] text-ash">
          {activeService.outcome}
        </p>
      </div>

      {/* Production sequence */}
      <div className="mt-auto border-t border-glass-border pt-5">
        <div className="flex items-center justify-between gap-5">
          <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-ash">
            Production sequence
          </span>

          <Link
            href={activeService.href}
            data-hover
            data-label="OPEN"
            className="inline-flex items-center gap-2 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-bone transition-colors duration-fast hover:text-signal"
          >
            View service
            <span>↗</span>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {activeService.pipeline.map(
            (step, index) => (
              <div
                key={step}
                className="border-t border-glass-border pt-3"
              >
                <span className="block font-mono text-[0.43rem] text-signal">
                  0{index + 1}
                </span>

                <span className="mt-1 block font-mono text-[0.45rem] uppercase tracking-[0.065em] text-ash">
                  {step}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  </div>

  <div className="absolute inset-x-0 bottom-0 h-px bg-glass-border">
    <span className="services-stage-progress absolute inset-y-0 left-0 bg-gradient-to-r from-cobalt to-signal shadow-[0_0_10px_rgba(216,216,211,0.25)]" />
  </div>
</div>
          </div>

<div className="pointer-events-none flex h-6 shrink-0 items-center justify-between border-t border-glass-border/50 pt-2 font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ash">
  <span>
    Scroll to inspect each discipline
  </span>

  <span>
    System group / BEZTEQ-SVC
  </span>
</div>
        </div>
      </div>
    </section>
  );
}