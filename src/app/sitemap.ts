import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { SERVICE_SLUGS } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const routes = ["", "/services", "/book", "/about", "/contact", "/privacy"];
  const serviceRoutes = SERVICE_SLUGS.map((s) => `/services/${s}`);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = `/${locale}`;
    for (const route of routes) {
      entries.push({
        url: `${base}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
    for (const route of serviceRoutes) {
      entries.push({
        url: `${base}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return entries;
}
