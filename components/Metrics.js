"use client";

import { useEffect, useRef, useState } from "react";
import { METRICS } from "@/lib/content";

function formatNumber(n) {
  return Math.round(n).toLocaleString("en-US");
}

// Counts from 0 to `to` once the element scrolls into view.
function useCountUp(to) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutExpo for a fast-then-settle feel
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setValue(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return [ref, value];
}

function Metric({ to, suffix, label }) {
  const [ref, value] = useCountUp(to);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-6xl font-bold leading-none tracking-tight text-paper [font-variant-numeric:tabular-nums] sm:text-8xl lg:text-9xl">
        {formatNumber(value)}
        <span className="text-acid">{suffix}</span>
      </div>
      <p className="mx-auto mt-6 max-w-[26ch] text-sm leading-snug text-smoke sm:text-base">
        {label}
      </p>
    </div>
  );
}

export default function Metrics() {
  return (
    <section
      id="proof"
      className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32"
    >
      <p className="label mb-12 text-xs text-smoke sm:text-sm">The receipts</p>
      <div className="flex flex-col items-center gap-16">
        {METRICS.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
      </div>
    </section>
  );
}
