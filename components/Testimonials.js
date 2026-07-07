"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/content";

// Renders nothing until you add real quotes to TESTIMONIALS in lib/content.js.
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;

  return (
    <section
      id="words"
      className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 sm:py-28"
    >
      <p className="label mb-12 text-center text-xs text-smoke sm:text-sm">
        In their words
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-8"
          >
            <blockquote className="font-display text-lg font-medium leading-snug text-paper sm:text-xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-smoke">
              <span className="text-acid/80">{t.name}</span>
              {t.role ? ` · ${t.role}` : ""}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
