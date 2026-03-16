import { NextResponse } from "next/server";
import { Resend } from "resend";
import { appendBooking, isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { bookingSchema } from "@/lib/booking-schema";
import type { BookingFormData } from "@/types";

async function sendBookingEmail(data: BookingFormData) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) return;

  const resend = new Resend(apiKey);
  const windowExtras =
    data.serviceType === "window_cleaning"
      ? [
          data.windowCount && `Windows: ${data.windowCount}`,
          data.sprojs && "Spröjs",
          data.fonsterbleck && "Fönsterbleck",
          data.fonsterkarm && "Fönsterkarm",
          data.flexibleDate && "Flexible date (100 kr off)",
        ]
          .filter(Boolean)
          .join(", ")
      : "";

  await resend.emails.send({
    from: fromEmail,
    to: notifyEmail,
    subject: `New booking: ${data.serviceType} - ${data.date}`,
    html: `
      <h2>New booking received</h2>
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Date:</strong> ${data.date} at ${data.time}</p>
      <p><strong>Address:</strong> ${data.address}, ${data.postcode}</p>
      <p><strong>Contact:</strong> ${data.name ?? "—"} | ${data.phone} | ${data.email}</p>
      ${windowExtras ? `<p><strong>Window extras:</strong> ${windowExtras}</p>` : ""}
      ${data.specialInstructions ? `<p><strong>Instructions:</strong> ${data.specialInstructions}</p>` : ""}
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

    // Optional: send email notification if Resend is configured
    await sendBookingEmail(data).catch((e) =>
      console.error("Booking email failed:", e)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to save booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
