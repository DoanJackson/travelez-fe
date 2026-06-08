import { Sun, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export function PoiWhenToVisit() {
  return (
    <Card className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold text-gray-900 mb-4">When to Visit</h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg shrink-0">
            <Sun className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-0.5">
              Best time of day
            </div>
            <div className="text-xs text-gray-600">
              Early morning (6-8 AM) for fewer crowds and better light
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 rounded-lg shrink-0">
            <TrendingUp className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-0.5">
              Peak period
            </div>
            <div className="text-xs text-gray-600">
              Weekends and holidays can get very crowded
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
