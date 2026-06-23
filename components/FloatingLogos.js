"use client";

import { useEffect, useRef } from "react";
import { CLIENTS } from "@/lib/content";
import { FONT_VARS } from "@/lib/fonts";

const REPEL_RADIUS = 150;
const REPEL_FORCE = 0.9;
const FRICTION = 0.94;
const MAX_SPEED = 0.45; // px/ms-ish, kept slow & ambient

/**
 * Client / artist logos that drift around the outer edges of the hero,
 * bounce off the walls, and flee the pointer, a living ecosystem framing
 * the logo. Positions are kept out of a central "safe zone" so they never
 * cover TRENDPLATES. Uses a single rAF loop writing transforms directly.
 *
 * `logos` is an array of filenames found in /public/logos (passed from the
 * server). When present they render as monochrome images; otherwise we fall
 * back to the text wordmarks in lib/content.js.
 */
export default function FloatingLogos({ pointerRef, logos = [] }) {
  const items = logos.length ? logos : CLIENTS;
  const useImages = logos.length > 0;
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const particles = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      const { width, height } = container.getBoundingClientRect();
      // Central safe zone (fraction of viewport) the logos avoid spawning into.
      const safeW = width * 0.52;
      const safeH = height * 0.42;
      const cx = width / 2;
      const cy = height / 2;

      particles.current = nodesRef.current.map((node) => {
        if (!node) return null;
        const w = node.offsetWidth;
        const h = node.offsetHeight;
        let x, y;
        let tries = 0;
        do {
          x = Math.random() * (width - w);
          y = Math.random() * (height - h);
          tries++;
        } while (
          tries < 30 &&
          Math.abs(x + w / 2 - cx) < safeW / 2 &&
          Math.abs(y + h / 2 - cy) < safeH / 2
        );
        return {
          node,
          w,
          h,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        };
      });
    };

    init();

    // Images report width/height only once loaded, so re-init when they do.
    const imgs = useImages
      ? nodesRef.current.filter((n) => n && n.tagName === "IMG")
      : [];
    const onImgLoad = () => init();
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onImgLoad);
    });

    if (prefersReduced) {
      // Place them statically and bail out of animation.
      particles.current.forEach((p) => {
        if (p) p.node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });
      return;
    }

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(40, now - last);
      last = now;
      const { width, height } = container.getBoundingClientRect();
      const rect = container.getBoundingClientRect();
      const p = pointerRef.current;

      particles.current.forEach((pt) => {
        if (!pt) return;

        // Pointer repulsion (convert viewport pointer to container space).
        if (p && p.active) {
          const px = p.x - rect.left;
          const py = p.y - rect.top;
          const dx = pt.x + pt.w / 2 - px;
          const dy = pt.y + pt.h / 2 - py;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < REPEL_RADIUS) {
            const f = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            pt.vx += (dx / dist) * f;
            pt.vy += (dy / dist) * f;
          }
        }

        pt.vx *= FRICTION;
        pt.vy *= FRICTION;

        // Clamp speed so the drift stays calm.
        const sp = Math.hypot(pt.vx, pt.vy);
        if (sp > MAX_SPEED) {
          pt.vx = (pt.vx / sp) * MAX_SPEED;
          pt.vy = (pt.vy / sp) * MAX_SPEED;
        }

        // Gentle constant drift so nothing ever fully stops.
        if (sp < 0.04) {
          pt.vx += (Math.random() - 0.5) * 0.02;
          pt.vy += (Math.random() - 0.5) * 0.02;
        }

        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;

        // Bounce off the edges.
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

        pt.node.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(
          1
        )}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
    };
  }, [pointerRef, useImages, items.length]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {items.map((item, i) =>
        useImages ? (
          <img
            key={item + i}
            ref={(el) => (nodesRef.current[i] = el)}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logos/${encodeURIComponent(item)}`}
            alt=""
            className="absolute left-0 top-0 h-7 w-auto select-none object-contain opacity-50 sm:h-9"
            style={{
              // Render any logo as a clean monochrome (off-white) silhouette
              // so it reads premium on black. Tweak/remove to keep originals.
              filter: "brightness(0) invert(1)",
              willChange: "transform",
            }}
          />
        ) : (
          <span
            key={item + i}
            ref={(el) => (nodesRef.current[i] = el)}
            className="label absolute left-0 top-0 whitespace-nowrap text-[0.6rem] text-smoke/40 sm:text-xs"
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
