const RESEND_API_KEY = import.meta.env.RESEND_API_KEY ?? '';
const FROM = import.meta.env.RESEND_FROM_EMAIL ?? 'Meridian <onboarding@resend.dev>';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return { ok: false, error: `Resend ${res.status}: ${txt.slice(0, 200)}` };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, id: json?.id };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'unknown send error' };
  }
}

export function welcomeEmailHtml(email: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4eee4;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1512;">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px;">
    <p style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#6b5d4f;margin:0 0 24px;">— Meridian Coffee Co.</p>
    <h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.1;font-weight:300;margin:0 0 16px;">You're on the list.</h1>
    <p style="font-size:16px;line-height:1.6;color:#2a1f18;margin:0 0 16px;">Hi — thanks for signing up to hear from Meridian. We're a small specialty coffee brand getting ready to open, and we're glad you're here before the doors are.</p>
    <p style="font-size:16px;line-height:1.6;color:#2a1f18;margin:0 0 16px;">Over the coming weeks you'll get the founders' letter, a tour of our first three origin lots, and early access to reserve a bag before general release. One email at a time. No spam.</p>
    <p style="font-size:16px;line-height:1.6;color:#2a1f18;margin:0 0 24px;">If you have a moment — hit reply and tell us how you take your coffee. We read every one.</p>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#c8862e;margin:0 0 4px;">— The Meridian team</p>
    <p style="font-size:12px;color:#6b5d4f;margin:32px 0 0;">You received this because you signed up at Meridian. You can reply to unsubscribe.</p>
  </div>
</body></html>`;
}
