"use client"

import { useRouter } from "next/navigation"
import { useTripPlanningStore } from "@/state/planning-store"
import MiniContextHeader from "@/components/planning/MiniContextHeader"
import CalendarSelector from "@/components/planning/CalendarSelector"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Step2Page() {
  const router = useRouter()
  const {
    dateMode,
    dayRange,
    monthRange,
    setDateMode,
    setDayRange,
    setMonthRange,
    isStep2Valid,
    comingFromSummary,
    summaryReturnStep,
    setComingFromSummary,
  } = useTripPlanningStore()

  const handleNext = () => {
    if (!isStep2Valid()) return

    // Smart return logic
    if (comingFromSummary && summaryReturnStep === 6) {
      setComingFromSummary(false)
      router.push("/planning/summary")
    } else {
      router.push("/planning/step3")
    }
  }

  const handleBack = () => {
    router.push("/planning/step1")
  }

  const isValid = isStep2Valid()

  return (
    <>
      <MiniContextHeader />

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            When do you want to go?
          </h2>
          <p className="text-gray-600">
            Choose your travel dates or months
          </p>
        </div>

        <Card className="p-6 mb-8">
          <CalendarSelector
            dateMode={dateMode}
            dayRange={dayRange}
            monthRange={monthRange}
            onDateModeChange={setDateMode}
            onDayRangeChange={setDayRange}
            onMonthRangeChange={setMonthRange}
          />
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
            disabled={!isValid}
            className="order-1 sm:order-2"
            size="lg"
          >
            Next: Who's Traveling?
          </Button>
        </div>
    </>
  )
}
