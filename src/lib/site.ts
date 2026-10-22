/** Placeholder production domain — update when the real domain is confirmed. */
export const SITE_URL = "https://bezteq.com";

/**
 * Single source of truth for NAP (name/address/phone) and company facts —
 * Footer, About, Contact, and schema markup all read from here so they can
 * never drift out of sync (CLAUDE.md §9: NAP must match the Google Business
 * Profile exactly). Values marked "placeholder" are obvious dummy patterns
 * (all-zero license/phone) to update before launch, not invented facts.
 */
export const COMPANY = {
  name: "BEZTEQ",
  foundedYear: 2017,
  teamSize: "18",
  tradeLicense: "000000",
  email: "contact@bezteq.com",
  phone: "+971 56 8253021",
  whatsapp: "https://wa.me/971568253021",
  addressLocality: "Dubai",
  addressCountry: "AE",
  addressFull: "Dubai, United Arab Emirates",
  geo: { lat: 25.0805, lng: 55.1403 },
} as const;
