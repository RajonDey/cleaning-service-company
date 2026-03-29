import { google } from "googleapis";
import type { BookingFormData, QuoteRequestFormData } from "@/types";

const DEFAULT_QUOTES_TAB = "QuoteLeads";

function quotesTabName(): string {
  return process.env.GOOGLE_SHEET_QUOTES_TAB?.trim() || DEFAULT_QUOTES_TAB;
}

function quotesAppendRange(): string {
  return `${quotesTabName()}!A:G`;
}

function googleApiErrorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const o = err as {
      message?: string;
      response?: { data?: { error?: { message?: string } } };
    };
    return o.response?.data?.error?.message ?? o.message ?? "";
  }
  return String(err);
}

function getCredentials() {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!credentials || !sheetId) {
    return null;
  }

  try {
    const parsed = JSON.parse(credentials) as {
      type: string;
      project_id: string;
      private_key_id: string;
      private_key: string;
      client_email: string;
      client_id: string;
    };
    return { auth: parsed, sheetId };
  } catch {
    return null;
  }
}

export async function appendBooking(data: BookingFormData): Promise<boolean> {
  const config = getCredentials();
  if (!config) {
    throw new Error(
      "Google Sheets not configured. Add GOOGLE_SHEETS_CREDENTIALS and GOOGLE_SHEET_ID to .env"
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: config.auth,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const row = [
    new Date().toISOString(),
    data.serviceType,
    data.homeSize,
    data.date,
    data.time,
    data.address,
    data.postcode,
    data.phone,
    data.email,
    data.name ?? "",
    data.personnummer ?? "",
    data.specialInstructions ?? "",
    "pending",
    data.windowCount ?? "",
    data.sprojs ? "Yes" : "",
    data.fonsterbleck ? "Yes" : "",
    data.fonsterkarm ? "Yes" : "",
    data.flexibleDate ? "Yes" : "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range: "Sheet1!A:R",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

  return true;
}

export async function appendQuoteRequest(
  data: QuoteRequestFormData
): Promise<boolean> {
  const config = getCredentials();
  if (!config) {
    throw new Error(
      "Google Sheets not configured. Add GOOGLE_SHEETS_CREDENTIALS and GOOGLE_SHEET_ID to .env"
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: config.auth,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const row = [
    new Date().toISOString(),
    data.serviceType,
    data.squareMeters,
    data.city,
    data.phone,
    data.email,
    data.marketingConsent ? "Yes" : "No",
  ];

  const tab = quotesTabName();
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: quotesAppendRange(),
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });
  } catch (err: unknown) {
    const text = googleApiErrorText(err).toLowerCase();
    if (
      text.includes("unable to parse range") ||
      text.includes("invalid data[0].range") ||
      (text.includes("not found") && text.includes("range"))
    ) {
      throw new Error(
        `Google Sheet is missing the "${tab}" tab. Add a new worksheet with that exact name in the same spreadsheet as Sheet1 (or set GOOGLE_SHEET_QUOTES_TAB in .env to match your tab name).`
      );
    }
    throw err;
  }

  return true;
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_CREDENTIALS &&
    process.env.GOOGLE_SHEET_ID
  );
}
