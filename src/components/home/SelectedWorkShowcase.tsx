"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Project = {
  id: string;
  category: string;
  title: string;
  // statement: string;
  description: string;
  image: string;
  href: string;
  tags: string[];
};

const projects: Project[] = [
{
  id: "01",
  category: "Web Development",
  title: "Modern Web Solutions",
  // statement: "Built for the modern web.",
  description:
    "High-performance websites and digital experiences built with modern technologies, from custom React applications to scalable WordPress, Shopify, Wix and WooCommerce solutions.",
  image: "/images/home/webdevelopments.webp",
  href: "/services/web-development",
  tags: ["React.js", "WordPress", "Shopify", "Wix", "WooCommerce"],
},
{
  id: "02",
  category: "Custom Software",
  title: "Software Built Around Your Business",
  description:
    "Custom platforms designed around real business workflows, connecting operations, automation, data and teams through scalable software built for growth.",
  image: "/images/home/custome-software01.webp",
  href: "/services/custom-software",
  tags: ["React", "Node.js", "PostgreSQL", "API Integrations"],
},
  {
    id: "03",
    category: "POS System",
    title: "Restaurant POS",
    // statement: "Orders without the chaos.",
    description:
      "A fast point-of-sale experience connecting counter orders, kitchen operations, payments and business reports.",
    image: "/images/home/poscustomsoftware.webp",
    href: "/work/restaurant-pos",
    tags: ["POS", "Inventory", "Payments", "Reports"],
  },
  {
    id: "04",
    category: "Lead Generation",
    title: "Acquisition Engine",
    // statement: "Clicks become customers.",
    description:
      "A connected growth system combining landing pages, campaign attribution, CRM automation and conversion analytics.",
    image: "/images/home/LeadGeneration.webp",
    href: "/work/acquisition-engine",
    tags: ["CRM", "Meta Ads", "Automation", "Analytics"],
  },
{
  id: "05",
  category: "Creative Services",
  title: "Graphic Design & Video Creation",
  // statement: "Ideas made visual.",
  description:
    "Creative visual content built to strengthen brands across digital platforms, from social media graphics and marketing creatives to professional video editing and motion content.",
  image: "/images/home/graphicdesigning.webp",
  href: "/services/graphic-design",
  tags: ["Graphic Design", "Video Editing", "Motion", "Social Media"],
},
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 16L16 4M7 4h9v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SelectedWorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 1024px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            desktop: boolean;
            reducedMotion: boolean;
          };

          if (!conditions.desktop || conditions.reducedMotion) return;

          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-project-card]",
            track
          );

          const getHorizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          /*
           * Main horizontal movement:
           * vertical scrolling controls the X position of the track.
           */
          const horizontalTween = gsap.to(track, {
            x: () => -getHorizontalDistance(),
            ease: "none",

            scrollTrigger: {
              id: "bezteq-selected-work",
              trigger: section,
              start: "top top",
              end: () => `+=${getHorizontalDistance()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              onUpdate: (self) => {
                if (!progressRef.current) return;

                gsap.set(progressRef.current, {
                  scaleX: self.progress,
                });
              },
            },
          });

          /*
           * Each card begins below the viewport.
           * When it enters from the right, it rises upward while
           * the complete track continues moving horizontally.
           */
          cards.forEach((card, index) => {
            const mediaElement =
              card.querySelector<HTMLElement>("[data-project-media]");

            const content =
              card.querySelector<HTMLElement>("[data-project-content]");

            const initialY =
              index % 3 === 0
                ? window.innerHeight * 0.28
                : index % 3 === 1
                  ? window.innerHeight * 0.5
                  : window.innerHeight * 0.38;

            gsap.fromTo(
              card,
              {
                y: initialY,
                rotation: index % 2 === 0 ? 1.5 : -1.5,
              },
              {
                y: 0,
                rotation: 0,
                ease: "none",

                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left 100%",
                  end: "left 62%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );

            /*
             * Subtle image zoom-out while the card crosses the screen.
             */
            if (mediaElement) {
              gsap.fromTo(
                mediaElement,
                {
                  scale: 1.1,
                },
                {
                  scale: 1,
                  ease: "none",

                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontalTween,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                }
              );
            }

            /*
             * Project information reveals shortly after the card rises.
             */
            if (content) {
              gsap.fromTo(
                content,
                {
                  y: 35,
                  opacity: 0,
                },
                {
                  y: 0,
                  opacity: 1,
                  ease: "none",

                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontalTween,
                    start: "left 82%",
                    end: "left 60%",
                    scrub: true,
                  },
                }
              );
            }
          });

          /*
           * Refresh after fonts and images affect measurements.
           */
          document.fonts?.ready.then(() => {
            ScrollTrigger.refresh();
          });
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
      id="selected-work"
      className="
        relative
        overflow-hidden
        border-y
        border-black/10
        bg-[#efefed]
        text-[#161719]
        lg:h-[100svh]
      "
    >
      {/* Background technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <span className="absolute inset-y-0 left-1/3 w-px bg-black/10" />
        <span className="absolute inset-y-0 left-2/3 w-px bg-black/10" />
      </div>

      {/* Top technical label */}
      <div className="pointer-events-none absolute left-6 top-5 z-20 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00cae0]" />
        BEZTEQ / SELECTED_WORK
      </div>

      {/* Horizontal progress */}
      <div className="absolute inset-x-0 bottom-0 z-30 hidden h-px bg-black/10 lg:block">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-black"
        />
      </div>

      <div
        ref={trackRef}
        className="
          relative
          z-10
          flex
          flex-col
          lg:h-full
          lg:w-max
          lg:flex-row
          lg:items-start
          lg:gap-[8vw]
          lg:pr-[12vw]
        "
      >
        {/* Opening heading panel */}
        <div
          className="
            flex
            min-h-[70svh]
            w-full
            shrink-0
            flex-col
            justify-center
            border-b
            border-black/10
            px-6
            py-24
            sm:px-10
            lg:h-full
            lg:min-h-0
            lg:w-[42vw]
            lg:border-b-0
            lg:border-r
            lg:px-[3vw]
            lg:py-0
          "
        >
          <div>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
              // What we have built
            </p>

            <h2
              className="
                max-w-[760px]
                text-[clamp(3.3rem,5.7vw,7.2rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.07em]
              "
            >
              Selected work
              <br />
              <span className="text-black/42">&amp; explorations</span>
            </h2>

            <p className="mt-8 max-w-md text-sm leading-6 text-black/55 sm:text-base sm:leading-7">
              A mixed portfolio of websites, custom software, POS products,
              growth platforms and digital commerce systems.
            </p>

            <Link
              href="/work"
              className="
                group
                mt-12
                flex
                w-fit
                items-center
                gap-14
                border-b
                border-black/50
                pb-3
                font-mono
                text-[10px]
                uppercase
                tracking-[0.16em]
                transition-colors
                hover:border-[#00cae0]
                hover:text-[#00cae0]
              "
            >
              View all projects

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>

        {/* Projects */}
        {projects.map((project, index) => (
          <article
            key={project.id}
            data-project-card
            className="
              flex
              w-full
              shrink-0
              items-start
              border-b
              border-black/10
              px-5
              py-16
              sm:px-8
              lg:h-full
              lg:w-[clamp(680px,46vw,920px)]
              lg:border-b-0
              lg:px-0
              lg:pb-0
              lg:pt-[5.5vh]
            "
          >
            <Link
              href={project.href}
              aria-label={`Explore ${project.title}`}
              className="group block w-full"
            >
              {/* Project image */}
              <div
                className="
                  relative
                  aspect-[16/11]
                  overflow-hidden
                  rounded-[1.25rem]
                  bg-[#0b0c0e]
                  sm:rounded-[1.75rem]
                "
              >
                <Image
                  data-project-media
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  priority={index === 0}
                  sizes="
                    (max-width: 1023px) 94vw,
                    (max-width: 1600px) 46vw,
                    920px
                  "
                  className="
                    object-cover
                    will-change-transform
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.025]
                  "
                  onLoad={() => {
                    ScrollTrigger.refresh();
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />

                {/* Inner visual frame */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-5
                    rounded-[0.9rem]
                    border
                    border-white/20
                    sm:inset-8
                    sm:rounded-[1.25rem]
                  "
                />

                {/* Image top information */}
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#d8d8d3]" />

                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/75">
                      {project.category}
                    </span>
                  </div>

                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                    BEZTEQ / {project.id}
                  </span>
                </div>

                {/* Large project statement */}
                <div className="absolute inset-x-5 bottom-6 sm:inset-x-8 sm:bottom-8">
                  <p
                    className="
                      max-w-[96%]
                      text-[clamp(2.5rem,4.9vw,6.5rem)]
                      font-medium
                      leading-[0.84]
                      tracking-[-0.065em]
                      text-white
                    "
                  >
                    {/* {project.statement} */}
                  </p>
                </div>

                {/* Desktop hover circle */}
                <div
                  className="
                    absolute
                    right-7
                    top-1/2
                    hidden
                    h-24
                    w-24
                    -translate-y-1/2
                    scale-75
                    items-center
                    justify-center
                    rounded-full
                    bg-[#d8d8d3]
                    text-center
                    font-mono
                    text-[9px]
                    uppercase
                    leading-4
                    tracking-[0.14em]
                    text-black
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:scale-100
                    group-hover:opacity-100
                    xl:flex
                  "
                >
                  Explore
                  <br />
                  project
                </div>
              </div>

              {/* Project description */}
              <div
                data-project-content
                className="
                  grid
                  gap-6
                  pt-7
                  sm:grid-cols-[0.8fr_1.2fr]
                  sm:pt-8
                  xl:grid-cols-[0.75fr_1.25fr_auto]
                "
              >
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40">
                    {project.id} / {project.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.045em] sm:text-3xl">
                    {project.title}
                  </h3>
                </div>

                <div>
                  <p className="max-w-md text-sm leading-6 text-black/55">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          rounded-full
                          border
                          border-black/15
                          px-3
                          py-1.5
                          font-mono
                          text-[8px]
                          uppercase
                          tracking-[0.13em]
                          text-black/55
                        "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end sm:col-span-2 xl:col-span-1">
                  <span
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-9
                      border-b
                      border-black/45
                      pb-3
                      font-mono
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                      transition-colors
                      group-hover:border-[#00cae0]
                      group-hover:text-[#00cae0]
                      xl:w-auto
                    "
                  >
                    Explore project
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}