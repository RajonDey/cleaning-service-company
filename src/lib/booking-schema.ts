import { z } from "zod";
import {
  WINDOW_HELP_TYPES,
  nonNegativeInt,
  windowCleaningCountsSum,
} from "@/lib/window-cleaning-fields";

/** Client order: Flytt → Fönster → Stor → Kontor → Hem */
export const SERVICE_TYPES = [
  "move_out",
  "window_cleaning",
  "deep_cleaning",
  "office_cleaning",
  "home_cleaning",
] as const;

/** i18n key under `services.{key}.name` for each service type */
export const SERVICE_FORM_OPTIONS: {
  value: (typeof SERVICE_TYPES)[number];
  key: string;
}[] = [
  { value: "move_out", key: "moveOutCleaning" },
  { value: "window_cleaning", key: "windowCleaning" },
  { value: "deep_cleaning", key: "deepCleaning" },
  { value: "office_cleaning", key: "officeCleaning" },
  { value: "home_cleaning", key: "homeCleaning" },
];

const HOME_SIZES = ["1-2", "3-4", "5+"] as const;

export const bookingSchema = z
  .object({
    serviceType: z.enum(SERVICE_TYPES),
    homeSize: z.enum(HOME_SIZES),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    address: z.string().min(1, "Address is required"),
    postcode: z.string().min(1, "Postcode is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email"),
    name: z.string().optional(),
    personnummer: z.string().optional(),
    specialInstructions: z.string().optional(),
    windowHelpType: z.enum(WINDOW_HELP_TYPES).optional(),
    normalWindows: nonNegativeInt,
    twoPaneWindows: nonNegativeInt,
    glassDoors: nonNegativeInt,
    sprojs: z.boolean().optional(),
    fonsterbleck: z.boolean().optional(),
    fonsterkarm: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType !== "window_cleaning") return;
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
  });

export type BookingSchema = z.infer<typeof bookingSchema>;
