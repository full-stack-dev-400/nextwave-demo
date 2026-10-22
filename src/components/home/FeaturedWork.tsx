"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { FleetDispatchVisual } from "@/components/work/FleetDispatchVisual";
import { useDegradation } from "@/providers/DegradationProvider";
import { STUDIES } from "@/lib/work-data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADING_FIRST = "Built systems.";
const HEADING_SECOND = "Measured impact.";
const FULL_HEADING = `${HEADING_FIRST} ${HEADING_SECOND}`;

function shorten(text: string, maximum = 175) {
  if (text.length <= maximum) {
    return text;
  }

  return `${text.slice(0, maximum).trim()}…`;
}

function PosVisual() {
  const POS_STEPS = [
    "Scan item",
    "Add to cart",
    "Calculate VAT",
    "Payment approved",
    "Print receipt",
    "Inventory updated",
    "Synced to HQ",
  ] as const;

  const [stage, setStage] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStage((current) => (current + 1) % POS_STEPS.length);
    }, 1350);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const firstItemVisible = stage >= 1;
  const secondItemVisible = stage >= 2;
  const vatVisible = stage >= 3;
  const paymentApproved = stage >= 4;
  const receiptVisible = stage >= 5;
  const inventoryUpdated = stage >= 5;
  const synced = stage >= 6;

  const subtotal =
    stage >= 2 ? "AED 126.00" : stage >= 1 ? "AED 84.00" : "AED 0.00";

  const vat = vatVisible ? "AED 6.30" : "AED 0.00";
  const total = paymentApproved ? "AED 132.30" : subtotal;

  const stockCount = inventoryUpdated ? 23 : 24;
  const syncLabel = synced ? "Synced to HQ" : "Pending sync";

  return (
    <div
      aria-hidden="true"
      className="pos-live-terminal pos-terminal-grid relative h-full overflow-hidden p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border pb-4">
        <div>
          <span className="block font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
            Retail operating system
          </span>

          <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.1em] text-bone">
            Store 12 / Checkout 04
          </span>
        </div>

        <span className="flex items-center gap-2 font-mono text-[0.48rem] uppercase tracking-[0.1em] text-signal">
          <span className="pos-status-dot size-[5px] rounded-full bg-signal shadow-[0_0_8px_var(--signal)]" />
          Online
        </span>
      </div>

      {/* Stage tracker */}
      <div className="mt-4 grid grid-cols-4 gap-2 xl:grid-cols-7">
        {POS_STEPS.map((step, index) => {
          const active = index <= stage;
          const current = index === stage;

          return (
            <div
              key={step}
              className={`pos-stage-chip flex min-h-[42px] items-center border px-2.5 py-2 font-mono text-[0.42rem] uppercase tracking-[0.08em] ${
                active
                  ? "pos-stage-chip-active border-cobalt/40 bg-[rgba(0,202,224,0.1)] text-bone"
                  : "border-glass-border bg-[rgba(11,12,14,0.45)] text-ash"
              }`}
            >
              <span
                className={`mr-2 size-[5px] shrink-0 rounded-full ${
                  current
                    ? "bg-signal shadow-[0_0_8px_var(--signal)]"
                    : active
                      ? "bg-cobalt"
                      : "bg-ash/40"
                }`}
              />

              {step}
            </div>
          );
        })}
      </div>

      {/* Main POS area */}
      <div className="mt-4 grid grid-cols-[1.08fr_0.92fr] gap-4">
        {/* Left - transaction/cart */}
        <div className="relative overflow-hidden border border-glass-border bg-[rgba(11,12,14,0.56)] p-4">
          <div className="pos-scanner-line pointer-events-none absolute inset-x-4 top-[34px] h-px" />

          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-cobalt">
              Current transaction
            </span>

            <span className="font-mono text-[0.46rem] uppercase tracking-[0.09em] text-ash">
              POS / 44712
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div
              className={`border-b border-glass-border pb-3 transition-all duration-300 ${
                firstItemVisible ? "opacity-100" : "opacity-35"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block font-mono text-[0.54rem] uppercase text-bone">
                    Product 041
                  </span>

                  <span className="mt-1 block font-mono text-[0.43rem] uppercase tracking-[0.08em] text-ash">
                    Quantity 02
                  </span>
                </div>

                <span className="font-mono text-[0.54rem] text-bone">
                  {firstItemVisible ? "AED 84.00" : "—"}
                </span>
              </div>
            </div>

            <div
              className={`border-b border-glass-border pb-3 transition-all duration-300 ${
                secondItemVisible ? "opacity-100" : "opacity-35"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block font-mono text-[0.54rem] uppercase text-bone">
                    Product 108
                  </span>

                  <span className="mt-1 block font-mono text-[0.43rem] uppercase tracking-[0.08em] text-ash">
                    Quantity 01
                  </span>
                </div>

                <span className="font-mono text-[0.54rem] text-bone">
                  {secondItemVisible ? "AED 42.00" : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 font-mono text-[0.48rem] uppercase tracking-[0.08em]">
            <div className="flex justify-between text-ash">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>

            <div className="flex justify-between text-ash">
              <span>VAT 5%</span>
              <span>{vat}</span>
            </div>

            <div className="flex justify-between border-t border-glass-border pt-3 text-bone">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-glass-border pt-4">
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.09em] text-ash">
              Payment
            </span>

            <span
              className={`font-mono text-[0.48rem] uppercase tracking-[0.1em] ${
                paymentApproved ? "text-signal" : "text-ash"
              }`}
            >
              {paymentApproved ? "Approved" : "Awaiting"}
            </span>
          </div>
        </div>

        {/* Right - operational cards */}
        <div className="flex flex-col gap-3">
          <div className="border border-glass-border bg-[rgba(0,202,224,0.07)] p-4">
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.1em] text-ash">
              Inventory status
            </span>

            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-bone">
                  {stockCount}
                </div>

                <span className="mt-2 block font-mono text-[0.46rem] uppercase tracking-[0.09em] text-signal">
                  Units after sale
                </span>
              </div>

              <div className="text-right">
                <span className="block font-mono text-[0.44rem] uppercase tracking-[0.08em] text-ash">
                  Updated
                </span>

                <span className="mt-1 block font-mono text-[0.48rem] uppercase tracking-[0.08em] text-bone">
                  {inventoryUpdated ? "Yes" : "Waiting"}
                </span>
              </div>
            </div>

            <div className="mt-4 h-px bg-glass-border">
              <span
                className="pos-stock-progress block h-full bg-gradient-to-r from-cobalt to-signal"
                style={{
                  width: synced
                    ? "100%"
                    : inventoryUpdated
                      ? "82%"
                      : paymentApproved
                        ? "58%"
                        : "26%",
                }}
              />
            </div>
          </div>

          <div className="border border-glass-border bg-[rgba(11,12,14,0.56)] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.46rem] uppercase tracking-[0.1em] text-ash">
                Store connection
              </span>

              <span
                className={`font-mono text-[0.46rem] uppercase tracking-[0.1em] ${
                  synced ? "text-signal" : "text-ash"
                }`}
              >
                {syncLabel}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border border-glass-border px-2.5 py-1.5 font-mono text-[0.42rem] uppercase tracking-[0.08em] text-bone">
                Offline ready
              </span>

              <span className="border border-glass-border px-2.5 py-1.5 font-mono text-[0.42rem] uppercase tracking-[0.08em] text-bone">
                VAT ready
              </span>

              <span className="border border-glass-border px-2.5 py-1.5 font-mono text-[0.42rem] uppercase tracking-[0.08em] text-bone">
                Head office sync
              </span>
            </div>
          </div>

          <div
            className={`border border-glass-border bg-[rgba(11,12,14,0.62)] p-4 transition-all duration-400 ${
              receiptVisible
                ? "pos-receipt-card opacity-100"
                : "translate-y-2 opacity-40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.46rem] uppercase tracking-[0.1em] text-cobalt">
                Receipt
              </span>

              <span className="font-mono text-[0.44rem] uppercase tracking-[0.08em] text-ash">
                #{paymentApproved ? "44712" : "-----"}
              </span>
            </div>

            <div className="mt-3 space-y-2 font-mono text-[0.44rem] uppercase tracking-[0.08em]">
              <div className="flex justify-between text-ash">
                <span>Items</span>
                <span>{secondItemVisible ? "03" : firstItemVisible ? "02" : "00"}</span>
              </div>

              <div className="flex justify-between text-ash">
                <span>VAT</span>
                <span>{vatVisible ? "5%" : "—"}</span>
              </div>

              <div className="flex justify-between border-t border-glass-border pt-2 text-bone">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-glass-border pt-3">
              <span className="font-mono text-[0.44rem] uppercase tracking-[0.08em] text-ash">
                Print status
              </span>

              <span className="font-mono text-[0.46rem] uppercase tracking-[0.08em] text-signal">
                {receiptVisible ? "Printed" : "Queued"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FintechWebsiteVisual() {
  const { prefersReducedMotion } = useDegradation();

  const CONVERSION_STAGES = [
    "Landing page",
    "CTA engaged",
    "Form completed",
    "Lead captured",
    "CRM routed",
  ] as const;

  const [stage, setStage] = useState(
    prefersReducedMotion
      ? CONVERSION_STAGES.length - 1
      : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage(CONVERSION_STAGES.length - 1);
      return;
    }

    const intervalId = window.setInterval(() => {
      setStage(
        (current) =>
          (current + 1) %
          CONVERSION_STAGES.length,
      );
    }, 1450);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  const ctaEngaged = stage >= 1;
  const formCompleted = stage >= 2;
  const leadCaptured = stage >= 3;
  const crmRouted = stage >= 4;

  return (
    <div
      aria-hidden="true"
      className="leadgen-visual relative h-full overflow-hidden p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border pb-4">
        <div>
          <span className="block font-mono text-[0.48rem] uppercase tracking-[0.12em] text-ash">
            Fintech acquisition system
          </span>

          <span className="mt-1 block font-mono text-[0.57rem] uppercase tracking-[0.1em] text-bone">
            Landing page / International
          </span>
        </div>

        <span
          className={`flex items-center gap-2 font-mono text-[0.46rem] uppercase tracking-[0.1em] ${
            crmRouted
              ? "text-signal"
              : "text-ash"
          }`}
        >
          <span
            className={`size-[5px] rounded-full ${
              crmRouted
                ? "bg-signal shadow-[0_0_8px_var(--signal)]"
                : "bg-ash/50"
            }`}
          />

          {crmRouted
            ? "CRM connected"
            : "Processing"}
        </span>
      </div>

      {/* Conversion stage tracker */}
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {CONVERSION_STAGES.map(
          (conversionStage, index) => {
            const completed = index <= stage;
            const current = index === stage;

            return (
              <div
                key={conversionStage}
                className={`leadgen-stage relative min-h-[38px] border px-2 py-2 font-mono text-[0.38rem] uppercase leading-[1.35] tracking-[0.065em] ${
                  completed
                    ? "border-cobalt/40 bg-[rgba(0,202,224,0.1)] text-bone"
                    : "border-glass-border bg-[rgba(11,12,14,0.4)] text-ash"
                }`}
              >
                <span
                  className={`mr-1.5 inline-block size-[4px] rounded-full ${
                    current
                      ? "bg-signal shadow-[0_0_7px_var(--signal)]"
                      : completed
                        ? "bg-cobalt"
                        : "bg-ash/40"
                  }`}
                />

                {conversionStage}

                {current && (
                  <span className="absolute inset-x-0 top-0 h-px bg-signal shadow-[0_0_8px_var(--signal)]" />
                )}
              </div>
            );
          },
        )}
      </div>

      {/* Website and lead form */}
      <div className="mt-4 grid min-h-[205px] grid-cols-[1.14fr_0.86fr] overflow-hidden rounded-[14px] border border-glass-border bg-[rgba(11,12,14,0.56)]">
        {/* Landing page */}
        <div className="leadgen-landing relative overflow-hidden border-r border-glass-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-[5px] rounded-full bg-ash/40" />
              <span className="size-[5px] rounded-full bg-ash/40" />
              <span className="size-[5px] rounded-full bg-signal" />
            </div>

            <span className="font-mono text-[0.4rem] uppercase tracking-[0.09em] text-ash">
              fintech-platform.com
            </span>
          </div>

          <div className="mt-7 max-w-[270px]">
           <span className="font-mono text-[0.42rem] uppercase tracking-[0.1em] text-cobalt">
  Built around your business
</span>

<h4 className="mt-3 font-display text-[clamp(1.5rem,2.2vw,2.3rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-bone">
  From idea to execution.
  <span className="block text-cobalt">
    We make every step clear.
  </span>
</h4>

<p className="mt-3 max-w-[38ch] text-[0.65rem] leading-[1.55] text-ash">
  We understand your goals, define the right strategy,
  design the experience, build the system, test every
  detail, and support you after launch.
</p>

            {/* <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                tabIndex={-1}
                className={`leadgen-primary-cta rounded-full px-4 py-2 font-mono text-[0.43rem] uppercase tracking-[0.08em] text-bone ${
                  ctaEngaged
                    ? "leadgen-primary-cta-active bg-cobalt"
                    : "bg-cobalt/70"
                }`}
              >
                Open an account
              </button>

              <button
                type="button"
                tabIndex={-1}
                className="rounded-full border border-glass-border px-3 py-2 font-mono text-[0.4rem] uppercase tracking-[0.07em] text-ash"
              >
                Explore platform
              </button>
            </div> */}
          </div>

          {/* <div className="absolute bottom-4 left-5 flex gap-2">
            {[
              "Secure",
              "Fast onboarding",
              "Multi-market",
            ].map((item) => (
              <span
                key={item}
                className="font-mono text-[0.36rem] uppercase tracking-[0.07em] text-ash"
              >
                <span className="mr-1 text-signal">
                  ✓
                </span>

                {item}
              </span>
            ))}
          </div> */}

          {ctaEngaged && (
            <span className="leadgen-cta-pulse pointer-events-none absolute bottom-[61px] left-[74px] size-[72px] rounded-full border border-signal/40" />
          )}
        </div>

        {/* Lead capture form */}
        <div className="relative p-5">
          {!leadCaptured ? (
            <div
              key={`form-${stage}`}
              className="leadgen-form-enter"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[0.42rem] uppercase tracking-[0.1em] text-cobalt">
                    Lead capture
                  </span>

                  <span className="mt-1 block font-mono text-[0.5rem] uppercase tracking-[0.08em] text-bone">
                    Start in minutes
                  </span>
                </div>

                <span className="font-mono text-[0.38rem] uppercase tracking-[0.07em] text-ash">
                  Step 01
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div
                  className={`leadgen-field border-b pb-2 ${
                    stage >= 1
                      ? "border-cobalt text-bone"
                      : "border-glass-border text-ash"
                  }`}
                >
                  <span className="block font-mono text-[0.36rem] uppercase tracking-[0.08em] text-ash">
                    Full name
                  </span>

                  <span className="mt-1 block min-h-[14px] font-mono text-[0.46rem]">
                    {stage >= 1
                      ? "Prospective client"
                      : ""}
                  </span>
                </div>

                <div
                  className={`leadgen-field border-b pb-2 ${
                    stage >= 2
                      ? "border-cobalt text-bone"
                      : "border-glass-border text-ash"
                  }`}
                >
                  <span className="block font-mono text-[0.36rem] uppercase tracking-[0.08em] text-ash">
                    Email
                  </span>

                  <span className="mt-1 block min-h-[14px] font-mono text-[0.46rem]">
                    {stage >= 2
                      ? "client@example.com"
                      : ""}
                  </span>
                </div>

                <div
                  className={`leadgen-field border-b pb-2 ${
                    formCompleted
                      ? "border-cobalt text-bone"
                      : "border-glass-border text-ash"
                  }`}
                >
                  <span className="block font-mono text-[0.36rem] uppercase tracking-[0.08em] text-ash">
                    Phone
                  </span>

                  <span className="mt-1 block min-h-[14px] font-mono text-[0.46rem]">
                    {formCompleted
                      ? "+971 ••• ••••"
                      : ""}
                  </span>
                </div>
              </div>

              <div
                className={`mt-4 flex h-[34px] items-center justify-center rounded-full font-mono text-[0.42rem] uppercase tracking-[0.08em] ${
                  formCompleted
                    ? "bg-cobalt text-bone"
                    : "bg-glass text-ash"
                }`}
              >
                {formCompleted
                  ? "Submit application"
                  : "Complete form"}
              </div>
            </div>
          ) : (
            <div
              key={`success-${stage}`}
              className="leadgen-success flex h-full min-h-[165px] flex-col items-center justify-center text-center"
            >
              <span className="flex size-[42px] items-center justify-center rounded-full border border-signal/50 bg-signal/10 font-mono text-[1rem] text-signal shadow-[0_0_24px_rgba(216,216,211,0.16)]">
                ✓
              </span>

              <span className="mt-4 font-mono text-[0.5rem] uppercase tracking-[0.11em] text-signal">
                Lead captured
              </span>

              <span className="mt-2 max-w-[24ch] text-[0.65rem] leading-[1.5] text-ash">
                Submission validated and prepared
                for CRM routing.
              </span>

              <div className="mt-4 flex gap-2">
                <span className="border border-glass-border px-2 py-1 font-mono text-[0.36rem] uppercase tracking-[0.07em] text-bone">
                  Source / Paid
                </span>

                <span className="border border-glass-border px-2 py-1 font-mono text-[0.36rem] uppercase tracking-[0.07em] text-bone">
                  Status / Qualified
                </span>
              </div>
            </div>
          )}

          {crmRouted && (
            <div className="leadgen-crm-routed absolute inset-x-5 bottom-4 flex items-center justify-between border-t border-glass-border pt-3">
              <span className="font-mono text-[0.38rem] uppercase tracking-[0.08em] text-ash">
                Destination
              </span>

              <span className="font-mono text-[0.4rem] uppercase tracking-[0.08em] text-signal">
                CRM pipeline / Routed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Campaign evidence */}
      <div className="mt-4 grid grid-cols-4 border border-glass-border bg-[rgba(11,12,14,0.46)]">
        {[
          {
            value: "12.57M",
            label: "Impressions",
          },
          {
            value: "306K",
            label: "Link clicks",
          },
          {
            value: "74.4K",
            label: "Landing views",
          },
          {
            value: "6,145",
            label: "Leads",
          },
        ].map((metric, index) => (
          <div
            key={metric.label}
            className="border-r border-glass-border px-3 py-3 last:border-r-0"
          >
            <span className="block font-display text-[1.4rem] font-semibold leading-none tracking-[-0.035em] text-bone">
              {metric.value}
            </span>

            <span className="mt-1.5 block font-mono text-[0.36rem] uppercase tracking-[0.075em] text-ash">
              {metric.label}
            </span>

            <span className="mt-2 block h-px bg-glass-border">
              <span
                className="leadgen-metric-progress block h-full bg-gradient-to-r from-cobalt to-signal"
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[0.38rem] uppercase tracking-[0.08em] text-ash">
        <span>
          85 international campaigns
        </span>

        <span>
          CTR 2.43% / CPC $0.07 / CPL $3.44
        </span>
      </div>
    </div>
  );
}

export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useDegradation();

  const fleetStudy =
    STUDIES.find(
      (study) => study.slug === "fleet-platform",
    ) ?? STUDIES[0];

  const posStudy =
    STUDIES.find(
      (study) => study.slug === "retail-pos",
    ) ?? STUDIES[1];

  const fintechStudy =
    STUDIES.find(
      (study) => study.slug === "fintech-web",
    ) ?? STUDIES[2];

  const projects = [
  {
    id: "01",
    systemId: "DEPLOYMENT / FLT-001",
    category: "Custom Software",
    environment: "Logistics operations",

    displayTitle: "Fleet dispatch, accelerated.",
    displayOutcome:
      "Real-time routing for GCC logistics operations.",

    study: fleetStudy,
    visual: <FleetDispatchVisual />,
    linkLabel: "Open fleet case",
  },
  {
    id: "02",
    systemId: "DEPLOYMENT / POS-012",
    category: "Retail Technology",
    environment: "Point-of-sale environment",

    displayTitle: "Retail operations, connected.",
    displayOutcome:
      "Checkout, inventory and head-office sync in one system.",

    study: posStudy,
    visual: <PosVisual />,
    linkLabel: "Open POS case",
  },
  {
    id: "03",
    systemId: "DEPLOYMENT / FIN-085",
    category: "Fintech Website",
    environment: "Acquisition infrastructure",

    displayTitle: "Traffic converted into qualified leads.",
    displayOutcome:
      "Landing pages, tracking and CRM routing working together.",

    study: fintechStudy,
    visual: <FintechWebsiteVisual />,
    linkLabel: "Open fintech case",
  },
];

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || prefersReducedMotion) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-deployment-card]",
          section,
        );

        const projectCopies =
          gsap.utils.toArray<HTMLElement>(
            "[data-project-copy]",
            section,
          );

        const progressSegments =
          gsap.utils.toArray<HTMLElement>(
            "[data-project-progress]",
            section,
          );

        const cardVisuals = cards.map((card) =>
          card.querySelector<HTMLElement>(
            "[data-deployment-visual]",
          ),
        );

        const headingLines =
          gsap.utils.toArray<HTMLElement>(
            "[data-work-heading-line]",
            section,
          );

        const railElements =
          gsap.utils.toArray<HTMLElement>(
            "[data-work-rail-reveal]",
            section,
          );

        const deckStatus =
          section.querySelector<HTMLElement>(
            "[data-deck-status]",
          );

        /*
         * Starting positions.
         *
         * Card 1 starts near the centre.
         * Later cards wait below and to the right.
         */
        cards.forEach((card, index) => {
          if (index === 0) {
            gsap.set(card, {
              xPercent: 0,
              yPercent: 7,
              rotateX: 7,
              rotateY: -3,
              rotateZ: -1,
              scale: 0.94,
              opacity: 0,
              zIndex: 10,
              pointerEvents: "auto",
            });

            return;
          }

          gsap.set(card, {
            xPercent: 28,
            yPercent: 115,
            rotateX: 12,
            rotateY: -8,
            rotateZ: 5,
            scale: 0.8,
            opacity: 0,
            zIndex: 5 - index,
            pointerEvents: "none",
          });
        });

        cardVisuals.forEach((visual) => {
          if (!visual) {
            return;
          }

          gsap.set(visual, {
            scale: 1.055,
          });
        });

        projectCopies.forEach((copy, index) => {
          gsap.set(copy, {
            opacity: index === 0 ? 0 : 0,
            y: index === 0 ? 30 : 45,
            pointerEvents: "none",
          });
        });

        gsap.set(progressSegments, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set(railElements, {
          opacity: 0,
          y: 24,
        });

        const timeline = gsap.timeline({
          defaults: {
            ease: "none",
          },

        scrollTrigger: {
          id: "bezteq-deployment-deck",
          trigger: section,

          // Keep the pinned section below the fixed navbar
          start: "top 88px",

          end: () => `+=${window.innerHeight * 4.2}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        });

        /*
         * Intro:
         * Bring in heading, rail and first deployment.
         */
        timeline
          .fromTo(
            headingLines,
            {
              yPercent: 115,
              rotateX: -25,
            },
            {
              yPercent: 0,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            },
            0,
          )
          .to(
            railElements,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power2.out",
            },
            0.2,
          )
          .to(
            cards[0],
            {
              xPercent: 0,
              yPercent: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            },
            0.15,
          )
          .to(
            cardVisuals[0],
            {
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
            },
            0.15,
          )
          .to(
            projectCopies[0],
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            0.4,
          )
          .to(
            progressSegments[0],
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            0.3,
          );

        /*
         * Project changes:
         *
         * Active window moves into the archive position.
         * Next window enters diagonally from bottom-right.
         */
        for (
          let index = 1;
          index < cards.length;
          index += 1
        ) {
          const previousCard = cards[index - 1];
          const nextCard = cards[index];

          const previousCopy =
            projectCopies[index - 1];

          const nextCopy = projectCopies[index];

          const previousVisual =
            cardVisuals[index - 1];

          const nextVisual = cardVisuals[index];

          const label = `deployment-${index}`;

          timeline.addLabel(label, "+=0.55");

          timeline
            .set(
              nextCard,
              {
                zIndex: 20 + index,
                pointerEvents: "auto",
              },
              label,
            )
            .set(
              previousCard,
              {
                pointerEvents: "none",
              },
              label,
            )
            .to(
              previousCopy,
              {
                opacity: 0,
                y: -28,
                duration: 0.4,
                ease: "power2.in",
              },
              label,
            )
            .to(
              previousCard,
              {
                xPercent: -20,
                yPercent: -21,
                rotateX: -4,
                rotateY: 8,
                rotateZ: -4,
                scale: 0.76,
                opacity: 0.2,
                filter:
                  "saturate(0.35) brightness(0.7)",
                duration: 1.1,
                ease: "power3.inOut",
              },
              label,
            )
            .to(
              previousVisual,
              {
                scale: 0.96,
                duration: 1.1,
                ease: "power3.inOut",
              },
              label,
            )
            .to(
              nextCard,
              {
                xPercent: 0,
                yPercent: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                filter:
                  "saturate(1) brightness(1)",
                duration: 1.15,
                ease: "power3.out",
              },
              label,
            )
            .to(
              nextVisual,
              {
                scale: 1,
                duration: 1.25,
                ease: "power3.out",
              },
              label,
            )
            .to(
              nextCopy,
              {
                opacity: 1,
                y: 0,
                duration: 0.62,
                ease: "power2.out",
              },
              `${label}+=0.3`,
            )
            .to(
              progressSegments[index],
              {
                scaleX: 1,
                duration: 0.8,
                ease: "power2.out",
              },
              `${label}+=0.2`,
            );

          if (deckStatus) {
            timeline.to(
              deckStatus,
              {
                keyframes: [
                  {
                    opacity: 0,
                    y: -5,
                    duration: 0.16,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.22,
                  },
                ],
              },
              `${label}+=0.1`,
            );
          }
        }

        /*
         * Give the final deployment some viewing time.
         */
        timeline.to(
          cards[cards.length - 1],
          {
            scale: 1,
            duration: 0.8,
          },
          "+=0.45",
        );

        document.fonts?.ready.then(() => {
          ScrollTrigger.refresh();
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => {
        media.revert();
      };
    },
    {
      scope: sectionRef,
      dependencies: [prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
      <section
        ref={sectionRef}
        id="featured-work"
        className="
          work-deployment-section
          relative isolate overflow-hidden
          border-y border-glass-border
          bg-obsidian text-bone
          lg:h-[calc(100svh-88px)]
        "
      >
      {/* Background engineering grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]
          [background-size:72px_72px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-[31.5%] top-0 hidden h-full w-px
          bg-glass-border lg:block
        "
      />

      {/* Desktop deployment deck */}
      {!prefersReducedMotion && (
        <div
          className="
            relative z-10 hidden h-full
            lg:grid lg:grid-cols-[32%_68%]
          "
        >
          {/* Left control rail */}
          <aside
            className="
              relative flex h-full flex-col
              px-[clamp(1.8rem,2.8vw,3.6rem)]
              py-[4vh]
            "
          >
            <div data-work-rail-reveal>
              <SectionEyebrow>
                / 04 — Selected work
              </SectionEyebrow>
            </div>

            <h2
              aria-label="Built systems. Measured impact."
              className="
                mt-[4vh] font-display
                text-[clamp(2.6rem,3.55vw,4.4rem)]
                font-semibold leading-[0.88]
                tracking-[-0.06em]
              "
            >
              <span className="block overflow-hidden">
                <span
                  data-work-heading-line
                  className="block origin-bottom whitespace-nowrap"
                >
                  Built systems.
                </span>
              </span>

              <span className="mt-1 block overflow-hidden">
                <span
                  data-work-heading-line
                  className="block origin-bottom whitespace-nowrap text-cobalt"
                >
                  Measured impact.
                </span>
              </span>
            </h2>

            {/* Dynamic project information */}
            <div
              data-work-rail-reveal
              className="relative mt-[4vh] min-h-[170px]"
            >
              {projects.map((project) => (
<div
  key={project.id}
  data-project-copy
  className="absolute inset-0"
>
  <div className="flex items-center gap-3">
    <span className="size-[5px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

    <span className="font-mono text-[0.47rem] uppercase tracking-[0.13em] text-signal">
      Active deployment {project.id}
    </span>
  </div>

  <div className="mt-4 font-mono text-[0.47rem] uppercase tracking-[0.12em] text-cobalt">
    {project.category}
  </div>

  <h3
    className="
      mt-2 max-w-[15ch] font-display
      text-[clamp(1.5rem,2.15vw,2.55rem)]
      font-semibold leading-[0.96]
      tracking-[-0.045em]
    "
  >
    {project.displayTitle}
  </h3>

  <p className="mt-3 max-w-[35ch] text-[0.76rem] leading-[1.55] text-ash">
    {project.displayOutcome}
  </p>
</div>
              ))}
            </div>

            {/* Section progress */}
            <div
              data-work-rail-reveal
              className="mt-auto"
            >
              <div className="grid grid-cols-3 gap-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="h-px overflow-hidden bg-white/10"
                  >
                    <span
                      data-project-progress
                      className="block h-full w-full bg-signal"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  data-deck-status
                  className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-ash"
                >
                  Scroll to inspect deployments
                </span>

                <span className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-ash">
                  03 records
                </span>
              </div>

              <Link
                href="/work"
                data-hover
                data-label="OPEN"
                className="
                  mt-8 inline-flex items-center gap-4
                  border-b border-white/30 pb-3
                  font-mono text-[0.56rem] uppercase
                  tracking-[0.13em]
                  transition-colors duration-fast
                  hover:border-signal hover:text-signal
                "
              >
                View complete archive
                <span>↗</span>
              </Link>
            </div>
          </aside>

          {/* Right deployment stage */}
          <div
            className="
              relative h-full overflow-hidden
              [perspective:1700px]
            "
          >
            {/* Stage metadata */}
            <div className="absolute left-[4vw] right-[4vw] top-[3.5vh] z-40 flex items-center justify-between">
              <span className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-ash">
                BEZTEQ / OPERATING ENVIRONMENTS
              </span>

              <span className="flex items-center gap-2 font-mono text-[0.48rem] uppercase tracking-[0.13em] text-signal">
                <span className="size-[5px] rounded-full bg-signal shadow-[0_0_9px_var(--signal)]" />
                Live systems
              </span>
            </div>

            {/* Layered deployment windows */}
            <div className="absolute inset-x-[2.7vw] bottom-[2.5vh] top-[4.5vh]">
              {projects.map((project) => (
                <article
                  key={project.id}
                  data-deployment-card
                  className="
                    work-deployment-card
                    absolute inset-0
                    overflow-hidden rounded-[22px]
                    border border-white/15
                    bg-[rgba(20,22,26,0.96)]
                    shadow-[0_30px_90px_rgba(0,0,0,0.42)]
                    backdrop-blur-xl
                    will-change-transform
                  "
                >
                  <div className="flex h-full flex-col">
                    {/* Application header */}
                    <div className="flex h-[42px] shrink-0 items-center justify-between border-b border-glass-border px-5">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                          <span className="size-[6px] rounded-full bg-white/15" />
                          <span className="size-[6px] rounded-full bg-white/15" />
                          <span className="size-[6px] rounded-full bg-signal" />
                        </div>

                        <span className="font-mono text-[0.4rem] uppercase tracking-[0.1em] text-bone">
                          {project.systemId}
                        </span>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="font-mono text-[0.38rem] uppercase tracking-[0.09em] text-ash">
                          {project.environment}
                        </span>

                        <span className="font-mono text-[0.38rem] uppercase tracking-[0.09em] text-signal">
                          Operational
                        </span>
                      </div>
                    </div>

                    {/* Existing interactive visual */}
                    <div
                      data-deployment-visual
                      className="
                        relative min-h-0 flex-1
                        overflow-hidden
                        will-change-transform
                      "
                    >
                      {project.visual}

                      <div
                        aria-hidden="true"
                        className="work-deployment-scan pointer-events-none absolute inset-x-0 top-0 z-30 h-px"
                      />
                    </div>

                    {/* Deployment footer */}
{/* Compact deployment footer */}
<div
  className="
    grid h-[96px] shrink-0
    grid-cols-[1.15fr_1fr_116px]
    border-t border-glass-border
    bg-[rgba(11,12,14,0.94)]
  "
>
  {/* Project identity */}
  <div className="flex min-w-0 flex-col justify-center border-r border-glass-border px-5">
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[0.4rem] uppercase tracking-[0.1em] text-cobalt">
        {project.category}
      </span>

      <span className="font-mono text-[0.37rem] uppercase tracking-[0.08em] text-ash">
        {project.study.year}
      </span>
    </div>

    <h3
      className="
        mt-2 line-clamp-1 font-display
        text-[clamp(1.15rem,1.5vw,1.7rem)]
        font-semibold leading-none
        tracking-[-0.035em] text-bone
      "
    >
      {project.displayTitle}
    </h3>
  </div>

  {/* Metrics */}
  <div className="grid grid-cols-3">
    {project.study.metrics
      .slice(0, 3)
      .map((metric) => (
        <div
          key={metric.label}
          className="
            flex min-w-0 flex-col justify-center
            border-r border-glass-border px-3
            last:border-r-0
          "
        >
          <span className="font-display text-[clamp(1.2rem,1.8vw,2rem)] font-semibold leading-none tracking-[-0.04em] text-bone">
            {metric.value}
          </span>

          <span className="mt-1.5 line-clamp-1 font-mono text-[0.32rem] uppercase tracking-[0.06em] text-ash">
            {metric.label}
          </span>
        </div>
      ))}
  </div>

  {/* Link */}
  <Link
    href={`/work/${project.study.slug}`}
    data-hover
    data-label="VIEW"
    aria-label={project.linkLabel}
    className="
      group flex flex-col items-center justify-center
      gap-2 border-l border-glass-border
      font-mono text-[0.4rem] uppercase
      tracking-[0.1em] text-bone
      transition-colors duration-fast
      hover:bg-white/[0.025] hover:text-signal
    "
  >
    <span>Open</span>

    <span className="text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
      ↗
    </span>
  </Link>
</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile and reduced-motion version */}
      <div
        className={
          prefersReducedMotion
            ? "relative z-10 px-[var(--space-gutter)] py-[var(--space-section)]"
            : "relative z-10 px-[var(--space-gutter)] py-[var(--space-section)] lg:hidden"
        }
      >
        <div className="mx-auto max-w-[1280px]">
          <SectionEyebrow>
            / 04 — Selected work
          </SectionEyebrow>

          <h2 className="mt-7 max-w-[12ch] font-display text-[clamp(3.2rem,13vw,6.4rem)] font-semibold leading-[0.87] tracking-[-0.065em] text-bone">
            Built systems.
            <span className="block text-cobalt">
              Measured impact.
            </span>
          </h2>

          <p className="mt-7 max-w-[500px] text-[1rem] leading-[1.7] text-ash">
            Three production systems shown through the
            real environments they were designed to
            operate in.
          </p>

          <div className="mt-14 space-y-7">
            {projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-[22px] border border-glass-border bg-[rgba(22,24,28,0.72)]"
              >
                <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
                  <span className="font-mono text-[0.45rem] uppercase tracking-[0.11em] text-cobalt">
                    {project.systemId}
                  </span>

                  <span className="font-mono text-[0.43rem] uppercase tracking-[0.1em] text-signal">
                    Operational
                  </span>
                </div>

                <div className="h-[420px] overflow-hidden sm:h-[520px]">
                  {project.visual}
                </div>

                <div className="border-t border-glass-border p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-cobalt">
                      {project.category}
                    </span>

                    <span className="font-mono text-[0.44rem] uppercase tracking-[0.1em] text-ash">
                      {project.study.year}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-[clamp(1.8rem,8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                    {project.study.title}
                  </h3>

                  <p className="mt-5 text-[0.92rem] leading-[1.7] text-ash">
                    {project.study.outcome}
                  </p>

                  <div className="mt-6 grid grid-cols-3 border-y border-glass-border">
                    {project.study.metrics
                      .slice(0, 3)
                      .map((metric) => (
                        <div
                          key={metric.label}
                          className="border-r border-glass-border px-3 py-4 last:border-r-0"
                        >
                          <span className="block font-display text-[1.55rem] font-semibold leading-none">
                            {metric.value}
                          </span>

                          <span className="mt-2 block font-mono text-[0.38rem] uppercase leading-[1.4] tracking-[0.07em] text-ash">
                            {metric.label}
                          </span>
                        </div>
                      ))}
                  </div>

                  <Link
                    href={`/work/${project.study.slug}`}
                    className="mt-6 inline-flex items-center gap-3 font-mono text-[0.52rem] uppercase tracking-[0.12em] transition-colors hover:text-signal"
                  >
                    {project.linkLabel}
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/work"
            className="mt-10 inline-flex items-center gap-4 border-b border-white/30 pb-3 font-mono text-[0.56rem] uppercase tracking-[0.12em] transition-colors hover:border-signal hover:text-signal"
          >
            View complete archive
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}