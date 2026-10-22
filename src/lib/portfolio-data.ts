import type { ServiceSlug } from "./services-data";

export interface PortfolioProject {
  slug: string;
  title: string;
  client: string;
  tag: string;
  outcome: string;
  services: ServiceSlug[];
  stack: string[];

  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };

  year?: string;
  projectUrl?: string;
  caseStudySlug?: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "stonefort-uae",
    title: "A regional trading website built around market discovery",
    client: "Stonefort UAE",
    tag: "FinTech · Trading Platform",
    outcome:
      "A responsive financial website connecting market information, trading products and account registration.",
    services: ["web-development", "ui-ux-design"],
    stack: ["WordPress", "Elementor", "Responsive UI", "TradingView"],
    image: {
      src: "/images/work/stonefortUAE.png",
      alt: "Stonefort UAE financial trading website shown on laptop and tablet",
    },
  },
  {
    slug: "stonefort-social",
    title: "A copy-trading platform designed around trader discovery",
    client: "Stonefort Social",
    tag: "FinTech · Copy Trading",
    outcome:
      "A product-focused website explaining copy trading, trader selection and automated execution.",
    services: ["web-development", "ui-ux-design"],
    stack: ["WordPress", "Responsive UI", "FinTech UX", "Custom Components"],
    image: {
      src: "/images/work/stonefortsocial.png",
      alt: "Stonefort Social copy-trading website shown on laptop and tablet",
    },
  },
  {
    slug: "stonefort-partners",
    title: "A partner platform for affiliates and introducing brokers",
    client: "Stonefort Partners",
    tag: "FinTech · Partner Platform",
    outcome:
      "A responsive partner acquisition experience communicating payouts, benefits and loyalty programmes.",
    services: ["web-development", "ui-ux-design"],
    stack: ["WordPress", "Responsive UI", "Partner Journey", "Custom Components"],
    image: {
      src: "/images/work/stonefortpartners.png",
      alt: "Stonefort Partners affiliate website shown on laptop and tablet",
    },
  },
  {
    slug: "stonefort-securities",
    title: "A multi-market trading website for international clients",
    client: "Stonefort Securities",
    tag: "FinTech · Brokerage Website",
    outcome:
      "A structured trading experience covering products, platforms, education and account conversion.",
    services: ["web-development", "ui-ux-design"],
    stack: ["WordPress", "Elementor", "Polylang", "Responsive UI"],
    image: {
      src: "/images/work/stonefortsecurities.png",
      alt: "Stonefort Securities brokerage website shown on laptop and tablet",
    },
  },
  {
    slug: "shams-barakaat-furniture",
    title: "A furniture catalogue designed for faster product discovery",
    client: "Shams Barakaat Furniture",
    tag: "E-commerce · Furniture",
    outcome:
      "A responsive product catalogue connecting desktop and mobile browsing with direct customer enquiries.",
    services: ["web-development", "digital-marketing"],
    stack: ["WordPress", "WooCommerce", "Elementor", "Cloudflare"],
    image: {
      src: "/images/work/shams-barakaat.png",
      alt: "Shams Barakaat Furniture website shown on laptop and tablet",
    },
    projectUrl: "https://shamsbarakaatfurniture.com",
    caseStudySlug: "shams-barakaat-furniture",
  },
  {
    slug: "eiklique",
    title: "A premium beauty storefront designed around discovery",
    client: "Eiklique",
    tag: "E-commerce · Beauty",
    outcome:
      "A responsive catalogue bringing popular categories, new arrivals and best sellers into one shopping journey.",
    services: ["web-development", "ui-ux-design"],
    stack: ["E-commerce", "Responsive UI", "Product Catalogue"],
    image: {
      src: "/images/work/eiklique.png",
      alt: "Eiklique beauty website shown on laptop and tablet",
    },
    caseStudySlug: "eiklique",
  },
  {
    slug: "heaven-couture",
    title: "A fashion storefront built for mobile product browsing",
    client: "Heaven Couture",
    tag: "E-commerce · Fashion",
    outcome:
      "A catalogue-led experience that keeps categories, brands and products easy to explore.",
    services: ["web-development", "ui-ux-design"],
    stack: ["E-commerce", "Responsive UI", "Product Catalogue"],
    image: {
      src: "/images/work/heaven-couture.png",
      alt: "Heaven Couture fashion website shown on laptop and tablet",
    },
    caseStudySlug: "heaven-couture",
  },
  {
    slug: "shorter-investment",
    title: "A luxury property website with an editorial presentation",
    client: "Shorter Investment",
    tag: "Real Estate · Corporate Website",
    outcome:
      "A responsive property experience designed around premium positioning and project discovery.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Web Development", "Responsive UI", "CMS"],
    image: {
      src: "/images/work/shorter-investment.jpg",
      alt: "Shorter Investment property website shown on laptop and tablet",
    },
  },
  {
    slug: "skw-greater-360",
    title: "A healthcare platform connecting patients with specialists",
    client: "SKW Greater 360",
    tag: "Healthcare · Web Platform",
    outcome:
      "A responsive interface helping users discover specialists and access healthcare information.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Web Development", "Healthcare UX", "Responsive UI"],
    image: {
      src: "/images/work/skwgreater360.jpg",
      alt: "SKW Greater 360 healthcare website shown on laptop and tablet",
    },
  },
  {
    slug: "vacation-rental-license",
    title: "A vacation-rental licensing website focused on conversion",
    client: "Vacation Rental License",
    tag: "Real Estate · Lead Generation",
    outcome:
      "A focused service website communicating licensing support with clear enquiry actions.",
    services: ["web-development", "digital-marketing"],
    stack: ["Web Development", "Lead Generation", "Responsive UI"],
    image: {
      src: "/images/work/vacationrentallicense.gif",
      alt: "Vacation Rental License website shown on a laptop",
    },
  },
  {
    slug: "walkies",
    title: "A friendly product website for pet-service businesses",
    client: "Walkies",
    tag: "SaaS · Pet Services",
    outcome:
      "A product-led website explaining mobile tools for pet sitters and dog-walking businesses.",
    services: ["web-development", "ui-ux-design"],
    stack: ["SaaS Website", "Responsive UI", "Product Marketing"],
    image: {
      src: "/images/work/walkie.jpg",
      alt: "Walkies pet services website shown on laptop and tablet",
    },
  },
  {
    slug: "walk-in-specialist",
    title: "A healthcare clinic website built around service access",
    client: "Walk-In Specialist",
    tag: "Healthcare · Clinic Website",
    outcome:
      "A responsive healthcare experience presenting services, appointments and patient information.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Healthcare Website", "Responsive UI", "CMS"],
    image: {
      src: "/images/work/walkinspecialist.gif",
      alt: "Walk-In Specialist clinic website shown on a laptop",
    },
  },
  {
    slug: "360-app-services",
    title: "A digital-services website structured around lead generation",
    client: "360 App Services",
    tag: "Digital Agency · Lead Generation",
    outcome:
      "A responsive corporate website presenting services, credentials and consultation paths.",
    services: ["web-development", "digital-marketing"],
    stack: ["Web Development", "Lead Generation", "Responsive UI"],
    image: {
      src: "/images/work/360appservices.gif",
      alt: "360 App Services website shown on a laptop",
    },
  },
  {
    slug: "a2z-auto-express",
    title: "An automotive enquiry platform built for direct conversion",
    client: "A2Z Auto Express",
    tag: "Automotive · Lead Generation",
    outcome:
      "A service website connecting vehicle sellers with a focused quotation and enquiry flow.",
    services: ["web-development", "digital-marketing"],
    stack: ["Lead Generation", "Responsive UI", "Form Integration"],
    image: {
      src: "/images/work/a2zautoexpress.gif",
      alt: "A2Z Auto Express website shown on a laptop",
    },
  },
  {
    slug: "a2z-leather",
    title: "An online leather catalogue designed around product browsing",
    client: "A2Z Leather",
    tag: "E-commerce · Leather",
    outcome:
      "A responsive commerce interface presenting leather collections and product categories.",
    services: ["web-development", "ui-ux-design"],
    stack: ["E-commerce", "Product Catalogue", "Responsive UI"],
    image: {
      src: "/images/work/a2zleather.gif",
      alt: "A2Z Leather e-commerce website shown on a laptop",
    },
  },
  {
    slug: "airvistas",
    title: "A property platform for short-term rental management",
    client: "Airvistas",
    tag: "Real Estate · Property Management",
    outcome:
      "A responsive property experience presenting listings, services and management updates.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Property Listings", "Responsive UI", "CMS"],
    image: {
      src: "/images/work/airvistas.png",
      alt: "Airvistas property website shown on laptop and tablet",
    },
  },
  {
    slug: "arabian-printing-press",
    title: "A corporate printing website designed around service discovery",
    client: "Arabian Printing Press",
    tag: "Printing · Corporate Website",
    outcome:
      "A responsive service website communicating commercial printing capabilities and enquiries.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Corporate Website", "Responsive UI", "CMS"],
    image: {
      src: "/images/work/arabian-printing-press.jpg",
      alt: "Arabian Printing Press website shown on laptop and phone",
    },
  },
  {
    slug: "beloon-decor",
    title: "An e-commerce experience for decorative balloon products",
    client: "Beloon Decor",
    tag: "E-commerce · Home Decor",
    outcome:
      "A responsive shopping interface connecting product categories with a clear purchase journey.",
    services: ["web-development", "ui-ux-design"],
    stack: ["E-commerce", "Responsive UI", "Product Catalogue"],
    image: {
      src: "/images/work/beloon-decor.jpg",
      alt: "Beloon Decor website shown on laptop and tablet",
    },
  },
  {
    slug: "berks-insulation",
    title: "A home-services website built around funding enquiries",
    client: "Berks Insulation",
    tag: "Home Services · Lead Generation",
    outcome:
      "A responsive service platform explaining insulation solutions, grants and qualification steps.",
    services: ["web-development", "digital-marketing"],
    stack: ["Lead Generation", "Responsive UI", "Service Pages"],
    image: {
      src: "/images/work/berks-inulation.png",
      alt: "Berks Insulation website shown on laptop and tablet",
    },
  },
  {
    slug: "cymbiotika",
    title: "A wellness storefront designed for product-led discovery",
    client: "Cymbiotika",
    tag: "E-commerce · Wellness",
    outcome:
      "A responsive commerce experience presenting supplements, education and product collections.",
    services: ["web-development", "ui-ux-design"],
    stack: ["E-commerce", "Responsive UI", "Product Catalogue"],
    image: {
      src: "/images/work/cymbiotika.gif",
      alt: "Cymbiotika wellness website shown on a laptop",
    },
  },
  {
    slug: "ecolox-tech",
    title: "A product website for home and commercial technology",
    client: "Ecolox Tech",
    tag: "Technology · E-commerce",
    outcome:
      "A responsive platform explaining products, applications and industry-specific solutions.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Product Website", "E-commerce", "Responsive UI"],
    image: {
      src: "/images/work/ecolox-tech.jpg",
      alt: "Ecolox Tech website shown on laptop and tablet",
    },
  },
  {
    slug: "great-vtubers",
    title: "A digital-products storefront for streaming creators",
    client: "Great Vtubers",
    tag: "E-commerce · Digital Products",
    outcome:
      "A catalogue-based commerce experience for streaming assets and creator products.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Digital Commerce", "Product Catalogue", "Responsive UI"],
    image: {
      src: "/images/work/greatvtubers.gif",
      alt: "Great Vtubers digital products website shown on a laptop",
    },
  },
  {
    slug: "gymnation",
    title: "A fitness website built around memberships and locations",
    client: "GymNation",
    tag: "Fitness · Membership Website",
    outcome:
      "A responsive fitness experience communicating locations, memberships and customer reviews.",
    services: ["web-development", "digital-marketing"],
    stack: ["Membership Website", "Responsive UI", "Lead Generation"],
    image: {
      src: "/images/work/gymnation.gif",
      alt: "GymNation fitness website shown on a laptop",
    },
  },
  {
    slug: "illusive",
    title: "A cybersecurity website translating complex products clearly",
    client: "Illusive",
    tag: "Cybersecurity · Enterprise Website",
    outcome:
      "An enterprise product experience presenting identity security, research and platform capabilities.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Enterprise Website", "Product Marketing", "Responsive UI"],
    image: {
      src: "/images/work/illusive.jpg",
      alt: "Illusive cybersecurity website shown on laptop and tablet",
    },
  },
  {
    slug: "inclusive-leaders-group",
    title: "A consulting website built around authority and engagement",
    client: "Inclusive Leaders Group",
    tag: "Consulting · Corporate Website",
    outcome:
      "A responsive consulting platform presenting expertise, services and thought leadership.",
    services: ["web-development", "ui-ux-design"],
    stack: ["Corporate Website", "Responsive UI", "CMS"],
    image: {
      src: "/images/work/inclusive.jpg",
      alt: "Inclusive Leaders Group website shown on laptop and tablet",
    },
  },
];

export function getPortfolioProjectsForService(
  slug: ServiceSlug,
): PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((project) =>
    project.services.includes(slug),
  );
}