import type { MorphState } from "@/components/core/morph-states";

export type ServiceSlug =
  | "web-development"
  | "custom-software"
  | "pos-software"
  | "ui-ux-design"
  | "digital-marketing";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServiceContent {
  slug: ServiceSlug;
  coreState: MorphState;
  /** Fixed display copy - large type, no geo keyword (CLAUDE.md §9: geo never in hero display type). */
  displayLine: string;
  /** The real semantic H1: "[Service] in Dubai" pattern (CLAUDE.md §9). */
  h1: string;
  breadcrumbLabel: string;
  metaDescription: string;
  offer: string;
  deliverables: string[];
  stackBadges: string[];
  testimonial: { quote: string; who: string; flag: string };
  faq: FaqItem[];
}

export const SERVICES: ServiceContent[] = [
  {
    slug: "web-development",
    coreState: "lattice",
    displayLine: "Websites built like products.",
    h1: "Custom web development in Dubai",
    breadcrumbLabel: "Web Development",
    metaDescription:
      "Custom web development - fast, bespoke sites and web apps built like products on Next.js, headless CMS, and production-grade hosting.",
    offer:
      "We build marketing sites and web apps the same way we'd build a product: componentized, tested, and fast by default. Every build starts from a real content model, not a page-builder template, so it holds up as the business grows. You get a Next.js codebase your own team can read on day one, a CMS your editors can actually use, and hosting that doesn't fall over under a launch spike. We handle the unglamorous parts - redirects, analytics, Core Web Vitals, accessibility - as part of the build, not a post-launch scramble.",
    deliverables: [
      "Next.js + TypeScript codebase, source handed over",
      "Headless CMS wired to real content models",
      "Lighthouse 95+ across performance, SEO, accessibility",
      "Analytics + conversion tracking configured",
    ],
    stackBadges: ["Next.js", "TypeScript", "Tailwind", "Headless CMS", "Vercel/AWS"],
    testimonial: {
      quote:
        "They shipped in weeks what our last agency couldn't in a year. The code was clean enough that our own team could take it over.",
      who: "Head of Digital · Retail group",
      flag: "🇦🇪 UAE",
    },
    faq: [
      {
        q: "How much does custom web development cost in Dubai?",
        a: "It depends on scope, but every engagement starts with a fixed-price discovery phase, so you have a firm number before committing to the build.",
      },
      {
        q: "How long does a typical build take?",
        a: "Most marketing sites ship in 4–8 weeks; web apps with real data models run 8–14 weeks. Weekly demos mean you see progress the whole way, not just at the end.",
      },
      {
        q: "Can we choose our own CMS?",
        a: "Yes - we'll recommend one based on your team's workflow, but we've shipped on Sanity, Contentful, and WordPress headless. The content model matters more than the vendor.",
      },
      {
        q: "Who hosts the site after launch?",
        a: "Your accounts, your infrastructure - typically Vercel or AWS. We configure it during the build and hand over full access; there's no dependency on us to keep it running.",
      },
    ],
  },
  {
    slug: "custom-software",
    coreState: "assembling",
    displayLine: "Software shaped to your business.",
    h1: "Custom business software development",
    breadcrumbLabel: "Custom Software",
    metaDescription:
      "Custom business software development in Dubai - internal tools, dashboards, and platforms shaped to your operation. You own the code and the roadmap.",
    offer:
      "Off-the-shelf software makes you adapt your business to its workflow. We build the reverse: software shaped to how your team actually operates, so the tool disappears and the work speeds up. That means real requirements gathering with the people who'll use it daily, a data model that matches your operation rather than a generic template, and integrations into whatever you already run - ERP, accounting, logistics providers. You own the resulting codebase outright; there's no license to renegotiate every year and no vendor holding your data hostage.",
    deliverables: [
      "Requirements mapped with your operational team, not just stakeholders",
      "Modular architecture that grows with new workflows",
      "Integrations into existing ERP/accounting/logistics systems",
      "Full source and data ownership, no recurring license",
    ],
    stackBadges: ["Node.js", "PostgreSQL", "React", "REST/GraphQL APIs", "Docker"],
    testimonial: {
      quote: "Weekly demos meant zero surprises at launch.",
      who: "COO · Logistics",
      flag: "🇦🇪 UAE",
    },
    faq: [
      {
        q: "Should we build custom or buy an off-the-shelf tool?",
        a: "If your workflow is genuinely standard, buy. If you're bending your operation to fit someone else's software - or paying per-seat for features you don't use - custom usually pays for itself within a year.",
      },
      {
        q: "Who owns the code and the data?",
        a: "You do, entirely. There's no license, no per-seat fee, and no dependency on us to keep operating it once it's delivered.",
      },
      {
        q: "Can it integrate with our existing systems?",
        a: "Yes - this is most of the work on custom builds. We've integrated with ERPs, accounting platforms, and third-party logistics APIs across past projects.",
      },
      {
        q: "What if our requirements change mid-build?",
        a: "Expected, not exceptional. The modular architecture and weekly demos exist specifically so scope changes get absorbed without a full re-plan.",
      },
    ],
  },
  {
    slug: "pos-software",
    coreState: "grid",
    displayLine: "Point of sale, minus the friction.",
    h1: "POS software development in Dubai & UAE",
    breadcrumbLabel: "POS Software",
    metaDescription:
      "POS software development in Dubai and the UAE - offline-first point-of-sale systems with built-in VAT compliance, built for retail and F&B.",
    offer:
      "Point-of-sale software fails at exactly the wrong moment: mid-transaction, with a queue forming. We build POS systems offline-first from the ground up, so a dropped connection never stops a sale - transactions sync the moment the network returns. UAE VAT compliance is built in, not bolted on: correct tax treatment, invoice formatting, and FTA-ready reporting from day one. Whether you're running a single till or 30 store locations, the system gives you one real-time view of stock and sales across every terminal.",
    deliverables: [
      "Offline-first transaction handling with automatic sync",
      "UAE VAT compliance and FTA-ready reporting built in",
      "Real-time stock and sales view across all locations",
      "Hardware integration: receipt printers, card readers, barcode scanners",
    ],
    stackBadges: ["React Native", "Node.js", "PostgreSQL", "Offline sync", "Payment gateways"],
    testimonial: {
      quote: "Weekly demos meant zero surprises at launch.",
      who: "COO · Logistics",
      flag: "🇦🇪 UAE",
    },
    faq: [
      {
        q: "How much does POS software cost in Dubai?",
        a: "Pricing scales with the number of terminals and integrations (payment gateways, hardware, existing inventory systems). Discovery gives you a fixed number before the build starts.",
      },
      {
        q: "What happens if the internet goes down mid-sale?",
        a: "Nothing breaks - the system is offline-first. Transactions complete locally and sync automatically the moment connectivity returns.",
      },
      {
        q: "Is UAE VAT compliance really built in?",
        a: "Yes: correct tax treatment, compliant invoice formatting, and FTA-ready reporting are part of the base system, not an add-on.",
      },
      {
        q: "Which hardware does it support?",
        a: "Standard receipt printers, card readers, and barcode scanners. We confirm exact hardware compatibility during discovery based on what you already own or plan to buy.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    coreState: "surface",
    displayLine: "Design people don't have to learn.",
    h1: "UI/UX design agency in Dubai",
    breadcrumbLabel: "UI/UX & Design",
    metaDescription:
      "UI/UX design agency in Dubai - research-led interface design for web and product, handed off as a system your engineering team can build from.",
    offer:
      "Good design is invisible: people finish the task and don't remember the interface. We get there through research first - talking to actual users before opening Figma - then design as a system, not a set of one-off screens, so new features stay consistent as the product grows. Every deliverable is engineering-ready: component specs, states, and edge cases documented, not just polished mockups. Revisions are scoped upfront so the process stays predictable, and handoff includes working sessions with your developers, not just a file link.",
    deliverables: [
      "User research and usability findings, documented",
      "A component-based design system, not one-off screens",
      "Engineering-ready specs: states, edge cases, interaction notes",
      "Handoff sessions with your development team",
    ],
    stackBadges: ["Figma", "Design tokens", "Component systems", "Usability testing"],
    testimonial: {
      quote: "The only vendor that told us when 3D wasn't the answer. That's rare.",
      who: "Founder · Fintech",
      flag: "🇸🇦 KSA",
    },
    faq: [
      {
        q: "What does the design process actually look like?",
        a: "Research and usability findings first, then a component-based system, then engineering-ready specs. Each phase has a defined deliverable, not an open-ended exploration.",
      },
      {
        q: "Do you conduct real user research?",
        a: "Yes - usability sessions with actual users before design work starts whenever the project and timeline allow for it. Assumptions get tested, not just documented.",
      },
      {
        q: "How does handoff to our developers work?",
        a: "You get component specs, states, and edge cases documented, plus working sessions with your engineering team - not just a Figma link and good luck.",
      },
      {
        q: "How many rounds of revisions are included?",
        a: "Scoped upfront during discovery so both sides know what's included before work starts, rather than negotiating it after the fact.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    coreState: "waveform",
    displayLine: "Growth you can audit.",
    h1: "Digital marketing & SEO services in Dubai",
    breadcrumbLabel: "Growth",
    metaDescription:
      "Digital marketing, SEO, and lifecycle email services in Dubai - performance marketing and technical SEO with reporting you can independently verify.",
    offer:
      "Marketing you can't audit is marketing you have to trust blindly - we build reporting so you don't have to. That means technical SEO grounded in your actual site's crawl data, performance marketing with attribution you can check against your own analytics, and lifecycle email that's measured on revenue, not open rates. We work in the same GA4/Search Console/ad accounts you already have - nothing routes through a black-box dashboard we control. Timelines to rank are stated honestly upfront, because “guaranteed page one in 30 days” is a claim, not a plan.",
    deliverables: [
      "Technical SEO audit and fixes, grounded in your crawl data",
      "Performance marketing with attribution tied to your own analytics",
      "Lifecycle email measured on revenue, not opens",
      "Monthly reporting in your existing GA4/Search Console accounts",
    ],
    stackBadges: ["GA4", "Search Console", "Google Ads", "Meta Ads", "Klaviyo/Braze"],
    testimonial: {
      quote: "The only vendor that told us when 3D wasn't the answer. That's rare.",
      who: "Founder · Fintech",
      flag: "🇸🇦 KSA",
    },
    faq: [
      {
        q: "How is reporting handled?",
        a: "In your own GA4 and Search Console accounts - you can independently verify every number we report, since nothing routes through a dashboard we control.",
      },
      {
        q: "How long until we see SEO results?",
        a: "Honestly, 3–6 months for measurable ranking movement on competitive terms - we won't promise page one in 30 days, because that claim isn't credible.",
      },
      {
        q: "Do you handle paid ads as well as SEO?",
        a: "Yes - Google and Meta performance campaigns, with attribution tied back to your own analytics rather than platform-reported numbers alone.",
      },
      {
        q: "What counts as success for email marketing?",
        a: "Revenue attributed to campaigns and flows, not open or click rates in isolation - those are inputs, not outcomes.",
      },
    ],
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getSiblingServices(slug: ServiceSlug, count = 2): ServiceContent[] {
  const idx = SERVICES.findIndex((s) => s.slug === slug);
  const siblings: ServiceContent[] = [];
  for (let i = 1; siblings.length < count && i <= SERVICES.length; i++) {
    siblings.push(SERVICES[(idx + i) % SERVICES.length]);
  }
  return siblings;
}
