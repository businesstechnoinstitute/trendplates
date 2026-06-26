import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import ViralStatement from "@/components/ViralStatement";
import WhoWeWorkWith from "@/components/WhoWeWorkWith";
import Services from "@/components/Services";
import About from "@/components/About";
import BouncyBand from "@/components/BouncyBand";
import LeadMagnet from "@/components/LeadMagnet";
import Cursor from "@/components/Cursor";

// Read whatever client logos have been dropped into /public/logos so they
// appear in the floating background automatically, no code changes needed.
function getLogos() {
  try {
    const dir = path.join(process.cwd(), "public", "logos");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|svg|webp|avif|gif)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

export default function Home() {
  const logos = getLogos();

  return (
    <main className="relative">
      {/* Depth: a faint top light and a soft bottom vignette so the black
          reads as intentional rather than flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(110% 70% at 50% -10%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(100% 60% at 50% 115%, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />
      <Cursor />
      <div className="scanlines" />
      <div className="grain" />

      {/* Top bar */}
      <header className="absolute left-0 top-0 z-30 flex w-full items-center justify-between px-6 py-6 sm:px-10">
        <span className="label font-grotesk text-xs font-semibold text-paper">
          Trendplates
        </span>
        <nav className="hidden items-center gap-6 sm:flex">
          <a
            href="#who-we-work-with"
            className="label text-[0.6rem] text-smoke transition-colors hover:text-acid"
          >
            Who
          </a>
          <a
            href="#services"
            className="label text-[0.6rem] text-smoke transition-colors hover:text-acid"
          >
            Services
          </a>
          <a
            href="#about"
            className="label text-[0.6rem] text-smoke transition-colors hover:text-acid"
          >
            About
          </a>
        </nav>
      </header>

      <Hero />

      <ViralStatement />

      {/* Client logos live here (drop PNGs in /public/logos). Falls back to
          the bouncy words until any logos are present. */}
      <BouncyBand
        className="h-80 sm:h-64"
        logos={logos}
        words={["Discovery", "Clips", "Momentum", "Fans", "Reach", "Signal", "Drops"]}
      />

      <WhoWeWorkWith />

      <BouncyBand
        className="h-40 sm:h-52"
        words={["Culture", "Community", "Energy", "Scene", "Movement", "Underground", "Sound"]}
      />

      <Services />

      <BouncyBand
        className="h-40 sm:h-52"
        words={["Organic", "Attention", "Growth", "Bass", "Rave", "Creative", "Buzz"]}
      />

      <About />

      <LeadMagnet />

      <footer className="relative z-10 border-t border-white/10 px-6 py-12 text-center">
        <p className="font-grotesk text-sm font-medium text-paper/80">
          Organic Growth Systems for Electronic Dance Music
        </p>
        <p className="label mt-4 text-[0.6rem] text-smoke/60">
          © {new Date().getFullYear()} Trendplates
        </p>
      </footer>
    </main>
  );
}
