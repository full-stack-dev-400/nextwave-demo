import type { Metadata } from "next";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ContactForm } from "@/components/ui/ContactForm";
import { COMPANY, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project with BEZTEQ | Contact",
  description: "Tell us about your project. We reply within one business day.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

/** Contact (wireframes §07): zero friction, zero theatre — the Core is absent by design. */
export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "ProfessionalService",
      name: COMPANY.name,
      email: COMPANY.email,
      telephone: COMPANY.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: COMPANY.addressLocality,
        addressCountry: COMPANY.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: COMPANY.geo.lat,
        longitude: COMPANY.geo.lng,
      },
      areaServed: ["AE", "SA", "GCC"],
    },
  };

  const mapSrc = `https://maps.google.com/maps?q=${COMPANY.geo.lat},${COMPANY.geo.lng}&z=14&output=embed`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <section className="px-[var(--space-gutter)] pb-[var(--space-section)] pt-32">
        <div className="mx-auto max-w-[1280px]">
          <SectionEyebrow>/ Contact</SectionEyebrow>
          <h1 className="max-w-[20ch] font-display text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-bone">
            Start a project with BEZTEQ.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[1.02rem] text-ash">
            Zero friction, zero theatre. Tell us about the problem — we reply
            within one business day.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_1fr]">
            <ContactForm showService />

            <div className="space-y-10">
              <div>
                <div className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                  Direct
                </div>
                <a
                  href={`mailto:${COMPANY.email}`}
                  data-hover
                  className="block text-[1.05rem] text-bone transition-colors duration-fast hover:text-cobalt"
                >
                  {COMPANY.email}
                </a>
                <a
                  href={COMPANY.whatsapp}
                  data-hover
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[1.05rem] text-bone transition-colors duration-fast hover:text-cobalt"
                >
                  WhatsApp
                </a>
              </div>

              <div>
                <div className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                  Office
                </div>
                <p className="text-[0.95rem] text-ash">{COMPANY.addressFull}</p>
              </div>

              <div className="overflow-hidden rounded-lg border border-glass-border">
                <iframe
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full grayscale invert-[0.92] contrast-[0.9]"
                  title="BEZTEQ Dubai office location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
