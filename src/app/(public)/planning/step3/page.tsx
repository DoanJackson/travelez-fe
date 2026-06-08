"use client"

import { useRouter } from "next/navigation"
import { useTripPlanningStore } from "@/state/planning-store"
import MiniContextHeader from "@/components/planning/MiniContextHeader"
import TripTypeSelector from "@/components/planning/TripTypeSelector"
import ToggleOption from "@/components/planning/ToggleOption"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Step3Page() {
  const router = useRouter()
  const {
    tripType,
    withPets,
    withKids,
    setTripType,
    setWithPets,
    setWithKids,
    isStep3Valid,
    comingFromSummary,
    summaryReturnStep,
    setComingFromSummary,
  } = useTripPlanningStore()

  const handleNext = () => {
    if (!isStep3Valid()) return

    // Smart return logic
    if (comingFromSummary && summaryReturnStep === 6) {
      setComingFromSummary(false)
      router.push("/planning/summary")
    } else {
      router.push("/planning/step4")
    }
  }

  const handleBack = () => {
    router.push("/planning/step2")
  }

  const isValid = isStep3Valid()

  return (
    <>
      <MiniContextHeader />

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Who's traveling?
          </h2>
          <p className="text-gray-600">
            Tell us about your travel companions
          </p>
        </div>

        {/* Trip Type Selector */}
        <Card className="p-6 mb-6">
          <TripTypeSelector
            value={tripType}
            onChange={setTripType}
          />
        </Card>

        {/* Toggles */}
        <div className="space-y-4 mb-8">
          <Card className="p-6">
            <ToggleOption
              label="Traveling with pets?"
              helperText="We'll prioritize pet-friendly accommodations and activities"
              value={withPets}
              onChange={setWithPets}
            />
          </Card>
          
          <Card className="p-6">
            <ToggleOption
              label="Traveling with kids?"
              helperText="We'll include kid-friendly attractions and flexible schedules"
              value={withKids}
              onChange={setWithKids}
            />
          </Card>
        </div>

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
            disabled={!isValid}
            className="order-1 sm:order-2"
            size="lg"
          >
            Next: Set Budget
          </Button>
        </div>
    </>
  )
}
