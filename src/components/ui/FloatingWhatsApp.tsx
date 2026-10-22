"use client";

import { COMPANY } from "@/lib/site";

export function FloatingWhatsApp() {
  return (
    <a
      href={COMPANY.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BEZTEQ on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        group
        fixed
        bottom-5
        right-5
        z-[60]
        flex
        size-[54px]
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-[0_10px_35px_rgba(0,0,0,0.35)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:scale-105

        md:bottom-7
        md:right-7
        md:size-[58px]
      "
    >
      <WhatsAppIcon />

      {/* Tooltip */}
      <span
        className="
          pointer-events-none
          absolute
          right-[calc(100%+12px)]
          whitespace-nowrap
          rounded-md
          border
          border-glass-border
          bg-obsidian/95
          px-3
          py-2
          font-mono
          text-[0.65rem]
          uppercase
          tracking-[0.08em]
          text-bone
          opacity-0
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-200

          group-hover:translate-x-0
          group-hover:opacity-100

          translate-x-2
        "
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-[27px] md:size-[29px]"
    >
      <path d="M12.04 2C6.52 2 2.03 6.48 2.03 12c0 1.76.46 3.48 1.32 5L2 22l5.12-1.34A9.95 9.95 0 0 0 12.04 22C17.56 22 22 17.52 22 12S17.56 2 12.04 2Zm0 18.18a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.04.8.81-2.96-.2-.31A8.16 8.16 0 0 1 3.86 12c0-4.51 3.67-8.18 8.18-8.18A8.18 8.18 0 0 1 20.22 12c0 4.51-3.67 8.18-8.18 8.18Zm4.48-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.59.1.49-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}