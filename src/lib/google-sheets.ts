import { google } from "googleapis";
import type { BookingFormData } from "@/types";

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
    range: "Sheet1!A:Q",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

  return true;
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_CREDENTIALS &&
    process.env.GOOGLE_SHEET_ID
  );
}
