# Trend Plates

A sleek, monochrome, highly interactive one-page site for **Trend Plates** - a
boutique AI, Creative, Organic, Social & Digital agency helping music break
through naturally.

Built with **Next.js (App Router)**, **Tailwind CSS**, and **Framer Motion**.
The signature interactions (font morphing + cursor repulsion + floating logos)
are custom requestAnimationFrame physics - no GSAP / Matter.js needed.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

## Deploy

This is a static export (`output: "export"` in `next.config.mjs`) so it can be
hosted anywhere that serves static files.

- **Cloudflare Pages** (primary): connect the repo, build command
  `npm run build`, output directory `out`. Leave `PAGES_BASE_PATH` unset so
  assets resolve at the domain root.
- **GitHub Pages** (mirror, auto-deploys via `.github/workflows/deploy.yml`):
  every push to `main` builds and publishes to
  `https://<user>.github.io/<repo>/`. This one needs `PAGES_BASE_PATH` set to
  `/<repo>` (the workflow does this automatically).

## The signature effects

| Feature | Where |
| --- | --- |
| Scanner-Darkly font morphing (one letter at a time, on `TRENDPLATES`) | `components/MorphingLogo.js` |
| Cursor / touch letter repulsion + distortion | `components/MorphingLogo.js` |
| Cycling descriptor under the logo | `components/Descriptors.js` |
| Push-away ("repel") body text, reusable | `components/RepelText.js` |
| Viral-marketing description using the repel effect | `components/ViralStatement.js` |
| Floating client logos / wordmarks (drift, bounce, flee cursor) | `components/FloatingLogos.js` |
| Trailing cursor ring | `components/Cursor.js` |
| Lead-magnet form | `components/LeadMagnet.js` |

All effects respect `prefers-reduced-motion`.

## Customise

**Client logos:** drop image files into **`public/logos/`** and they appear in
the floating background automatically (see `public/logos/README.md`). With no
images there, the site falls back to the text wordmarks in `lib/content.js`
(`CLIENTS`).

Other content in **`lib/content.js`**:

- `DESCRIPTORS` - the words that cycle under the logo.
- `CLIENTS` - text wordmarks used only when `public/logos/` is empty.

Other quick edits:

- **Fonts** in the morph cycle: `lib/fonts.js` (add/remove Google fonts).
- **Morph speed**: the `setTimeout(tick, …)` interval in `MorphingLogo.js`.
- **Logo repulsion feel**: `REPEL_RADIUS` / `REPEL_MAX` / `EASE` in `MorphingLogo.js`.
- **Description copy + its repel feel**: `components/ViralStatement.js`
  (`radius` / `max` props on `<RepelText>`).
- **Lead form submission**: wired to ConvertKit (see "Analytics & lead
  capture" below). Until the env vars are set, it simulates success so the
  form still demos cleanly.

## Analytics & lead capture

Everything below is **opt-in via environment variables set at build time**.
Leave any of them unset and that tool simply never loads - no errors, no code
changes needed later, just add the variable and redeploy.

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_CONVERTKIT_FORM_ID` | Delivers the PDF/checklist automatically on signup | ConvertKit (Kit) → the form's embed code |
| `NEXT_PUBLIC_CONVERTKIT_API_KEY` | Same as above (pairs with the Form ID) | ConvertKit → Account Settings → Advanced → **API Key** (not "API Secret" - the API Key is the one meant to be used in the browser, same as ConvertKit's own embeddable forms) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container - manage GA4 / other tags without touching code again | [tagmanager.google.com](https://tagmanager.google.com) → container ID, format `GTM-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta (Facebook/Instagram) Pixel - retargeting, conversions, lookalikes | Meta Events Manager → Data Sources → your pixel → Settings |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel - conversion tracking, retargeting | TikTok Ads Manager → Assets → Events → Web Events |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog product analytics - autocapture, funnels, session replay | [posthog.com](https://posthog.com) project → Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Only needed if your PostHog project is EU-hosted | `https://eu.i.posthog.com` (defaults to the US host) |

**Why ConvertKit specifically:** its forms are purpose-built to deliver a
"content upgrade" (this PDF) automatically the moment someone subscribes - no
extra automation to build. Swapping to Klaviyo/MailerLite later just means
changing the fetch call in `components/LeadMagnet.js` to that provider's
subscribe endpoint; the rest of the form is untouched.

**Where to set these:**
- **Cloudflare Pages**: Project → Settings → Environment variables → add each
  (Production, and Preview if you want them there too) → redeploy.
- **GitHub Pages mirror**: repo → Settings → Secrets and variables → Actions →
  add each as a repository **variable**, then reference it in
  `.github/workflows/deploy.yml`'s build step (see the comment there).

The event fired on a successful signup is centralised in `lib/analytics.js`
(`trackLead`), so every configured tool receives it from one call site.

## Notes

- Colours are defined as `ink` (black), `paper` (off-white), `smoke` (grey) in
  `tailwind.config.js`.
- The grain + scanline overlays are pure CSS in `app/globals.css`.
