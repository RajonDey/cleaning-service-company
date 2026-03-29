import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/booking-schema";

export const quoteRequestSchema = z.object({
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
  }, z.number({ required_error: "Square meters is required" }).positive().max(100_000)),
  city: z.string().min(1, "City is required").max(200),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  marketingConsent: z.boolean().refine((v) => v === true, {
    message: "Consent is required",
  }),
});

export type QuoteRequestParsed = z.infer<typeof quoteRequestSchema>;
