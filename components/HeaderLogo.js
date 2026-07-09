"use client";

import { FONT_VARS } from "@/lib/fonts";

const WORD = "TRENDPLATES";

// Same curated jumbled arrangement used for the exported logo files
// (public/brand/trendplates-logo.png / .svg), so the nav wordmark and the
// downloadable logo stay visually consistent. Static (no cursor repel, no
// cycling) since it's small and sits above scrolling content.
const ASSIGN = [3, 0, 6, 1, 4, 2, 5, 6, 3, 1, 4];

function scrollToTop() {
  if (typeof window === "undefined") return;
  if (window.__lenis) window.__lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function HeaderLogo() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Trendplates, back to top"
      className="select-none whitespace-nowrap text-left font-display text-lg font-bold uppercase leading-none tracking-tight text-paper transition-opacity hover:opacity-80 sm:text-xl"
    >
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          style={{ fontFamily: FONT_VARS[ASSIGN[i % ASSIGN.length]] }}
        >
          {ch}
        </span>
      ))}
    </button>
  );
}
