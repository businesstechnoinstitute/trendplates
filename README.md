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

Push to GitHub and import into [Vercel](https://vercel.com) - zero config.
(It's a static-friendly Next.js app, so Netlify / any Node host works too.)

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
- **Lead form submission**: `components/LeadMagnet.js` has a `TODO` where the
  fake submit lives - wire it to Mailchimp / ConvertKit / Klaviyo or a Next.js
  `/api` route.

## Notes

- Colours are defined as `ink` (black), `paper` (off-white), `smoke` (grey) in
  `tailwind.config.js`.
- The grain + scanline overlays are pure CSS in `app/globals.css`.
