"use client"

import { useRouter } from "next/navigation"
import { useTripPlanningStore } from "@/state/planning-store"
import MiniContextHeader from "@/components/planning/MiniContextHeader"
import TravelStyleSelector from "@/components/planning/TravelStyleSelector"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function Step5Page() {
  const router = useRouter()
  const {
    travelStyles,
    extraPreferences,
    addTravelStyle,
    removeTravelStyle,
    setExtraPreferences,
    comingFromSummary,
    summaryReturnStep,
    setComingFromSummary,
  } = useTripPlanningStore()

  const handleNext = () => {
    // Smart return logic
    if (comingFromSummary && summaryReturnStep === 6) {
      setComingFromSummary(false)
      router.push("/planning/summary")
    } else {
      router.push("/planning/summary")
    }
  }

  const handleBack = () => {
    router.push("/planning/step4")
  }

  return (
    <>
      <MiniContextHeader />

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What's your travel style?
          </h2>
          <p className="text-gray-600">
            Select up to 3 styles that match your preferences
          </p>
        </div>

        <Card className="p-6 mb-6">
          <TravelStyleSelector
            selectedStyles={travelStyles}
            onToggle={(style) => {
              if (travelStyles.includes(style)) {
                removeTravelStyle(style)
              } else {
                addTravelStyle(style)
              }
            }}
            maxStyles={3}
          />
        </Card>

        {/* Extra Preferences Section */}
        <Card className="p-6 mb-8">
          <Label htmlFor="extraPreferences" className="text-base font-semibold mb-2 block">
            Additional travel preferences <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Share any specific requests, accessibility needs, dietary restrictions, or special interests
          </p>
          <Textarea
            id="extraPreferences"
            placeholder="E.g., I'm vegetarian, need wheelchair-accessible places, love photography spots, want to avoid crowded areas..."
            value={extraPreferences || ""}
            onChange={(e) => setExtraPreferences(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            {extraPreferences?.length || 0} / 500 characters
          </p>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="order-2 sm:order-1"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="order-1 sm:order-2"
            size="lg"
          >
            Continue to Review
          </Button>
        </div>
    </>
  )
}
