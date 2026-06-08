"use client"

import { motion } from "framer-motion"
import { ItineraryCard } from "./ItineraryCard"
import type { ItinerarySummary, SharedItinerarySummary } from "@/types/itinerary"

interface ItineraryGridProps {
  itineraries: ItinerarySummary[]
  onDelete?: (itinerary: ItinerarySummary) => void
  onShare?: (itinerary: ItinerarySummary) => void
  onToggleVisibility?: (itinerary: ItinerarySummary, isPublic: boolean) => void
  isReadOnly?: boolean
  showSharedBy?: boolean
}

export function ItineraryGrid({ itineraries, onDelete, onShare, onToggleVisibility, isReadOnly, showSharedBy }: ItineraryGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {itineraries.map((itinerary, index) => (
        <ItineraryCard
          key={itinerary.id}
          itinerary={itinerary as SharedItinerarySummary}
          index={index}
          onDelete={onDelete ? () => onDelete(itinerary) : undefined}
          onShare={onShare ? () => onShare(itinerary) : undefined}
          onToggleVisibility={onToggleVisibility}
          isReadOnly={isReadOnly}
          showSharedBy={showSharedBy}
        />
      ))}
    </motion.div>
  )
}
