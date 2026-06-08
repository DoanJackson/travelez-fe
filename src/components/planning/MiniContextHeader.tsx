"use client"

import { useTripPlanningStore } from "@/state/planning-store"

export default function MiniContextHeader() {
  const summaryText = useTripPlanningStore((state) => state.getSummaryText())

  if (!summaryText) return null

  return (
    <div className="text-center mb-6">
      <p className="text-sm text-gray-600 bg-gray-50 inline-block px-4 py-2 rounded-full">
        {summaryText}
      </p>
    </div>
  )
}

