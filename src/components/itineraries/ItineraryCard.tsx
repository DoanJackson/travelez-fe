"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Share2, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SharedItinerarySummary } from "@/types/itinerary"

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

interface ItineraryCardProps {
  itinerary: SharedItinerarySummary
  index: number
  onDelete?: () => void
  onShare?: (itinerary: SharedItinerarySummary) => void
  onToggleVisibility?: (itinerary: SharedItinerarySummary, isPublic: boolean) => void
  isReadOnly?: boolean
  showSharedBy?: boolean
}

export function ItineraryCard({ itinerary, index, onDelete, onShare, onToggleVisibility, isReadOnly, showSharedBy }: ItineraryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const thumbnailSrc = THUMBNAILS[Number(itinerary.id) % THUMBNAILS.length]
  const durationDays = Math.round((new Date(itinerary.endDate).getTime() - new Date(itinerary.startDate).getTime()) / 86_400_000) + 1

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    onShare?.(itinerary)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    onDelete?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/itinerary/${itinerary.id}`}>
        <Card className="h-full flex flex-col overflow-hidden cursor-pointer">
          {/* Thumbnail */}
          <div className="relative h-40 overflow-hidden rounded-t-2xl">
            <motion.div
              className="relative h-40 w-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={thumbnailSrc}
                alt={itinerary.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>

            {!isReadOnly && onToggleVisibility && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm shadow-sm rounded-full px-2.5 py-1">
                <span className="text-xs text-gray-700 font-medium select-none">
                  {itinerary.isPublic ? "Public" : "Private"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={itinerary.isPublic ?? false}
                  aria-label="Toggle visibility"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleVisibility(itinerary, !itinerary.isPublic)
                  }}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
                    itinerary.isPublic ? "bg-pink-500" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
                    itinerary.isPublic ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <CardHeader className="pb-3 grow">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {itinerary.title}
            </h3>

            {showSharedBy && itinerary.ownerUsername && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                <Users className="h-3 w-3" />
                Shared by @{itinerary.ownerUsername}
              </p>
            )}

            {/* Location badges */}
            <div className="flex flex-wrap gap-2">
              {itinerary.destinationCities.map((city, idx) => (
                <Badge
                  key={idx}
                  variant="location"
                >
                  {city}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            {/* Metadata */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Created {formatDate(itinerary.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {durationDays}{" "}
                  {durationDays === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>
                  {itinerary.destinationCities.length}{" "}
                  {itinerary.destinationCities.length === 1 ? "location" : "locations"}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <Button
              className="flex-1"
              size="sm"
              aria-label="View trip"
            >
              View trip
            </Button>

            {!isReadOnly && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  aria-label="Share trip"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  aria-label="Delete trip"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
