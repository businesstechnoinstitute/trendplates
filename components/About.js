"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto w-full max-w-3xl px-6 py-28 text-center sm:py-36"
    >
      <p className="label mb-8 text-[0.6rem] text-smoke">About</p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-grotesk text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl"
      >
        Built for the culture, not the algorithm.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-smoke sm:text-base"
      >
        Trendplates is an organic growth agency built for electronic and dance
        music. We come from the culture, and we know records don&apos;t break
        because of ad spend. They break through communities, clips, moments and
        momentum. We build the systems that make that happen: fan-page networks,
        creative formats and culture-first campaigns that earn real attention
        and turn artists, labels and catalogues into movements.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="label mt-10 text-[0.62rem] text-paper/70"
      >
        Music-first. Culture-first. Organic by design.
      </motion.p>
    </section>
  );
}
