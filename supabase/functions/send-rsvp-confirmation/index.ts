import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPConfirmationPayload {
  name: string;
  email: string;
  guestCount: number;
}

function buildEmailHtml({ name, guestCount }: RSVPConfirmationPayload) {
  const spotsText = guestCount === 1 ? "spot" : "spots";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="margin-bottom: 8px;">You're confirmed! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your RSVP. We have reserved <strong>${guestCount} ${spotsText}</strong> for you.</p>
      <p><strong>Date:</strong> Saturday, August 29, 2026</p>
      <p><strong>Time:</strong> 17:00 PM</p>
      <p><strong>Venue:</strong> Angke Heritage - PIK 2</p>
      <p><strong>Room:</strong> Lounge Room</p>
      <p>We can't wait to celebrate with you! 🌸</p>
      <p style="margin-top: 16px;">With love,<br/>The Family</p>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Note: This function is intentionally public (no JWT required) to allow unauthenticated RSVP submissions

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RSVP_FROM_EMAIL");

    if (!resendApiKey || !fromEmail) {
      return new Response(
        JSON.stringify({
          error: "Missing RESEND_API_KEY or RSVP_FROM_EMAIL secret",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload = (await req.json()) as RSVPConfirmationPayload;

    if (!payload?.name || !payload?.email || !payload?.guestCount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: "RSVP Confirmation - You're on the list!",
      html: buildEmailHtml(payload),
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
