"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDY } from "@/lib/content";

const EMAIL = "trendplates@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Trendplates%20Field%20Report%20001`;

export default function CaseStudy() {
  const { kicker, question, cta } = CASE_STUDY;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the address is selectable text, so nothing is lost.
    }
  };

  // Highlight the headline number in acid green.
  const parts = question.split(/(77,000)/);

  return (
    <section
      id="proof"
      className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center sm:py-32"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-14">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-acid/70">
          {kicker}
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-paper sm:text-5xl"
        >
          {parts.map((p, i) =>
            p === "77,000" ? (
              <span key={i} className="text-acid">
                {p}
              </span>
            ) : (
              p
            )
          )}
        </motion.h2>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-acid/50 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-acid transition-colors duration-300 hover:bg-acid hover:text-ink"
        >
          {cta}
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${
              open ? "rotate-90" : "group-hover:translate-x-1"
            }`}
          >
            →
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="contact"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8">
                <p className="select-all font-display text-xl font-semibold tracking-tight text-paper sm:text-3xl">
                  {EMAIL}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em]">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="rounded-full border border-white/15 px-4 py-2 text-smoke transition-colors duration-300 hover:border-acid/60 hover:text-acid"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={MAILTO}
                    className="rounded-full border border-white/15 px-4 py-2 text-smoke transition-colors duration-300 hover:border-acid/60 hover:text-acid"
                  >
                    Open in email
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
