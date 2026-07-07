"use client";

// Renders real campaign artefacts (screenshots) dropped into /public/proof.
// Filenames become the caption: "tiktok-4.2m-72h.png" → "TIKTOK · 4.2M · 72H".
// No images? The section renders nothing, so the page stays clean until you
// add real proof (no stock, no filler).

function captionFromFilename(file) {
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " · ")
    .toUpperCase();
}

export default function Proof({ artefacts = [] }) {
  if (!artefacts.length) return null;

  // Duplicate the set so the marquee can loop seamlessly.
  const items = [...artefacts, ...artefacts];

  return (
    <section
      id="artefacts"
      className="relative z-10 w-full overflow-hidden py-20 sm:py-28"
    >
      <p className="label mb-10 text-center text-xs text-smoke sm:text-sm">
        Artefacts from the field
      </p>

      <div className="proof-marquee group flex w-max gap-5 px-6">
        {items.map((file, i) => (
          <figure
            key={file + i}
            className="proof-frame relative w-[240px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:w-[300px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/proof/${encodeURIComponent(
                file
              )}`}
              alt=""
              className="block w-full object-cover opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
            />
            <figcaption className="flex items-center justify-between border-t border-white/10 px-3 py-2 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-smoke">
              <span className="truncate">{captionFromFilename(file)}</span>
              <span className="ml-2 shrink-0 text-acid/70">●&nbsp;REC</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
