"use client";

import { motion } from "framer-motion";
import { AUDIENCES } from "@/lib/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WhoWeWorkWith() {
  return (
    <section
      id="who-we-work-with"
      className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 sm:py-36"
    >
      <p className="label mb-4 text-center text-[0.6rem] text-smoke">
        Who we work with
      </p>
      <h2 className="mx-auto mb-14 max-w-2xl text-center font-grotesk text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
        Built for the people moving dance music forward.
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3"
      >
        {AUDIENCES.map((a) => (
          <motion.div
            key={a.title}
            variants={card}
            className="group bg-ink p-7 transition-colors duration-300 hover:bg-white/[0.02] sm:p-8"
          >
            <h3 className="font-grotesk text-lg font-semibold tracking-tight text-paper">
              {a.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-smoke transition-colors duration-300 group-hover:text-paper/80">
              {a.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
