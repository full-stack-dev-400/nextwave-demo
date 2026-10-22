import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, getService } from "@/lib/services-data";
import { SITE_URL } from "@/lib/site";

import { ServiceHero } from "@/components/services/ServiceHero";
import { WebDevelopmentHero } from "@/components/services/web-development/WebDevelopmentHero";

import { WebDevelopmentOffer } from "@/components/services/web-development/WebDevelopmentOffer";
import { Offer } from "@/components/services/Offer";

import { ProofSection } from "@/components/services/ProofSection";
import { WebDevelopmentProof } from "@/components/services/web-development/WebDevelopmentProof";

import { ApproachSection } from "@/components/services/ApproachSection";
import { SupportBlock } from "@/components/services/SupportBlock";
import { FaqCta } from "@/components/services/FaqCta";

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {};
  }

  return {
    title: `${service.h1} | BEZTEQ`,
    description: service.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.breadcrumbLabel,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      {service.slug === "web-development" ? (
        <WebDevelopmentHero service={service} />
      ) : (
        <ServiceHero service={service} />
      )}

      {service.slug === "web-development" ? (
        <WebDevelopmentOffer />
      ) : (
        <Offer service={service} />
      )}

      {service.slug === "web-development" ? (
        <WebDevelopmentProof />
      ) : (
        <ProofSection slug={service.slug} />
      )}

      <ApproachSection service={service} />
      <SupportBlock service={service} />
      <FaqCta service={service} />
    </>
  );
}