"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ContactForm } from "@/components/ui/ContactForm";
import { useDegradation } from "@/providers/DegradationProvider";

interface IntakeStep {
  id: string;
  name: string;
  description: string;
  output: string;
}

const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "INT-01",
    name: "Share the problem",
    description:
      "Tell us what is not working, what needs to improve and what the business needs next.",
    output: "Initial business brief",
  },
  {
    id: "INT-02",
    name: "We assess the system",
    description:
      "We review the requirements, possible constraints and the clearest route forward.",
    output: "Scope direction",
  },
  {
    id: "INT-03",
    name: "Receive the next step",
    description:
      "You receive a practical recommendation for discovery, planning or project delivery.",
    output: "Actionable response",
  },
];

const HEADING_FIRST = "Bring the brief.";
const HEADING_SECOND = "We’ll build the system.";

const FULL_HEADING =
  `${HEADING_FIRST} ${HEADING_SECOND}`;

export function CtaContact() {
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
    activeStep,
    setActiveStep,
  ] = useState(0);

  /*
   * Detect when the final CTA enters the viewport.
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
            "0px 0px -8% 0px",
        },
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Type the final CTA heading once.
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
   * Demonstrate the three intake stages.
   */
  useEffect(() => {
    if (
      !sectionVisible ||
      prefersReducedMotion
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        setActiveStep(
          (current) =>
            (current + 1) %
            INTAKE_STEPS.length,
        );
      }, 3200);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    sectionVisible,
    prefersReducedMotion,
  ]);

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

  const intakeProgress =
    ((activeStep + 1) /
      INTAKE_STEPS.length) *
    100;

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-active={
        sectionVisible
          ? "true"
          : "false"
      }
      className="final-cta-section relative overflow-hidden border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Section introduction */}
        <div className="final-cta-reveal grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionEyebrow>
              / 08 — Start a project
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
                    className="final-cta-heading-cursor text-signal"
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
                    className="final-cta-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>
          </div>

          <div className="max-w-[510px] lg:justify-self-end">
            <p className="text-[clamp(1rem,1.35vw,1.12rem)] leading-[1.72] text-ash">
              Tell us what the business needs,
              where the current friction exists and
              what a successful result should look
              like. We will turn that into a clear
              next step.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-signal">
              <span className="final-cta-live-dot size-[6px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

              Project intake open
            </div>
          </div>
        </div>

        {/* Main CTA console */}
        <div className="final-cta-reveal mt-14 grid overflow-hidden rounded-[28px] border border-glass-border bg-[rgba(22,24,28,0.7)] lg:grid-cols-[0.78fr_1.22fr]">
          {/* What happens next */}
          <div className="relative overflow-hidden border-b border-glass-border p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
            <div
              aria-hidden="true"
              className="final-cta-left-glow pointer-events-none absolute inset-0"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <span className="block font-mono text-[0.52rem] uppercase tracking-[0.13em] text-ash">
                    Project handoff
                  </span>

                  <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.11em] text-bone">
                    Brief → assessment → next step
                  </span>
                </div>

                <span className="font-mono text-[0.48rem] uppercase tracking-[0.1em] text-signal">
                  Open
                </span>
              </div>

              <h3 className="mt-10 max-w-[12ch] font-display text-[clamp(2rem,3.7vw,4rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-bone">
                A clear start creates a better system.
              </h3>

              <p className="mt-6 max-w-[45ch] text-[0.94rem] leading-[1.7] text-ash">
                You do not need to prepare a perfect
                specification. Start with the business
                problem and the outcome you are trying
                to create.
              </p>

              {/* Intake stages */}
              <div className="mt-10 space-y-3">
                {INTAKE_STEPS.map(
                  (step, index) => {
                    const active =
                      activeStep === index;

                    const complete =
                      index < activeStep;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        data-hover
                        aria-pressed={active}
                        onClick={() =>
                          setActiveStep(index)
                        }
                        className={`final-cta-step relative w-full border p-4 text-left transition-colors duration-base ${
                          active
                            ? "border-cobalt/50 bg-[rgba(0,202,224,0.11)]"
                            : "border-glass-border bg-[rgba(11,12,14,0.36)] hover:bg-glass"
                        }`}
                      >
                        <div className="grid gap-4 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center">
                          <span
                            className={`font-mono text-[0.52rem] uppercase tracking-[0.11em] ${
                              active
                                ? "text-signal"
                                : complete
                                  ? "text-cobalt"
                                  : "text-ash"
                            }`}
                          >
                            0{index + 1}
                          </span>

                          <div>
                            <span className="block font-display text-[1.1rem] font-medium text-bone">
                              {step.name}
                            </span>

                            <span className="mt-1 block max-w-[47ch] text-[0.76rem] leading-[1.55] text-ash">
                              {step.description}
                            </span>
                          </div>

                          <span className="font-mono text-[0.43rem] uppercase tracking-[0.08em] text-ash">
                            {step.output}
                          </span>
                        </div>

                        {active && (
                          <span className="absolute inset-y-0 left-0 w-[2px] bg-signal shadow-[0_0_10px_rgba(216,216,211,0.45)]" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Intake progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between font-mono text-[0.48rem] uppercase tracking-[0.1em] text-ash">
                  <span>
                    Intake sequence
                  </span>

                  <span className="text-signal">
                    {String(
                      activeStep + 1,
                    ).padStart(2, "0")}
                    /0{INTAKE_STEPS.length}
                  </span>
                </div>

                <div className="mt-3 h-px bg-glass-border">
                  <span
                    className="final-cta-progress block h-full bg-gradient-to-r from-cobalt to-signal shadow-[0_0_10px_rgba(216,216,211,0.3)]"
                    style={{
                      width: `${intakeProgress}%`,
                    }}
                  />
                </div>
              </div>

              <Link
                href="/contact"
                data-hover
                data-label="OPEN"
                className="mt-8 inline-flex items-center gap-3 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-bone transition-colors duration-fast hover:text-signal"
              >
                Open the full contact page
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Project intake form */}
          <div className="final-cta-form-shell relative min-w-0 overflow-hidden">
            <div
              aria-hidden="true"
              className="final-cta-form-grid pointer-events-none absolute inset-0"
            />

            {!prefersReducedMotion && (
              <span
                aria-hidden="true"
                className="final-cta-form-scan pointer-events-none absolute inset-x-[5%] top-[75px] z-10 h-px"
              />
            )}

            <div className="relative z-20 flex min-h-[72px] items-center justify-between gap-5 border-b border-glass-border bg-[rgba(11,12,14,0.48)] px-6 sm:px-8">
              <div>
                <span className="block font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ash">
                  BEZTEQ project intake
                </span>

                <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.11em] text-bone">
                  New project brief
                </span>
              </div>

              <span className="flex items-center gap-2 font-mono text-[0.47rem] uppercase tracking-[0.1em] text-signal">
                <span className="size-[5px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                Ready
              </span>
            </div>

            <div className="relative z-20 p-6 sm:p-8 lg:p-9">
              <div className="mb-8 grid grid-cols-3 border-y border-glass-border">
                <div className="py-4 pr-3">
                  <span className="block font-mono text-[0.43rem] uppercase tracking-[0.09em] text-ash">
                    Input
                  </span>

                  <span className="mt-1 block text-[0.76rem] text-bone">
                    Business need
                  </span>
                </div>

                <div className="border-x border-glass-border px-3 py-4">
                  <span className="block font-mono text-[0.43rem] uppercase tracking-[0.09em] text-ash">
                    Review
                  </span>

                  <span className="mt-1 block text-[0.76rem] text-bone">
                    Scope direction
                  </span>
                </div>

                <div className="py-4 pl-3">
                  <span className="block font-mono text-[0.43rem] uppercase tracking-[0.09em] text-ash">
                    Output
                  </span>

                  <span className="mt-1 block text-[0.76rem] text-bone">
                    Clear next step
                  </span>
                </div>
              </div>

              <ContactForm showService={true} />
            </div>

            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-glass-border bg-[rgba(11,12,14,0.42)] px-6 py-4 font-mono text-[0.45rem] uppercase tracking-[0.1em] text-ash sm:px-8">
              <span>
                Start with the problem
              </span>

              <span>
                Clear scope before commitment
              </span>
            </div>
          </div>
        </div>

        {/* Final annotation */}
        <div className="final-cta-reveal mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-glass-border pt-5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
          <span>
            Built around your business
          </span>

          <span>
            From first brief to operating system
          </span>
        </div>
      </div>

      <span
        className="sr-only"
        aria-live="polite"
      >
        Current project-intake stage:
        {" "}
        {INTAKE_STEPS[activeStep].name}.
      </span>
    </section>
  );
}