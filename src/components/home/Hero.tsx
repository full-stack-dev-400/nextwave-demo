"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Core } from "@/components/core/Core";
import { Button } from "@/components/ui/Button";
import { useDegradation } from "@/providers/DegradationProvider";
import { COMPANY } from "@/lib/site";
import type { MorphState } from "@/components/core/morph-states";

type EnginePhase =
  | "visual"
  | "scanning"
  | "blueprint"


interface EngineMode {
  label: string;
  shortLabel: string;
  state: MorphState;
  systemId: string;
  description: string;
  command: string;
  completionMessage: string;
  stages: string[];
}

const ENGINE_MODES: EngineMode[] = [
  {
    label: "Web Development",
    shortLabel: "Web",
    state: "lattice",
    systemId: "WEB_SYSTEM_01",
    description:
      "Connected digital products engineered for speed, stability and scale.",
    command: "INITIALIZING WEB DEVELOPMENT PIPELINE",
    completionMessage: "WEB SYSTEM READY FOR BUILD",
    stages: [
      "Idea discovery",
      "Requirements mapping",
      "Information architecture",
      "UI system design",
      "Frontend engineering",
      "CMS and API integration",
      "Quality and performance",
      "Deployment",
    ],
  },
  {
    label: "Custom Software",
    shortLabel: "Software",
    state: "assembling",
    systemId: "SOFTWARE_SYSTEM_02",
    description:
      "Business software assembled around real operational requirements.",
    command: "INITIALIZING SOFTWARE ENGINEERING PIPELINE",
    completionMessage: "SOFTWARE ARCHITECTURE VERIFIED",
    stages: [
      "Operation analysis",
      "Workflow mapping",
      "System architecture",
      "Database design",
      "Business logic",
      "API and integrations",
      "Permissions and testing",
      "Deployment",
    ],
  },
  {
    label: "POS Systems",
    shortLabel: "POS",
    state: "grid",
    systemId: "POS_SYSTEM_03",
    description:
      "Transactions, inventory and reporting connected in one operating system.",
    command: "INITIALIZING POS OPERATIONS PIPELINE",
    completionMessage: "TRANSACTION SYSTEM READY",
    stages: [
      "Checkout flow",
      "Product catalogue",
      "Inventory engine",
      "UAE VAT rules",
      "Offline operation",
      "Payments and receipts",
      "Staff access and reporting",
      "Synchronization",
    ],
  },
  {
    label: "UI and UX",
    shortLabel: "Interface",
    state: "surface",
    systemId: "INTERFACE_SYSTEM_04",
    description:
      "Complex functionality translated into clear, usable interfaces.",
    command: "INITIALIZING INTERFACE DESIGN PIPELINE",
    completionMessage: "INTERFACE SYSTEM VALIDATED",
    stages: [
      "User research",
      "Journey mapping",
      "Information architecture",
      "Wireframing",
      "Visual system",
      "Component library",
      "Prototype and testing",
      "Accessibility and handoff",
    ],
  },
  {
    label: "Digital Growth",
    shortLabel: "Growth",
    state: "waveform",
    systemId: "GROWTH_SYSTEM_05",
    description:
      "Performance signals converted into measurable and scalable growth.",
    command: "INITIALIZING DIGITAL GROWTH PIPELINE",
    completionMessage: "GROWTH SYSTEM OPTIMIZED",
    stages: [
      "Market research",
      "Audience mapping",
      "Tracking setup",
      "Campaign structure",
      "Creative testing",
      "Landing pages and SEO",
      "Lifecycle automation",
      "Optimization and scaling",
    ],
  },
];

const PHASE_LABEL: Record<EnginePhase, string> = {
  visual: "Active",
  scanning: "Scanning",
  blueprint: "Blueprint",

};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sequenceTimersRef = useRef<number[]>([]);
  const initialSequenceStartedRef = useRef(false);

  const { prefersReducedMotion } = useDegradation();

  const [activeMode, setActiveMode] = useState(0);
  const [enginePhase, setEnginePhase] =
    useState<EnginePhase>("visual");
  const [sequenceRun, setSequenceRun] = useState(0);

  const mode = ENGINE_MODES[activeMode];
  const modeNumber = String(activeMode + 1).padStart(2, "0");

  const clearSequenceTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    sequenceTimersRef.current = [];
  }, []);

  const runEngineSequence = useCallback(
    (modeIndex: number) => {
      clearSequenceTimers();

      setActiveMode(modeIndex);
      setSequenceRun((current) => current + 1);

      /*
       * Reduced-motion visitors receive the same content,
       * but without the scanner and timed transitions.
       */
      if (prefersReducedMotion) {
        setEnginePhase("blueprint");
        return;
      }

      setEnginePhase("visual");

      sequenceTimersRef.current.push(
        window.setTimeout(() => {
          setEnginePhase("scanning");
        }, 250),
      );

      sequenceTimersRef.current.push(
        window.setTimeout(() => {
          setEnginePhase("blueprint");
        }, 1550),
      );




    },
    [clearSequenceTimers, prefersReducedMotion],
  );

  /*
   * Standard Hero entrance reveal.
   */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      contentRef.current?.classList.add("reveal-in");
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  /*
   * Run the Web Development scan once after initial load.
   */
  useEffect(() => {
    if (
      prefersReducedMotion ||
      initialSequenceStartedRef.current
    ) {
      return;
    }

    initialSequenceStartedRef.current = true;

    const timeoutId = window.setTimeout(() => {
      runEngineSequence(0);
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion, runEngineSequence]);

  /*
   * Cancel scanner timers when the Hero unmounts.
   */
  useEffect(() => {
    return () => {
      clearSequenceTimers();
    };
  }, [clearSequenceTimers]);

  /*
   * Pointer-following ambient light.
   */
  const handlePointerMove = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (prefersReducedMotion) {
      return;
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();

    section.style.setProperty(
      "--hero-x",
      `${event.clientX - rect.left}px`,
    );

    section.style.setProperty(
      "--hero-y",
      `${event.clientY - rect.top}px`,
    );
  };

  const phaseStatusClass =
    enginePhase === "scanning"
      ? "text-signal"
      : enginePhase === "blueprint"
        ? "text-cobalt"
        : "text-signal";

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-obsidian px-[var(--space-gutter)] pb-24 pt-28 lg:pb-16"
    >
      {/* Technical background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,240,234,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(242,240,234,0.055) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 94%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 94%)",
        }}
      />

      {/* Pointer glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(620px circle at var(--hero-x, 74%) var(--hero-y, 42%), rgba(0,202,224,0.18), transparent 64%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18%] top-[6%] size-[760px] rounded-full bg-cobalt/10 blur-[150px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1.08fr)] lg:gap-10">
        {/* Left content */}
        <div ref={contentRef} className="relative z-20">
          <div className="reveal-up mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ash">
            <span className="flex items-center gap-3">
              <span className="relative flex size-[8px]">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-40" />
                <span className="relative inline-flex size-[8px] rounded-full bg-signal shadow-[0_0_14px_var(--signal)]" />
              </span>

              System online
            </span>

            <span className="hidden text-glass-border sm:inline">
              /
            </span>

            <span>
              Dubai · Est. {COMPANY.foundedYear}
            </span>
          </div>

          <p className="reveal-up mb-7 max-w-[46ch] font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.1em] text-ash">
            Software house in Dubai engineering custom web,
            software and growth systems for ambitious businesses.
          </p>

          <h1 className="max-w-[11ch] font-display text-[clamp(3.2rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-bone">
            <span className="mask-line block">
              <span>Software,</span>
            </span>

            <span className="mask-line block">
              <span className="text-cobalt">
                machined.
              </span>
            </span>
          </h1>

          <p className="reveal-up mt-8 max-w-[48ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.65] text-ash">
            Ideas arrive unfinished. We architect, build and
            stress-test them until they become reliable digital
            systems.
          </p>

          <div className="reveal-up mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Start a project
            </Button>

            <Button
              href="/work"
              variant="ghost"
              label="VIEW"
            >
              Explore our work
            </Button>
          </div>

          <div className="reveal-up mt-12 grid max-w-[590px] grid-cols-3 border-y border-glass-border">
            <div className="py-4 pr-4">
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ash">
                Approach
              </span>

              <span className="mt-1 block text-[0.88rem] text-bone">
                Engineering first
              </span>
            </div>

            <div className="border-x border-glass-border px-4 py-4">
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ash">
                Systems
              </span>

              <span className="mt-1 block text-[0.88rem] text-bone">
                Built to scale
              </span>
            </div>

            <div className="py-4 pl-4">
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ash">
                Delivery
              </span>

              <span className="mt-1 block text-[0.88rem] text-bone">
                End to end
              </span>
            </div>
          </div>
        </div>

        {/* BEZTEQ Engine */}
        <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[680px]">
          <div
            data-phase={enginePhase}
            className="hero-engine-panel absolute inset-0 overflow-hidden rounded-[26px] border border-glass-border bg-[rgba(22,24,28,0.48)] shadow-[0_0_100px_-45px_rgba(0,202,224,0.75)] backdrop-blur-sm"
          >
            {/* Corner details */}
            <span className="absolute left-0 top-0 z-30 h-10 w-px bg-cobalt" />
            <span className="absolute left-0 top-0 z-30 h-px w-10 bg-cobalt" />

            <span className="absolute right-0 top-0 z-30 h-10 w-px bg-cobalt" />
            <span className="absolute right-0 top-0 z-30 h-px w-10 bg-cobalt" />

            <span className="absolute bottom-0 left-0 z-30 h-10 w-px bg-cobalt" />
            <span className="absolute bottom-0 left-0 z-30 h-px w-10 bg-cobalt" />

            <span className="absolute bottom-0 right-0 z-30 h-10 w-px bg-cobalt" />
            <span className="absolute bottom-0 right-0 z-30 h-px w-10 bg-cobalt" />

            {/* Header */}
            <div className="absolute inset-x-0 top-0 z-30 flex h-[70px] items-center justify-between border-b border-glass-border bg-[rgba(11,12,14,0.42)] px-5 sm:px-6">
              <div>
                <span className="block font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                  BEZTEQ Engine
                </span>

                <span className="mt-1 block font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone">
                  Mode {modeNumber} / {mode.label}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] ${phaseStatusClass}`}
              >
                <span className="hero-phase-indicator size-[6px] rounded-full bg-current shadow-[0_0_10px_currentColor]" />

                {PHASE_LABEL[enginePhase]}
              </div>
            </div>

            {/* Main visual area */}
            <div className="absolute inset-x-0 bottom-[84px] top-[70px] overflow-hidden">
              {/* 3D Core remains mounted */}
              <div className="hero-core-layer pointer-events-none absolute inset-x-8 inset-y-4 sm:left-12 sm:right-16">
                <Core
                  morphState={mode.state}
                  className="h-full w-full"
                />
              </div>

              {/* Technical labels */}
              <div className="hero-core-labels pointer-events-none absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ash sm:flex">
                <span>Input / idea</span>
                <span>Logic / structure</span>
                <span>Output / system</span>
              </div>

              <div className="hero-core-labels pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 sm:flex">
                <span className="whitespace-nowrap font-mono text-[0.55rem] uppercase leading-none tracking-[0.18em] text-ash [writing-mode:vertical-rl]">
                  Move cursor to inspect
                </span>
              </div>

              {/* Scanner */}
              {enginePhase === "scanning" && (
                <div
                  key={`scanner-${sequenceRun}`}
                  aria-hidden="true"
                  className="hero-engine-scan pointer-events-none absolute inset-x-[4%] top-0 z-20 h-[2px]"
                >
                  <span className="absolute bottom-3 left-0 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-signal">
                    Scanning {mode.systemId}
                  </span>
                </div>
              )}

              {/* Typed blueprint */}
              <div
                key={`blueprint-${mode.state}-${sequenceRun}`}
                className="hero-blueprint absolute inset-0 z-20 px-5 py-7 sm:px-10 sm:py-9"
              >
                <div className="flex h-full flex-col">
                  <div className="border-b border-glass-border pb-4">
                    <div className="flex items-center justify-between gap-5">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cobalt">
                        {mode.systemId}
                      </span>

                      <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-ash">
                        Pipeline diagnostic
                      </span>
                    </div>

                    <p className="hero-terminal-command mt-4 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-bone">
                      <span className="text-signal">
                        &gt;
                      </span>{" "}
                      {mode.command}
                    </p>
                  </div>

                  <div className="mt-5 flex-1 space-y-2 overflow-hidden">
                    {mode.stages.map((stage, index) => (
                      <div
                        key={`${mode.systemId}-${stage}`}
                        className="hero-blueprint-line grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 border-b border-glass-border/60 pb-2 font-mono uppercase"
                        style={{
                          animationDelay: `${260 + index * 170}ms`,
                        }}
                      >
                        <span className="text-[0.58rem] tracking-[0.1em] text-ash">
                          [
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                          ]
                        </span>

                        <span className="truncate text-[0.62rem] tracking-[0.1em] text-bone sm:text-[0.68rem]">
                          {stage}
                        </span>

                        <span className="flex items-center gap-2 text-[0.54rem] tracking-[0.1em] text-signal">
                          <span className="size-[4px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
                          Ready
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="hero-blueprint-complete mt-4 flex items-center justify-between gap-5 border-t border-glass-border pt-4"
                    style={{
                      animationDelay: `${
                        400 + mode.stages.length * 170
                      }ms`,
                    }}
                  >
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal">
                      &gt; {mode.completionMessage}
                      <span className="hero-terminal-cursor ml-1">
                        _
                      </span>
                    </span>

                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.12em] text-ash">
                      100% complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard visual description */}
              <div className="hero-mode-description absolute bottom-5 left-5 right-14 z-10 sm:left-6">
                <p className="max-w-[42ch] text-[0.82rem] leading-relaxed text-ash">
                  {mode.description}
                </p>
              </div>
            </div>

            {/* Service tabs */}
            <div className="absolute inset-x-0 bottom-0 z-30 grid h-[84px] grid-cols-5 border-t border-glass-border bg-[rgba(11,12,14,0.76)]">
              {ENGINE_MODES.map((engineMode, index) => {
                const active = index === activeMode;

                return (
                  <button
                    key={engineMode.state}
                    type="button"
                    data-hover
                    aria-label={`Run ${engineMode.label} scan`}
                    aria-pressed={active}
                    onClick={() =>
                      runEngineSequence(index)
                    }
                    className={`relative border-r border-glass-border px-1 py-3 text-center font-mono text-[0.52rem] uppercase tracking-[0.08em] transition-colors duration-fast last:border-r-0 sm:px-2 sm:text-[0.6rem] ${
                      active
                        ? "bg-cobalt text-bone"
                        : "bg-transparent text-ash hover:bg-glass hover:text-bone"
                    }`}
                  >
                    <span className="block opacity-60">
                      0{index + 1}
                    </span>

                    <span className="mt-1 block">
                      {engineMode.shortLabel}
                    </span>

                    {active && (
                      <span className="absolute inset-x-0 top-0 h-px bg-signal shadow-[0_0_12px_var(--signal)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-4 right-6 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ash">
            Select a mode to run scan
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-[var(--space-gutter)] z-20 hidden items-center gap-[0.6rem] font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ash lg:flex">
        <span className="scroll-hint-bar" />
        Scroll to enter the system
      </div>

      <span className="sr-only" aria-live="polite">
        Current engine mode: {mode.label}. Current state:{" "}
        {PHASE_LABEL[enginePhase]}.
      </span>
    </section>
  );
}