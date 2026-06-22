# Client / artist logos

Drop logo image files directly into this folder and they'll automatically
appear floating in the hero background - no code changes needed. Just refresh
(or redeploy).

**Supported formats:** `.png`, `.svg`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`

**Best results:**
- Use logos with a **transparent background** (PNG or SVG).
- They're rendered as clean off-white silhouettes to stay on-brand (monochrome).
  To keep original colours instead, remove the `filter` line in
  `components/FloatingLogos.js`.
- Any size works; they're scaled to a small uniform height automatically.

When this folder has no images, the site falls back to the text wordmarks
defined in `lib/content.js` (`CLIENTS`).
