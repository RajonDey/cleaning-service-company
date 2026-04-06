import {
  Home,
  Sparkles,
  Sun,
  Truck,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { imageConfig } from "@/config/images";

/** Same display order as booking / quote forms (client spec) */
export const SERVICE_SLUGS = [
  "move-out-cleaning",
  "window-cleaning",
  "deep-cleaning",
  "office-cleaning",
  "home-cleaning",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const SERVICE_CONFIG: Record<
  ServiceSlug,
  { icon: LucideIcon; messageKey: string; image: string }
> = {
  "move-out-cleaning": {
    icon: Truck,
    messageKey: "moveOutCleaning",
    image: imageConfig.services["move-out-cleaning"],
  },
  "window-cleaning": {
    icon: Sun,
    messageKey: "windowCleaning",
    image: imageConfig.services["window-cleaning"],
  },
  "deep-cleaning": {
    icon: Sparkles,
    messageKey: "deepCleaning",
    image: imageConfig.services["deep-cleaning"],
  },
  "office-cleaning": {
    icon: Building2,
    messageKey: "officeCleaning",
    image: imageConfig.services["office-cleaning"],
  },
  "home-cleaning": {
    icon: Home,
    messageKey: "homeCleaning",
    image: imageConfig.services["home-cleaning"],
  },
};

export function getServiceHref(slug: ServiceSlug): string {
  return `/services/${slug}`;
}

/** Map service slug (URL) to booking form serviceType value */
export const SLUG_TO_SERVICE_TYPE: Record<ServiceSlug, string> = {
  "move-out-cleaning": "move_out",
  "window-cleaning": "window_cleaning",
  "deep-cleaning": "deep_cleaning",
  "office-cleaning": "office_cleaning",
  "home-cleaning": "home_cleaning",
};

export function slugToServiceType(slug: string): string | null {
  return SLUG_TO_SERVICE_TYPE[slug as ServiceSlug] ?? null;
}
