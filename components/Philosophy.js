"use client";

import { motion } from "framer-motion";
import { PHILOSOPHY } from "@/lib/content";
import ScrollHighlightText from "./ScrollHighlightText";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Philosophy() {
  const { statement, contrasts } = PHILOSOPHY;

  return (
    <section
      id="philosophy"
      className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center sm:py-32"
    >
      <p className="label mb-8 text-xs text-smoke sm:text-sm">Philosophy</p>

      <ScrollHighlightText
        text={statement}
        className="mx-auto max-w-3xl font-display text-2xl font-semibold leading-[1.25] tracking-tight text-paper sm:text-4xl sm:leading-[1.2]"
      />

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-6"
      >
        {contrasts.map(({ a, b }) => (
          <motion.li
            key={a}
            variants={item}
            className="flex items-baseline gap-3 font-display text-lg font-semibold sm:text-xl"
          >
            <span className="text-acid">{a}</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-smoke">
              over
            </span>
            <span className="text-smoke/50 line-through decoration-smoke/40">
              {b}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
