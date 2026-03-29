/**
 * Local brand and marketing images in /public/images/.
 * Paths are root-relative (Next.js public folder).
 */

export const imageConfig = {
  /** Square brand mark — header, etc. */
  logo: "/images/logo.png",

  /**
   * Wide hero / banner — home hero (full-bleed), works best as landscape.
   * Uses object-cover so different ratios still fill the frame cleanly.
   */
  hero: "/images/banner.jpeg",

  /**
   * Service card & detail heroes — object-cover inside fixed aspect ratios.
   * Three client photos mapped to five services (shared shots where needed).
   */
  services: {
    "home-cleaning": "/images/services/service-home-cleaning.jpeg",
    "deep-cleaning": "/images/services/service-cleaning.jpeg",
    "window-cleaning": "/images/services/service-window-cleaning.jpeg",
    /** Same generic interior clean as deep — until a dedicated asset exists */
    "move-out-cleaning": "/images/services/service-cleaning.jpeg",
    /** Professional clean vibe; reuse generic cleaning shot */
    "office-cleaning": "/images/services/service-cleaning.jpeg",
  } as const,

  /** About page hero — wide ratio; reuses banner for consistent branding */
  about: "/images/banner.jpeg",
} as const;
