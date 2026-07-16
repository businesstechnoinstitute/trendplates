// Cloudflare Pages Function: POST /api/subscribe
//
// Captures a lead-magnet signup and emails the PDF via Resend. Runs
// server-side only (Cloudflare's edge), so the Resend API key never reaches
// the browser — unlike everything else in this static-exported site.
//
// Required environment variables (set in Cloudflare Pages dashboard ->
// Settings -> Environment variables, NOT as NEXT_PUBLIC_*):
//   RESEND_API_KEY   - secret. From resend.com/api-keys. Never commit this,
//                       never put it in a NEXT_PUBLIC_ var.
//   RESEND_FROM      - e.g. "Trendplates <hello@mail.trendplates.com>".
//                       The address/domain must be verified in Resend first.
// Optional:
//   RESEND_REPLY_TO  - where replies should land. Defaults to
//                       trendplates@gmail.com below if unset.
//   PDF_PATH         - site-relative path to the PDF, e.g.
//                       "/downloads/tiktok-starter-guide.pdf". Defaults to
//                       that same path. Drop the real file into
//                       public/downloads/ with that exact name, or override
//                       this env var to point at an externally-hosted file.

const DEFAULT_REPLY_TO = "trendplates@gmail.com";
const DEFAULT_PDF_PATH = "/downloads/tiktok-starter-guide.pdf";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailHtml({ name, downloadUrl }) {
  const greeting = name ? `Hey ${name.split(" ")[0]},` : "Hey,";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="background:#0a0a0a;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" style="max-width:90%;background:#111;border:1px solid #262626;border-radius:16px;padding:32px;">
            <tr>
              <td style="color:#8a8a86;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding-bottom:16px;">
                Trendplates
              </td>
            </tr>
            <tr>
              <td style="color:#f2f0ea;font-size:22px;font-weight:700;padding-bottom:12px;">
                ${greeting}
              </td>
            </tr>
            <tr>
              <td style="color:#c9c9c6;font-size:15px;line-height:1.5;padding-bottom:24px;">
                Here's The Ultimate Music Artist TikTok Starter Guide and Checklist,
                the exact framework and pre-post checklist we run on every clip we
                publish for dance music artists and labels.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <a href="${downloadUrl}"
                   style="display:inline-block;background:#c6ff3a;color:#0a0a0a;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:999px;">
                  Download the guide
                </a>
              </td>
            </tr>
            <tr>
              <td style="color:#6b6b68;font-size:12px;line-height:1.5;">
                Just reply to this email if you want to talk, we read every reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const email = (body.email || "").trim();
  const name = (body.name || "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: "A valid email is required" }, 400);
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
    // Not configured yet. Fail clearly rather than pretending it worked.
    return json(
      { error: "Email sending isn't configured yet on the server." },
      503
    );
  }

  const origin = new URL(request.url).origin;
  const pdfPath = env.PDF_PATH || DEFAULT_PDF_PATH;
  const downloadUrl = pdfPath.startsWith("http")
    ? pdfPath
    : `${origin}${pdfPath}`;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [email],
      reply_to: env.RESEND_REPLY_TO || DEFAULT_REPLY_TO,
      subject: "Your TikTok Starter Guide from Trendplates",
      html: emailHtml({ name, downloadUrl }),
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    return json({ error: "Failed to send email", detail }, 502);
  }

  return json({ ok: true });
}

export async function onRequestGet() {
  return json({ error: "Method not allowed" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
