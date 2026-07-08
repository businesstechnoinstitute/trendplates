"use client";

import { useEffect } from "react";

/**
 * Inertia / momentum scrolling (Lenis) — the single biggest "modern, expensive
 * site" feel upgrade. It scrolls the real page, so window.scrollY stays
 * accurate and every existing scroll-driven effect (RepelText, reveals,
 * IntersectionObservers) keeps working. Disabled under reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis;
    let raf;
    let cancelled = false;

    const onAnchorClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target && lenis) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0 });
        }
      }
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
      window.__lenis = lenis;
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      document.addEventListener("click", onAnchorClick);

      // Recompute the scroll limit once async content (web fonts, the logo-band
      // images) has settled and can change the page height after init.
      const resize = () => lenis && lenis.resize();
      window.addEventListener("load", resize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(resize).catch(() => {});
      }
      setTimeout(resize, 600);
      setTimeout(resize, 1500);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
