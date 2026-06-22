"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FONT_VARS } from "@/lib/fonts";

const WORD = "TRENDPLATES";

const REPEL_RADIUS = 195; // px: how close the pointer gets before letters flee
const REPEL_MAX = 88; // px: max displacement (knocked further out of the way)
const EASE = 0.16; // lerp factor for the spring-like return

function randomFont(exclude) {
  let f = FONT_VARS[Math.floor(Math.random() * FONT_VARS.length)];
  if (FONT_VARS.length > 1) {
    while (f === exclude) {
      f = FONT_VARS[Math.floor(Math.random() * FONT_VARS.length)];
    }
  }
  return f;
}

// Deterministic on first paint so server and client markup match (no
// hydration mismatch). Randomisation happens after mount, in an effect.
function baseFontArray(len) {
  return Array.from({ length: len }, () => FONT_VARS[0]);
}

/**
 * The signature element: TRENDPLATES rendered per-character, with
 *  - continuous one-letter-at-a-time font morphing (Scanner Darkly feel),
 *  - pointer/touch repulsion driven by a shared rAF loop.
 *
 * The word itself never changes, only the typefaces morph.
 *
 * `pointerRef` is { current: { x, y, active } } in viewport coordinates,
 * owned by the Hero so the floating logos can share the same pointer.
 */
export default function MorphingLogo({ pointerRef }) {
  const [fonts, setFonts] = useState(() => baseFontArray(WORD.length));

  const charEls = useRef([]); // index -> element
  const offsets = useRef({}); // index -> { x, y }
  const rafRef = useRef(0);

  // Reset the element registry each render; ref callbacks repopulate on commit.
  charEls.current = [];

  // After mount, scatter the fonts so the logo looks "reassembled" right away
  // (kept out of the initial render to avoid a hydration mismatch).
  useEffect(() => {
    setFonts((arr) => arr.map((f) => randomFont(f)));
  }, []);

  // ---- Continuous font morphing: a few random letters swap each tick,
  //      instantly (no fade/blink), never the whole word at once. ----
  useEffect(() => {
    let timers = [];
    const total = WORD.length;

    const tick = () => {
      // 1–3 distinct random letters change this tick.
      const count = Math.min(total, 1 + Math.floor(Math.random() * 3));
      const ids = new Set();
      while (ids.size < count) {
        ids.add(Math.floor(Math.random() * total));
      }

      setFonts((arr) => arr.map((f, i) => (ids.has(i) ? randomFont(f) : f)));

      timers.push(setTimeout(tick, 220 + Math.random() * 380));
    };

    timers.push(setTimeout(tick, 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  // ---- Pointer repulsion loop ----
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const loop = () => {
      const p = pointerRef.current;
      const els = charEls.current;

      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const o = offsets.current[i] || (offsets.current[i] = { x: 0, y: 0 });

        let tx = 0;
        let ty = 0;

        if (p && p.active) {
          const rect = el.getBoundingClientRect();
          // Recover the rest position by subtracting the offset we applied.
          const baseX = rect.left + rect.width / 2 - o.x;
          const baseY = rect.top + rect.height / 2 - o.y;
          const dx = baseX - p.x;
          const dy = baseY - p.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < REPEL_RADIUS) {
            const force = 1 - dist / REPEL_RADIUS;
            const eased = force * force; // softer near the edge
            tx = (dx / dist) * eased * REPEL_MAX;
            ty = (dy / dist) * eased * REPEL_MAX;
          }
        }

        o.x += (tx - o.x) * EASE;
        o.y += (ty - o.y) * EASE;
        const liveForce = Math.min(1, Math.hypot(o.x, o.y) / REPEL_MAX) || 0;
        const scale = 1 + liveForce * 0.16;
        const rot = (o.x / REPEL_MAX) * 6;

        el.style.transform = `translate3d(${o.x.toFixed(2)}px, ${o.y.toFixed(
          2
        )}px, 0) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pointerRef]);

  const setCharRef = useCallback(
    (index) => (el) => {
      if (el) charEls.current[index] = el;
    },
    []
  );

  return (
    <h1
      aria-label="Trendplates"
      className="select-none whitespace-nowrap text-center font-grotesk font-bold uppercase leading-[0.9] tracking-tight"
      style={{ fontSize: "clamp(2rem, 12vw, 12rem)" }}
    >
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          ref={setCharRef(i)}
          className="morph-char"
          style={{ fontFamily: fonts[i] || FONT_VARS[0] }}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}
