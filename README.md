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
- **Lead form submission**: posts to `/api/subscribe`, a Cloudflare Pages
  Function (see "Email funnel" below). **Only live on the Cloudflare deploy**
  of this site — the GitHub Pages mirror can't run server code at all, so the
  form will fail there once this is configured.

## Email funnel (sign up → PDF via email)

`functions/api/subscribe.js` is a Cloudflare Pages Function: server-side code
that runs at the same domain as the static site, so the form can `fetch("/api/subscribe")`
same-origin with no CORS setup. It sends the guide via
[Resend](https://resend.com), keeping the API key server-side only — it never
reaches the browser, unlike the `NEXT_PUBLIC_*` variables used elsewhere in
this project (those are safe to expose by design; a Resend key is not).

**Environment variables** (Cloudflare Pages → Project → Settings →
Environment variables — **not** `NEXT_PUBLIC_*`, these must stay server-only):

| Variable | Required | What it's for |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Secret key from [resend.com/api-keys](https://resend.com/api-keys). If a key was ever pasted into chat/a doc/a commit, rotate it (revoke + create new) before using it here. |
| `RESEND_FROM` | Yes | e.g. `Trendplates <hello@mail.trendplates.com>`. That address's domain must be verified in Resend first (Resend → Domains). A subdomain like `mail.trendplates.com` is the safer choice when the root domain already runs Google Workspace, since it avoids touching the existing MX/SPF records entirely. |
| `RESEND_REPLY_TO` | No | Where replies land. Defaults to `trendplates@gmail.com` if unset. |
| `PDF_PATH` | No | Site-relative path to the guide, defaults to `/downloads/tiktok-starter-guide.pdf`. Drop the real file at that path in `public/downloads/` (see the README there), or set this to a full external URL to host it elsewhere instead. |

Without `RESEND_API_KEY` / `RESEND_FROM` set, the function responds with a
clear 503 rather than silently pretending to succeed.

The event fired on a successful signup is centralised in `lib/analytics.js`
(`trackLead`), so every configured analytics tool below also receives it from
one call site.

## Analytics

Everything below is **opt-in via environment variables set at build time**.
Leave any of them unset and that tool simply never loads - no errors, no code
changes needed later, just add the variable and redeploy.

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container - manage GA4 / other tags without touching code again | [tagmanager.google.com](https://tagmanager.google.com) → container ID, format `GTM-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta (Facebook/Instagram) Pixel - retargeting, conversions, lookalikes | Meta Events Manager → Data Sources → your pixel → Settings |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel - conversion tracking, retargeting | TikTok Ads Manager → Assets → Events → Web Events |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog product analytics - autocapture, funnels, session replay | [posthog.com](https://posthog.com) project → Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Only needed if your PostHog project is EU-hosted | `https://eu.i.posthog.com` (defaults to the US host) |

**Where to set these:**
- **Cloudflare Pages**: Project → Settings → Environment variables → add each
  (Production, and Preview if you want them there too) → redeploy.
- **GitHub Pages mirror**: repo → Settings → Secrets and variables → Actions →
  add each as a repository **variable**, then reference it in
  `.github/workflows/deploy.yml`'s build step (see the comment there). Note
  this doesn't apply to the Resend variables above — GitHub Pages can't run
  the Function at all.

## Notes

- Colours are defined as `ink` (black), `paper` (off-white), `smoke` (grey) in
  `tailwind.config.js`.
- The grain + scanline overlays are pure CSS in `app/globals.css`.
