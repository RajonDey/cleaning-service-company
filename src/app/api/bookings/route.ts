import { NextResponse } from "next/server";
import { Resend } from "resend";
import { appendBooking, isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { bookingSchema } from "@/lib/booking-schema";
import { siteConfig } from "@/config/site";
import type { BookingFormData } from "@/types";

const SERVICE_LABELS: Record<string, string> = {
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

const WINDOW_SCOPE_LABEL: Record<string, string> = {
  exterior: "Exterior only",
  interior_exterior: "Interior + exterior",
  interior_exterior_between: "Interior, exterior + between panes",
};

function buildWindowExtras(data: BookingFormData): string {
  if (data.serviceType !== "window_cleaning") return "";
  const scope = data.windowHelpType
    ? WINDOW_SCOPE_LABEL[data.windowHelpType] ?? data.windowHelpType
    : "";
  return [
    scope && `Scope: ${scope}`,
    `Counts — normal: ${data.normalWindows}, two-pane: ${data.twoPaneWindows}, glass doors: ${data.glassDoors}`,
    data.sprojs && "Spröjs",
    data.fonsterbleck && "Fönsterbleck cleaning",
    data.fonsterkarm && "Fönsterkarm cleaning",
  ]
    .filter(Boolean)
    .join("; ");
}

async function sendOwnerNotification(data: BookingFormData) {
  const config = getResend();
  if (!config || !config.notifyEmail) return;

  const serviceName = SERVICE_LABELS[data.serviceType] ?? data.serviceType;
  const windowExtras = buildWindowExtras(data);

  await config.resend.emails.send({
    from: config.fromEmail,
    to: config.notifyEmail,
    subject: `New booking: ${serviceName} — ${data.date}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">New Booking Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #71717a;">Service</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Date & Time</td><td style="padding: 8px 0;">${data.date} at ${data.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Address</td><td style="padding: 8px 0;">${data.address}, ${data.postcode}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Customer</td><td style="padding: 8px 0;">${data.name ?? "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Phone</td><td style="padding: 8px 0;">${data.phone || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #71717a;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
          ${data.personnummer ? `<tr><td style="padding: 8px 0; color: #71717a;">Personnummer</td><td style="padding: 8px 0;">${data.personnummer}</td></tr>` : ""}
          ${windowExtras ? `<tr><td style="padding: 8px 0; color: #71717a;">Window Extras</td><td style="padding: 8px 0;">${windowExtras}</td></tr>` : ""}
          ${data.specialInstructions ? `<tr><td style="padding: 8px 0; color: #71717a;">Instructions</td><td style="padding: 8px 0;">${data.specialInstructions}</td></tr>` : ""}
        </table>
        <p style="margin-top: 20px; padding: 12px; background: #d1fae5; border-radius: 8px; color: #047857;">
          Please call the customer to confirm this booking.
        </p>
      </div>
    `,
  });
}

async function sendCustomerConfirmation(data: BookingFormData) {
  const config = getResend();
  if (!config || !data.email) return;

  const serviceName = SERVICE_LABELS[data.serviceType] ?? data.serviceType;
  const windowExtras = buildWindowExtras(data);
  const { siteName, contact } = siteConfig;

  await config.resend.emails.send({
    from: config.fromEmail,
    to: data.email,
    subject: `Booking confirmation — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Thank you for your booking!</h2>
        <p>Hi ${data.name ?? "there"},</p>
        <p>We've received your booking for <strong>${serviceName}</strong> on <strong>${data.date}</strong> at <strong>${data.time}</strong>.</p>
        
        <div style="margin: 24px 0; padding: 16px; background: #f4f4f5; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #71717a; text-transform: uppercase;">Booking Details</h3>
          <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${data.date} at ${data.time}</p>
          <p style="margin: 4px 0;"><strong>Address:</strong> ${data.address}, ${data.postcode}</p>
          ${data.serviceType === "window_cleaning" && windowExtras ? `<p style="margin: 4px 0;"><strong>Window details:</strong> ${windowExtras}</p>` : ""}
        </div>

        <div style="margin: 24px 0; padding: 16px; background: #d1fae5; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #047857;">What happens next?</h3>
          <p style="margin: 0; color: #047857;">Our team will call you within 24 hours to confirm the details and finalize the schedule. No payment is required at this time.</p>
        </div>

        <p>If you have any questions, don't hesitate to contact us:</p>
        <p>
          Phone: ${contact.phone}<br/>
          Email: ${contact.email}
        </p>
        <p>Best regards,<br/><strong>${siteName}</strong></p>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data as unknown as BookingFormData;

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json(
        {
          error:
            "Booking service is not configured. Please contact us directly by phone or email.",
        },
        { status: 503 }
      );
    }

    await appendBooking(data);

    await Promise.allSettled([
      sendOwnerNotification(data),
      sendCustomerConfirmation(data),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`Email ${i === 0 ? "owner" : "customer"} failed:`, r.reason);
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
