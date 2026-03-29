/**
 * Centralized site configuration and SEO metadata.
 * Update this file to change branding and SEO across the entire site.
 */

export const siteConfig = {
  /** Site name used in header, footer, and SEO */
  siteName: "Home Cleaning Service",

  /** Base URL for canonical links and Open Graph (no trailing slash) */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecleaningservice.se",

  /** Default meta when page-specific values are not set */
  defaultTitle: "Home Cleaning Service | Professional Cleaning Services",
  defaultDescription:
    "Professional cleaning services for homes and businesses. Trustworthy, flexible, easy. Home cleaning, deep cleaning, window cleaning, move-out and office cleaning.",

  /** Contact details (update for production) */
  contact: {
    phone: "+46 00 000 00 00",
    phoneHref: "tel:+46000000000",
    email: "info@homecleaningservice.se",
    whatsapp: "https://wa.me/46000000000",
  },

  /** Per-page SEO overrides. Title is combined with siteName when needed. */
  seo: {
    home: {
      title: "Home Cleaning Service | Professional Cleaning Services",
      description:
        "Professional cleaning services for homes and businesses. Trustworthy, flexible, easy. Home cleaning, deep cleaning, window cleaning, move-out and office cleaning.",
    },
    services: {
      title: "Our Services",
      description:
        "Professional cleaning services for homes and businesses across Sweden. Home cleaning, deep cleaning, window cleaning, move-out and office cleaning.",
    },
    book: {
      title: "Book a Service",
      description:
        "Book your cleaning service online. We confirm by phone. No payment required upfront. RUT tax deduction applies.",
    },
    about: {
      title: "About Us",
      description:
        "Nearly 30 years of first-class home services. Trustworthy, flexible, easy. Learn about our values and commitment to quality.",
    },
    contact: {
      title: "Contact Us",
      description:
        "Get in touch for a quote or questions. Call, email, or WhatsApp. We're happy to help.",
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "How we handle personal data when you use our website, forms, and services.",
    },
    /** Used for service detail pages — {serviceName} is replaced */
    serviceDetail: {
      titleTemplate: "{serviceName} | Home Cleaning Service",
      descriptionTemplate:
        "{serviceName} — professional cleaning service. Trustworthy, flexible, easy. Book online or contact us.",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
