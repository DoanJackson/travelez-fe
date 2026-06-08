"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export function TipsWidget() {
  const preparationTips = [
    "Bring comfortable walking shoes",
    "Carry a compact umbrella or raincoat",
  ]

  const quickTips = [
    "Stay hydrated",
    "Keep belongings secure at markets",
  ]

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Preparation Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {preparationTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-pink-500 font-semibold">{index + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Quick tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {quickTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-pink-500 font-semibold">{index + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

