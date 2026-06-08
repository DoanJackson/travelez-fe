"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTripPlanningStore } from "@/state/planning-store"
import { Textarea } from "@/components/ui/textarea"

export default function SummaryCard() {
  const router = useRouter()
  const {
    destinations,
    dateMode,
    dayRange,
    monthRange,
    tripType,
    withPets,
    withKids,
    budget,
    currency,
    travelStyles,
    customNote,
    setCustomNote,
    setComingFromSummary,
    getFormattedBudget,
    getTripDuration,
  } = useTripPlanningStore()

  const handleEdit = (step: number) => {
    setComingFromSummary(true, 6)
    router.push(`/planning/step${step}`)
  }

  const formatDestinations = () => {
    if (destinations.length === 0) return "Not set"
    return destinations.join(", ")
  }

  const formatDateRange = () => {
    const duration = getTripDuration()
    if (dateMode === "day" && dayRange.start && dayRange.end) {
      const start = dayRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const end = dayRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${start} – ${end}${duration ? ` (${duration} days)` : ''}`
    }
    if (dateMode === "month" && monthRange.startMonth && monthRange.endMonth) {
      return `${monthRange.startMonth} – ${monthRange.endMonth}`
    }
    return "Not set"
  }

  const formatCompanions = () => {
    if (!tripType) return "Not set"
    
    const type = tripType.charAt(0).toUpperCase() + tripType.slice(1)
    const extras: string[] = []
    
    if (withPets) extras.push("with pets")
    if (withKids) extras.push("with kids")
    
    return extras.length > 0 ? `${type} (${extras.join(", ")})` : type
  }

  const formatStyles = () => {
    if (travelStyles.length === 0) return "Not specified"
    
    const styleLabels: Record<string, string> = {
      'food-tourism': 'Food Tourism',
      'city-break': 'City Break',
      'nature-escape': 'Nature Escape',
      'cultural-tourism': 'Cultural',
      'photography': 'Photography',
      'adventure': 'Adventure',
      'relaxation': 'Relaxation',
      'shopping': 'Shopping',
      'nightlife': 'Nightlife',
    }
    
    return travelStyles.map(s => styleLabels[s] || s).join(", ")
  }

  const isComplete = destinations.length > 0 && 
    (dateMode === 'day' ? (dayRange.start && dayRange.end) : (monthRange.startMonth && monthRange.endMonth)) &&
    tripType && withPets !== null && withKids !== null && budget && budget > 0

  const summaryItems = [
    { label: "Destinations", value: formatDestinations(), editStep: 1 },
    { label: "Travel Dates", value: formatDateRange(), editStep: 2 },
    { label: "Trip Companions", value: formatCompanions(), editStep: 3 },
    { label: "Budget per Person", value: getFormattedBudget() || "Not set", editStep: 4 },
    { label: "Travel Styles", value: formatStyles(), editStep: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      {isComplete && (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">All details complete</span>
        </div>
      )}

      <Card className="p-8 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Trip Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {summaryItems.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(item.editStep)}
                  className="h-8 w-8 text-gray-400 hover:text-pink-600"
                  aria-label={`Edit ${item.label}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t">
          <label className="block font-semibold text-gray-900 mb-3">
            Additional Notes & Preferences
          </label>
          <Textarea
            placeholder="e.g., Emphasize local street food markets and hidden culinary gems, seek out unique photo opportunities..."
            className="w-full min-h-[120px] resize-none"
            value={customNote || ""}
            onChange={(e) => setCustomNote(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            Tell us anything special you'd like us to consider when creating your itinerary
          </p>
        </div>
      </Card>
    </div>
  )
}
