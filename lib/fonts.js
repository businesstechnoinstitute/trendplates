import {
  Space_Grotesk,
  Inter,
  Archivo,
  Archivo_Black,
  Archivo_Narrow,
  Playfair_Display,
  Space_Mono,
  Bricolage_Grotesque,
  Syne,
  Unbounded,
} from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

// Display face for headings/nav/CTAs sitewide (not part of the hero morph
// cycle) — bold, geometric, more rave-poster than "SaaS template" like the
// previous Space Grotesk default.
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

// Google Fonts (free, open license) spotted on lgrp.co — available as
// font-archivo-black / font-archivo-narrow. Archivo Narrow now powers the
// site's `.label` eyebrow/kicker text (see globals.css); Archivo Black is
// loaded and ready for a bold single-word emphasis moment if wanted.
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

// CSS variables, in the order the morph effect can cycle through them.
export const FONT_VARS = [
  "var(--font-space-grotesk)",
  "var(--font-inter)",
  "var(--font-archivo)",
  "var(--font-playfair)",
  "var(--font-space-mono)",
  "var(--font-bricolage)",
  "var(--font-syne)",
];

export const fontVariables = [
  spaceGrotesk.variable,
  inter.variable,
  archivo.variable,
  playfair.variable,
  spaceMono.variable,
  bricolage.variable,
  syne.variable,
  unbounded.variable,
  archivoBlack.variable,
  archivoNarrow.variable,
].join(" ");
