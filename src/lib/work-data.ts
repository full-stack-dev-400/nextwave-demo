import type { ServiceSlug } from "./services-data";

/* =========================================================
   TYPES
========================================================= */

export interface Metric {
  value: string;
  label: string;
}

/**
 * Individual image used inside the
 * "03 / Interface" section of a case study.
 */
export interface InterfaceImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface Study {
  slug: string;
  tag: string;
  title: string;
  outcome: string;
  span: "full" | "half";

  /**
   * Which service pages this project supports.
   */
  services: ServiceSlug[];

  industry: string;
  year: string;
  client: string;
  stack: string[];

  /**
   * Main project image.
   *
   * Used for:
   * - Work showcase
   * - Case study hero
   * - Project preview
   */
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
  };

  /**
   * Images specifically for:
   *
   * 03 / INTERFACE
   *
   * Each project can now have its own
   * different set of interface images.
   */
  interfaceImages?: InterfaceImage[];

  interfaceLabels?: [
  string,
  string,
  string
];

  /**
   * External project website.
   */
  projectUrl?: string;

  challenge: string;
  approach: string;

  metrics: Metric[];

  quote: {
    text: string;
    who: string;
    flag: string;
  };
}

/* =========================================================
   PROJECTS
========================================================= */

export const STUDIES: Study[] = [
  /* =======================================================
     01 — CUSTOM SOFTWARE
  ======================================================= */
  {
    slug: "fleet-platform",

    tag: "Custom Software · Business Operations",

    title: "One platform to run your entire operation",

    outcome:
      "Projects, quotations, clients, tasks, approvals and reporting - connected in one internal management system.",

    image: {
      src: "/images/services/customsoftwarebanner.webp",
      alt: "BEZTEQ custom internal business management software dashboard",
      width: 1600,
      height: 1000,
      objectPosition: "center",
    },

    /**
     * 03 / INTERFACE IMAGES
     */
    interfaceImages: [
      {
        src: "/images/work/fleet-platform/interface-01.webp",
        alt: "Fleet operations management dashboard",
        objectPosition: "center",
      },
      {
        src: "/images/work/fleet-platform/interface-02.webp",
        alt: "Fleet project and operations interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/fleet-platform/interface-03.webp",
        alt: "Fleet reporting and business management interface",
        objectPosition: "center",
      },
    ],

    span: "full",

    services: ["custom-software"],

    industry: "Logistics",

    year: "2025",

    client: "Regional logistics operator",

    stack: [
      "Node.js",
      "PostgreSQL",
      "React",
      "Mapbox",
      "Docker",
    ],

    challenge:
      "Dispatch ran on spreadsheets and phone calls. Drivers were assigned routes manually each morning, with no visibility into real-time traffic or vehicle location — a change mid-route meant a phone call, not a system update. As the fleet grew past 40 vehicles, dispatch time crept toward an hour per shift change, and customers had no reliable ETA.",

    approach:
      "We rebuilt dispatch around a live map, not a spreadsheet: real-time vehicle tracking, automated route assignment based on proximity and load, and a driver app that pushed updates without a phone call. The system integrates directly with the existing fleet telematics hardware, so no vehicle retrofits were needed.",

    metrics: [
      {
        value: "40%",
        label: "Faster dispatch",
      },
      {
        value: "32",
        label: "Vehicles tracked live",
      },
      {
        value: "3wks",
        label: "To first live route",
      },
    ],

    quote: {
      text: "Weekly demos meant zero surprises at launch.",
      who: "COO · Logistics",
      flag: "🇦🇪 UAE",
    },
  },

  /* =======================================================
     02 — POS SOFTWARE
  ======================================================= */
  {
    slug: "retail-pos",

    tag: "POS · Retail",

    title: "POS across 32 stores",

    outcome: "Offline-first, VAT-ready.",

    image: {
      src: "/images/services/possoftwarebanner.webp",
      alt: "BEZTEQ retail POS and inventory management software dashboard",
      width: 1600,
      height: 1000,
      objectPosition: "center",
    },

    /**
     * 03 / INTERFACE IMAGES
     */
    interfaceImages: [
      {
        src: "/images/work/retail-pos/interface-01.webp",
        alt: "Retail POS checkout interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/retail-pos/interface-02.webp",
        alt: "Retail inventory management interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/retail-pos/interface-03.webp",
        alt: "Retail POS reporting dashboard",
        objectPosition: "center",
      },
    ],

    span: "half",

    services: ["pos-software"],

    industry: "Retail",

    year: "2025",

    client: "Multi-location retail group",

    stack: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "Offline sync",
      "Payment gateways",
    ],

    challenge:
      "Each store ran a different POS setup — some offline-only, some cloud-only, none synced. Head office had no same-day view of stock or sales across locations, and VAT reporting meant manually reconciling 32 separate exports every month.",

    approach:
      "One POS system across all 32 stores, offline-first so a dropped connection never stops a sale, syncing centrally the moment connectivity returns. VAT-compliant reporting generates automatically from the same data — no more manual reconciliation.",

    metrics: [
      {
        value: "32",
        label: "Stores on one system",
      },
      {
        value: "100%",
        label: "Offline-capable",
      },
      {
        value: "0",
        label: "Manual VAT exports",
      },
    ],

    quote: {
      text:
        "Our store managers stopped calling head office to ask what today's numbers were.",
      who: "Operations Director · Retail",
      flag: "🇦🇪 UAE",
    },
  },

  /* =======================================================
     03 — SHAMS BARAKAAT FURNITURE
  ======================================================= */
  {
    slug: "shams-barakaat-furniture",

    tag: "E-commerce · Furniture",

    title:
      "A furniture catalogue designed for faster product discovery",

    outcome:
      "A responsive shopping experience connecting desktop and mobile browsing with direct customer enquiries.",

    span: "full",

    services: [
      "web-development",
      "digital-marketing",
    ],

    industry: "Furniture & Retail",

    year: "2026",

    client: "Shams Barakaat Furniture",

    stack: [
      "WordPress",
      "WooCommerce",
      "Elementor",
      "Cloudflare",
      "Meta Pixel",
    ],

image: {
  src: "/images/work/shams-barakaat.png",
  alt: "Shams Barakaat Furniture website displayed on laptop and tablet",
  width: 1080,
  height: 637,
  objectPosition: "center",
},

    /**
     * 03 / INTERFACE IMAGES
     */
    interfaceImages: [
      {
        src: "/images/work/shams-barakaat/interface-01.webp",
        alt: "Shams Barakaat Furniture homepage interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/shams-barakaat/interface-02.webp",
        alt: "Shams Barakaat Furniture product catalogue interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/shams-barakaat/interface-03.webp",
        alt: "Shams Barakaat Furniture responsive e-commerce experience",
        objectPosition: "center",
      },
    ],

    interfaceLabels: [
  "01 / Discovery",
  "02 / Conversion",
  "03 / Commerce Experience",
],

    projectUrl:
      "https://shamsbarakaatfurniture.com",

    challenge:
      "The business needed a responsive online catalogue that made its furniture collection easier to browse while creating a clear path from product discovery to customer enquiry.",

    approach:
      "We reorganized the catalogue, improved mobile navigation, created responsive product layouts and connected important customer actions with analytics and advertising platforms.",

    metrics: [],

    quote: {
      text:
        "A responsive catalogue built to move customers from product discovery to direct enquiry.",
      who: "Project objective",
      flag: "🇦🇪 UAE",
    },
  },

  /* =======================================================
     04 — HEAVEN COUTURE
  ======================================================= */
  {
    slug: "heaven-couture",

    tag: "E-commerce · Fashion",

    title:
      "A fashion storefront built for fast mobile browsing",

    outcome:
      "A catalogue-led shopping experience that keeps categories, brands and products easy to explore across different screen sizes.",

    span: "half",

    services: [
      "web-development",
      "ui-ux-design",
    ],

    industry: "Fashion & E-commerce",

    year: "2026",

    client: "Heaven Couture",

    stack: [
      "E-commerce CMS",
      "Responsive UI",
      "Product catalogue",
      "Mobile optimization",
    ],

    image: {
      src: "/images/work/heaven-couture.png",
      alt: "Heaven Couture fashion website displayed on laptop and tablet",
      width: 1080,
      height: 647,
      objectPosition: "center",
    },

    /**
     * 03 / INTERFACE IMAGES
     */
    interfaceImages: [
      {
        src: "/images/work/heaven-couture/interface-01.webp",
        alt: "Heaven Couture homepage interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/heaven-couture/interface-02.webp",
        alt: "Heaven Couture fashion catalogue interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/heaven-couture/interface-03.webp",
        alt: "Heaven Couture responsive product browsing experience",
        objectPosition: "center",
      },
    ],

    projectUrl:
      "https://heavencoutureonline.com/",

    challenge:
      "The storefront needed to present a broad catalogue without making navigation feel crowded, especially for customers browsing from mobile devices.",

    approach:
      "We structured the experience around clear product categories, responsive catalogue grids and simplified navigation so customers could move between discovery and product browsing with less friction.",

    metrics: [],

    quote: {
      text:
        "A mobile-first catalogue experience focused on navigation and product discovery.",
      who: "Project objective",
      flag: "🌍 E-commerce",
    },
  },

  /* =======================================================
     05 — EIKLIQUE
  ======================================================= */
  {
    slug: "eiklique",

    tag: "E-commerce · Beauty",

    title:
      "A premium beauty storefront designed around discovery",

    outcome:
      "A responsive product experience bringing popular categories, new arrivals and best sellers into one clear shopping journey.",

    span: "half",

    services: [
      "web-development",
      "ui-ux-design",
    ],

    industry: "Beauty & E-commerce",

    year: "2026",

    client: "Eiklique",

    stack: [
      "E-commerce CMS",
      "Responsive UI",
      "Product catalogue",
      "Mobile optimization",
    ],

    image: {
      src: "/images/work/eiklique.png",
      alt: "Eiklique beauty e-commerce website displayed on laptop and tablet",
      width: 1080,
      height: 657,
      objectPosition: "center",
    },

    /**
     * 03 / INTERFACE IMAGES
     */
    interfaceImages: [
      {
        src: "/images/work/eiklique/interface-01.webp",
        alt: "Eiklique premium beauty homepage interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/eiklique/interface-02.webp",
        alt: "Eiklique product catalogue interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/eiklique/interface-03.webp",
        alt: "Eiklique responsive beauty e-commerce experience",
        objectPosition: "center",
      },
    ],

    projectUrl: "https://eiklique.com/",

    challenge:
      "The brand needed a premium digital storefront that could present multiple beauty categories while keeping new arrivals and popular products easy to find.",

    approach:
      "We developed a responsive catalogue experience with stronger product hierarchy, prominent category discovery and layouts designed to remain clear on desktop and mobile devices.",

    metrics: [],

    quote: {
      text:
        "A premium catalogue experience connecting brand presentation with practical product discovery.",
      who: "Project objective",
      flag: "🌍 E-commerce",
    },
  },

  /* =======================================================
     06 — FINTECH / GROWTH
  ======================================================= */
  {
    slug: "fintech-web",

    tag: "Fintech Website · Lead Generation",

    title:
      "A fintech acquisition system that generated 6,145 leads",

    outcome:
      "12.57M impressions, 306K link clicks and 74.4K landing-page views across 85 international campaigns.",

    span: "half",

    services: [
      "web-development",
      "digital-marketing",
    ],

    industry: "Fintech",

    year: "2026",

    client: "International fintech platform",

    stack: [
      "Landing pages",
      "Meta Ads",
      "Google Tag Manager",
      "GA4",
      "CRM integration",
    ],

    /**
     * Main image.
     *
     * This remains the image displayed on
     * the main Work page / project hero.
     */
    image: {
      src: "/images/services/marketingflow.webp",
      alt: "BEZTEQ lead generation process from campaign setup and conversion tracking to landing page, lead capture and Google Sheets",
      width: 1536,
      height: 1024,
      objectPosition: "center",
    },

    /**
     * 03 / INTERFACE IMAGES
     *
     * These are completely separate from
     * the main project image.
     */
    interfaceImages: [
      {
        src: "/images/work/fintech/interface-01.webp",
        alt: "International digital advertising campaign setup",
        objectPosition: "center",
      },
      {
        src: "/images/work/fintech/interface-02.webp",
        alt: "Fintech conversion landing page and lead capture interface",
        objectPosition: "center",
      },
      {
        src: "/images/work/fintech/interface-03.webp",
        alt: "Complete fintech lead generation and tracking workflow",
        objectPosition: "center",
      },
    ],

    challenge:
      "Acquisition campaigns were running across multiple international markets, but performance depended on consistent landing-page experiences, reliable event tracking and a clear path from advertising click to submitted lead.",

    approach:
      "We connected campaign traffic with dedicated landing pages, conversion tracking and CRM routing. Performance was monitored across impressions, clicks, landing-page views, leads and acquisition cost so campaigns could be optimized using real funnel data.",

    metrics: [
      {
        value: "85",
        label: "Campaigns managed",
      },
      {
        value: "2.43%",
        label: "Link CTR",
      },
      {
        value: "$0.07",
        label: "Average CPC",
      },
    ],

    quote: {
      text:
        "Campaign, landing-page and CRM data were connected into one measurable acquisition journey.",
      who: "Fintech acquisition system",
      flag: "🌍 International",
    },
  },
];

/* =========================================================
   HELPERS
========================================================= */

export function getStudyForService(
  slug: ServiceSlug,
): Study {
  return (
    STUDIES.find((study) =>
      study.services.includes(slug),
    ) ?? STUDIES[0]
  );
}

export function getStudiesForService(
  slug: ServiceSlug,
): Study[] {
  return STUDIES.filter((study) =>
    study.services.includes(slug),
  );
}

export function getStudy(
  slug: string,
): Study | undefined {
  return STUDIES.find(
    (study) => study.slug === slug,
  );
}

export function getNextStudy(
  slug: string,
): Study {
  const index = STUDIES.findIndex(
    (study) => study.slug === slug,
  );

  return STUDIES[
    (index + 1) % STUDIES.length
  ];
}