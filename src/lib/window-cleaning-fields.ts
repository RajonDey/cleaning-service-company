import { z } from "zod";

/** "Vad vill du ha hjälp med?" — mutually exclusive options */
export const WINDOW_HELP_TYPES = [
  "exterior",
  "interior_exterior",
  "interior_exterior_between",
] as const;

export type WindowHelpType = (typeof WINDOW_HELP_TYPES)[number];

/** Coerce empty / missing to 0 for optional count inputs */
export const nonNegativeInt = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return 0;
  if (typeof val === "number" && Number.isFinite(val)) return Math.max(0, Math.floor(val));
  if (typeof val === "string" && /^\d+$/.test(val.trim()))
    return Math.max(0, Number.parseInt(val.trim(), 10));
  return 0;
}, z.number().int().min(0));

export function windowCleaningCountsSum(data: {
  normalWindows: number;
  twoPaneWindows: number;
  glassDoors: number;
}): number {
  return data.normalWindows + data.twoPaneWindows + data.glassDoors;
}
