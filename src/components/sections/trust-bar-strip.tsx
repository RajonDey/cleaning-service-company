"use client";

import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Clock, Shield, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYS = ["p1", "p2", "p3", "p4"] as const;

const ICONS: Record<(typeof KEYS)[number], LucideIcon> = {
  p1: BadgeCheck,
  p2: Clock,
  p3: Shield,
  p4: Percent,
};

export function TrustBarStrip({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const t = useTranslations("trustBar");
  const dark = variant === "dark";

  if (dark) {
    return (
      <ul className="m-0 flex w-full list-none flex-col gap-3.5 p-0">
        {KEYS.map((key) => {
          const Icon = ICONS[key];
          return (
            <li
              key={key}
              className="flex w-full items-start gap-3 text-left text-xs font-medium leading-snug text-white/90 sm:text-sm"
            >
              <Icon
                className="mt-0.5 size-4 shrink-0 text-primary-light"
                aria-hidden
              />
              <span>{t(key)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "m-0 grid w-full list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5 lg:grid-cols-4 lg:gap-6"
      )}
    >
      {KEYS.map((key) => {
        const Icon = ICONS[key];
        return (
          <li key={key} className="flex min-w-0 gap-3 text-left">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"
              aria-hidden
            >
              <Icon className="size-5" />
            </span>
            <span className="pt-1.5 text-sm font-medium leading-snug text-foreground md:text-base">
              {t(key)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
