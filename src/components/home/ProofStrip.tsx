"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

interface ProofItem {
  value: string;
  label: string;
  description: string;
  status: string;
}

const PROOF_ITEMS: ProofItem[] = [
  {
    value: "6+",
    label: "Years of experience",
    description:
      "Production websites, digital platforms and business systems engineered across multiple industries.",
    status: "Experienced",
  },
  {
    value: "20+",
    label: "International markets",
    description:
      "Experience delivering digital work across the GCC, Africa, Europe and Asia.",
    status: "Global",
  },
  {
    value: "99.9%",
    label: "Infrastructure uptime",
    description:
      "Reliable cloud deployments, monitoring and maintenance for business-critical systems.",
    status: "Stable",
  },
  {
    value: "End-to-end",
    label: "Project ownership",
    description:
      "Strategy, interface, engineering, integrations, deployment and continuous improvement.",
    status: "Complete",
  },
];

const PIPELINE_STEPS = [
  "Diagnose",
  "Architect",
  "Build",
  "Stress-test",
  "Deploy",
];

const HEADING_FIRST = "Proof,";
const HEADING_SECOND = "not promises.";
const FULL_HEADING = `${HEADING_FIRST} ${HEADING_SECOND}`;

export function ProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [typedHeading, setTypedHeading] = useState("");
  const headingStartedRef = useRef(false);

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

        setActive(true);
        observer.disconnect();
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

    useEffect(() => {
    if (!active || headingStartedRef.current) {
      return;
    }

    headingStartedRef.current = true;

    let characterIndex = 0;

    const typingInterval = window.setInterval(() => {
      characterIndex += 1;

      setTypedHeading(
        FULL_HEADING.slice(0, characterIndex),
      );

      if (characterIndex >= FULL_HEADING.length) {
        window.clearInterval(typingInterval);
      }
    }, 75);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [active]);

  /*
   * These variables also go before return
   */
  const firstLineTyped = typedHeading.slice(
    0,
    Math.min(
      typedHeading.length,
      HEADING_FIRST.length,
    ),
  );

  const secondLineStart = HEADING_FIRST.length + 1;

  const secondLineTyped =
    typedHeading.length > secondLineStart
      ? typedHeading.slice(secondLineStart)
      : "";

  const typingSecondLine =
    typedHeading.length > HEADING_FIRST.length;

  return (
    <section
      ref={sectionRef}
      data-active={active ? "true" : "false"}
      className="proof-strip relative overflow-hidden border-y border-glass-border bg-graphite/30 px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Section heading */}
        <div className="proof-reveal grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionEyebrow>
              / 02 — System output
            </SectionEyebrow>

            <h2
              aria-label={FULL_HEADING}
              className="min-h-[1.84em] max-w-[14ch] font-mono text-[clamp(2.2rem,4.8vw,5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-bone"
            >
              <span className="block min-h-[0.95em]">
                {firstLineTyped}

                {!typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="proof-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>

              <span className="block min-h-[0.95em] text-cobalt">
                {secondLineTyped}

                {typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="proof-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>
          </div>

          <div className="max-w-[520px] lg:justify-self-end">
            <p className="text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.7] text-ash">
              Every system is judged by the same conditions:
              performance, reach, reliability and ownership.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-signal">
              <span className="proof-status-dot size-[7px] rounded-full bg-signal shadow-[0_0_12px_var(--signal)]" />
              Operational record verified
            </div>
          </div>
        </div>

        {/* Proof modules */}
        <div className="mt-16 grid grid-cols-1 border-l border-t border-glass-border sm:grid-cols-2 xl:grid-cols-4">
          {PROOF_ITEMS.map((item, index) => (
            <article
              key={item.label}
              data-hover
              data-label="PROOF"
              tabIndex={0}
              className="proof-module group relative min-h-[280px] overflow-hidden border-b border-r border-glass-border bg-[rgba(22,24,28,0.56)] p-6 outline-none sm:p-7"
              style={
                {
                  "--proof-delay": `${index * 160}ms`,
                } as CSSProperties
              }
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.13em] text-ash">
                  <span>
                    Module {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex items-center gap-2 text-signal">
                    <span className="size-[4px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                    {item.status}
                  </span>
                </div>

                <div className="mt-auto pt-14">
                  <div
                    className={`font-display font-semibold leading-none tracking-[-0.045em] text-bone transition-colors duration-base group-hover:text-cobalt ${
                      item.value === "End-to-end"
                        ? "text-[clamp(2.3rem,3.6vw,3.8rem)]"
                        : "text-[clamp(3.8rem,6vw,6.2rem)]"
                    }`}
                  >
                    {item.value}
                  </div>

                  <h3 className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-bone">
                    {item.label}
                  </h3>

                  <p className="mt-4 max-w-[32ch] text-[0.86rem] leading-[1.65] text-ash">
                    {item.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-3 font-mono text-[0.54rem] uppercase tracking-[0.12em] text-ash">
                  <span className="h-px flex-1 bg-glass-border" />
                  Output confirmed
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Engineering pipeline */}
        <div className="proof-pipeline mt-14 border border-glass-border bg-[rgba(11,12,14,0.48)] px-5 py-6 sm:px-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ash">
              BEZTEQ production pipeline
            </span>

            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-signal">
              System path / complete
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-[7px] h-px bg-glass-border">
              <span className="proof-pipeline-progress absolute inset-y-0 left-0 w-full bg-gradient-to-r from-cobalt via-signal to-cobalt shadow-[0_0_12px_rgba(216,216,211,0.5)]" />
            </div>

            <div className="relative grid grid-cols-5 gap-2">
              {PIPELINE_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`proof-pipeline-step ${
                    index === PIPELINE_STEPS.length - 1
                      ? "text-right"
                      : index === 0
                        ? "text-left"
                        : "text-center"
                  }`}
                  style={
                    {
                      "--pipeline-delay": `${600 + index * 180}ms`,
                    } as CSSProperties
                  }
                >
                  <span className="proof-pipeline-node relative z-10 inline-block size-[15px] rounded-full border border-glass-border bg-obsidian">
                    <span className="absolute inset-[4px] rounded-full bg-signal" />
                  </span>

                  <span className="mt-4 block font-mono text-[0.54rem] uppercase tracking-[0.1em] text-ash sm:text-[0.62rem]">
                    <span className="hidden sm:inline">
                      0{index + 1} /
                    </span>{" "}
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom annotation */}
        <div className="proof-reveal mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ash">
          <span>
            Engineering standard / BEZTEQ-01
          </span>

          <span>
            Built for performance after launch
          </span>
        </div>
      </div>
    </section>
  );
}