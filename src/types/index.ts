/**
 * Shared types for the application.
 */

import type { WindowHelpType } from "@/lib/window-cleaning-fields";

export type { WindowHelpType };

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
  phone?: string;
  email: string;
  name?: string;
  personnummer?: string;
  specialInstructions?: string;
  windowHelpType?: WindowHelpType;
  normalWindows: number;
  twoPaneWindows: number;
  glassDoors: number;
  sprojs?: boolean;
  fonsterbleck?: boolean;
  fonsterkarm?: boolean;
}

export interface QuoteRequestFormData {
  serviceType: ServiceType;
  /** Omitted or 0 for window-cleaning quote leads */
  squareMeters?: number;
  city: string;
  phone?: string;
  email: string;
  marketingConsent: boolean;
  name: string;
  address: string;
  windowHelpType?: WindowHelpType;
  normalWindows: number;
  twoPaneWindows: number;
  glassDoors: number;
  sprojs?: boolean;
  fonsterbleck?: boolean;
  fonsterkarm?: boolean;
}
