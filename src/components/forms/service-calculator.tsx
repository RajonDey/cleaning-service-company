"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const BASE_PRICES: Record<string, Record<string, number>> = {
  home_cleaning: { "1-2": 450, "3-4": 650, "5+": 850 },
  deep_cleaning: { "1-2": 1200, "3-4": 1800, "5+": 2400 },
  window_cleaning: { "1-2": 400, "3-4": 600, "5+": 800 },
  move_out: { "1-2": 1500, "3-4": 2200, "5+": 3000 },
  office_cleaning: { "1-2": 800, "3-4": 1200, "5+": 1600 },
};

const WINDOW_PRICE_PER = 80;
const EXTRAS_PRICE = 50;

export interface ServiceCalculatorProps {
  serviceType: string;
  homeSize: string;
  normalWindows?: number;
  twoPaneWindows?: number;
  glassDoors?: number;
  sprojs?: boolean;
  fonsterbleck?: boolean;
  fonsterkarm?: boolean;
  className?: string;
}

export function ServiceCalculator({
  serviceType,
  homeSize,
  normalWindows = 0,
  twoPaneWindows = 0,
  glassDoors = 0,
  sprojs = false,
  fonsterbleck = false,
  fonsterkarm = false,
  className,
}: ServiceCalculatorProps) {
  const t = useTranslations("book");

  const estimate = useMemo(() => {
    const base = BASE_PRICES[serviceType]?.[homeSize] ?? 0;
    if (serviceType === "window_cleaning") {
      const units =
        (normalWindows || 0) + (twoPaneWindows || 0) + (glassDoors || 0);
      let total = base + units * WINDOW_PRICE_PER;
      if (sprojs) total += EXTRAS_PRICE;
      if (fonsterbleck) total += EXTRAS_PRICE;
      if (fonsterkarm) total += EXTRAS_PRICE;
      return Math.max(0, total);
    }
    return base;
  }, [
    serviceType,
    homeSize,
    normalWindows,
    twoPaneWindows,
    glassDoors,
    sprojs,
    fonsterbleck,
    fonsterkarm,
  ]);

  if (estimate <= 0) return null;

  const afterRut = Math.round(estimate * 0.5);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-foreground-muted">{t("estimatedQuote")}</span>
        <span className="font-heading text-2xl font-bold text-foreground">
          {estimate.toLocaleString("sv-SE")} kr
        </span>
      </div>
      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <span className="text-sm font-medium text-primary">{t("afterRut")}</span>
        <span className="font-heading text-2xl font-bold text-primary">
          {afterRut.toLocaleString("sv-SE")} kr
        </span>
      </div>
      <p className="text-xs text-foreground-muted">
        {t("quoteDisclaimer")}
      </p>
    </div>
  );
}
