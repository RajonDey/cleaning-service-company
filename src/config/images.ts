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
   * Move-out & office each differ from deep-cleaning’s generic `service-cleaning` shot.
   * Move-out reuses home photo (same domestic context); office uses banner.
   * Add `/images/services/service-move-out.jpeg` & `service-office.jpeg` for five unique thumbnails.
   */
  services: {
    "home-cleaning": "/images/services/service-home-cleaning.jpeg",
    "deep-cleaning": "/images/services/service-cleaning.jpeg",
    "window-cleaning": "/images/services/service-window-cleaning.jpeg",
    "move-out-cleaning": "/images/services/service-home-cleaning.jpeg",
    "office-cleaning": "/images/banner.jpeg",
  } as const,

  /** About page hero — wide ratio; reuses banner for consistent branding */
  about: "/images/banner.jpeg",
} as const;
