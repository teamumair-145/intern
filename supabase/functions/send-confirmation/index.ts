import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { full_name, email, track, duration } = await req.json();

    if (!full_name || !email || !track || !duration) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trackLabels: Record<string, string> = {
      "machine-learning": "Machine Learning",
      "data-analytics": "Data Analytics",
      "frontend-dev": "Front-End Web Development",
      "nlp": "Natural Language Processing (NLP)",
      "ui-ux": "UI/UX Design",
    };

    const durationLabels: Record<string, string> = {
      "2-weeks": "2 Weeks",
      "1-month": "1 Month",
    };

    const trackLabel = trackLabels[track] || track;
    const durationLabel = durationLabels[duration] || duration;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - Live Pakistan</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0a0a0a;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#f5c518;border-radius:8px;padding:8px 14px;display:inline-block;">
                    <span style="color:#0a0a0a;font-size:20px;font-weight:900;letter-spacing:1px;">LP</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.5px;">LIVE PAKISTAN</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Yellow accent bar -->
          <tr>
            <td style="background-color:#f5c518;height:4px;"></td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#0a0a0a;line-height:1.2;">Application Received!</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#666666;">We're thrilled to hear from you.</p>

              <p style="margin:0 0 20px;font-size:16px;color:#1a1a1a;line-height:1.6;">
                Dear <strong>${full_name}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#444444;line-height:1.7;">
                Thank you for applying to the <strong>Live Pakistan Internship Program</strong>! We have successfully received your application and are excited to review it.
              </p>

              <!-- Application Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;border-radius:10px;border-left:4px solid #f5c518;margin:24px 0;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#888888;letter-spacing:1px;text-transform:uppercase;">Application Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#666666;width:140px;">Track</td>
                        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${trackLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#666666;">Duration</td>
                        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${durationLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.7;">
                Our team will carefully review your application shortly. If your profile matches our requirements, we will reach out to you with the next steps.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#444444;line-height:1.7;">
                In the meantime, feel free to visit our website at <a href="https://www.livepakistan.pk" style="color:#f5c518;font-weight:600;text-decoration:none;">www.livepakistan.pk</a> to learn more about our programs.
              </p>

              <!-- CTA -->
              <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;font-weight:600;">Keep learning. Keep building.</p>
              <p style="margin:0;font-size:14px;color:#888888;">Best regards,<br><strong style="color:#1a1a1a;">The Live Pakistan Team</strong></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8f8;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;line-height:1.6;">
                This is an automated email. Please do not reply to this message.<br>
                &copy; 2025 Live Pakistan. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer re_XH2NPVmH_N6m9TAWin61J7rjCRXrRwqcT`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Live Pakistan <livepakistan@careergpt.site>",
        to: [email],
        subject: "Application Received - Live Pakistan Internship Program",
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend error:", errBody);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errBody }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await resendRes.json();

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
