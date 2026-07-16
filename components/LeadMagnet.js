"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trackLead } from "@/lib/analytics";

// Posts to the Cloudflare Pages Function at functions/api/subscribe.js,
// which sends the guide via Resend server-side (API key never reaches the
// browser). Only live on the Cloudflare deploy of this site, not the GitHub
// Pages mirror, since that host can't run server code at all.
export default function LeadMagnet() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      trackLead({ email });
      setStatus("done");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      id="playbook"
      className="relative z-10 mx-auto w-full max-w-2xl px-6 py-24 sm:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-12"
      >
        <p className="label mb-4 text-[0.6rem] text-smoke">Free Download</p>
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          The Ultimate Music Artist TikTok Starter Guide and Checklist
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-smoke sm:text-base">
          The exact framework and pre-post checklist our team runs on every
          clip we publish for dance music artists and labels. Free, no fluff.
        </p>

        {status === "done" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center"
          >
            <p className="font-display text-lg font-semibold text-paper">
              You&apos;re in.
            </p>
            <p className="mt-1 text-sm text-smoke">
              Check your inbox. The guide is on its way.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <input
              type="text"
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-paper placeholder:text-smoke/60 focus:border-acid/70 focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-paper placeholder:text-smoke/60 focus:border-acid/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative w-full overflow-hidden rounded-xl bg-paper px-6 py-3 font-display font-semibold text-ink transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? "Sending…" : "Send Me the Guide"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-xs text-red-400">
            Something went wrong. Try again, or email us at{" "}
            <a href="mailto:trendplates@gmail.com" className="underline">
              trendplates@gmail.com
            </a>
            .
          </p>
        )}

        <p className="mt-4 text-xs text-smoke/60">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
