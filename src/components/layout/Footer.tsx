import Link from "next/link";
import type { ReactNode } from "react";

import { COMPANY } from "@/lib/site";

const SERVICE_LINKS = [
  "Web Development",
  "Custom Software",
  "POS Software",
  "UI/UX & Design",
  "Growth",
];

const COMPANY_LINKS = [
  {
    label: "Work",
    href: "/work",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Process",
    href: "/about#process",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const CONNECT_LINKS = [
  {
    label: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    icon: <MailIcon />,
  },
  {
    label: "WhatsApp",
    href: COMPANY.whatsapp,
    icon: <WhatsAppIcon />,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bezteq/",
    icon: <InstagramIcon />,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61556556446978",
    icon: <FacebookIcon />,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bezteq/",
    icon: <LinkedInIcon />,
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-glass-border pb-10 pt-16">
      <div className="mx-auto max-w-[1280px] px-[var(--space-gutter)]">
        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* BRAND */}

          <div>
            <div className="mb-4 font-display text-[1.6rem] font-semibold tracking-[-0.03em]">
              BEZTE
              <span className="text-cobalt">Q</span>
            </div>

            <p className="max-w-[34ch] text-[0.9rem] leading-[1.7] text-ash">
              Engineering-grade software, commerce and growth systems. Built in
              Dubai for the GCC and beyond.
            </p>
          </div>

          {/* SERVICES */}

          <FooterCol
            title="Services"
            items={SERVICE_LINKS.map((label) => ({
              label,
              href: "/services",
            }))}
          />

          {/* COMPANY */}

          <FooterCol title="Company" items={COMPANY_LINKS} />

          {/* CONNECT */}

          <FooterCol title="Connect" items={CONNECT_LINKS} />
        </div>

        {/* =====================================================
            FOOTER BOTTOM
        ===================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-glass-border pt-8 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ash">
          <span>
            © {new Date().getFullYear()} {COMPANY.name} ·{" "}
            {COMPANY.addressLocality.toUpperCase()}, {COMPANY.addressCountry}
          </span>

          <span className="text-ash/70">
            Building digital systems for real business
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

type FooterItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
};

function FooterCol({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div>
      <h4 className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
        {title}
      </h4>

      <div className="flex flex-col gap-[0.7rem]">
        {items.map((item) => {
          const className =
            "group flex w-fit items-center gap-2.5 text-[0.9rem] text-ash transition-colors duration-fast hover:text-bone";

          const content = (
            <>
              {item.icon && (
                <span className="flex size-[17px] shrink-0 items-center justify-center text-ash transition-colors duration-fast group-hover:text-cobalt">
                  {item.icon}
                </span>
              )}

              <span>{item.label}</span>
            </>
          );

          if (
            item.external ||
            item.href.startsWith("http") ||
            item.href.startsWith("mailto:")
          ) {
            return (
              <a
                key={item.label}
                href={item.href}
                data-hover
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={className}
                aria-label={
                  item.href.startsWith("http")
                    ? `${item.label} — opens in a new tab`
                    : item.label
                }
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              data-hover
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-full"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-full"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />

      <circle cx="12" cy="12" r="4" />

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-full"
    >
      <path d="M13.7 21v-8h2.8l.42-3.2H13.7V7.75c0-.93.26-1.56 1.6-1.56H17V3.32c-.3-.04-1.3-.12-2.48-.12-2.46 0-4.14 1.5-4.14 4.25V9.8H7.6V13h2.78v8h3.32Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-full"
    >
      <path d="M6.5 8.2H3.3V21h3.2V8.2ZM4.9 3A1.9 1.9 0 1 0 4.9 6.8 1.9 1.9 0 0 0 4.9 3ZM21 13.65c0-3.86-2.06-5.65-4.81-5.65-2.22 0-3.21 1.22-3.77 2.08V8.2H9.2V21h3.22v-6.34c0-1.67.32-3.3 2.4-3.3 2.04 0 2.07 1.91 2.07 3.4V21H21v-7.35Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-full"
    >
      <path d="M20.5 11.8a8.3 8.3 0 0 1-12.3 7.3L3 20.5l1.4-5A8.3 8.3 0 1 1 20.5 11.8Z" />

      <path d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.5 0 .7.6 1.1 1.5 2 2.6 2.6.3.2.5.2.7 0l.9-1.1c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.4.6 0 .5-.2 1.5-.7 1.9-.5.5-1.3.8-2.2.8-1.3 0-3.1-.6-5.2-2.4-2.5-2.2-3.8-5-3.8-6.3 0-.7.3-1.2.9-1.8Z" />
    </svg>
  );
}
