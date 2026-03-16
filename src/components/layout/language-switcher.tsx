"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const locales = [
  { code: "en" as const, label: "EN" },
  { code: "sv" as const, label: "SV" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "en" | "sv") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className={cn(
        "flex rounded-button border border-border bg-background-muted p-0.5",
        className
      )}
      role="group"
      aria-label="Switch language"
    >
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200",
            locale === code
              ? "bg-primary text-white"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
