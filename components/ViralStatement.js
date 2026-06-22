"use client";

import RepelText from "./RepelText";

export default function ViralStatement() {
  return (
    <section
      id="what-we-do"
      className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center sm:py-36"
    >
      <p className="label mb-8 text-[0.6rem] text-smoke">What we do</p>

      <RepelText
        text="We grow electronic music the way it actually spreads. Through culture, communities and content that travel, not paid ads."
        radius={120}
        max={26}
        className="font-grotesk text-2xl font-semibold leading-[1.15] tracking-tight text-paper sm:text-4xl sm:leading-[1.15]"
      />

      <RepelText
        text="Trendplates builds fan-page networks, creative formats and organic campaigns that turn records, catalogues and moments into momentum across the dance music scene. We work where discovery really happens, in feeds, communities and clips, so attention is earned rather than bought."
        radius={100}
        max={16}
        className="mx-auto mt-10 max-w-2xl text-sm leading-relaxed text-smoke sm:text-base"
      />
    </section>
  );
}
