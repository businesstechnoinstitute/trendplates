"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { FONT_VARS } from "@/lib/fonts";

const WORD = "TRENDPLATES";

const REPEL_RADIUS = 195; // px: how close the pointer gets before letters flee
const REPEL_MAX = 88; // px: max displacement (knocked further out of the way)
const EASE = 0.16; // lerp factor for the spring-like return
const IDLE_AMP = 6; // px: gentle "alive" drift each letter has at rest
const IDLE_SPEED = 0.0011; // radians/ms for the idle drift

// Visual family of each font, so we can bias swaps toward a *different* family
// (serif / mono / display vs sans) and make each morph clearly noticeable.
const FAMILY = {
  "var(--font-space-grotesk)": "sans",
  "var(--font-inter)": "sans",
  "var(--font-archivo)": "sans",
  "var(--font-playfair)": "serif",
  "var(--font-space-mono)": "mono",
  "var(--font-bricolage)": "display",
  "var(--font-syne)": "display2",
};

function randomFont(exclude) {
  // ~70% of the time, jump to a different type family so the change reads.
  let pool = FONT_VARS;
  if (exclude && Math.random() < 0.7) {
    const exFam = FAMILY[exclude];
    const diff = FONT_VARS.filter((f) => FAMILY[f] !== exFam);
    if (diff.length) pool = diff;
  }
  let f = pool[Math.floor(Math.random() * pool.length)];
  if (f === exclude && FONT_VARS.length > 1) {
    const others = FONT_VARS.filter((v) => v !== exclude);
    f = others[Math.floor(Math.random() * others.length)];
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
  const h1Ref = useRef(null);

  // Fixed width (in em) per letter so swapping fonts never reflows the layout
  // and the logo stops "popping". Slots are sized to the base font so the word
  // keeps tight, on-brand spacing (the widest fonts spill a touch, which reads
  // as part of the morph rather than padding the whole logo out).
  const [slots, setSlots] = useState(null);

  // Reset the element registry each render; ref callbacks repopulate on commit.
  charEls.current = [];

  useLayoutEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;

    const measure = () => {
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:absolute;visibility:hidden;white-space:pre;pointer-events:none;";
      h1.appendChild(probe);
      const fs = parseFloat(getComputedStyle(h1).fontSize) || 16;
      probe.style.fontFamily = FONT_VARS[0]; // measure in the base font
      const ems = WORD.split("").map((ch) => {
        probe.textContent = ch;
        return probe.offsetWidth / fs; // store in em so it scales responsively
      });
      h1.removeChild(probe);
      setSlots(ems);
    };

    measure();
    // Re-measure once web fonts have loaded (fallback metrics differ).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, []);

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
      // 2–4 distinct random letters change this tick.
      const count = Math.min(total, 2 + Math.floor(Math.random() * 3));
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

    const loop = (now) => {
      const p = pointerRef.current;
      const els = charEls.current;

      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const o = offsets.current[i] || (offsets.current[i] = { x: 0, y: 0 });

        // Gentle idle drift so the letters feel alive without any input
        // (especially on mobile, where there's no hovering cursor).
        const idleX = Math.sin(now * IDLE_SPEED + i * 0.7) * IDLE_AMP;
        const idleY = Math.cos(now * IDLE_SPEED * 0.85 + i * 1.3) * IDLE_AMP;

        let rx = 0;
        let ry = 0;

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
            rx = (dx / dist) * eased * REPEL_MAX;
            ry = (dy / dist) * eased * REPEL_MAX;
          }
        }

        o.x += (rx + idleX - o.x) * EASE;
        o.y += (ry + idleY - o.y) * EASE;
        // Scale/rotation track the repulsion only, so idle drift stays a calm
        // translate and never makes the logo pulse.
        const liveForce = Math.min(1, Math.hypot(rx, ry) / REPEL_MAX) || 0;
        const scale = 1 + liveForce * 0.16;
        const rot = (rx / REPEL_MAX) * 6;

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
      ref={h1Ref}
      aria-label="Trendplates"
      className="touch-none select-none whitespace-nowrap text-center font-grotesk font-bold uppercase leading-[0.9] tracking-tight"
      style={{ fontSize: "clamp(2rem, 10.5vw, 10.5rem)" }}
    >
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          ref={setCharRef(i)}
          className="morph-char"
          style={{
            fontFamily: fonts[i] || FONT_VARS[0],
            ...(slots
              ? {
                  width: `${slots[i]}em`,
                  textAlign: "center",
                }
              : null),
          }}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}
