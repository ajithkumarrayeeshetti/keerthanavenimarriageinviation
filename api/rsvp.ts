import { Resend } from "resend";

// This handler is written against the Web-standard Request/Response API
// (req.json(), new Response(...)) rather than Node's (req, res) style.
// That API is only available on Vercel's Edge runtime — the default
// Node.js runtime passes a plain IncomingMessage with no .json() method,
// which causes "req.json is not a function". This config line opts into
// the Edge runtime so the handler works as written, both in `vercel dev`
// and once deployed.
export const config = {
  runtime: "edge",
};

const resendApiKey = process.env.RESEND_API_KEY;
const hostEmail = process.env.HOST_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type RsvpPayload = {
  name: string;
  email: string;
  phone: string;
  guests: number;
  attending: "yes" | "no";
  message: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[0-9+()\s-]{7,30}$/.test(value.trim());
}

function sanitize(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMessage(value: string) {
  return sanitize(value).replace(/\r?\n/g, "<br />");
}

function buildHostHtml(payload: RsvpPayload, submittedAt: string) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #361b1a; padding: 24px; background: #fbf7ef;">
      <div style="max-width: 680px; margin: auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%); color: white; padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 0.08em;">New RSVP Received</h1>
          <p style="margin: 12px 0 0; font-size: 16px; opacity: 0.9;">A guest has submitted their RSVP.</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="margin: 0 0 16px; font-size: 22px; color: #7c2d12;">Guest Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; width: 30%; font-weight: 700;">Name</td><td style="padding: 12px 0;">${sanitize(payload.name)}</td></tr>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; font-weight: 700;">Email</td><td style="padding: 12px 0;">${sanitize(payload.email)}</td></tr>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; font-weight: 700;">Phone</td><td style="padding: 12px 0;">${sanitize(payload.phone)}</td></tr>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; font-weight: 700;">Guests</td><td style="padding: 12px 0;">${payload.guests}</td></tr>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; font-weight: 700;">Attending</td><td style="padding: 12px 0;">${payload.attending === "yes" ? "Yes" : "No"}</td></tr>
              <tr style="border-bottom: 1px solid #f3e8ff;"><td style="padding: 12px 0; font-weight: 700;">Message</td><td style="padding: 12px 0;">${formatMessage(payload.message || "—")}</td></tr>
              <tr><td style="padding: 12px 0; font-weight: 700;">Submitted</td><td style="padding: 12px 0;">${sanitize(submittedAt)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildGuestHtml(payload: RsvpPayload, hostEmail: string) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2f1b14; background: #fdf7ef; padding: 24px;">
      <div style="max-width: 680px; margin: auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #a16207 0%, #7c2d12 100%); color: white; padding: 32px 24px; text-align: center;">
          <p style="margin: 0; letter-spacing: 0.18em; font-size: 14px; text-transform: uppercase; opacity: 0.85;">You're confirmed</p>
          <h1 style="margin: 16px 0 0; font-size: 32px;">Thank you for your RSVP</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.75;">Dear ${sanitize(payload.name)},</p>
          <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.75;">Your response has been received with love. We look forward to celebrating together.</p>
          <div style="background: #fff7ed; border: 1px solid #fde8c9; border-radius: 18px; padding: 20px;">
            <h2 style="margin: 0 0 12px; font-size: 20px; color: #7c2d12;">Wedding Details</h2>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Couple:</strong> ${sanitize("RAYEESHETTI KEERTHANA & ALLAM VENU")}</p>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Date:</strong> AUGUST 27, 2026</p>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Time:</strong> 10:00 AM</p>
            <p style="margin: 0 0 0; font-size: 15px;"><strong>Venue:</strong> P S R A/C GARDEN, Mandal, Konaimakula Village, Geesugonda, Telangana</p>
          </div>

          <div style="margin-top: 24px; padding: 24px; background: #fff4e6; border-radius: 18px; border: 1px solid #f8d7a1;">
            <p style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #7c2d12;">Your RSVP Summary</p>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Attending:</strong> ${payload.attending === "yes" ? "Yes" : "No"}</p>
            <p style="margin: 0 0 8px; font-size: 15px;"><strong>Guests:</strong> ${payload.guests}</p>
            <p style="margin: 0; font-size: 15px;"><strong>Message:</strong> ${formatMessage(payload.message || "Thank you for your warm wishes.")}</p>
          </div>

          <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.75;">If you need to make any changes, please reply to this email or contact us at ${sanitize(hostEmail)}.</p>
          <p style="margin: 24px 0 0; font-size: 16px; font-weight: 700; color: #7c2d12;">With love,<br />${sanitize("RAYEESHETTI KEERTHANA & ALLAM VENU")}</p>
        </div>
      </div>
    </div>
  `;
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, phone, guests, attending, message } = body as Partial<RsvpPayload>;

  if (!name || typeof name !== "string" || !name.trim()) {
    return new Response(JSON.stringify({ error: "Please provide your name." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Please provide a valid email address." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
    return new Response(JSON.stringify({ error: "Please provide a valid phone number." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    return new Response(JSON.stringify({ error: "Please provide a valid number of guests." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (attending !== "yes" && attending !== "no") {
    return new Response(JSON.stringify({ error: "Please select your attendance status." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Please provide a message." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload: RsvpPayload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    guests: guestCount,
    attending,
    message: message.trim(),
  };

  const submittedAt = new Date().toISOString();

  if (!resend || !hostEmail) {
    return new Response(JSON.stringify({ error: "Email service is not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Resend only allows a "from" address on a domain you've verified in the
  // Resend dashboard. onboarding@resend.dev is Resend's sandbox sender that
  // works with any API key with no domain setup — but it can ONLY deliver
  // to the email address of the Resend account itself, not to arbitrary
  // guest addresses. See https://resend.com/docs/knowledge-base/403-error-resend-dev-domain
  //
  // To send from your own address later (e.g. hello@yourwedding.com):
  //   1. Add + verify your domain at https://resend.com/domains
  //   2. Replace SEND_FROM below with e.g. "Keerthana & Venu <hello@yourwedding.com>"
  const SEND_FROM = "onboarding@resend.dev";
  const guestEmailMatchesHost = payload.email.trim().toLowerCase() === hostEmail.trim().toLowerCase();

  // IMPORTANT: this app has no database. The host email below is the ONLY
  // record that an RSVP ever happened. If it fails to send, the guest's
  // response is lost with nothing to recover it from — so, unlike the
  // guest confirmation, this send is NOT allowed to fail silently. A
  // failure here must be reported back to the guest as an error so they
  // know to retry or contact the couple directly.
  try {
    await resend.emails.send({
      from: SEND_FROM,
      to: hostEmail,
      replyTo: payload.email,
      subject: `New RSVP from ${payload.name}`,
      html: buildHostHtml(payload, submittedAt),
    });
  } catch (error) {
    console.error("Resend error (host notification — RSVP was NOT recorded):", error);
    return new Response(JSON.stringify({ error: "Unable to send your RSVP. Please try again later." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Guest confirmation is a nice-to-have, not the record of truth, so a
  // failure here is safe to swallow (and expected, until a domain is
  // verified, for any guest whose email isn't the Resend account email) —
  // the RSVP has already been recorded via the host email above.
  if (guestEmailMatchesHost) {
    try {
      await resend.emails.send({
        from: SEND_FROM,
        to: payload.email,
        replyTo: hostEmail,
        subject: `Your RSVP for ${"RAYEESHETTI KEERTHANA & ALLAM VENU"}`,
        html: buildGuestHtml(payload, hostEmail),
      });
    } catch (error) {
      console.warn("Guest confirmation email failed (non-fatal — RSVP was still recorded):", error);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
