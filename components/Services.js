"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/content";
import RepelText from "./RepelText";

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
        The System
      </p>
      <RepelText
        as="h2"
        text="Not services. Systems."
        radius={130}
        max={22}
        className="mx-auto mb-4 max-w-3xl text-center font-display text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl"
      />
      <p className="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-smoke sm:text-base">
        Six proprietary systems that move records the way the scene actually
        moves them.
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="border-b border-white/10"
      >
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.system}
            variants={row}
            className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 gap-y-2 border-t border-white/10 py-7 transition-colors duration-300 hover:bg-white/[0.02] sm:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1.4fr)] sm:gap-x-8 sm:py-9"
          >
            <span className="font-mono text-xs text-smoke transition-colors duration-300 group-hover:text-acid">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold tracking-tight text-paper transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                {s.system}
              </h3>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-acid/70">
                {s.tag}
              </p>
            </div>
            <p className="col-span-2 max-w-md text-sm leading-relaxed text-smoke transition-colors duration-300 group-hover:text-paper/80 sm:col-span-1">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
