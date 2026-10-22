"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useDegradation } from "@/providers/DegradationProvider";

interface SignalItem {
  code: string;
  name: string;
  detail: string;
  signals: string[];
}

const INDUSTRIES: SignalItem[] = [
  {
    code: "IND-01",
    name: "Retail",
    detail:
      "Connected commerce, inventory, checkout and multi-location reporting systems.",
    signals: [
      "POS",
      "Inventory",
      "E-commerce",
    ],
  },
  {
    code: "IND-02",
    name: "Food & Beverage",
    detail:
      "Ordering, kitchen workflows, delivery operations and stock control.",
    signals: [
      "Ordering",
      "Operations",
      "Delivery",
    ],
  },
  {
    code: "IND-03",
    name: "Real Estate",
    detail:
      "Property discovery, lead capture, CRM integration and sales automation.",
    signals: [
      "Listings",
      "CRM",
      "Lead generation",
    ],
  },
  {
    code: "IND-04",
    name: "Logistics",
    detail:
      "Dispatch automation, fleet visibility, routing and operational dashboards.",
    signals: [
      "Fleet",
      "Routing",
      "Automation",
    ],
  },
  {
    code: "IND-05",
    name: "Fintech",
    detail:
      "High-trust websites, onboarding journeys, dashboards and acquisition systems.",
    signals: [
      "Security",
      "Conversion",
      "Integrations",
    ],
  },
  {
    code: "IND-06",
    name: "Healthcare",
    detail:
      "Accessible portals, booking journeys, internal workflows and secure information handling.",
    signals: [
      "Portals",
      "Booking",
      "Accessibility",
    ],
  },
  {
    code: "IND-07",
    name: "E-commerce",
    detail:
      "Storefronts, checkout, fulfilment, payments and lifecycle marketing.",
    signals: [
      "Commerce",
      "Payments",
      "Retention",
    ],
  },
  {
    code: "IND-08",
    name: "Hospitality",
    detail:
      "Booking experiences, guest operations, loyalty and service automation.",
    signals: [
      "Booking",
      "Guest experience",
      "Loyalty",
    ],
  },
  {
    code: "IND-09",
    name: "Professional Services",
    detail:
      "Lead generation, client portals, internal systems and workflow automation.",
    signals: [
      "Websites",
      "Portals",
      "Automation",
    ],
  },
];

const TECHNOLOGIES: SignalItem[] = [
  {
    code: "TEC-01",
    name: "Next.js",
    detail:
      "Server-rendered digital products and high-performance websites.",
    signals: [
      "SSR",
      "App Router",
      "Performance",
    ],
  },
  {
    code: "TEC-02",
    name: "React",
    detail:
      "Interactive interfaces, dashboards and maintainable product experiences.",
    signals: [
      "Interfaces",
      "Components",
      "Applications",
    ],
  },
  {
    code: "TEC-03",
    name: "TypeScript",
    detail:
      "Safer application development with clearer contracts and fewer production errors.",
    signals: [
      "Reliability",
      "Types",
      "Scale",
    ],
  },
  {
    code: "TEC-04",
    name: "Node.js",
    detail:
      "APIs, business logic, integrations and scalable backend services.",
    signals: [
      "APIs",
      "Backend",
      "Automation",
    ],
  },
  {
    code: "TEC-05",
    name: "WordPress",
    detail:
      "Flexible content platforms, business websites and custom publishing systems.",
    signals: [
      "CMS",
      "Custom themes",
      "Plugins",
    ],
  },
  {
    code: "TEC-06",
    name: "WooCommerce",
    detail:
      "Custom commerce experiences built inside the WordPress ecosystem.",
    signals: [
      "Checkout",
      "Products",
      "Payments",
    ],
  },
  {
    code: "TEC-07",
    name: "PostgreSQL",
    detail:
      "Reliable relational data, reporting and structured business information.",
    signals: [
      "Database",
      "Reporting",
      "Integrity",
    ],
  },
  {
    code: "TEC-08",
    name: "AWS",
    detail:
      "Cloud deployment, infrastructure, monitoring and application scaling.",
    signals: [
      "Cloud",
      "Deployment",
      "Monitoring",
    ],
  },
  {
    code: "TEC-09",
    name: "Shopify",
    detail:
      "Fast commerce launches with customized storefronts and integrations.",
    signals: [
      "Commerce",
      "Liquid",
      "Integrations",
    ],
  },
  {
    code: "TEC-10",
    name: "REST APIs",
    detail:
      "Reliable connectivity between websites, CRMs, platforms and external services.",
    signals: [
      "Integration",
      "Data",
      "Connectivity",
    ],
  },
  {
    code: "TEC-11",
    name: "Docker",
    detail:
      "Consistent, portable application environments across development and production.",
    signals: [
      "Containers",
      "Deployment",
      "Consistency",
    ],
  },
];

const HEADING_FIRST = "Across industries.";
const HEADING_SECOND = "Built with intent.";
const FULL_HEADING =
  `${HEADING_FIRST} ${HEADING_SECOND}`;

function MarqueeRow({
  items,
  activeName,
  onActivate,
  reverse = false,
  outline = false,
  label,
  count,
}: {
  items: SignalItem[];
  activeName: string;
  onActivate: (item: SignalItem) => void;
  reverse?: boolean;
  outline?: boolean;
  label: string;
  count: string;
}) {
  const renderGroup = (
    duplicate: boolean,
  ) => (
    <div
      aria-hidden={duplicate ? "true" : undefined}
      className={`industries-marquee-group ${
        duplicate
          ? "industries-marquee-group-duplicate"
          : ""
      }`}
    >
      {items.map((item, index) => {
        const active =
          item.name === activeName;

        return (
          <div
            key={`${duplicate ? "duplicate" : "primary"}-${item.code}`}
            className="flex shrink-0 items-center"
          >
            <button
              type="button"
              data-hover
              tabIndex={duplicate ? -1 : 0}
              aria-label={`Inspect ${item.name}`}
              aria-pressed={
                duplicate
                  ? undefined
                  : active
              }
              onPointerEnter={() =>
                onActivate(item)
              }
              onFocus={() =>
                onActivate(item)
              }
              onClick={() =>
                onActivate(item)
              }
              className={`industries-marquee-item ${
                outline
                  ? "industries-marquee-item-outline"
                  : ""
              } ${
                active
                  ? "industries-marquee-item-active"
                  : ""
              }`}
            >
              {item.name}
            </button>

            <span
              aria-hidden="true"
              className="industries-marquee-separator"
            >
              /
            </span>

            {index ===
              items.length - 1 && (
              <span
                aria-hidden="true"
                className="industries-marquee-end-space"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="industries-marquee-row grid border-b border-glass-border last:border-b-0 lg:grid-cols-[170px_minmax(0,1fr)]">
      <div className="flex items-center justify-between border-b border-glass-border px-5 py-4 lg:flex-col lg:items-start lg:justify-center lg:border-b-0 lg:border-r lg:px-6">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-cobalt">
          {label}
        </span>

        <span className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash lg:mt-3">
          {count}
        </span>
      </div>

      <div className="industries-marquee-viewport">
        <div
          className={`industries-marquee-track ${
            reverse
              ? "industries-marquee-track-reverse"
              : ""
          }`}
        >
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </div>
  );
}

export function IndustriesMarquee() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const headingStartedRef =
    useRef(false);

  const {
    prefersReducedMotion,
  } = useDegradation();

  const [
    sectionVisible,
    setSectionVisible,
  ] = useState(false);

  const [
    typedHeading,
    setTypedHeading,
  ] = useState("");

  const [
    activeIndustry,
    setActiveIndustry,
  ] = useState<SignalItem>(
    INDUSTRIES[4],
  );

  const [
    activeTechnology,
    setActiveTechnology,
  ] = useState<SignalItem>(
    TECHNOLOGIES[0],
  );

  /*
   * Detect the section entering the viewport.
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
   * Type the Section 6 heading once.
   */
  useEffect(() => {
    if (
      !sectionVisible ||
      headingStartedRef.current
    ) {
      return;
    }

    headingStartedRef.current =
      true;

    if (prefersReducedMotion) {
      setTypedHeading(
        FULL_HEADING,
      );

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
      className="industries-section relative overflow-hidden border-y border-glass-border py-[var(--space-section)]"
    >
      <div className="relative z-10">
        {/* Heading */}
        <div className="industries-section-reveal mx-auto grid max-w-[1280px] gap-8 px-[var(--space-gutter)] lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionEyebrow>
              / 06 — Operating range
            </SectionEyebrow>

            <h2
              aria-label={FULL_HEADING}
              className="min-h-[1.9em] max-w-[18ch] font-mono text-[clamp(2.1rem,4.7vw,4.8rem)] font-medium leading-[0.97] tracking-[-0.045em] text-bone"
            >
              <span className="block min-h-[0.97em]">
                {firstLineTyped}

                {!typingSecondLine && (
                  <span
                    aria-hidden="true"
                    className="industries-heading-cursor text-signal"
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
                    className="industries-heading-cursor text-signal"
                  >
                    |
                  </span>
                )}
              </span>
            </h2>
          </div>

          <div className="max-w-[510px] lg:justify-self-end">
            <p className="text-[clamp(1rem,1.35vw,1.12rem)] leading-[1.72] text-ash">
              Technology is selected around the
              problem-not forced onto every project.
              The system changes with the business,
              users and operating environment.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-signal">
              <span className="size-[6px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

              Context-first engineering
            </div>
          </div>
        </div>

        {/* Moving operating range */}
        <div className="industries-section-reveal mt-14 border-y border-glass-border bg-[rgba(11,12,14,0.38)]">
          <MarqueeRow
            items={INDUSTRIES}
            activeName={
              activeIndustry.name
            }
            onActivate={
              setActiveIndustry
            }
            label="Industries"
            count="09 environments"
          />

          <MarqueeRow
            items={TECHNOLOGIES}
            activeName={
              activeTechnology.name
            }
            onActivate={
              setActiveTechnology
            }
            reverse
            outline
            label="Technology"
            count="11 systems"
          />
        </div>

        {/* Active readouts */}
        <div className="industries-section-reveal mx-auto mt-8 grid max-w-[1280px] gap-5 px-[var(--space-gutter)] lg:grid-cols-2">
          <article
            key={activeIndustry.code}
            className="industry-readout-card relative overflow-hidden rounded-[20px] border border-glass-border bg-[rgba(22,24,28,0.65)] p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-5">
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-cobalt">
                Industry signal
              </span>

              <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-ash">
                {activeIndustry.code}
              </span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-bone">
              {activeIndustry.name}
            </h3>

            <p className="mt-4 max-w-[52ch] text-[0.9rem] leading-[1.7] text-ash">
              {activeIndustry.detail}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {activeIndustry.signals.map(
                (signal) => (
                  <span
                    key={signal}
                    className="border border-glass-border bg-glass px-3 py-2 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-bone"
                  >
                    <span className="mr-2 text-signal">
                      +
                    </span>

                    {signal}
                  </span>
                ),
              )}
            </div>

            <span className="industry-readout-line absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cobalt via-signal to-transparent" />
          </article>

          <article
            key={activeTechnology.code}
            className="industry-readout-card relative overflow-hidden rounded-[20px] border border-glass-border bg-[rgba(22,24,28,0.65)] p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-5">
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-cobalt">
                Technology signal
              </span>

              <span className="font-mono text-[0.48rem] uppercase tracking-[0.11em] text-ash">
                {activeTechnology.code}
              </span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-bone">
              {activeTechnology.name}
            </h3>

            <p className="mt-4 max-w-[52ch] text-[0.9rem] leading-[1.7] text-ash">
              {activeTechnology.detail}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {activeTechnology.signals.map(
                (signal) => (
                  <span
                    key={signal}
                    className="border border-glass-border bg-glass px-3 py-2 font-mono text-[0.48rem] uppercase tracking-[0.08em] text-bone"
                  >
                    <span className="mr-2 text-cobalt">
                      /
                    </span>

                    {signal}
                  </span>
                ),
              )}
            </div>

            <span className="industry-readout-line absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cobalt via-signal to-transparent" />
          </article>
        </div>

        {/* Footer annotation */}
        <div className="industries-section-reveal mx-auto mt-7 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-glass-border px-[var(--space-gutter)] pt-5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ash">
          <span>
            Hover or select a signal
          </span>

          <span>
            One stack never fits every system
          </span>
        </div>
      </div>
    </section>
  );
}