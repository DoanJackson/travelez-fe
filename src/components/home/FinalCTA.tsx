"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const containerVariants = reduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
      };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-pink-600 via-rose-500 to-orange-400 py-24 text-white">
      {/* Decorative pulse rings */}
      {!reduced && (
        <>
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            style={{
              width: "600px",
              height: "600px",
              animation: "pulse-ring 3s ease-out infinite",
            }}
          />
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            style={{
              width: "900px",
              height: "900px",
              animation: "pulse-ring 3s ease-out infinite 1s",
            }}
          />
        </>
      )}

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
        }
      `}</style>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Start planning in seconds
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
          Your next adventure is one click away
        </h2>
        <p className="mb-10 text-lg text-white/85">
          Let AI craft a personalised itinerary tailored to your style, budget,
          and travel dates — completely free.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="min-w-[180px] bg-white text-pink-600 hover:bg-white/90 font-semibold shadow-lg"
          >
            <Link href="/planning">Plan my trip</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-[180px] border-white/60 bg-transparent text-white hover:bg-white/10"
          >
            <Link href="/discover">Explore destinations</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
