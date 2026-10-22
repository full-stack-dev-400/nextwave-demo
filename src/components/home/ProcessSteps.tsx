"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useDegradation } from "@/providers/DegradationProvider";

interface ProcessStep {
  id: string;
  name: string;
  shortName: string;
  phase: string;
  summary: string;
  clientInput: string;
  bezteqAction: string;
  output: string;
  approvalGate: string;
  deliverables: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "PROC-01",
    name: "Discover",
    shortName: "Discover",
    phase: "Business diagnosis",
    summary:
      "We begin by understanding the business before discussing screens, features or technology.",
    clientInput:
      "Business goals, target users, current challenges, existing tools, constraints and priorities.",
    bezteqAction:
      "We review the current operation, identify friction, clarify requirements and define what success should mean.",
    output:
      "A validated project brief that connects the business problem with a clear digital objective.",
    approvalGate:
      "Problem and priorities confirmed",
    deliverables: [
      "Discovery notes",
      "Requirement map",
      "Risk register",
      "Success criteria",
    ],
  },
  {
    id: "PROC-02",
    name: "Architect",
    shortName: "Architect",
    phase: "System definition",
    summary:
      "The approved requirements are converted into a practical structure, scope and technical direction.",
    clientInput:
      "Approved priorities, internal workflows, platform access and relevant operational information.",
    bezteqAction:
      "We define user flows, information architecture, system modules, integrations, data movement and delivery scope.",
    output:
      "A technical blueprint showing what will be built, how the parts connect and what the delivery includes.",
    approvalGate:
      "Scope and architecture approved",
    deliverables: [
      "System blueprint",
      "User flows",
      "Integration plan",
      "Delivery scope",
    ],
  },
  {
    id: "PROC-03",
    name: "Prototype",
    shortName: "Prototype",
    phase: "Experience validation",
    summary:
      "Important ideas are tested visually before full engineering begins.",
    clientInput:
      "Brand direction, content priorities, user expectations and feedback from relevant stakeholders.",
    bezteqAction:
      "We create wireframes, interface systems and interactive prototypes focused on clarity and usability.",
    output:
      "A validated experience that allows the client to review structure, interaction and direction before development.",
    approvalGate:
      "Experience direction approved",
    deliverables: [
      "Wireframes",
      "Visual direction",
      "Interactive prototype",
      "Design system",
    ],
  },
  {
    id: "PROC-04",
    name: "Engineer",
    shortName: "Engineer",
    phase: "Production build",
    summary:
      "The approved system is developed, connected and demonstrated through visible delivery cycles.",
    clientInput:
      "Approved prototype, required accounts, platform credentials, content and timely review feedback.",
    bezteqAction:
      "We build the frontend, backend, CMS, database, APIs and integrations while sharing progress through working reviews.",
    output:
      "A functional production-ready system tested against the approved requirements and real business workflows.",
    approvalGate:
      "Build accepted for release",
    deliverables: [
      "Production code",
      "CMS or dashboard",
      "API integrations",
      "QA build",
    ],
  },
  {
    id: "PROC-05",
    name: "Launch & improve",
    shortName: "Launch",
    phase: "Operational release",
    summary:
      "Launch is treated as the beginning of operation, not the end of responsibility.",
    clientInput:
      "Final approval, launch access, responsible contacts and operational readiness from the client team.",
    bezteqAction:
      "We complete final QA, performance checks, deployment, monitoring, handover and post-launch improvement planning.",
    output:
      "A live, monitored and documented system with a clear path for support, optimization and future growth.",
    approvalGate:
      "System operating successfully",
    deliverables: [
      "Live deployment",
      "Handover documents",
      "Monitoring setup",
      "Improvement roadmap",
    ],
  },
];

const HEADING_FIRST = "From business brief.";
const HEADING_SECOND = "To operating system.";
const FULL_HEADING = `${HEADING_FIRST} ${HEADING_SECOND}`;

export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingStartedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const { prefersReducedMotion } = useDegradation();

  const [sectionVisible, setSectionVisible] =
    useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedHeading, setTypedHeading] =
    useState("");

  const activeStep = PROCESS_STEPS[activeIndex];

  const progress =
    PROCESS_STEPS.length <= 1
      ? 100
      : (activeIndex /
          (PROCESS_STEPS.length - 1)) *
        100;

  /*
   * Detect when Section 5 enters the viewport.
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
        threshold: 0.08,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * Type the heading once.
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

    const intervalId = window.setInterval(() => {
      characterIndex += 1;

      setTypedHeading(
        FULL_HEADING.slice(0, characterIndex),
      );

      if (
        characterIndex >= FULL_HEADING.length
      ) {
        window.clearInterval(intervalId);
      }
    }, 66);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sectionVisible, prefersReducedMotion]);

  /*
   * Demonstrate the complete process once the section
   * becomes visible.
   *
   * The automatic cycle stops permanently after the
   * visitor selects a stage manually.
   */
  useEffect(() => {
    if (
      !sectionVisible ||
      prefersReducedMotion
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (userInteractedRef.current) {
        window.clearInterval(intervalId);
        return;
      }

      setActiveIndex(
        (current) =>
          (current + 1) %
          PROCESS_STEPS.length,
      );
    }, 3900);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sectionVisible, prefersReducedMotion]);

  const selectStep = (index: number) => {
    userInteractedRef.current = true;
    setActiveIndex(index);
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

  return (
    <section
      ref={sectionRef}
      data-active={sectionVisible ? "true" : "false"}
      className="process-machine-section relative overflow-hidden border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="process-machine-reveal grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionEyebrow>
              / 05 — How we work
            </SectionEyebrow>

            <h2
              aria-label={FULL_HEADING}
              className="min-h-[1.9em] max-w-[19ch] font-display text-[clamp(2.1rem,4.7vw,4.8rem)] font-medium leading-[0.97] tracking-[-0.045em] text-bone"
            >
              <span className="block min-h-[0.97em]">
                {firstLineTyped}

                {!typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="process-heading-cursor text-signal"
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
                    className="process-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>
          </div>

          <div className="max-w-[520px] lg:justify-self-end">
            <p className="text-[clamp(1rem,1.35vw,1.12rem)] leading-[1.72] text-ash">
              Every engagement follows a visible
              sequence. The client always knows what
              we need, what we are doing and what will
              be delivered next.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-signal">
              <span className="size-[6px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />
              Client visibility enabled
            </div>
          </div>
        </div>

        {/* Process console */}
        <div className="process-machine-reveal mt-14 overflow-hidden rounded-[26px] border border-glass-border bg-[rgba(22,24,28,0.7)]">
          <div className="grid lg:grid-cols-[0.58fr_1.42fr]">
            {/* Process selector */}
            <div className="border-b border-glass-border lg:border-b-0 lg:border-r">
              <div className="process-stage-grid">
                {PROCESS_STEPS.map((step, index) => {
                  const active =
                    activeIndex === index;

                  const completed =
                    index < activeIndex;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      data-hover
                      aria-pressed={active}
                      onClick={() =>
                        selectStep(index)
                      }
                      onPointerEnter={() => {
                        if (
                          window.matchMedia(
                            "(hover: hover)",
                          ).matches
                        ) {
                          selectStep(index);
                        }
                      }}
                      className={`process-stage-button group relative min-w-0 px-4 py-5 text-left transition-colors duration-base sm:px-5 sm:py-6 ${
                        active
                          ? "bg-[rgba(0,202,224,0.13)]"
                          : "hover:bg-glass"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={`font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                            active
                              ? "text-signal"
                              : completed
                                ? "text-cobalt"
                                : "text-ash"
                          }`}
                        >
                          0{index + 1}
                        </span>

                        <span
                          className={`size-[6px] rounded-full ${
                            active
                              ? "bg-signal shadow-[0_0_9px_var(--signal)]"
                              : completed
                                ? "bg-cobalt"
                                : "border border-ash/40"
                          }`}
                        />
                      </div>

                      <span
                      className={`mt-4 block font-display font-medium leading-[1.05] tracking-[-0.025em] transition-all duration-base ${
                        active
                          ? "text-[1.35rem] text-bone sm:text-[1.55rem] lg:translate-x-1 lg:text-[clamp(1.45rem,2vw,2rem)]"
                          : "text-[1.15rem] text-ash group-hover:text-bone sm:text-[1.3rem] lg:text-[clamp(1.2rem,1.55vw,1.55rem)]"
                      }`}
                      >
                        {step.name}
                      </span>

                      <span className="mt-3 block font-mono text-[0.48rem] uppercase leading-[1.5] tracking-[0.09em] text-ash">
                        {step.phase}
                      </span>

                      <span
                        className={`absolute inset-y-0 left-0 w-[2px] origin-top bg-cobalt transition-transform duration-base ${
                          active
                            ? "scale-y-100"
                            : "scale-y-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active work order */}
            <div
              key={activeStep.id}
              className="process-work-order min-w-0"
            >
              {/* Console header */}
              <div className="flex min-h-[72px] items-center justify-between gap-5 border-b border-glass-border px-6 sm:px-8">
                <div>
                  <span className="block font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ash">
                    Client work order
                  </span>

                  <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.11em] text-bone">
                    {activeStep.id} /{" "}
                    {activeStep.phase}
                  </span>
                </div>

                <span className="flex items-center gap-2 font-mono text-[0.48rem] uppercase tracking-[0.11em] text-signal">
                  <span className="process-live-dot size-[5px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                  Active phase
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
                  {/* Phase summary */}
                  <div>
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.13em] text-cobalt">
                      Phase{" "}
                      {String(
                        activeIndex + 1,
                      ).padStart(2, "0")}
                    </span>

                    <h3 className="mt-4 max-w-[13ch] font-display text-[clamp(2.2rem,4vw,4.3rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-bone">
                      {activeStep.name}
                    </h3>

                    <p className="mt-5 max-w-[44ch] text-[0.94rem] leading-[1.7] text-ash">
                      {activeStep.summary}
                    </p>

                    <div className="mt-7 border-l-2 border-signal bg-[rgba(216,216,211,0.035)] px-5 py-4">
                      <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-signal">
                        Approval gate
                      </span>

                      <p className="mt-2 text-[0.84rem] leading-[1.55] text-bone">
                        {activeStep.approvalGate}
                      </p>
                    </div>
                  </div>

                  {/* Input/action/output */}
                  <div className="grid gap-3">
                    <div className="process-detail-row grid gap-4 border border-glass-border bg-glass p-4 sm:grid-cols-[130px_1fr]">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.11em] text-cobalt">
                        Client input
                      </span>

                      <p className="text-[0.82rem] leading-[1.6] text-ash">
                        {activeStep.clientInput}
                      </p>
                    </div>

                    <div className="process-detail-row grid gap-4 border border-glass-border bg-glass p-4 sm:grid-cols-[130px_1fr]">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.11em] text-cobalt">
                        BEZTEQ action
                      </span>

                      <p className="text-[0.82rem] leading-[1.6] text-ash">
                        {activeStep.bezteqAction}
                      </p>
                    </div>

                    <div className="process-detail-row grid gap-4 border border-glass-border bg-glass p-4 sm:grid-cols-[130px_1fr]">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.11em] text-cobalt">
                        Client output
                      </span>

                      <p className="text-[0.82rem] leading-[1.6] text-ash">
                        {activeStep.output}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mt-8 border-t border-glass-border pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-cobalt">
                      Phase deliverables
                    </span>

                    <span className="font-mono text-[0.47rem] uppercase tracking-[0.1em] text-ash">
                      Output package / verified
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {activeStep.deliverables.map(
                      (deliverable, index) => (
                        <div
                          key={deliverable}
                          className="process-deliverable flex min-h-[58px] items-center border border-glass-border bg-[rgba(11,12,14,0.42)] px-4 py-3"
                          style={{
                            animationDelay: `${index * 90}ms`,
                          }}
                        >
                          <span className="mr-3 size-[5px] shrink-0 rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />

                          <span className="font-mono text-[0.5rem] uppercase leading-[1.4] tracking-[0.08em] text-bone">
                            {deliverable}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Production route */}
              <div
                className="process-route relative border-t border-glass-border px-6 py-7 sm:px-8"
                style={
                  {
                    "--process-progress": `${progress}%`,
                  } as CSSProperties
                }
              >
                <div className="absolute left-8 right-8 top-[34px] h-px bg-glass-border">
                  <span className="process-route-progress absolute inset-y-0 left-0 bg-gradient-to-r from-cobalt to-signal shadow-[0_0_10px_rgba(216,216,211,0.35)]" />
                </div>

               <span
  className="process-workpiece absolute top-[28px] size-[13px] -translate-x-1/2 rounded-full border-2 border-signal bg-obsidian shadow-[0_0_16px_rgba(216,216,211,0.7)]"
  style={{
    left: `calc(2rem + (100% - 4rem) * ${
      progress / 100
    })`,
  }}
/>

                <div className="relative grid grid-cols-5">
                  {PROCESS_STEPS.map(
                    (step, index) => {
                      const complete =
                        index <= activeIndex;

                      return (
                        <div
                          key={step.id}
                          className={`${
                            index === 0
                              ? "text-left"
                              : index ===
                                  PROCESS_STEPS.length -
                                    1
                                ? "text-right"
                                : "text-center"
                          }`}
                        >
                          <span
                            className={`relative z-10 inline-block size-[13px] rounded-full border ${
                              complete
                                ? "border-signal bg-signal"
                                : "border-glass-border bg-obsidian"
                            }`}
                          />

                          <span
                            className={`mt-4 block font-mono text-[0.43rem] uppercase tracking-[0.075em] ${
                              index === activeIndex
                                ? "text-bone"
                                : "text-ash"
                            }`}
                          >
                            {step.shortName}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer annotation */}
        <div className="process-machine-reveal mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-glass-border pt-5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
          <span>
            One visible process / every project
          </span>

          <span>
            Client approval at every critical gate
          </span>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        Current process phase: {activeStep.name}.
      </span>
    </section>
  );
}