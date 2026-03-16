/**
 * Shared types for the application.
 */

export type ServiceType =
  | "home_cleaning"
  | "deep_cleaning"
  | "window_cleaning"
  | "move_out"
  | "office_cleaning";

export interface BookingFormData {
  serviceType: ServiceType;
  homeSize: string;
  date: string;
  time: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  name?: string;
  specialInstructions?: string;
  windowCount?: number;
  sprojs?: boolean;
  fonsterbleck?: boolean;
  fonsterkarm?: boolean;
  flexibleDate?: boolean;
}
