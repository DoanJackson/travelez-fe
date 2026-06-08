"use client"

import { Car, Footprints, Bus, Train } from "lucide-react"
import { TravelIndicator as TravelIndicatorType } from "@/types/itinerary"

interface TimelineTravelIndicatorProps {
  indicator: TravelIndicatorType
}

const iconMap = {
  walk: Footprints,
  taxi: Car,
  bus: Bus,
  train: Train,
}

export function TimelineTravelIndicator({ indicator }: TimelineTravelIndicatorProps) {
  const Icon = iconMap[indicator.type]

  return (
    <div className="flex items-center gap-3 py-4 px-4 text-gray-600">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 border-t-2 border-dashed border-gray-300" />
      <span className="text-sm font-medium">{indicator.duration}</span>
    </div>
  )
}

