"use client";

import { useEffect, useRef } from "react";

/**
 * A thin acid-green line at the very top that fills as you scroll. Minimal,
 * modern, and reads purely as progress — no clutter.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const bar = barRef.current;
      if (bar) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.transform = `scaleX(${p})`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-acid"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
