import { Calendar as CalendarIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DatePicker } from "./DatePicker"

interface PlanTripPanelProps {
  cityName: string
  startDate?: Date
  endDate?: Date
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  onCreateItinerary: () => void
  onPlanWithoutDates: () => void
}

export function PlanTripPanel({
  cityName,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onCreateItinerary,
  onPlanWithoutDates,
}: PlanTripPanelProps) {
  return (
    <Card className="w-full lg:max-w-md p-6 bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              Plan a trip to {cityName} with AI
            </h3>
            <p className="text-sm text-gray-600">
              Destination is pre-selected. Choose dates and we'll take you to the planner.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <DatePicker
            label="Start date"
            date={startDate}
            onDateChange={onStartDateChange}
            placeholder="Select start date"
          />
          <DatePicker
            label="End date"
            date={endDate}
            onDateChange={onEndDateChange}
            placeholder="Select end date"
            minDate={startDate}
            disabled={!startDate}
          />
        </div>

        <Button
          onClick={onCreateItinerary}
          className="w-full"
          size="lg"
          disabled={!startDate || !endDate}
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          Create itinerary
        </Button>

        <Button
          onClick={onPlanWithoutDates}
          variant="ghost"
          className="w-full text-sm text-pink-600 hover:text-pink-700"
        >
          Plan without dates →
        </Button>
      </div>
    </Card>
  )
}
