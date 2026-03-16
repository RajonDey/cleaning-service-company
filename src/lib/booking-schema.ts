import { z } from "zod";

export const SERVICE_TYPES = [
  "home_cleaning",
  "deep_cleaning",
  "window_cleaning",
  "move_out",
  "office_cleaning",
] as const;

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
    // Window cleaning extras
    windowCount: z.coerce.number().optional(),
    sprojs: z.boolean().optional(),
    fonsterbleck: z.boolean().optional(),
    fonsterkarm: z.boolean().optional(),
    flexibleDate: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.serviceType !== "window_cleaning") return true;
      return true; // windowCount optional for window cleaning
    },
    { message: "Window count required for window cleaning", path: ["windowCount"] }
  );

export type BookingSchema = z.infer<typeof bookingSchema>;
