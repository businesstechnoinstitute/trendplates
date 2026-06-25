"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MorphingLogo from "./MorphingLogo";
import Descriptors from "./Descriptors";
import FloatingLogos from "./FloatingLogos";

export default function Hero({ logos = [] }) {
  // Shared pointer state in viewport coordinates, consumed by the logo and
  // the floating wordmarks via a ref (no re-renders on mouse move).
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const [hintVisible, setHintVisible] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const setPos = (x, y) => {
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      pointerRef.current.active = true;
    };

    const onPointerMove = (e) => setPos(e.clientX, e.clientY);
    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) {
        setPos(t.clientX, t.clientY);
        setHintVisible(false);
      }
    };
    const onTouchEnd = () => {
      // Let letters drift back once the finger lifts.
      setTimeout(() => {
        pointerRef.current.active = false;
      }, 120);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Hide the desktop hint once the user moves.
    const hideOnMove = () => setHintVisible(false);
    window.addEventListener("pointermove", hideOnMove, { once: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointermove", hideOnMove);
    };
  }, []);

  return (
    <section className="hero-cursor-none relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Depth: a soft glow behind the logo (faint green core, grey halo). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70vh] w-[120vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(198,255,58,0.06), rgba(255,255,255,0.03) 45%, transparent 72%)",
        }}
      />
      <FloatingLogos pointerRef={pointerRef} logos={logos} />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MorphingLogo pointerRef={pointerRef} />
        </motion.div>

        <Descriptors />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-center font-grotesk text-sm font-medium leading-snug text-paper/90 sm:mt-9 sm:text-lg"
        >
          Organic Growth Systems for Electronic Dance Music
        </motion.p>
      </div>

      <p className="sr-only">
        Trendplates is an organic growth agency for electronic and dance music,
        helping labels, artists, management, festivals and catalogue owners grow
        through organic social, fan-page networks and culture-first creative.
      </p>

      {/* Helper hint */}
      <AnimatePresence>
        {hintVisible && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="label absolute bottom-24 z-10 text-[0.6rem] text-smoke/70 sm:bottom-28"
          >
            {isTouch ? "Drag the letters" : "Move your cursor"}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Scroll cue */}
      <motion.button
        onClick={() =>
          document
            .getElementById("what-we-do")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="label absolute bottom-8 z-10 flex flex-col items-center gap-2 text-[0.55rem] text-smoke/70 transition-colors hover:text-acid"
        aria-label="Scroll to the playbook section"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-3 w-px bg-current"
        />
      </motion.button>
    </section>
  );
}
