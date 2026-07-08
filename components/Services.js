"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "@/lib/content";
import RepelText from "./RepelText";
import ScrollHighlightText from "./ScrollHighlightText";

export default function Services() {
  // FAQ-style: all closed by default, click a row to reveal it.
  const [open, setOpen] = useState(-1);

  return (
    <section
      id="services"
      className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20 sm:py-28"
    >
      <p className="label mb-5 text-center text-xs text-smoke sm:text-sm">
        The System
      </p>
      <ScrollHighlightText
        as="h2"
        text="Not services. Systems."
        className="mx-auto mb-4 max-w-3xl text-center font-display text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl"
      />
      <RepelText
        text="Six proprietary systems that move records the way the scene actually moves them."
        radius={90}
        max={16}
        className="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-smoke sm:text-base"
      />

      <div className="mx-auto max-w-3xl border-b border-white/10">
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s.system} className="border-t border-white/10">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-4 py-6 text-left sm:gap-6"
              >
                <span className="w-6 shrink-0 font-mono text-xs text-smoke transition-colors duration-300 group-hover:text-acid">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-xl font-semibold tracking-tight text-paper transition-colors duration-300 group-hover:text-acid sm:text-2xl">
                  {s.system}
                </span>
                <span
                  className={`shrink-0 font-mono text-2xl leading-none text-acid transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pl-10 pr-2 sm:pl-12">
                      <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-acid/70">
                        {s.tag}
                      </p>
                      <p className="max-w-xl text-sm leading-relaxed text-smoke sm:text-base">
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
