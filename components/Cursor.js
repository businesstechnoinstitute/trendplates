"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop pointer treatment: a small green dot that trails the cursor
 * (no ring/circle, no glow/halo). Hidden on touch devices. Disabled under
 * reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!hasFinePointer || prefersReduced) return;

    const dot = dotRef.current;

    const onMove = (e) => {
      if (dot) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-1.5 w-1.5 rounded-full bg-acid [@media(pointer:fine)]:block"
      style={{
        marginLeft: "-3px",
        marginTop: "-3px",
        transform: "translate3d(-600px, -600px, 0)",
      }}
    />
  );
}
