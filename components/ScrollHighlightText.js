"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Each word brightens from dim to full as it passes through the reading band.
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="relative mr-[0.24em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/**
 * Big statement text that "reads along": words light up one by one as you
 * scroll it through the viewport. Scroll-linked (not a timed animation), so it
 * tracks the pointer of the page rather than playing on its own.
 */
export default function ScrollHighlightText({ text, className = "", as = "p" }) {
  const Tag = as;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </Tag>
  );
}
