"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { COMPANY } from "@/lib/site";

type ChatAction = {
  label: string;
  href: string;
  external?: boolean;
};

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  actions?: ChatAction[];
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "bot",
    text:
      "Hi - I’m BEZTEQ Assist. I can help you explore our services, work or start a project.",
  },
];

const QUICK_REPLIES = [
  "Our Services",
  "Web Development",
  "Custom Software",
  "POS Software",
  "Digital Growth",
  "Technologies",
  "View Our Work",
  "Get a Quote",
];

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

/**
 * This is the part we can replace later
 * with an AI endpoint such as /api/chat.
 */
/* =========================================================
   TEXT HELPERS
========================================================= */

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ");
}

function levenshtein(
  first: string,
  second: string,
) {
  const matrix = Array.from(
    {
      length: second.length + 1,
    },
    () =>
      Array(first.length + 1).fill(0),
  );

  for (
    let i = 0;
    i <= first.length;
    i++
  ) {
    matrix[0][i] = i;
  }

  for (
    let j = 0;
    j <= second.length;
    j++
  ) {
    matrix[j][0] = j;
  }

  for (
    let j = 1;
    j <= second.length;
    j++
  ) {
    for (
      let i = 1;
      i <= first.length;
      i++
    ) {
      const cost =
        first[i - 1] ===
        second[j - 1]
          ? 0
          : 1;

      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] +
          cost,
      );
    }
  }

  return matrix[second.length][
    first.length
  ];
}

function wordMatches(
  message: string,
  target: string,
) {
  if (message.includes(target)) {
    return true;
  }

  const words =
    message.split(" ");

  return words.some((word) => {
    if (word.length < 4) {
      return false;
    }

    const distance =
      levenshtein(word, target);

    const allowedDistance =
      target.length >= 7 ? 2 : 1;

    return (
      distance <=
      allowedDistance
    );
  });
}

function matchesAny(
  message: string,
  keywords: string[],
) {
  return keywords.some(
    (keyword) =>
      wordMatches(
        message,
        keyword,
      ),
  );
}

/* =========================================================
   RESPONSE ENGINE
========================================================= */

function getBotReply(
  rawMessage: string,
): Omit<
  ChatMessage,
  "id" | "role"
> {
  const message =
    normalizeText(rawMessage);

  /* =====================================================
      GREETINGS
  ===================================================== */

  if (
    matchesAny(message, [
      "hello",
      "hey",
      "hi",
      "salam",
      "assalam",
    ])
  ) {
    return {
      text:
        "Hello 👋 Welcome to BEZTEQ. What are you looking to build or improve? I can help you explore our services, technologies, previous work, pricing or connect you with our team.",
      actions: [
        {
          label: "Our Services",
          href: "/services",
        },
        {
          label: "View Work",
          href: "/work",
        },
        {
          label: "Start a Project",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      PRICING
      IMPORTANT: check this BEFORE individual services
  ===================================================== */

  if (
    matchesAny(message, [
      "price",
      "pricing",
      "cost",
      "budget",
      "quote",
      "quotation",
      "charges",
      "charge",
      "estimate",
    ])
  ) {
    if (
      matchesAny(message, [
        "website",
        "web",
        "wordpress",
        "ecommerce",
      ])
    ) {
      return {
        text:
          "Website cost depends on scope — for example, whether you need a corporate website, e-commerce store, custom integrations, UI/UX design or lead-generation functionality. Share your requirements and we can prepare an accurate quotation rather than giving you a generic price.",
        actions: [
          {
            label:
              "Request a Quote",
            href: "/contact",
          },
          {
            label: "WhatsApp",
            href: COMPANY.whatsapp,
            external: true,
          },
        ],
      };
    }

    if (
      matchesAny(message, [
        "software",
        "system",
        "platform",
        "application",
        "app",
      ])
    ) {
      return {
        text:
          "Custom software pricing depends on the number of modules, users, integrations, automation requirements and overall complexity. If you tell us what the system needs to do, we can review the scope and prepare an estimate.",
        actions: [
          {
            label:
              "Discuss Software",
            href: "/contact",
          },
          {
            label: "WhatsApp",
            href: COMPANY.whatsapp,
            external: true,
          },
        ],
      };
    }

    return {
      text:
        "BEZTEQ projects are priced according to scope, complexity, integrations and delivery requirements. Tell us what you're planning and we'll provide a suitable estimate.",
      actions: [
        {
          label:
            "Request a Quote",
          href: "/contact",
        },
        {
          label: "WhatsApp",
          href: COMPANY.whatsapp,
          external: true,
        },
      ],
    };
  }

  /* =====================================================
      ALL SERVICES
  ===================================================== */

  if (
    matchesAny(message, [
      "services",
      "service",
      "offer",
      "provide",
      "solutions",
    ])
  ) {
    return {
      text:
        "BEZTEQ provides end-to-end digital services including Web Development, Custom Software, POS Software, UI/UX Design and Digital Growth. We can handle projects from strategy and design through engineering, launch and ongoing growth.",
      actions: [
        {
          label:
            "Web Development",
          href:
            "/services/web-development",
        },
        {
          label:
            "Custom Software",
          href:
            "/services/custom-software",
        },
        {
          label:
            "POS Software",
          href:
            "/services/pos-software",
        },
        {
          label:
            "All Services",
          href: "/services",
        },
      ],
    };
  }

  /* =====================================================
      TECHNOLOGIES
  ===================================================== */

  if (
    matchesAny(message, [
      "technology",
      "technologies",
      "tech",
      "stack",
      "framework",
      "frameworks",
      "language",
      "languages",
    ])
  ) {
    return {
      text:
        "Our technology stack depends on the project. We work across modern web and software technologies including React, Next.js, TypeScript, Node.js, PostgreSQL, WordPress, WooCommerce, APIs, cloud infrastructure, analytics and integration platforms. We choose the stack around the business requirement rather than forcing every project into the same technology.",
      actions: [
        {
          label:
            "Custom Software",
          href:
            "/services/custom-software",
        },
        {
          label:
            "Web Development",
          href:
            "/services/web-development",
        },
        {
          label:
            "Discuss Your Project",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      WEB DEVELOPMENT
  ===================================================== */

  if (
    matchesAny(message, [
      "website",
      "web",
      "wordpress",
      "ecommerce",
      "commerce",
      "woocommerce",
    ])
  ) {
    return {
      text:
        "BEZTEQ designs and develops corporate websites, e-commerce stores, landing pages and conversion-focused digital platforms. We handle responsive development, performance, integrations, analytics and the overall customer journey.",
      actions: [
        {
          label:
            "Web Development",
          href:
            "/services/web-development",
        },
        {
          label:
            "View Our Work",
          href: "/work",
        },
        {
          label:
            "Start a Project",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      CUSTOM SOFTWARE
  ===================================================== */

  if (
    matchesAny(message, [
      "software",
      "softwares",
      "system",
      "systems",
      "platform",
      "application",
      "applications",
      "app",
      "automation",
      "crm",
    ])
  ) {
    return {
      text:
        "We build custom software around real business operations — including internal management systems, dashboards, CRM workflows, automation platforms, operational tools and customer-facing applications.",
      actions: [
        {
          label:
            "Custom Software",
          href:
            "/services/custom-software",
        },
        {
          label:
            "View Software Work",
          href: "/work",
        },
        {
          label:
            "Discuss Your System",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      POS
  ===================================================== */

  if (
    matchesAny(message, [
      "pos",
      "retail",
      "checkout",
      "inventory",
      "stock",
      "store",
    ])
  ) {
    return {
      text:
        "BEZTEQ develops POS and retail systems covering checkout, inventory management, stock movement, multi-location operations, reporting and business workflows.",
      actions: [
        {
          label:
            "POS Software",
          href:
            "/services/pos-software",
        },
        {
          label:
            "Discuss POS",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      UI / UX
  ===================================================== */

  if (
    matchesAny(message, [
      "ui",
      "ux",
      "design",
      "interface",
      "prototype",
      "wireframe",
      "branding",
    ])
  ) {
    return {
      text:
        "Our UI/UX work focuses on clear user journeys, usable interfaces and conversion-oriented digital experiences. We design around the user and business objective rather than decoration alone.",
      actions: [
        {
          label:
            "UI/UX Design",
          href:
            "/services/ui-ux-design",
        },
        {
          label:
            "Start a Project",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      MARKETING / GROWTH
  ===================================================== */

  if (
    matchesAny(message, [
      "marketing",
      "growth",
      "seo",
      "campaign",
      "campaigns",
      "advertising",
      "ads",
      "leads",
      "meta",
      "google",
    ])
  ) {
    return {
      text:
        "Our growth systems connect campaigns, landing pages, analytics, conversion tracking and lead capture. We work across digital advertising, SEO, analytics and acquisition infrastructure.",
      actions: [
        {
          label:
            "Digital Growth",
          href:
            "/services/growth",
        },
        {
          label:
            "Discuss Campaign",
          href: "/contact",
        },
      ],
    };
  }

  /* =====================================================
      PORTFOLIO / PROJECTS
  ===================================================== */

  if (
    matchesAny(message, [
      "portfolio",
      "work",
      "project",
      "projects",
      "case",
      "examples",
      "clients",
    ])
  ) {
    return {
      text:
        "You can explore selected BEZTEQ work across custom software, POS systems, e-commerce, web development and digital growth.",
      actions: [
        {
          label:
            "View Our Work",
          href: "/work",
        },
      ],
    };
  }

  /* =====================================================
      COMPANY
  ===================================================== */

  if (
    matchesAny(message, [
      "bezteq",
      "company",
      "agency",
      "about",
      "dubai",
      "location",
      "office",
    ])
  ) {
    return {
      text:
        "BEZTEQ is a Dubai-based technology company building software, commerce and growth systems for businesses across the GCC and beyond.",
      actions: [
        {
          label: "About BEZTEQ",
          href: "/about",
        },
        {
          label:
            "View Our Work",
          href: "/work",
        },
      ],
    };
  }

  /* =====================================================
      HUMAN / CONTACT
  ===================================================== */

  if (
    matchesAny(message, [
      "human",
      "person",
      "contact",
      "talk",
      "call",
      "whatsapp",
      "representative",
      "agent",
    ])
  ) {
    return {
      text:
        "Absolutely. You can send us a project enquiry or speak directly with the BEZTEQ team on WhatsApp.",
      actions: [
        {
          label:
            "Contact BEZTEQ",
          href: "/contact",
        },
        {
          label: "WhatsApp",
          href: COMPANY.whatsapp,
          external: true,
        },
      ],
    };
  }

  /* =====================================================
      FALLBACK
  ===================================================== */

  return {
    text:
      "I’m not fully sure what you mean yet. I can help with BEZTEQ services, technologies, pricing, previous projects or starting a new project. Try asking something like “What services do you offer?” or “How much does a website cost?”",
    actions: [
      {
        label: "Our Services",
        href: "/services",
      },
      {
        label: "View Our Work",
        href: "/work",
      },
      {
        label:
          "Start a Project",
        href: "/contact",
      },
      {
        label: "WhatsApp",
        href: COMPANY.whatsapp,
        external: true,
      },
    ],
  };
}

export function BezteqChatbot() {
  const [open, setOpen] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const [messages, setMessages] =
    useState<ChatMessage[]>(
      INITIAL_MESSAGES,
    );

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  function submitMessage(
    message: string,
  ) {
    const trimmed =
      message.trim();

    if (!trimmed || typing) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const reply =
        getBotReply(trimmed);

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "bot",
          ...reply,
        },
      ]);

      setTyping(false);
    }, 550);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    submitMessage(input);
  }

  return (
    <>
      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            bottom-[164px]
            right-4
            z-[80]
            flex
            h-[min(520px,70vh)]
            w-[calc(100vw-2rem)]
            max-w-[370px]
            flex-col
            overflow-hidden
            rounded-xl
            border
            border-glass-border
            bg-obsidian/95
            shadow-[0_30px_90px_rgba(0,0,0,0.55)]
            backdrop-blur-xl

            md:bottom-[180px]
            md:right-7
          "
        >
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-[7px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

                <span className="font-mono text-[0.63rem] uppercase tracking-[0.12em] text-cobalt">
                  System online
                </span>
              </div>

              <div className="mt-1 font-display text-[1rem] font-medium text-bone">
                BEZTEQ Assist
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close chat"
              className="flex size-8 items-center justify-center rounded-full border border-glass-border text-ash transition-colors hover:border-cobalt/50 hover:text-bone"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}

          <div
            className="
              flex-1
              space-y-4
              overflow-y-auto
              px-4
              py-5
              [scrollbar-width:thin]
            "
            aria-live="polite"
          >
            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[88%]
                      rounded-xl
                      px-4
                      py-3
                      text-[0.83rem]
                      leading-[1.65]

                      ${
                        message.role ===
                        "user"
                          ? "bg-cobalt text-obsidian"
                          : "border border-glass-border bg-glass text-ash"
                      }
                    `}
                  >
                    <p className="whitespace-pre-line">
                      {message.text}
                    </p>

                    {message.actions &&
                      message.actions
                        .length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map(
                            (
                              action,
                            ) => (
                              <a
                                key={
                                  action.label
                                }
                                href={
                                  action.href
                                }
                                target={
                                  action.external
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  action.external
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="rounded-full border border-cobalt/30 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-cobalt transition-colors hover:bg-cobalt hover:text-obsidian"
                              >
                                {
                                  action.label
                                }
                              </a>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ),
            )}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-xl border border-glass-border bg-glass px-4 py-3">
                  <span className="size-1.5 animate-pulse rounded-full bg-ash" />

                  <span className="size-1.5 animate-pulse rounded-full bg-ash [animation-delay:120ms]" />

                  <span className="size-1.5 animate-pulse rounded-full bg-ash [animation-delay:240ms]" />
                </div>
              </div>
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {/* QUICK REPLIES */}

          <div className="border-t border-glass-border px-4 pb-3 pt-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {QUICK_REPLIES.map(
                (reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() =>
                      submitMessage(
                        reply,
                      )
                    }
                    className="shrink-0 rounded-full border border-glass-border px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.07em] text-ash transition-colors hover:border-cobalt/40 hover:text-cobalt"
                  >
                    {reply}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* INPUT */}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-glass-border p-3"
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value,
                )
              }
              type="text"
              placeholder="Ask BEZTEQ..."
              autoComplete="off"
              className="
                min-w-0
                flex-1
                rounded-full
                border
                border-glass-border
                bg-transparent
                px-4
                py-3
                text-[0.8rem]
                text-bone
                outline-none
                transition-colors
                placeholder:text-ash/60
                focus:border-cobalt/50
              "
            />

            <button
              type="submit"
              disabled={
                !input.trim() ||
                typing
              }
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cobalt text-obsidian transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* =====================================================
          FLOATING CHAT BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        aria-label={
          open
            ? "Close BEZTEQ chat"
            : "Open BEZTEQ chat"
        }
        aria-expanded={open}
        className="
          group
          fixed

          bottom-[88px]
          right-5

          z-[75]

          flex
          size-[54px]
          items-center
          justify-center

          rounded-full
          border
          border-cobalt/30

          bg-obsidian
          text-cobalt

          shadow-[0_12px_40px_rgba(0,0,0,0.45)]

          transition-all
          duration-300

          hover:-translate-y-1
          hover:border-cobalt
          hover:bg-cobalt
          hover:text-obsidian

          md:bottom-[102px]
          md:right-7
          md:size-[58px]
        "
      >
        {open ? (
          <span className="text-xl">
            ×
          </span>
        ) : (
          <ChatIcon />
        )}

        {!open && (
          <span className="absolute right-0 top-0 size-[10px] rounded-full border-2 border-obsidian bg-signal" />
        )}
      </button>
    </>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[25px]"
    >
      <path d="M20 15a4 4 0 0 1-4 4H8l-5 3 1.7-5A7 7 0 0 1 4 14V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z" />

      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <path d="m4 4 16 8-16 8 3-8-3-8Z" />
      <path d="M7 12h13" />
    </svg>
  );
}