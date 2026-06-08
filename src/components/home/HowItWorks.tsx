"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Cpu, CalendarCheck } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Tell us your trip",
    description:
      "Choose your destination, travel dates, budget, and style — solo, couple, family, or group.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI builds your plan",
    description:
      "Our AI analyses thousands of itineraries to craft a personalised day-by-day schedule just for you.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Tweak and go",
    description:
      "Drag to reorder activities, swap alternatives, and export your final itinerary to your phone.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-500">
            How it works
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Plan a trip in three simple steps
          </h2>
        </div>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={reduced ? undefined : container}
          initial={reduced ? false : "hidden"}
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                variants={reduced ? undefined : item}
                className={cn(
                  "relative flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center",
                  "transition-shadow duration-300 hover:shadow-md",
                )}
              >
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-0 top-14 hidden translate-x-1/2 border-t-2 border-dashed border-slate-200 md:block"
                    style={{ width: "calc(100% - 4rem)" }}
                  />
                )}

                {/* Step number badge */}
                <span className="absolute left-4 top-4 text-xs font-bold text-slate-300">
                  {s.step}
                </span>

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mini itinerary mockup */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-slate-400">travelez.vn — My Itinerary</span>
          </div>
          <div className="p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Day 1 — Ho Chi Minh City
            </p>
            <ul className="space-y-2">
              {[
                { time: "08:00", name: "Breakfast at a local pho shop" },
                { time: "09:30", name: "War Remnants Museum" },
                { time: "12:00", name: "Lunch at Ben Thanh Market" },
                { time: "14:00", name: "Reunification Palace tour" },
              ].map((act) => (
                <li
                  key={act.time}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm shadow-xs"
                >
                  <span className="w-10 shrink-0 text-xs font-medium text-pink-500">
                    {act.time}
                  </span>
                  <span className="text-slate-700">{act.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
