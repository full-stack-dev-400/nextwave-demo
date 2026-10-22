"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Service = {
  number: string;
  command: string;
  title: string;
  description: string;
  href: string;
  icon: string[];
};

const services: Service[] = [
  {
    number: "01",
    command: "npm run web",
    title: "Web Development",
    description:
      "High-performance websites engineered around brand, usability, conversion and measurable business outcomes.",
    href: "/services/web-development",
    icon: [
      "M4 5.5h16v13H4z",
      "M4 9h16",
      "M7 7.2h.01",
      "M9.5 7.2h.01",
      "M12 7.2h.01",
    ],
  },
  {
    number: "02",
    command: "node software.ts",
    title: "Custom Software",
    description:
      "Operational platforms, internal tools and connected systems designed around complex business workflows.",
    href: "/services/custom-software",
    icon: [
      "M8 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3",
      "M16 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3",
      "M10 8l-3 4 3 4",
      "M14 8l3 4-3 4",
    ],
  },
  {
    number: "03",
    command: "wp system:init",
    title: "WordPress Systems",
    description:
      "Custom themes, plugins, API integrations and enterprise WordPress architecture built beyond page builders.",
    href: "/services/wordpress-development",
    icon: [
      "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
      "M6.5 7.2 10 17",
      "M10 7.2 13.5 17",
      "M15.7 7.2 12 17",
      "M6.5 7.2h4.8",
    ],
  },
  {
    number: "04",
    command: "commerce --deploy",
    title: "E-commerce",
    description:
      "WooCommerce and Shopify experiences built for product discovery, reliable checkout and sustainable growth.",
    href: "/services/ecommerce",
    icon: [
      "M5 6h16l-2 8H8L5 3H2",
      "M9 19.5h.01",
      "M18 19.5h.01",
    ],
  },
  {
    number: "05",
    command: "crm.connect()",
    title: "Growth & Automation",
    description:
      "Landing pages, CRM integrations, campaign tracking and automated journeys that turn traffic into customers.",
    href: "/services/growth-automation",
    icon: [
      "M4 18V9",
      "M10 18V5",
      "M16 18v-7",
      "M22 18H2",
      "M4 9l6-4 6 6 6-7",
    ],
  },
  {
    number: "06",
    command: "audit --production",
    title: "Performance & Security",
    description:
      "Speed optimisation, infrastructure hardening and technical audits for stable, secure production systems.",
    href: "/services/performance-security",
    icon: [
      "M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z",
      "m9 12 2 2 4-5",
    ],
  },
];

const headingCharacters = Array.from("OUR SERVICES");

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 16 16 4M7 4h9v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceIcon({ paths }: { paths: string[] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
    >
      {paths.map((path, index) => (
        <path
          key={`${path}-${index}`}
          data-icon-path
          d={path}
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

function ServiceCard({
  service,
  mobile = false,
}: {
  service: Service;
  mobile?: boolean;
}) {
  return (
    <article
      data-desktop-service-card={mobile ? undefined : ""}
      className={
        mobile
          ? "group border-t border-white/15 py-8"
          : `
              group absolute left-1/2 top-1/2
              w-[clamp(290px,25vw,410px)]
              overflow-hidden rounded-[1.25rem]
              border border-white/15
              bg-[#111317]/90
              p-6 text-[#f4f2ea]
              opacity-0 shadow-2xl
              backdrop-blur-xl
              will-change-transform
            `
      }
    >
      <div className="flex items-start justify-between gap-6">
        <div
          className="
            flex h-12 w-12 items-center justify-center rounded-full
            border border-[#d8d8d3]/40 text-[#d8d8d3]
          "
        >
          <ServiceIcon paths={service.icon} />
        </div>

        <span className="font-mono text-[10px] tracking-[0.16em] text-white/35">
          {service.number}
        </span>
      </div>

      <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.18em] text-[#d8d8d3]">
        $ {service.command}
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-[-0.045em] sm:text-3xl">
        {service.title}
      </h3>

      <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
        {service.description}
      </p>

      <Link
        href={service.href}
        className="
          mt-7 flex items-center justify-between border-t border-white/15 pt-4
          font-mono text-[9px] uppercase tracking-[0.15em]
          transition-colors duration-300
          group-hover:text-[#d8d8d3]
        "
      >
        Explore service

        <span className="transition-transform duration-300 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </Link>
    </article>
  );
}

export function ServicesSequence() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      const media = gsap.matchMedia();

      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const characters = gsap.utils.toArray<HTMLElement>(
            "[data-service-character]"
          );

          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-desktop-service-card]"
          );

          const terminalLines = gsap.utils.toArray<HTMLElement>(
            "[data-terminal-line]"
          );

          const iconPaths = gsap.utils.toArray<SVGPathElement>(
            "[data-icon-path]"
          );

          const stripes =
            gsap.utils.toArray<HTMLElement>("[data-transition-stripe]");

          const firstRing = section.querySelector<HTMLElement>(
            "[data-core-ring-one]"
          );

          const secondRing = section.querySelector<HTMLElement>(
            "[data-core-ring-two]"
          );

          const thirdRing = section.querySelector<HTMLElement>(
            "[data-core-ring-three]"
          );

          const core = section.querySelector<HTMLElement>(
            "[data-service-core]"
          );

          const coreGlow = section.querySelector<HTMLElement>(
            "[data-core-glow]"
          );

          const progress = section.querySelector<HTMLElement>(
            "[data-section-progress]"
          );

          const darkInterface = section.querySelector<HTMLElement>(
            "[data-dark-interface]"
          );

          const outro = section.querySelector<HTMLElement>(
            "[data-services-outro]"
          );

          gsap.set(characters, {
            opacity: 0,
            y: 70,
            filter: "blur(18px)",
          });

          gsap.set(cards, {
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: 0.86,
          });

          gsap.set(terminalLines, {
            opacity: 0,
            y: 10,
          });

          gsap.set(iconPaths, {
            strokeDasharray: 100,
            strokeDashoffset: 100,
          });

          gsap.set(stripes, {
            scaleY: 0,
            transformOrigin: "bottom center",
          });

          gsap.set(progress, {
            scaleY: 0,
            transformOrigin: "top center",
          });

          gsap.set(outro, {
            opacity: 0,
            y: 50,
          });

          const timeline = gsap.timeline({
            defaults: {
              ease: "none",
            },

            scrollTrigger: {
              id: "bezteq-services-sequence",
              trigger: section,
              start: "top top",
              end: "+=5200",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          /*
           * Stage 1:
           * Heading and software core enter.
           */
          timeline
            .to(
              progress,
              {
                scaleY: 1,
                duration: 7.4,
              },
              0
            )
            .to(
              characters,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: {
                  each: 0.035,
                  from: "start",
                },
                ease: "power3.out",
              },
              0
            )
            .fromTo(
              core,
              {
                opacity: 0,
                scale: 0.55,
                rotation: -12,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "power3.out",
              },
              0.25
            )
            .fromTo(
              coreGlow,
              {
                opacity: 0,
                scale: 0.4,
              },
              {
                opacity: 0.8,
                scale: 1,
                duration: 1.2,
                ease: "power2.out",
              },
              0.4
            )
            .to(
              firstRing,
              {
                rotation: 160,
                duration: 2.2,
              },
              0.25
            )
            .to(
              secondRing,
              {
                rotation: -210,
                duration: 2.2,
              },
              0.25
            )
            .to(
              thirdRing,
              {
                rotation: 250,
                duration: 2.2,
              },
              0.25
            )
            .to(
              terminalLines,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.12,
                ease: "power2.out",
              },
              0.75
            );

          /*
           * Stage 2:
           * OUR SERVICES fragments into code-like particles.
           */
          timeline.to(
            characters,
            {
              x: (index) => {
                const distanceFromCenter =
                  index - (characters.length - 1) / 2;

                return (
                  distanceFromCenter * 42 +
                  gsap.utils.random(-150, 150)
                );
              },

              y: () => gsap.utils.random(-260, 260),
              rotation: () => gsap.utils.random(-100, 100),
              scale: () => gsap.utils.random(0.55, 1.25),
              opacity: 0,
              filter: "blur(10px)",

              duration: 1,
              stagger: {
                amount: 0.3,
                from: "random",
              },

              ease: "power2.in",
            },
            1.8
          );

          /*
           * Stage 3:
           * Service cards travel upward in left/right pairs.
           */
          cards.forEach((card, index) => {
            const pairIndex = Math.floor(index / 2);
            const isLeft = index % 2 === 0;
            const direction = isLeft ? -1 : 1;
            const pairStart = 2.35 + pairIndex * 1.05;

            const cardPaths =
              card.querySelectorAll<SVGPathElement>("[data-icon-path]");

            timeline
              .fromTo(
                card,
                {
                  x: () =>
                    direction * Math.min(window.innerWidth * 0.44, 720),

                  y: () => window.innerHeight * 0.58,
                  rotation: direction * 5,
                  scale: 0.84,
                  opacity: 0,
                },
                {
                  x: () =>
                    direction * Math.min(window.innerWidth * 0.23, 390),

                  y: () =>
                    pairIndex === 1
                      ? window.innerHeight * 0.05
                      : window.innerHeight * 0.14,

                  rotation: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 0.58,
                  ease: "power2.out",
                },
                pairStart
              )
              .to(
                cardPaths,
                {
                  strokeDashoffset: 0,
                  duration: 0.5,
                  stagger: 0.04,
                  ease: "power2.out",
                },
                pairStart + 0.18
              )
              .to(
                card,
                {
                  x: () =>
                    direction * Math.min(window.innerWidth * 0.31, 520),

                  y: () => -window.innerHeight * 0.65,
                  rotation: direction * -3,
                  scale: 0.9,
                  opacity: 0,
                  duration: 1.15,
                  ease: "power1.in",
                },
                pairStart + 0.7
              );
          });

          /*
           * Stage 4:
           * Core powers down before the light transition.
           */
          timeline
            .to(
              core,
              {
                scale: 0.72,
                rotation: 12,
                opacity: 0,
                duration: 0.75,
                ease: "power2.in",
              },
              5.2
            )
            .to(
              coreGlow,
              {
                scale: 1.5,
                opacity: 0,
                duration: 0.65,
              },
              5.15
            )
            .to(
              darkInterface,
              {
                opacity: 0.25,
                duration: 0.7,
              },
              5.35
            );

          /*
           * Stage 5:
           * Vertical strips transition the section to light mode.
           */
          timeline
            .to(
              stripes,
              {
                scaleY: 1,
                duration: 0.85,
                stagger: {
                  each: 0.06,
                  from: "start",
                },
                ease: "power3.inOut",
              },
              5.55
            )
            .to(
              outro,
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              6.25
            );

          document.fonts?.ready.then(() => {
            ScrollTrigger.refresh();
          });

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        }
      );

      return () => {
        media.revert();
      };
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="
        relative isolate overflow-hidden bg-[#0b0c0e] text-[#f4f2ea]
        lg:h-[100svh]
      "
    >
      {/* Mobile version */}
      <div className="px-6 py-24 sm:px-10 lg:hidden">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d8d8d3]">
          BEZTEQ / SYSTEM GROUP
        </div>

        <h2 className="mt-6 text-[clamp(3.5rem,15vw,6rem)] font-medium leading-[0.87] tracking-[-0.07em]">
          Our
          <br />
          services
        </h2>

        <p className="mt-7 max-w-md text-sm leading-6 text-white/55">
          Connected digital services engineered to move ideas from planning
          into reliable production.
        </p>

        <div className="mt-16">
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              service={service}
              mobile
            />
          ))}
        </div>

        <Link
          href="/services"
          className="
            mt-12 flex w-fit items-center gap-12 border-b border-white/40
            pb-3 font-mono text-[10px] uppercase tracking-[0.16em]
          "
        >
          View all services
          <ArrowIcon />
        </Link>
      </div>

      {/* Desktop animation */}
      <div
        data-dark-interface
        className="absolute inset-0 hidden lg:block"
      >
        {/* Technical background */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 opacity-40
            [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute left-1/2 top-0 h-full w-px
            bg-white/10
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute left-0 top-1/2 h-px w-full
            bg-white/10
          "
        />

        {/* Top metadata */}
        <div className="absolute left-8 top-7 z-20 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#d8d8d3]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
            BEZTEQ / SERVICE MACHINE
          </span>
        </div>

        <div className="absolute right-8 top-7 z-20 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
          STATUS: OPERATIONAL
        </div>

        {/* Main split heading */}
        <h2 className="sr-only">Our services</h2>

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-x-0 top-[12vh] z-10
            flex justify-center whitespace-nowrap
          "
        >
          <div
            className="
              flex text-[clamp(5rem,11vw,13rem)] font-medium
              leading-none tracking-[-0.075em]
            "
          >
            {headingCharacters.map((character, index) => (
              <span
                key={`${character}-${index}`}
                data-service-character
                className="inline-block will-change-transform"
              >
                {character === " " ? "\u00A0" : character}
              </span>
            ))}
          </div>
        </div>

        {/* Central software machine */}
        <div
          data-service-core
          className="
            absolute left-1/2 top-[56%] z-10
            aspect-square w-[clamp(340px,29vw,530px)]
            -translate-x-1/2 -translate-y-1/2
            will-change-transform
          "
        >
          <div
            data-core-glow
            className="
              absolute inset-[12%] rounded-full
              bg-[#00cae0]/20 blur-[70px]
            "
          />

          <div
            data-core-ring-one
            className="
              absolute inset-0 rounded-full border border-white/15
              will-change-transform
            "
          >
            <span className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 rounded-full bg-[#d8d8d3]" />
            <span className="absolute bottom-[15%] right-[6%] h-1.5 w-1.5 rounded-full bg-[#00cae0]" />
          </div>

          <div
            data-core-ring-two
            className="
              absolute inset-[10%] rounded-full border border-dashed
              border-white/20 will-change-transform
            "
          >
            <span className="absolute left-[3%] top-[42%] h-2 w-2 rounded-full border border-[#d8d8d3]" />
          </div>

          <div
            data-core-ring-three
            className="
              absolute inset-[21%] rounded-full border border-white/15
              will-change-transform
            "
          >
            <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 rounded-full bg-white" />
          </div>

          {/* Core terminal */}
          <div
            className="
              absolute left-1/2 top-1/2 w-[62%]
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-[1.15rem]
              border border-white/15 bg-[#101216]/95
              shadow-2xl backdrop-blur-xl
            "
          >
            <div
              className="
                flex items-center justify-between border-b border-white/10
                px-4 py-3
              "
            >
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8d8d3]" />
              </div>

              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/30">
                services.core
              </span>
            </div>

            <div className="space-y-3 p-5 font-mono text-[clamp(7px,0.65vw,10px)] leading-5">
              <p data-terminal-line className="text-white/35">
                <span className="text-[#00cae0]">const</span>{" "}
                services = initialize();
              </p>

              <p data-terminal-line className="text-white/35">
                connecting production systems...
              </p>

              <p data-terminal-line className="text-[#d8d8d3]">
                ✓ architecture ready
              </p>

              <p data-terminal-line className="text-[#d8d8d3]">
                ✓ integrations connected
              </p>

              <p data-terminal-line className="text-white">
                status: operational_
              </p>
            </div>
          </div>
        </div>

        {/* Animated service cards */}
        <div className="absolute inset-0 z-20">
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              service={service}
            />
          ))}
        </div>

        {/* Bottom metadata */}
        <div className="absolute bottom-7 left-8 z-20 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
          Scroll to inspect each discipline
        </div>

        <div className="absolute bottom-7 right-8 z-20 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
          BEZTEQ-SVC / 001
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-10 right-4 top-10 z-30 w-px bg-white/10">
          <div
            data-section-progress
            className="h-full w-full bg-[#d8d8d3]"
          />
        </div>
      </div>

      {/* Light transition strips */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 z-40 hidden
          grid-cols-6 lg:grid
        "
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            data-transition-stripe
            className="h-full bg-[#efefeb]"
          />
        ))}
      </div>

      {/* Final light frame */}
      <div
        data-services-outro
        className="
          pointer-events-none absolute inset-0 z-50 hidden
          items-center justify-center px-12 text-[#121315]
          lg:flex
        "
      >
        <div className="max-w-6xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/40">
            Strategy / Design / Engineering / Growth
          </p>

          <p
            className="
              mt-7 text-[clamp(4rem,8vw,10rem)] font-medium
              leading-[0.84] tracking-[-0.075em]
            "
          >
            Systems built to
            <br />
            move business forward.
          </p>
        </div>
      </div>
    </section>
  );
}