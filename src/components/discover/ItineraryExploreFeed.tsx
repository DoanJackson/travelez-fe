"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { searchPublicItineraries } from "@/services/itineraryService"
import type { PublicItinerarySummary } from "@/types/itinerary"
import type { ApiError } from "@/types/api"

const THUMBNAILS = [
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

const SAMPLE_PROMPTS = [
  "Beach trip in Đà Nẵng",
  "Food tour in Hà Nội",
  "Cultural trip in Huế",
  "Adventure in Sapa",
  "City break in Hồ Chí Minh",
  "Nature escape in Phú Quốc",
]

function getItineraryThumbnail(id: number): string {
  return THUMBNAILS[id % THUMBNAILS.length]
}

function calcDays(startDate: string, endDate: string): number {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  return Math.max(1, Math.round(diff / 86_400_000) + 1)
}

interface ItineraryExploreFeedProps {
  prompt: string | null
}

export function ItineraryExploreFeed({ prompt }: ItineraryExploreFeedProps) {
  const router = useRouter()
  const [items, setItems] = useState<PublicItinerarySummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedPage, setFeedPage] = useState(0)
  const [totalFeedPages, setTotalFeedPages] = useState(0)

  // Initial fetch — replaces items, resets pagination
  useEffect(() => {
    if (!prompt || prompt.trim().length < 2) {
      setItems([])
      setError(null)
      setIsLoading(false)
      setFeedPage(0)
      setTotalFeedPages(0)
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setFeedPage(0)
    setTotalFeedPages(0)
    searchPublicItineraries(prompt.trim(), 0)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data.content)
          setFeedPage(res.data.page)
          setTotalFeedPages(res.data.totalPages)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as ApiError)?.message ?? "Search failed.")
      })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [prompt])

  const handleLoadMore = async () => {
    if (isLoadingMore || !prompt) return
    const nextPage = feedPage + 1
    setIsLoadingMore(true)
    try {
      const res = await searchPublicItineraries(prompt.trim(), nextPage)
      setItems((prev) => [...prev, ...res.data.content])
      setFeedPage(res.data.page)
      setTotalFeedPages(res.data.totalPages)
    } catch {
      // silently fail — existing results remain visible
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Idle state */}
        {!prompt || prompt.trim().length < 2 ? (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <p className="text-base text-gray-500 max-w-md">
              🪄 Describe your dream trip above to search community itineraries...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLE_PROMPTS.map((chip) => (
                <button
                  key={chip}
                  onClick={() =>
                    router.push(`/discover?prompt=${encodeURIComponent(chip)}`)
                  }
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 shadow-sm hover:border-pink-400 hover:text-pink-500 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          /* Loading skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl" />
                <div className="pt-3 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <p className="text-sm text-red-500 max-w-xs">{error}</p>
            <Button size="sm" variant="outline" onClick={() => router.push("/discover")}>
              Clear search
            </Button>
          </div>
        ) : items.length === 0 ? (
          /* Empty results state */
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">
              No itineraries found for &ldquo;<strong>{prompt}</strong>&rdquo;
            </p>
            <Button size="sm" variant="outline" onClick={() => router.push("/discover")}>
              Clear search
            </Button>
          </div>
        ) : (
          /* Results grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index % 9) * 0.05 }}
                >
                  <Link href={`/itinerary/${item.id}`} className="group block">
                    <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={getItineraryThumbnail(item.id)}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="pt-3 space-y-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ⏱ {calcDays(item.startDate, item.endDate)} Days
                      </p>

                      {item.destinationCities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.destinationCities.map((city) => (
                            <span
                              key={city}
                              className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.styles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.styles.map((style) => (
                            <span
                              key={style}
                              className="text-xs text-pink-500 bg-pink-50 rounded-full px-2 py-0.5"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.ownerUsername && (
                        <p className="text-xs text-gray-400">by @{item.ownerUsername}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {feedPage < totalFeedPages - 1 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-full px-8 py-2.5 text-xs font-semibold tracking-wide"
                >
                  {isLoadingMore && (
                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                  )}
                  {isLoadingMore ? "Loading..." : "Load More Itineraries"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
