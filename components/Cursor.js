"use client";

import { useEffect, useRef } from "react";

/**
 * A soft monochrome ring that trails the pointer on desktop, reinforcing the
 * "scanning" feel. Hidden on touch devices. Disabled under reduced motion.
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
    let rx = -100;
    let ry = -100;
    let tx = -100;
    let ty = -100;
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
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/40 [@media(pointer:fine)]:block"
        style={{ marginLeft: "-20px", marginTop: "-20px" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-1.5 w-1.5 rounded-full bg-paper [@media(pointer:fine)]:block"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      />
    </>
  );
}
