"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DESCRIPTORS } from "@/lib/content";

export default function Descriptors() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % DESCRIPTORS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-smoke sm:mt-8">
      <span className="label text-[0.62rem] sm:text-xs">Trendplates is</span>
      <span className="relative inline-flex h-[1.6em] min-w-[7ch] items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={DESCRIPTORS[i]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap font-grotesk text-base font-medium text-paper sm:text-lg"
          >
            {DESCRIPTORS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
