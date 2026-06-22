import {
  Space_Grotesk,
  Inter,
  Archivo,
  Playfair_Display,
  Space_Mono,
  Bricolage_Grotesque,
  Syne,
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
].join(" ");
