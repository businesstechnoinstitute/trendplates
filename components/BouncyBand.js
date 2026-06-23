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
      particles.current = nodesRef.current.map((node) => {
        if (!node) return null;
        const w = node.offsetWidth;
        const h = node.offsetHeight;
        return {
          node,
          w,
          h,
          x: Math.random() * Math.max(1, width - w),
          y: Math.random() * Math.max(1, height - h),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
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
        particles.current.forEach((pt) => {
          if (!pt) return;
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
            className="absolute left-0 top-0 h-8 w-auto select-none object-contain opacity-70 sm:h-10"
            style={{
              // Clean monochrome (off-white) silhouette to stay on-brand.
              // Remove this filter line to keep the logos' original colours.
              filter: "brightness(0) invert(1)",
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
