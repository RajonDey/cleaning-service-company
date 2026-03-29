import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type Locale = "en" | "sv";

/** Build metadata from site config. Update src/config/site.ts to change all SEO data. */
export function buildMetadata(
  page: keyof typeof siteConfig.seo,
  locale: Locale,
  overrides?: {
    title?: string;
    description?: string;
    serviceName?: string;
    path?: string;
  }
): Metadata {
  const base = siteConfig.seo[page];
  if (!base) {
    return {
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
    };
  }

  let title = overrides?.title ?? (base as { title?: string }).title;
  let description =
    overrides?.description ?? (base as { description?: string }).description;

  // Service detail pages use templates
  const detailBase = base as {
    titleTemplate?: string;
    descriptionTemplate?: string;
  };
  if (detailBase.titleTemplate && overrides?.serviceName) {
    title = detailBase.titleTemplate.replace(
      "{serviceName}",
      overrides.serviceName
    );
  }
  if (detailBase.descriptionTemplate && overrides?.serviceName) {
    description = detailBase.descriptionTemplate.replace(
      "{serviceName}",
      overrides.serviceName
    );
  }

  const fullTitle = title ?? siteConfig.defaultTitle;
  const fullDescription = description ?? siteConfig.defaultDescription;
  const useAbsoluteTitle = page === "home" || page === "serviceDetail";

  const pathMap: Record<string, string> = {
    home: "",
    services: "/services",
    book: "/book",
    about: "/about",
    contact: "/contact",
    privacy: "/privacy",
  };
  const path = overrides?.path ?? pathMap[page] ?? "";
  const canonical = `${siteConfig.baseUrl}/${locale}${path}`.replace(/\/$/, "") || `${siteConfig.baseUrl}/${locale}`;

  return {
    title: useAbsoluteTitle ? { absolute: fullTitle } : fullTitle,
    description: fullDescription,
    metadataBase: new URL(siteConfig.baseUrl),
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonical,
      siteName: siteConfig.siteName,
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
    },
    alternates: {
      canonical,
    },
  };
}
