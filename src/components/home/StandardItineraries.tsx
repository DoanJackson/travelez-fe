"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Clock } from "lucide-react";
import { standardItineraryCards, StandardItineraryCard } from "@/lib/mock-standard-itineraries";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const ALL = "All";
const filters = [ALL, "Culture", "Food", "History", "Adventure", "Nature"];

export function StandardItineraries() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(ALL);

  const visible: StandardItineraryCard[] =
    active === ALL
      ? standardItineraryCards
      : standardItineraryCards.filter((c) => c.style === active);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const card = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-500">
              Ready-made itineraries
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Explore Ho Chi Minh City
            </h2>
          </div>
          <Link
            href="/discover"
            className="shrink-0 text-sm font-medium text-pink-500 underline-offset-4 hover:underline"
          >
            View all destinations
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === f
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <motion.div
          ref={ref}
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((itinerary) => (
            <motion.div key={itinerary.id} variants={reduced ? undefined : card}>
              <Link
                href={`/itinerary/${itinerary.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={itinerary.image}
                    alt={itinerary.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Style badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                    {itinerary.style}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{itinerary.duration}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
