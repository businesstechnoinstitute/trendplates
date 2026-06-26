"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop pointer treatment: an acid-green ring with a neon glow plus a small
 * green dot that trail the cursor. Hidden on touch devices. Disabled under
 * reduced motion.
 */
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!hasFinePointer || prefersReduced) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    // Start off-screen so nothing is parked in a corner before the first move.
    let rx = -600;
    let ry = -600;
    let tx = -600;
    let ty = -600;
    let raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot) dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-10 w-10 rounded-full border border-acid/70 [@media(pointer:fine)]:block"
        style={{
          marginLeft: "-20px",
          marginTop: "-20px",
          transform: "translate3d(-600px, -600px, 0)",
          boxShadow: "0 0 14px rgba(198,255,58,0.45)",
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-1.5 w-1.5 rounded-full bg-acid [@media(pointer:fine)]:block"
        style={{
          marginLeft: "-3px",
          marginTop: "-3px",
          transform: "translate3d(-600px, -600px, 0)",
        }}
      />
    </>
  );
}
