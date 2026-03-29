import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  appendQuoteRequest,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";
import { quoteRequestSchema } from "@/lib/quote-request-schema";
import { siteConfig } from "@/config/site";
import type { QuoteRequestFormData, ServiceType } from "@/types";

const SERVICE_LABELS: Record<ServiceType, string> = {
  home_cleaning: "Regular Home Cleaning",
  deep_cleaning: "Deep Cleaning",
  window_cleaning: "Window Cleaning",
  move_out: "Move-Out Cleaning",
  office_cleaning: "Office Cleaning",
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;
  if (!apiKey) return null;
  return { resend: new Resend(apiKey), fromEmail, notifyEmail };
}

async function sendOwnerQuoteNotification(data: QuoteRequestFormData) {
  const config = getResend();
  if (!config?.notifyEmail) return;

  const serviceName = SERVICE_LABELS[data.serviceType] ?? data.serviceType;

  await config.resend.emails.send({
    from: config.fromEmail,
    to: config.notifyEmail,
    replyTo: data.email,
    subject: `Quote request: ${serviceName} — ${data.city}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">New quote request (home form)</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #71717a;">Service</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Square meters</td><td style="padding: 8px 0;">${data.squareMeters}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">City</td><td style="padding: 8px 0;">${data.city}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Marketing consent</td><td style="padding: 8px 0;">${data.marketingConsent ? "Yes" : "No"}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = quoteRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const raw = parsed.data;
    const data: QuoteRequestFormData = {
      serviceType: raw.serviceType,
      squareMeters: raw.squareMeters,
      city: raw.city,
      phone: raw.phone,
      email: raw.email,
      marketingConsent: raw.marketingConsent,
    };

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json(
        {
          error:
            "This form is not configured. Please contact us by phone or email.",
        },
        { status: 503 }
      );
    }

    await appendQuoteRequest(data);

    sendOwnerQuoteNotification(data).catch((err) => {
      console.error("Quote request owner email failed:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote request error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save quote request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
