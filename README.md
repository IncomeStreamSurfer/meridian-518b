# Meridian — Specialty Coffee, Coming Soon

A pre-launch landing site for **Meridian**, a specialty coffee brand built around traceable single-origin sourcing and editorial-grade brand design.

## What's built

- **Astro 5 (server output) + Tailwind v4 + @astrojs/vercel + @astrojs/sitemap**
- **3 pages** — home (hero + manifesto + origins + ritual + closing CTA), `/our-story` (founders' manifesto + pull-quote + principles), `/thanks` (dark confirmation page + share block + next-steps)
- **Email capture wired to Supabase** — POST `/api/subscribe` → `meridian_waitlist` upsert + welcome email via Resend (non-blocking)
- **SEO hard-coded** — per-page `<SEOHead>` with title/meta/OG/Twitter/canonical + JSON-LD (Organization, WebSite, AboutPage, WebPage, BreadcrumbList), `/robots.txt` referencing `/sitemap-index.xml`
- **Editorial dark/light aesthetic** — cream/paper base with espresso ink + amber (Meridian ember) accent. Fraunces display + Inter body via Google Fonts CDN. Grain texture overlay.
- **Shared Nav + Footer + EmailCapture** (dark/light variants)

## Stack

| | |
|---|---|
| Frontend | Astro 5, Tailwind v4 |
| Data     | Supabase (`meridian_waitlist`, `meridian_content`) |
| Email    | Resend (`onboarding@resend.dev` — swap to verified domain before launch) |
| Hosting  | Vercel (server runtime) |

## Local dev

```bash
npm install --legacy-peer-deps
cp .env.example .env
# fill in Supabase + Resend values
npm run dev
```

## Environment variables

See `.env.example`.

## Next steps

1. Verify a real sending domain in Resend and swap `RESEND_FROM_EMAIL`.
2. Connect a custom domain in Vercel and update `PUBLIC_SITE_URL`.
3. Harbor's writer will publish launch articles into `meridian_content`.
