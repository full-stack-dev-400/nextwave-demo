"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";

import { useDegradation } from "@/providers/DegradationProvider";
import { useFableTimeline } from "./useFableTimeline";

const ParticleScene = dynamic(
  () =>
    import("./ParticleScene").then(
      (module) => module.ParticleScene,
    ),
  {
    ssr: false,
  },
);

type StageAlignment =
  | "left"
  | "right"
  | "center";

type Stage = {
  number: string;
  label: string;
  title: string;
  accent?: string;
  description: string;
  alignment: StageAlignment;
  final?: boolean;
};

const STAGES: Stage[] = [
  {
    number: "01",
    label: "Input",
    title: "Ideas enter",
    accent: "unfinished.",
    description:
      "Every project begins as scattered requirements, ambition and operational complexity.",
    alignment: "left",
  },
  {
    number: "02",
    label: "Strategy",
    title: "Direction creates",
    accent: "momentum.",
    description:
      "We define the path, organise the vision and give the idea a measurable direction.",
    alignment: "left",
  },
  {
    number: "03",
    label: "Architecture",
    title: "Complexity becomes",
    accent: "clear.",
    description:
      "Workflows, interfaces and infrastructure are shaped into one structured system.",
    alignment: "left",
  },
  {
    number: "04",
    label: "Engineering",
    title: "Every layer",
    accent: "connects.",
    description:
      "Frontend, backend, data and logic work together as one operational product.",
    alignment: "left",
  },
  {
    number: "05",
    label: "Outcome",
    title: "Systems built to move",
    accent: "business forward.",
    description:
      "From an unfinished idea to a measurable digital system designed for continued growth.",
    alignment: "left",
    final: true,
  },
];

function getAlignmentClass(
  alignment: StageAlignment,
) {
  if (alignment === "right") {
    return `
      ml-auto
      items-end
      text-right
    `;
  }

  if (alignment === "center") {
    return `
      mx-auto
      items-center
      text-center
    `;
  }

  return `
    mr-auto
    items-start
    text-left
  `;
}

export function FableSequence() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const progressRef =
    useRef(0);

  const {
    prefersReducedMotion,
  } = useDegradation();

  useFableTimeline(
    sectionRef,
    progressRef,
    prefersReducedMotion,
  );

  return (
    <section
      ref={sectionRef}
      id="system-sequence"
      className="
        relative isolate
        h-[100svh]
        overflow-hidden
        border-y border-glass-border
        bg-obsidian text-bone
      "
    >
      {/* WebGL particle scene */}
      <div className="absolute inset-0 z-0">
        <ParticleScene
          progressRef={
            progressRef
          }
          reducedMotion={
            prefersReducedMotion
          }
        />
      </div>

      {/* Dark edge gradients */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 z-[1]
          bg-[radial-gradient(circle_at_center,transparent_20%,rgba(11,12,14,0.22)_60%,rgba(11,12,14,0.92)_100%)]
        "
      />

      {/* Technical grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 z-[2]
          opacity-[0.1]
          [background-image:linear-gradient(rgba(239,239,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(239,239,237,0.04)_1px,transparent_1px)]
          [background-size:72px_72px]
        "
      />

      {/* Central axes */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-1/2 top-0
          z-[2] h-full w-px
          bg-white/[0.045]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-0 top-1/2
          z-[2] h-px w-full
          bg-white/[0.045]
        "
      />

      {/* Top metadata */}
      <div
        className="
          absolute inset-x-0 top-0
          z-20 flex h-[72px]
          items-center justify-between
          border-b border-glass-border
          px-[var(--space-gutter)]
        "
      >
        <span
          className="
            flex items-center gap-3
            font-mono text-[0.58rem]
            uppercase tracking-[0.17em]
            text-ash
          "
        >
          <span
            className="
              size-[6px] rounded-full
              bg-cobalt
              shadow-[0_0_12px_var(--cobalt)]
            "
          />

          BEZTEQ / System formation
        </span>

        <span
          className="
            font-mono text-[0.58rem]
            uppercase tracking-[0.16em]
            text-ash
          "
        >
          Scroll-driven sequence
        </span>
      </div>

      {/* Text stages */}
      <div
        className="
          absolute inset-x-0
          bottom-[88px] top-[72px]
          z-10
        "
      >
        {STAGES.map(
          (
            stage,
            index,
          ) => (
            <article
              key={
                stage.number
              }
              data-fable-stage={
                index
              }
              className="
                invisible absolute
                inset-0 flex
                items-center
                px-[var(--space-gutter)]
                opacity-0
              "
            >
              <div
                className={`
                  flex w-full
                  max-w-[560px]
                  flex-col
                  ${getAlignmentClass(stage.alignment)}
                `}
              >
                <div
                  className="
                    flex items-center
                    gap-3 font-mono
                    text-[0.58rem]
                    uppercase
                    tracking-[0.18em]
                    text-cobalt
                  "
                >
                  <span>
                    {
                      stage.number
                    }
                  </span>

                  <span className="h-px w-10 bg-cobalt/60" />

                  <span>
                    {
                      stage.label
                    }
                  </span>
                </div>

                <h2
                  className="
                  mt-5 max-w-[10ch]
                  font-display
                  text-[clamp(2.4rem,5vw,5.4rem)]
                  font-semibold
                  leading-[0.88]
                  tracking-[-0.055em]
                  text-bone
                "
                >
                  {
                    stage.title
                  }

                  {stage.accent && (
                    <span
                      className="
                        block
                        text-cobalt
                        opacity-95
                      "
                    >
                      {
                        stage.accent
                      }
                    </span>
                  )}
                </h2>

                <p
className="
  mt-5 max-w-[42ch]
  text-[clamp(0.92rem,1vw,1rem)]
  leading-[1.75]
  text-ash
"
                >
                  {
                    stage.description
                  }
                </p>

                {stage.final && (
                  <div
                    className="
                      mt-10 flex
                      flex-wrap
                      justify-center
                      gap-4
                    "
                  >
                    <Link
                      href="/contact"
                      className="
                        inline-flex
                        min-h-[52px]
                        items-center
                        justify-center
                        rounded-full
                        bg-cobalt
                        px-7
                        font-mono
                        text-[0.62rem]
                        uppercase
                        tracking-[0.14em]
                        text-obsidian
                        transition-transform
                        duration-fast
                        hover:-translate-y-1
                      "
                    >
                      Start a project
                    </Link>

                    <Link
                      href="/work"
                      className="
                        inline-flex
                        min-h-[52px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-glass-border
                        bg-glass
                        px-7
                        font-mono
                        text-[0.62rem]
                        uppercase
                        tracking-[0.14em]
                        text-bone
                        transition-colors
                        duration-fast
                        hover:border-cobalt/60
                        hover:text-cobalt
                      "
                    >
                      Explore our work
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ),
        )}
      </div>

      {/* Bottom sequence progress */}
      <div
        className="
          absolute inset-x-0 bottom-0
          z-20 h-[88px]
          border-t border-glass-border
          bg-[rgba(11,12,14,0.62)]
          px-[var(--space-gutter)]
          backdrop-blur-md
        "
      >
        <div
          className="
            flex h-full
            items-center gap-3
          "
        >
          {STAGES.map(
            (stage) => (
              <div
                key={
                  stage.number
                }
                className="
                  flex-1
                "
              >
                <div
                  className="
                    h-px
                    overflow-hidden
                    bg-white/10
                  "
                >
                  <span
                    data-fable-progress
                    className="
                      block h-full
                      w-full
                      origin-left
                      scale-x-0
                      bg-cobalt
                    "
                  />
                </div>

                <span
                  className="
                    mt-2 hidden
                    font-mono
                    text-[0.46rem]
                    uppercase
                    tracking-[0.12em]
                    text-ash
                    sm:block
                  "
                >
                  {
                    stage.number
                  }{" "}
                  /{" "}
                  {
                    stage.label
                  }
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}