"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Renders text per-character with the same cursor/touch "push away" repulsion
 * as the logo. Self-contained: it owns its own pointer listener (no shared
 * ref needed) and caches rest positions in document coordinates so it stays
 * correct through scrolling without re-measuring every frame.
 */
export default function RepelText({
  text,
  className = "",
  radius = 130,
  max = 34,
}) {
  const charEls = useRef([]);
  const base = useRef([]); // index -> { x, y } in document coordinates
  const offsets = useRef([]); // index -> { x, y } currently applied
  const pointer = useRef({ x: -9999, y: -9999, active: false });

  // Reset registry each render; ref callbacks repopulate on commit.
  charEls.current = [];

  const measure = () => {
    charEls.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const o = offsets.current[i] || (offsets.current[i] = { x: 0, y: 0 });
      base.current[i] = {
        x: r.left + r.width / 2 + window.scrollX - o.x,
        y: r.top + r.height / 2 + window.scrollY - o.y,
      };
    });
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Re-measure once web fonts have settled (glyph widths change positions).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const set = (x, y) => {
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.active = true;
    };
    const onPointerMove = (e) => set(e.clientX, e.clientY);
    const onLeave = () => {
      pointer.current.active = false;
    };
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) set(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      setTimeout(() => {
        pointer.current.active = false;
      }, 120);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let raf = 0;
    const loop = () => {
      const p = pointer.current;
      const sx = window.scrollX;
      const sy = window.scrollY;
      const els = charEls.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const b = base.current[i];
        if (!el || !b) continue;
        const o = offsets.current[i] || (offsets.current[i] = { x: 0, y: 0 });

        let tx = 0;
        let ty = 0;
        if (p.active && !prefersReduced) {
          const dx = b.x - (p.x + sx);
          const dy = b.y - (p.y + sy);
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < radius) {
            const f = 1 - dist / radius;
            const eased = f * f;
            tx = (dx / dist) * eased * max;
            ty = (dy / dist) * eased * max;
          }
        }
        o.x += (tx - o.x) * 0.16;
        o.y += (ty - o.y) * 0.16;
        el.style.transform = `translate3d(${o.x.toFixed(2)}px, ${o.y.toFixed(
          2
        )}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [radius, max]);

  let gi = 0;
  const words = text.split(" ");

  return (
    <p aria-label={text} className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 ? " " : null}
          <span
            aria-hidden="true"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.split("").map((ch, ci) => {
              const idx = gi++;
              return (
                <span
                  key={ci}
                  ref={(el) => {
                    if (el) charEls.current[idx] = el;
                  }}
                  style={{ display: "inline-block", willChange: "transform" }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
