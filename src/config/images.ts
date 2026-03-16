/**
 * Image URLs for the site. Using Unsplash (free, high-quality).
 * Replace with your own images in public/images/ when ready.
 * Source: unsplash.com — no attribution required.
 */

const U = "https://images.unsplash.com/photo";

export const imageConfig = {
  /** Hero background — clean, welcoming home interior */
  hero: `${U}-1484154218962-a197022b5858?w=1920&q=80`,

  /** Service card images (400x300, 4:3) */
  services: {
    "home-cleaning": `${U}-1581578731548-c64695cc6952?w=600&h=450&fit=crop&q=80`,
    "deep-cleaning": `${U}-1527515637462-cff94eecc1ac?w=600&h=450&fit=crop&q=80`,
    "window-cleaning": `${U}-1527689368864-3a821dbccc34?w=600&h=450&fit=crop&q=80`,
    "move-out-cleaning": `${U}-1600585154526-990dced4db0d?w=600&h=450&fit=crop&q=80`,
    "office-cleaning": `${U}-1497366216548-37526070297c?w=600&h=450&fit=crop&q=80`,
  } as const,

  /** About page — professional team */
  about: `${U}-1521791136064-7986c2920216?w=1200&h=600&fit=crop&q=80`,
} as const;
