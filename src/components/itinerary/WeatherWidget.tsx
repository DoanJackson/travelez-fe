"use client"

import { format, parseISO } from "date-fns"
import { Card } from "@/components/ui/card"
import { Cloud, CloudRain, Sun } from "lucide-react"

interface WeatherWidgetProps {
  dates: string[]
}

const MOCK_CONDITIONS = ["cloudy", "sunny", "sunny", "rainy", "sunny", "cloudy", "rainy"] as const
const MOCK_HIGHS = [33, 34, 32, 29, 33, 31, 30]
const MOCK_LOWS = [28, 27, 26, 25, 28, 26, 24]

export function WeatherWidget({ dates }: WeatherWidgetProps) {
  const getIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Weather forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
        {dates.map((isoDate, i) => {
          const label = format(parseISO(isoDate), "MMM d")
          const condition = MOCK_CONDITIONS[i % MOCK_CONDITIONS.length]
          const high = MOCK_HIGHS[i % MOCK_HIGHS.length]
          const low = MOCK_LOWS[i % MOCK_LOWS.length]
          return (
            <div key={isoDate} className="text-center min-w-16 shrink-0">
              <p className="text-xs text-gray-600 mb-2">{label}</p>
              <div className="flex justify-center mb-2">{getIcon(condition)}</div>
              <div className="text-sm">
                <span className="font-semibold">{high}°</span>
                <span className="text-gray-500 ml-1">{low}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

