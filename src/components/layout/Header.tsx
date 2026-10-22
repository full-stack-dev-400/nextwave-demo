"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

import { MenuOverlay, type NavItem } from "./MenuOverlay";

import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/lib/services-data";

const NAV_LINKS: NavItem[] = [
  {
    href: "/services",
    label: "Services",
    children: SERVICES.map((s) => ({
      href: `/services/${s.slug}`,
      label: s.breadcrumbLabel,
    })),
  },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

/**
 * Sticky header:
 * - Transparent at top
 * - Blur after scrolling
 * - Hides on scroll down
 * - Reveals on scroll up
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  const [hidden, setHidden] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [servicesOpen, setServicesOpen] = useState(false);

  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 40);

      setHidden(y > lastY.current && y > 160);

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          w-full
          overflow-visible
          border-b
          transition-[background-color,padding,transform]
          duration-base
          ease-out-expo

          ${
            scrolled
              ? "border-glass-border bg-obsidian/70 py-3 sm:py-3.5 lg:py-4 backdrop-blur-md"
              : "border-transparent py-4 sm:py-5 lg:py-6"
          }

          ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1280px]
            items-center
            justify-between
            gap-4
            px-4

            sm:px-6

            md:px-8

            lg:px-8

            xl:px-10

            2xl:px-6
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            aria-label="BEZTEQ home"
            data-hover
            className="
              relative
              flex
              min-w-0
              shrink-0
              items-center
              justify-start
            "
          >
            <Image
              src="/images/brand/bezteq-logo-white.png"
              alt="BEZTEQ"
              width={220}
              height={80}
              priority
              className="
                h-[44px]
                w-auto
                max-w-[150px]
                object-contain
                object-left

                min-[400px]:h-[48px]
                min-[400px]:max-w-[165px]

                sm:h-[52px]
                sm:max-w-[180px]

                md:h-[54px]
                md:max-w-[185px]

                lg:h-[56px]
                lg:max-w-[190px]

                xl:h-[60px]
                xl:max-w-[205px]

                2xl:h-[64px]
                2xl:max-w-[220px]
              "
            />
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav
            className="
              hidden
              min-w-0
              items-center
              justify-end
              gap-5

              lg:flex

              xl:gap-7

              2xl:gap-9
            "
          >
            {/* SERVICES */}

            <div
              className="relative shrink-0"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                data-hover
                className="
                  nav-link
                  flex
                  items-center
                  gap-[0.4rem]
                  whitespace-nowrap
                  text-[0.84rem]
                  text-ash

                  xl:text-[0.9rem]
                "
              >
                Services
                <span
                  aria-hidden
                  className={`
                    text-[0.6rem]
                    transition-transform
                    duration-fast
                    ease-out-expo

                    ${servicesOpen ? "rotate-180" : ""}
                  `}
                >
                  ▾
                </span>
              </Link>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 6,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      absolute
                      left-0
                      top-full
                      pt-3
                    "
                  >
                    <div
                      className="
                        w-64
                        rounded-lg
                        border
                        border-glass-border
                        bg-obsidian/95
                        p-2
                        shadow-[var(--glow-cobalt)]
                        backdrop-blur-md
                      "
                    >
                      {SERVICES.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          data-hover
                          className="
                              block
                              rounded-md
                              px-3
                              py-2
                              text-[0.88rem]
                              text-ash
                              transition-colors
                              duration-fast

                              hover:bg-glass
                              hover:text-bone
                            "
                        >
                          {service.breadcrumbLabel}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WORK */}

            <Link
              href="/work"
              data-hover
              className="
                nav-link
                shrink-0
                whitespace-nowrap
                text-[0.84rem]
                text-ash

                xl:text-[0.9rem]
              "
            >
              Work
            </Link>

            {/* BLOG */}

            <Link
              href="/blog"
              data-hover
              className="
                nav-link
                shrink-0
                whitespace-nowrap
                text-[0.84rem]
                text-ash
                xl:text-[0.9rem]
              "
            >
              Blog
            </Link>

            {/* ABOUT */}

            <Link
              href="/about"
              data-hover
              className="
                nav-link
                shrink-0
                whitespace-nowrap
                text-[0.84rem]
                text-ash

                xl:text-[0.9rem]
              "
            >
              About
            </Link>

            {/* CTA */}

            <div className="shrink-0">
              <Button href="/contact" variant="primary">
                Start a project
              </Button>
            </div>
          </nav>

          {/* =================================================
              MOBILE / TABLET MENU BUTTON
          ================================================= */}

          <button
            type="button"
            data-hover
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="
              relative
              z-10
              flex
              shrink-0
              flex-col
              items-center
              justify-center
              gap-[5px]
              p-2

              lg:hidden
            "
          >
            <span
              className={`
                h-px
                w-6
                bg-bone
                transition-transform
                duration-fast
                ease-out-expo

                ${menuOpen ? "translate-y-[3px] rotate-45" : ""}
              `}
            />

            <span
              className={`
                h-px
                w-6
                bg-bone
                transition-transform
                duration-fast
                ease-out-expo

                ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}
              `}
            />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE / TABLET MENU
      ===================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay links={NAV_LINKS} onClose={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
