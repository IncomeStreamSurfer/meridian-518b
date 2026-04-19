import type { APIRoute } from 'astro';
import { getSupabaseAdmin, TABLES } from '../../lib/supabase';
import { sendEmail, welcomeEmailHtml } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  const emailRaw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'unknown';

  if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (emailRaw.length > 200) {
    return json({ error: 'Email looks too long.' }, 400);
  }

  try {
    const supabase = getSupabaseAdmin();
    const ua = (request.headers.get('user-agent') || '').slice(0, 240);
    const { error } = await supabase
      .from(TABLES.waitlist)
      .upsert(
        { email: emailRaw, source, user_agent: ua },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('[subscribe] supabase error', error.message);
      return json({ error: 'We could not save your email. Please try again shortly.' }, 500);
    }
  } catch (err: any) {
    console.error('[subscribe] unexpected', err?.message);
    return json({ error: 'We could not save your email. Please try again shortly.' }, 500);
  }

  // Fire welcome email (non-blocking for UX — we still return success if it fails).
  sendEmail({
    to: emailRaw,
    subject: "You're on the Meridian list ✶",
    html: welcomeEmailHtml(emailRaw),
  }).then((r) => {
    if (!r.ok) console.warn('[subscribe] welcome email failed:', r.error);
  }).catch((e) => console.warn('[subscribe] welcome email threw:', e?.message));

  return json({ ok: true });
};

export const GET: APIRoute = () => json({ error: 'Use POST' }, 405);
