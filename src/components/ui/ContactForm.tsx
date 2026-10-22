"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  BUTTON_BASE_CLASS,
  BUTTON_VARIANT_CLASS,
} from "./Button";

import { SERVICES } from "@/lib/services-data";

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export function ContactForm({
  showService = false,
}: {
  showService?: boolean;
}) {
  const [status, setStatus] =
    useState<Status>("idle");

  const [errorMessage, setErrorMessage] =
    useState("");

  async function onSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name:
        formData.get("name")?.toString() ??
        "",

      company:
        formData
          .get("company")
          ?.toString() ?? "",

      email:
        formData.get("email")?.toString() ??
        "",

      service:
        formData
          .get("service")
          ?.toString() ?? "",

      budget:
        formData
          .get("budget")
          ?.toString() ?? "",

      message:
        formData
          .get("message")
          ?.toString() ?? "",
    };

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to send your enquiry.",
        );
      }

      form.reset();

      setStatus("success");
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setStatus("error");
    }
  }

  /* =========================================================
     SUCCESS STATE
  ========================================================= */

  if (status === "success") {
    return (
      <div
        className="flex max-w-[42ch] flex-col gap-3 py-2"
        aria-live="polite"
      >
        <p className="font-display text-2xl font-medium text-bone">
          Got it — thank you.
        </p>

        <p className="text-ash">
          We reply within one business day.
          For anything urgent, reach us on
          WhatsApp.
        </p>

        <button
          type="button"
          data-hover
          onClick={() =>
            setStatus("idle")
          }
          className="mt-3 w-fit font-mono text-[0.68rem] uppercase tracking-[0.1em] text-cobalt transition-opacity hover:opacity-70"
        >
          Send another enquiry →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6"
    >
      {/* =====================================================
          NAME + COMPANY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          autoComplete="name"
        />

        <Field
          id="company"
          label="Company"
          autoComplete="organization"
        />
      </div>

      {/* =====================================================
          EMAIL
      ===================================================== */}

      <Field
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
      />

      {/* =====================================================
          SERVICE
      ===================================================== */}

      {showService && (
        <div className="field">
          <select
            id="service"
            name="service"
            defaultValue=""
            required
          >
            <option
              value=""
              disabled
            >
              Service needed
            </option>

            {SERVICES.map(
              (service) => (
                <option
                  key={service.slug}
                  value={
                    service.breadcrumbLabel
                  }
                >
                  {
                    service.breadcrumbLabel
                  }
                </option>
              ),
            )}

            <option value="Not sure yet">
              Not sure yet
            </option>
          </select>

          <span className="underline" />
        </div>
      )}

      {/* =====================================================
          BUDGET
      ===================================================== */}

      <div className="field">
        <select
          id="budget"
          name="budget"
          defaultValue=""
          required
        >
          <option
            value=""
            disabled
          >
            Budget range (AED / USD)
          </option>

          <option value="Under 50k AED">
            Under 50k AED
          </option>

          <option value="50k – 150k AED">
            50k – 150k AED
          </option>

          <option value="150k – 500k AED">
            150k – 500k AED
          </option>

          <option value="500k+ AED">
            500k+ AED
          </option>
        </select>

        <span className="underline" />
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      <Field
        id="message"
        label="Tell us about the problem"
        textarea
      />

      {/* =====================================================
          ERROR
      ===================================================== */}

      {status === "error" && (
        <div
          role="alert"
          aria-live="polite"
          className="border-l-2 border-red-400/70 pl-4 text-[0.85rem] leading-[1.6] text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <button
        type="submit"
        data-hover
        disabled={
          status === "submitting"
        }
        className={`
          w-fit
          ${BUTTON_BASE_CLASS}
          ${BUTTON_VARIANT_CLASS.primary}
          disabled:cursor-wait
          disabled:opacity-70
        `}
      >
        {status === "submitting" ? (
          <span className="flex items-center gap-3">
            <span className="size-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" />

            Sending
          </span>
        ) : status === "error" ? (
          "Try again →"
        ) : (
          "Send it →"
        )}
      </button>

      {/* =====================================================
          RESPONSE NOTE
      ===================================================== */}

      <div className="flex items-center gap-[0.6rem] font-mono text-[0.72rem] tracking-[0.06em] text-ash">
        <span className="size-[7px] rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />

        We reply within one business day
      </div>
    </form>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  autoComplete,
}: {
  id: string;
  label: ReactNode;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="field">
      {textarea ? (
        <textarea
          id={id}
          name={id}
          placeholder=" "
          rows={2}
          required
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder=" "
          required
          autoComplete={
            autoComplete
          }
        />
      )}

      <label htmlFor={id}>
        {label}
      </label>

      <span className="underline" />
    </div>
  );
}