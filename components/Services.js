"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/content";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const row = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Services() {
  return (
    <section
      id="services"
      className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20 sm:py-28"
    >
      <p className="label mb-5 text-center text-xs text-smoke sm:text-sm">
        Services
      </p>
      <h2 className="mx-auto mb-12 max-w-3xl text-center font-grotesk text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
        Six ways we grow electronic music.
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="border-b border-white/10"
      >
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            variants={row}
            className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 gap-y-2 border-t border-white/10 py-7 transition-colors duration-300 hover:bg-white/[0.02] sm:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1.4fr)] sm:gap-x-8 sm:py-9"
          >
            <span className="font-mono text-xs text-smoke transition-colors duration-300 group-hover:text-paper">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-grotesk text-xl font-semibold tracking-tight text-paper transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
              {s.title}
            </h3>
            <p className="col-span-2 max-w-md text-sm leading-relaxed text-smoke transition-colors duration-300 group-hover:text-paper/80 sm:col-span-1">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
