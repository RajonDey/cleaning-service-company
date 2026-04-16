/**
 * Centralized site configuration and SEO metadata.
 * Update this file to change branding and SEO across the entire site.
 */

export const siteConfig = {
  /** Site name used in header, footer, and SEO */
  siteName: "Härlig Städ AB",

  /** Base URL for canonical links and Open Graph (no trailing slash) */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecleaningservice.se",

  /** Default meta when page-specific values are not set */
  defaultTitle: "Härlig Städ AB | Professional Cleaning Services",
  defaultDescription:
    "Professional cleaning services for homes and businesses. Trustworthy, flexible, easy. Home cleaning, deep cleaning, window cleaning, move-out and office cleaning.",

  /** Contact details */
  contact: {
    phone: "0470-597 015",
    phoneHref: "tel:+46470597015",
    email: "info@harligstad.se",
    whatsapp: "https://wa.me/46470597015",
    address: "Plogvägen 107, 352 53 Växjö",
  },

  /** Per-page SEO overrides. Title is combined with siteName when needed. */
  seo: {
    home: {
      title: "Härlig Städ AB | Professional Cleaning Services",
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
      titleTemplate: "{serviceName} | Härlig Städ AB",
      descriptionTemplate:
        "{serviceName} — professional cleaning service. Trustworthy, flexible, easy. Book online or contact us.",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
