"use client";

import { useEffect, useRef } from "react";
import { FONT_VARS } from "@/lib/fonts";

/**
 * A horizontal band that fills the space between sections with items that
 * gently drift, bounce off the band's edges (so they "only stay between those
 * segments") and flee the cursor/touch when it's over the band. Self-contained
 * physics via a single rAF loop, paused when the band is off-screen.
 *
 * Pass `logos` (filenames in /public/logos) to bounce client logos, or `words`
 * to bounce text. If logos are present they win; otherwise it falls back to
 * the words (handy before any logo files have been added).
 */
export default function BouncyBand({ words = [], logos = [], className = "" }) {
  const useImages = logos.length > 0;
  const items = useImages ? logos : words;

  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const particles = useRef([]);
  const pointer = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = containerRef.current;
    if (!el) return;

    const init = () => {
      const { width, height } = el.getBoundingClientRect();
      const valid = nodesRef.current.filter(Boolean);
      const n = valid.length || 1;
      // Grid sized to the actual space and a *typical* item width (median), so
      // one unusually wide logo doesn't collapse the whole grid to one column.
      // The collision pass handles any minor overflow from the widest items.
      const widths = valid
        .map((node) => node.offsetWidth || 50)
        .sort((a, b) => a - b);
      const medW = widths[Math.floor(widths.length / 2)] || 60;
      const gap = 14;
      const cols = Math.max(1, Math.min(n, Math.floor(width / (medW + gap))));
      const rows = Math.ceil(n / cols);
      const cellW = width / cols;
      const cellH = height / rows;
      let i = 0;
      particles.current = nodesRef.current.map((node) => {
        if (!node) return null;
        const w = node.offsetWidth;
        const h = node.offsetHeight;
        const idx = i++;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const jx = (Math.random() - 0.5) * Math.max(0, cellW - w) * 0.5;
        const jy = (Math.random() - 0.5) * Math.max(0, cellH - h) * 0.5;
        const x = Math.max(
          0,
          Math.min(width - w, col * cellW + (cellW - w) / 2 + jx)
        );
        const y = Math.max(
          0,
          Math.min(height - h, row * cellH + (cellH - h) / 2 + jy)
        );
        return {
          node,
          w,
          h,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        };
      });
    };
    init();

    // Logos report width/height only once loaded, so re-init when they do.
    const imgs = useImages
      ? nodesRef.current.filter((n) => n && n.tagName === "IMG")
      : [];
    const onImgLoad = () => init();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImgLoad);
    });

    if (reduce) {
      particles.current.forEach((p) => {
        if (p) p.node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });
      return;
    }

    const setP = (x, y) => {
      const r = el.getBoundingClientRect();
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      pointer.current = { x: x - r.left, y: y - r.top, active: inside };
    };
    const onPointerMove = (e) => setP(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) setP(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    io.observe(el);

    const REPEL_R = 130;
    const FRICTION = 0.95;
    const MAX = 0.4;
    let raf = 0;
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min(40, now - last);
      last = now;
      if (visible) {
        const { width, height } = el.getBoundingClientRect();
        const p = pointer.current;
        const list = particles.current.filter(Boolean);

        // 1) Move each logo (cursor repulsion, friction, drift, integrate).
        list.forEach((pt) => {
          if (p.active) {
            const dx = pt.x + pt.w / 2 - p.x;
            const dy = pt.y + pt.h / 2 - p.y;
            const d = Math.hypot(dx, dy) || 0.001;
            if (d < REPEL_R) {
              const f = (1 - d / REPEL_R) * 0.85;
              pt.vx += (dx / d) * f;
              pt.vy += (dy / d) * f;
            }
          }
          pt.vx *= FRICTION;
          pt.vy *= FRICTION;
          const sp = Math.hypot(pt.vx, pt.vy);
          if (sp > MAX) {
            pt.vx = (pt.vx / sp) * MAX;
            pt.vy = (pt.vy / sp) * MAX;
          }
          if (sp < 0.03) {
            pt.vx += (Math.random() - 0.5) * 0.02;
            pt.vy += (Math.random() - 0.5) * 0.02;
          }
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
        });

        // 2) Resolve logo-vs-logo collisions so they never stick together:
        //    separate along the axis of least overlap (keeping a small gap)
        //    and swap that velocity component for an elastic rebound.
        const PAD = 12;
        for (let a = 0; a < list.length; a++) {
          for (let b = a + 1; b < list.length; b++) {
            const A = list[a];
            const B = list[b];
            const ox =
              Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x) + PAD;
            const oy =
              Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y) + PAD;
            if (ox > 0 && oy > 0) {
              if (ox < oy) {
                const sep = ox / 2;
                if (A.x + A.w / 2 < B.x + B.w / 2) {
                  A.x -= sep;
                  B.x += sep;
                } else {
                  A.x += sep;
                  B.x -= sep;
                }
                const t = A.vx;
                A.vx = B.vx;
                B.vx = t;
              } else {
                const sep = oy / 2;
                if (A.y + A.h / 2 < B.y + B.h / 2) {
                  A.y -= sep;
                  B.y += sep;
                } else {
                  A.y += sep;
                  B.y -= sep;
                }
                const t = A.vy;
                A.vy = B.vy;
                B.vy = t;
              }
            }
          }
        }

        // 3) Keep them inside the band (bounce off the walls) and render.
        list.forEach((pt) => {
          if (pt.x < 0) {
            pt.x = 0;
            pt.vx = Math.abs(pt.vx);
          } else if (pt.x + pt.w > width) {
            pt.x = width - pt.w;
            pt.vx = -Math.abs(pt.vx);
          }
          if (pt.y < 0) {
            pt.y = 0;
            pt.vy = Math.abs(pt.vy);
          } else if (pt.y + pt.h > height) {
            pt.y = height - pt.h;
            pt.vy = -Math.abs(pt.vy);
          }
          pt.node.style.transform = `translate3d(${pt.x.toFixed(
            1
          )}px, ${pt.y.toFixed(1)}px, 0)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
    };
  }, [useImages, items.length]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative z-10 mx-auto w-full max-w-6xl overflow-hidden px-6 ${className}`}
    >
      {items.map((item, i) =>
        useImages ? (
          <img
            key={item + i}
            ref={(node) => (nodesRef.current[i] = node)}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logos/${encodeURIComponent(item)}`}
            alt=""
            // Universal renders 75% bigger than the base; the rest are +50%.
            className={`absolute left-0 top-0 w-auto select-none object-contain ${
              /universal/i.test(item)
                ? "h-14 sm:h-[98px]"
                : "h-12 sm:h-[84px]"
            }`}
            style={{
              // Subtle, semi-transparent grey monochrome treatment.
              // (invert(0.6) flattens any logo to a mid-grey; opacity fades it.)
              filter: "brightness(0) invert(0.6)",
              opacity: 0.4,
              willChange: "transform",
            }}
          />
        ) : (
          <span
            key={item + i}
            ref={(node) => (nodesRef.current[i] = node)}
            className="absolute left-0 top-0 select-none whitespace-nowrap font-grotesk text-sm font-medium uppercase tracking-[0.2em] text-smoke/25 sm:text-base"
            style={{
              fontFamily: FONT_VARS[i % FONT_VARS.length],
              willChange: "transform",
            }}
          >
            {item}
          </span>
        )
      )}
    </div>
  );
}
