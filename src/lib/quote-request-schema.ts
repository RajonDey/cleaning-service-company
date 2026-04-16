import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/booking-schema";
import {
  WINDOW_HELP_TYPES,
  nonNegativeInt,
  windowCleaningCountsSum,
} from "@/lib/window-cleaning-fields";

export const quoteRequestSchema = z
  .object({
    serviceType: z
      .string()
      .min(1, "Service type is required")
      .refine(
        (v): v is (typeof SERVICE_TYPES)[number] =>
          (SERVICE_TYPES as readonly string[]).includes(v),
        { message: "Invalid service type" }
      ),
    squareMeters: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      if (typeof val === "number" && !Number.isNaN(val)) return val;
      if (typeof val === "string" && /^\d+$/.test(val.trim()))
        return Number.parseInt(val.trim(), 10);
      return val;
    }, z.number().positive().max(100_000).optional()),
    city: z.string().min(1, "City is required").max(200),
    phone: z.string().optional(),
    email: z.string().email("Invalid email"),
    marketingConsent: z.boolean().refine((v) => v === true, {
      message: "Consent is required",
    }),
    name: z.string().min(1, "Name is required").max(200),
    address: z.string().min(1, "Address is required").max(500),
    windowHelpType: z.enum(WINDOW_HELP_TYPES).optional(),
    normalWindows: nonNegativeInt,
    twoPaneWindows: nonNegativeInt,
    glassDoors: nonNegativeInt,
    sprojs: z.boolean().optional(),
    fonsterbleck: z.boolean().optional(),
    fonsterkarm: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "window_cleaning") {
      if (!data.windowHelpType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose what you need help with",
          path: ["windowHelpType"],
        });
      }
      if (windowCleaningCountsSum(data) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter at least one window count",
          path: ["normalWindows"],
        });
      }
    } else if (data.squareMeters == null || data.squareMeters <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Square meters is required",
        path: ["squareMeters"],
      });
    }
  });

export type QuoteRequestParsed = z.infer<typeof quoteRequestSchema>;
