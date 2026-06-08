"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import Image from "next/image"

const DISCOVER_ASSETS = [
  "/discover/dave-weatherall-Cw9Immj9T4c-unsplash.jpg",
  "/discover/emerson-ward-1TMMXobrxMw-unsplash.jpg",
  "/discover/david-emrich-g2ejBYKMWxM-unsplash.jpg",
  "/discover/gau-xam-SjuEHXEhe_Q-unsplash.jpg",
  "/discover/doan-tuan-3QFQOxGCVmE-unsplash.jpg",
  "/discover/rene-deanda-NhsaAc3SyXg-unsplash.jpg",
  "/discover/duong-thinh-Gi0zkknkwpg-unsplash.jpg",
  "/discover/tong-a-pao-bnA0fFFHn0o-unsplash.jpg",
  "/discover/ha-nguy-n-OmjAuwbRlWE-unsplash.jpg",
  "/discover/vietnamese-food-thumb-1024x682-01-08-2024.jpg",
  "/discover/huong-pham-S8RZh7xgJdw-unsplash.jpg",
  "/discover/thuy-Mye1qNF-kjU-unsplash.jpg",
  "/discover/jean-papillon-0tLquA5qMrw-unsplash.jpg",
  "/discover/khuc-le-thanh-danh-nOG5RGMmEKk-unsplash.jpg",
  "/discover/quang-le-yAjoWqXwP6I-unsplash.jpg",
  "/discover/journaway-rundreisen-WmydFit532I-unsplash.jpg",
  "/discover/lydia-casey-VeZ2r709sbw-unsplash.jpg",
  "/discover/tron-le-eilpDNi_pV4-unsplash.jpg",
  "/discover/marvin-castelino-BmdAALzeGE4-unsplash.jpg",
]

const EXPLORE_PLACES_PROMPTS = [
  "✨ Try: Hidden waterfalls around Dalat...",
  "✨ Try: Unspoiled beaches in Phu Quoc...",
  "✨ Try: Ancient temples in Hue...",
  "✨ Try: Street food hotspots in Hanoi...",
]

const AI_ITINERARIES_PROMPTS = [
  "✨ Try: 3 days slow-travel itinerary in Hoi An...",
  "✨ Try: Motorcycle loop adventure across Ha Giang under $150...",
  "✨ Try: Family-friendly 5 days trip with kids...",
  "✨ Try: Luxe wellness retreat in Da Nang...",
]

export interface DiscoverHeroProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: (e: React.FormEvent) => void
  onTabChange?: (tab: "places" | "itineraries") => void
  onClear: () => void
}

export function DiscoverHero({
  searchQuery,
  onSearchChange,
  onSearch,
  onTabChange,
  onClear,
}: DiscoverHeroProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [activeTab, setActiveTab] = useState<"places" | "itineraries">("places")
  const [currentSlide, setCurrentSlide] = useState(0)

  const prompts = activeTab === "places" ? EXPLORE_PLACES_PROMPTS : AI_ITINERARIES_PROMPTS

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % prompts.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [prompts])

  useEffect(() => {
    const id = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % DISCOVER_ASSETS.length),
      3000,
    )
    return () => clearInterval(id)
  }, [])

  const handleTabClick = (tab: "places" | "itineraries") => {
    setActiveTab(tab)
    setCurrentPlaceholder(0)
    onTabChange?.(tab)
  }

  return (
    <section className="w-full relative overflow-hidden bg-[#faf9f7]">
      {/* Ambient blobs — staggered opacity pulse */}
      <motion.div
        className="absolute top-[-60px] left-[-80px] w-96 h-96 rounded-full bg-rose-200/50 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.div
        className="absolute top-[20px] right-[-60px] w-72 h-72 rounded-full bg-amber-200/45 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[-40px] left-[38%] w-64 h-64 rounded-full bg-sky-200/40 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Content row — no horizontal padding on wrapper; applied to left column only */}
      <div className="py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[42%_58%] gap-8 items-center">

            {/* LEFT COLUMN */}
            <div className="pl-6 lg:pl-16 pr-6 lg:pr-0">

              {/* Group 1 — Identity */}
              <div className="flex items-center gap-2">
                <div className="w-[7px] h-[7px] rounded-full flex-shrink-0" />
                <span className="text-[10px] tracking-[0.12em] text-slate-400 font-semibold uppercase">
                  AI-POWERED TRAVEL PLATFORM
                </span>
              </div>

              {/* Group 2 — Typography */}
              <div className="mt-4 mb-7">
                <h1 className="text-[36px] lg:text-[44px] font-bold tracking-tight leading-[1.15] text-slate-900">
                  Discover Your Next
                </h1>
                <h1 className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent text-[36px] lg:text-[44px] font-bold tracking-tight leading-[1.15]">
                  Vietnam Horizon
                </h1>
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-[420px] mt-3">
                  Search curated local places, or describe your dream trip in natural language — our
                  AI instantly maps the perfect community itinerary.
                </p>
              </div>

              {/* Group 3 — Search Controls */}
              <div className="space-y-3">
                {/* Segmented tab pill */}
                <div className="inline-flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/60 w-fit mb-4">
                  <button
                    type="button"
                    onClick={() => handleTabClick("places")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap ${
                      activeTab === "places"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Explore Places
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick("itineraries")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap ${
                      activeTab === "itineraries"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    AI Itineraries
                  </button>
                </div>

                {/* Capsule search input */}
                <form onSubmit={onSearch} className="max-w-[480px]">
                  <div className="rounded-full bg-white border border-slate-200 shadow-sm flex items-center pl-4 pr-1.5 py-1.5 gap-3">
                    <Sparkles size={15} className="text-rose-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={prompts[currentPlaceholder]}
                      className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-800 placeholder:text-slate-400"
                    />
                    {searchQuery.length > 0 && (
                      <button
                        type="button"
                        onClick={onClear}
                        aria-label="Clear search"
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-to-r from-pink-500 to-purple-400 text-white font-medium text-[12.5px] px-5 py-2 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Sparkles size={13} />
                      Explore
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN — Crossfade carousel */}
            <div className="hidden lg:block relative h-[400px] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-slate-100">

              <AnimatePresence>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
                >
                  <Image
                    src={DISCOVER_ASSETS[currentSlide]}
                    alt=""
                    fill
                    className="w-full h-full object-cover rounded-2xl"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dot indicators */}
              <div className="absolute bottom-4 right-4 flex gap-1 z-10">
                {DISCOVER_ASSETS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-white w-4" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
