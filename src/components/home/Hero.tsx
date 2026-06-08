"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import styles from "./Hero.module.css";

const DESTINATION_PILLS = [
  "Ho Chi Minh City",
  "Hanoi",
  "Da Nang",
  "Hoi An",
  "Nha Trang",
  "Phu Quoc",
];

const WORDS = ["adventure", "escape", "journey", "memory", "story"];

function RotatingWord({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);

  // cycle words every 3 s
  useState(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % WORDS.length),
      3000,
    );
    return () => clearInterval(id);
  });

  if (reduced) return <span className="text-pink-400">{WORDS[0]}</span>;

  return (
    <span className="relative inline-block overflow-hidden align-bottom text-pink-400">
      <motion.span
        key={index}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="inline-block"
      >
        {WORDS[index]}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const dest = query.trim();
    if (dest) {
      router.push(`/planning?destination=${encodeURIComponent(dest)}`);
    } else {
      router.push("/planning");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const fadeProps = (delay: number) =>
    reduced
      ? ({} as Record<string, never>)
      : ({
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: "easeOut" as const },
        } as const);

  return (
    /* -mt-16 pulls the hero behind the 64 px sticky header */
    <section
      className={cn(
        "relative -mt-16 flex min-h-screen items-center justify-center overflow-hidden",
        styles.heroBg,
      )}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-16 text-center text-white">
        {/* Badge */}
        <motion.div {...fadeProps(0)} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-pink-300" />
          AI-powered travel planning for Vietnam
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeProps(0.1)}
          className="mb-6 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          Plan your next{" "}
          <RotatingWord reduced={reduced} />
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeProps(0.2)}
          className="mb-10 text-lg text-white/85 sm:text-xl"
        >
          Choose from thousands of ready-made itineraries or let our AI build
          one personalised to you — in seconds.
        </motion.p>

        {/* Search bar */}
        <motion.div
          {...fadeProps(0.3)}
          className="mx-auto mb-8 flex max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              aria-label="Destination search"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="m-2 rounded-xl bg-pink-500 px-5 font-semibold text-white hover:bg-pink-600"
          >
            Search
          </Button>
        </motion.div>

        {/* Destination pills */}
        <motion.div
          {...fadeProps(0.4)}
          className="flex flex-wrap justify-center gap-2"
        >
          {DESTINATION_PILLS.map((dest) => (
            <button
              key={dest}
              onClick={() =>
                router.push(
                  `/planning?destination=${encodeURIComponent(dest)}`,
                )
              }
              className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {dest}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden
        >
          <span className="block h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="block h-2 w-2 rounded-full bg-white/70"
            />
          </span>
        </motion.div>
      )}
    </section>
  );
}
