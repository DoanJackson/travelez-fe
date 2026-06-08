import { Users } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PoiCrowdLevelProps {
  currentHour?: number
}

export function PoiCrowdLevel({ currentHour = 14 }: PoiCrowdLevelProps) {
  // Mock crowd data (0-100%)
  const crowdData = [
    { hour: "6 AM", level: 15, label: "6" },
    { hour: "9 AM", level: 45, label: "9" },
    { hour: "12 PM", level: 85, label: "12" },
    { hour: "3 PM", level: 90, label: "3" },
    { hour: "6 PM", level: 60, label: "6" },
    { hour: "9 PM", level: 25, label: "9" },
  ]

  const getCurrentHourIndex = () => {
    if (currentHour >= 6 && currentHour < 9) return 0
    if (currentHour >= 9 && currentHour < 12) return 1
    if (currentHour >= 12 && currentHour < 15) return 2
    if (currentHour >= 15 && currentHour < 18) return 3
    if (currentHour >= 18 && currentHour < 21) return 4
    return 5
  }

  const activeIndex = getCurrentHourIndex()

  const getLevelColor = (level: number) => {
    if (level < 30) return "bg-green-500"
    if (level < 60) return "bg-amber-500"
    return "bg-red-500"
  }

  const getLevelText = (level: number) => {
    if (level < 30) return "Not busy"
    if (level < 60) return "Moderately busy"
    return "Very busy"
  }

  return (
    <Card className="rounded-xl border bg-background p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Crowd Level</h3>
      </div>

      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-1">Right now</div>
        <div className="text-sm font-semibold text-gray-900">
          {getLevelText(crowdData[activeIndex].level)}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2 mb-4">
        {crowdData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className={`text-xs w-10 ${
                index === activeIndex ? "font-semibold text-gray-900" : "text-gray-600"
              }`}
            >
              {item.hour}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
              <div
                className={`h-full ${getLevelColor(item.level)} ${
                  index === activeIndex ? "opacity-100" : "opacity-60"
                } transition-all`}
                style={{ width: `${item.level}%` }}
              />
            </div>
            {index === activeIndex && (
              <div className="w-2 h-2 bg-pink-600 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
        <span>Less busy</span>
        <span>More busy</span>
      </div>
    </Card>
  )
}
