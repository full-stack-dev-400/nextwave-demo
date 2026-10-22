"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useDegradation } from "@/providers/DegradationProvider";

interface ClientQuote {
  quote: string;
  who: string;
  company: string;
  country: string;
  project: string;
  signals: string[];
}

const FEATURED_QUOTE: ClientQuote = {
  quote:
    "They shipped in weeks what our last agency couldn't in a year. The code was clean enough that our own team could take it over.",
  who: "Head of Digital",
  company: "Retail group",
  country: "🇦🇪 UAE",
  project: "Digital platform delivery",
  signals: [
    "Fast delivery",
    "Clean engineering",
    "Team-ready handover",
  ],
};

const SECONDARY_QUOTES: ClientQuote[] = [
  {
    quote:
      "The only vendor that told us when 3D wasn't the answer. That's rare.",
    who: "Founder",
    company: "Fintech platform",
    country: "🇸🇦 KSA",
    project: "Fintech website",
    signals: [
      "Honest recommendations",
      "Business-first decisions",
      "No unnecessary complexity",
    ],
  },
  {
    quote:
      "Weekly demos meant zero surprises at launch.",
    who: "Chief Operating Officer",
    company: "Logistics operator",
    country: "🇦🇪 UAE",
    project: "Fleet platform",
    signals: [
      "Weekly visibility",
      "Controlled delivery",
      "Predictable launch",
    ],
  },
];

const VOICE_BARS = [
  30, 52, 38, 75, 46, 86, 58,
  42, 72, 94, 60, 78, 48, 68,
  36, 84, 56, 72, 44, 62,
];

const ROTATE_MS = 8000;

const HEADING_FIRST =
  "What clients remember.";

const HEADING_SECOND =
  "After launch.";

const FULL_HEADING =
  `${HEADING_FIRST} ${HEADING_SECOND}`;

export function Testimonials() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const headingStartedRef =
    useRef(false);

  const { prefersReducedMotion } =
    useDegradation();

  const [
    sectionVisible,
    setSectionVisible,
  ] = useState(false);

  const [
    typedHeading,
    setTypedHeading,
  ] = useState("");

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    autoRotate,
    setAutoRotate,
  ] = useState(true);

  const activeQuote =
    SECONDARY_QUOTES[activeIndex];

  /*
   * Detect Section 7 entering the viewport.
   */
  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          setSectionVisible(true);
          observer.disconnect();
        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -10% 0px",
        },
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Type only the section heading.
   *
   * Testimonial quotes use a masked reveal,
   * not a typing animation.
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

    const intervalId =
      window.setInterval(() => {
        characterIndex += 1;

        setTypedHeading(
          FULL_HEADING.slice(
            0,
            characterIndex,
          ),
        );

        if (
          characterIndex >=
          FULL_HEADING.length
        ) {
          window.clearInterval(
            intervalId,
          );
        }
      }, 68);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    sectionVisible,
    prefersReducedMotion,
  ]);

  /*
   * Rotate the secondary client quote.
   *
   * Rotation stops once the visitor
   * manually selects a testimonial.
   */
  useEffect(() => {
    if (
      !sectionVisible ||
      prefersReducedMotion ||
      !autoRotate
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            SECONDARY_QUOTES.length,
        );
      }, ROTATE_MS);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    sectionVisible,
    prefersReducedMotion,
    autoRotate,
  ]);

  const selectQuote = (
    index: number,
  ) => {
    setAutoRotate(false);
    setActiveIndex(index);
  };

  const firstLineTyped =
    typedHeading.slice(
      0,
      Math.min(
        typedHeading.length,
        HEADING_FIRST.length,
      ),
    );

  const secondLineStart =
    HEADING_FIRST.length + 1;

  const secondLineTyped =
    typedHeading.length >
    secondLineStart
      ? typedHeading.slice(
          secondLineStart,
        )
      : "";

  const typingSecondLine =
    typedHeading.length >
    HEADING_FIRST.length;

  return (
    <section
      ref={sectionRef}
      data-active={
        sectionVisible
          ? "true"
          : "false"
      }
      className="testimonials-section relative overflow-hidden border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Section heading */}
        <div className="testimonials-reveal grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionEyebrow>
              / 07 — In their words
            </SectionEyebrow>

            <h2
              aria-label={FULL_HEADING}
              className="min-h-[1.9em] max-w-[19ch] font-mono text-[clamp(2.1rem,4.7vw,4.8rem)] font-medium leading-[0.97] tracking-[-0.045em] text-bone"
            >
              <span className="block min-h-[0.97em]">
                {firstLineTyped}

                {!typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="testimonials-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>

              <span className="block min-h-[0.97em] text-cobalt">
                {secondLineTyped}

                {typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="testimonials-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>
          </div>

          <div className="max-w-[510px] lg:justify-self-end">
            <p className="text-[clamp(1rem,1.35vw,1.12rem)] leading-[1.72] text-ash">
              The strongest proof appears after
              delivery-when the system is operating,
              the team is using it and the client can
              judge how the work was handled.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-signal">
              <span className="size-[6px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

              Client signal received
            </div>
          </div>
        </div>

        {/* Testimonial layout */}
        <div className="testimonials-reveal mt-14 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Featured testimonial */}
          <article className="testimonial-featured-card relative min-h-[560px] overflow-hidden rounded-[26px] border border-glass-border bg-[rgba(22,24,28,0.68)] p-7 sm:p-10">
            <div
              aria-hidden="true"
              className="testimonial-featured-glow pointer-events-none absolute inset-0"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-16 font-display text-[18rem] font-semibold leading-none text-cobalt/[0.055]"
            >
              “
            </span>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between gap-5">
                <span className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-cobalt">
                  Featured client signal
                </span>

                <span className="font-mono text-[0.5rem] uppercase tracking-[0.11em] text-ash">
                  01 / 03
                </span>
              </div>

              <div className="testimonial-featured-quote mt-12">
                <blockquote className="max-w-[22ch] text-balance font-display text-[clamp(2.1rem,4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-bone">
                  “{FEATURED_QUOTE.quote}”
                </blockquote>
              </div>

              <div className="mt-auto pt-12">
                <div className="flex flex-wrap items-end justify-between gap-6 border-t border-glass-border pt-6">
                  <div>
                    <span className="block font-display text-[1.15rem] font-medium text-bone">
                      {FEATURED_QUOTE.who}
                    </span>

                    <span className="mt-2 block font-mono text-[0.55rem] uppercase tracking-[0.11em] text-ash">
                      {FEATURED_QUOTE.company}
                      {" · "}
                      {FEATURED_QUOTE.country}
                    </span>
                  </div>

                  <span className="border border-glass-border bg-glass px-3 py-2 font-mono text-[0.48rem] uppercase tracking-[0.09em] text-cobalt">
                    {FEATURED_QUOTE.project}
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-1 border-l border-t border-glass-border sm:grid-cols-3">
                  {FEATURED_QUOTE.signals.map(
                    (signal, index) => (
                      <div
                        key={signal}
                        className="testimonial-featured-signal border-b border-r border-glass-border px-4 py-5"
                        style={{
                          animationDelay: `${index * 110}ms`,
                        }}
                      >
                        <span className="block font-mono text-[0.46rem] uppercase tracking-[0.1em] text-signal">
                          Signal 0{index + 1}
                        </span>

                        <span className="mt-2 block text-[0.82rem] leading-[1.5] text-bone">
                          {signal}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Rotating testimonial side */}
          <div className="grid gap-4">
            <article
              key={`${activeIndex}-${activeQuote.quote}`}
              className="testimonial-secondary-card relative min-h-[350px] overflow-hidden rounded-[22px] border border-glass-border bg-[rgba(22,24,28,0.6)] p-7"
            >
              <div className="flex items-center justify-between gap-5">
                <span className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-cobalt">
                  Client signal
                </span>

                <span className="font-mono text-[0.48rem] uppercase tracking-[0.1em] text-signal">
                  0{activeIndex + 2} / 03
                </span>
              </div>

              {/* Voice waveform */}
              <div
                aria-hidden="true"
                className="testimonial-voice-wave mt-8 flex h-[48px] items-center gap-[4px]"
              >
                {VOICE_BARS.map(
                  (height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="testimonial-voice-bar w-[3px] rounded-full bg-gradient-to-t from-cobalt to-signal"
                      style={{
                        height: `${height}%`,
                        animationDelay:
                          `${index * 45}ms`,
                      }}
                    />
                  ),
                )}
              </div>

              <blockquote className="mt-8 text-balance font-display text-[clamp(1.55rem,2.4vw,2.4rem)] font-medium leading-[1.16] tracking-[-0.025em] text-bone">
                “{activeQuote.quote}”
              </blockquote>

              <div className="mt-8 border-t border-glass-border pt-5">
                <span className="block text-[0.9rem] font-medium text-bone">
                  {activeQuote.who}
                </span>

                <span className="mt-2 block font-mono text-[0.5rem] uppercase tracking-[0.1em] text-ash">
                  {activeQuote.company}
                  {" · "}
                  {activeQuote.country}
                </span>
              </div>

              {autoRotate &&
                !prefersReducedMotion && (
                  <div className="absolute inset-x-0 bottom-0 h-px bg-glass-border">
                    <span
                      key={`testimonial-progress-${activeIndex}`}
                      className="testimonial-rotation-progress block h-full bg-gradient-to-r from-cobalt to-signal"
                      style={{
                        animationDuration:
                          `${ROTATE_MS}ms`,
                      }}
                    />
                  </div>
                )}
            </article>

            {/* Quote selectors */}
            <div className="grid grid-cols-2 gap-3">
              {SECONDARY_QUOTES.map(
                (quote, index) => {
                  const active =
                    activeIndex === index;

                  return (
                    <button
                      key={quote.quote}
                      type="button"
                      data-hover
                      aria-pressed={active}
                      onClick={() =>
                        selectQuote(index)
                      }
                      className={`testimonial-selector relative min-h-[110px] border p-4 text-left transition-colors duration-base ${
                        active
                          ? "border-cobalt/50 bg-[rgba(0,202,224,0.12)]"
                          : "border-glass-border bg-[rgba(11,12,14,0.38)] hover:bg-glass"
                      }`}
                    >
                      <span
                        className={`font-mono text-[0.46rem] uppercase tracking-[0.1em] ${
                          active
                            ? "text-signal"
                            : "text-ash"
                        }`}
                      >
                        Signal 0{index + 2}
                      </span>

                      <span className="mt-3 block font-display text-[1rem] font-medium text-bone">
                        {quote.project}
                      </span>

                      <span className="mt-2 block font-mono text-[0.43rem] uppercase tracking-[0.08em] text-ash">
                        {quote.country}
                      </span>

                      {active && (
                        <span className="absolute inset-x-0 top-0 h-px bg-signal shadow-[0_0_9px_var(--signal)]" />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* Selected value */}
            <div
              key={`signals-${activeIndex}`}
              className="testimonial-values-card rounded-[18px] border border-glass-border bg-[rgba(11,12,14,0.4)] p-5"
            >
              <span className="font-mono text-[0.49rem] uppercase tracking-[0.12em] text-cobalt">
                What this client valued
              </span>

              <div className="mt-4 space-y-3">
                {activeQuote.signals.map(
                  (signal, index) => (
                    <div
                      key={signal}
                      className="flex items-center gap-3 border-b border-glass-border pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="font-mono text-[0.43rem] text-signal">
                        0{index + 1}
                      </span>

                      <span className="text-[0.78rem] text-ash">
                        {signal}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="testimonials-reveal mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-glass-border pt-5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
          <span>
            Clear communication before, during and after delivery
          </span>

          <span>
            Trust is part of the system
          </span>
        </div>
      </div>

      <span
        className="sr-only"
        aria-live="polite"
      >
        Current testimonial from
        {" "}
        {activeQuote.who},
        {" "}
        {activeQuote.company}.
      </span>
    </section>
  );
}