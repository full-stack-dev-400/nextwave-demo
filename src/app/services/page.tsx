import Link from "next/link";
import type { Metadata } from "next";
import { Core } from "@/components/core/Core";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SERVICES } from "@/lib/services-data";
import { getStudyForService } from "@/lib/work-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software development services in Dubai | BEZTEQ",
  description:
    "Web development, custom software, POS systems, UI/UX design, and growth services — engineering-grade, built in Dubai for the GCC.",
  alternates: { canonical: `${SITE_URL}/services` },
};

/**
 * Services hub (wireframes §02): a decision surface, not a brochure — faster
 * and quieter than Home. No pin; this audience is task-driven.
 */
export default function ServicesHubPage() {
  return (
    <>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-obsidian px-[var(--space-gutter)] pt-28">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <div className="mb-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ash">
              Services
            </div>
            <div
              aria-hidden
              className="max-w-[14ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              What do you need built?
            </div>
            <h1 className="mt-5 max-w-[38ch] font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ash">
              Software development services in Dubai
            </h1>
          </div>
          <div className="h-[280px] md:h-[360px]">
            <Core morphState="lattice" />
          </div>
        </div>
      </section>

      <section className="border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto max-w-[1280px]">
          <SectionEyebrow>/ 01 — Choose a discipline</SectionEyebrow>
          <Reveal group stagger={0.06} className="border-t border-glass-border">
            {SERVICES.map((service, i) => {
              const study = getStudyForService(service.slug);
              return (
                <div
                  key={service.slug}
                  data-hover
                  data-label="EXPLORE"
                  className="group grid grid-cols-1 gap-4 border-b border-glass-border py-8 transition-[padding] duration-base ease-out-expo hover:py-9 md:grid-cols-[80px_1fr_auto]"
                >
                  <div className="font-mono text-[0.8rem] text-ash">0{i + 1}</div>
                  <div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="font-display text-[1.6rem] font-medium tracking-[-0.01em] text-bone transition-colors duration-fast hover:text-cobalt md:text-[1.9rem]"
                    >
                      {service.breadcrumbLabel}
                    </Link>
                    <p className="mt-2 max-w-[52ch] text-[0.9rem] text-ash">
                      {service.metaDescription}
                    </p>
                    <div className="mt-3 flex gap-5 font-mono text-[0.7rem] uppercase tracking-[0.08em]">
                      <Link
                        href={`/work/${study.slug}`}
                        className="text-cobalt transition-colors hover:text-bone"
                      >
                        See work →
                      </Link>
                      <Link
                        href={`/services/${service.slug}#faq`}
                        className="text-ash transition-colors hover:text-bone"
                      >
                        FAQ →
                      </Link>
                    </div>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hidden items-center font-mono text-[0.72rem] text-ash opacity-0 transition-opacity duration-base md:flex md:group-hover:opacity-100"
                  >
                    Explore →
                  </Link>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-glass-border px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto max-w-[1280px] text-center">
          <Reveal>
            <p className="mx-auto max-w-[52ch] font-display text-[1.4rem] font-medium tracking-[-0.01em] text-bone">
              Not sure what you need? Describe the problem — we&rsquo;ll scope it.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact" variant="primary">
                Start a project
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
