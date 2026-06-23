"use client";

import { motion } from "framer-motion";
import RepelText from "./RepelText";

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 mx-auto w-full max-w-3xl px-6 py-20 text-center sm:py-28"
    >
      <p className="label mb-6 text-xs text-smoke sm:text-sm">About</p>

      <RepelText
        as="h2"
        text="Built for the culture, not the algorithm."
        radius={130}
        max={22}
        className="mx-auto max-w-3xl font-grotesk text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl"
      />

      <RepelText
        text="Trendplates is an organic growth agency built for electronic and dance music. We come from the culture, and we know records don't break because of ad spend. They break through communities, clips, moments and momentum. We build the systems that make that happen: fan-page networks, creative formats and culture-first campaigns that earn real attention and turn artists, labels and catalogues into movements."
        radius={100}
        max={16}
        className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-smoke sm:text-base"
      />

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
