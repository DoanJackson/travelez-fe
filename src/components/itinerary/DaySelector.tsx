"use client"

import { useEffect, useRef } from "react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface DaySelectorProps {
  days: { dayNumber: number; title: string; date?: string; activityCount?: number }[]
  activeDay: number
  onDaySelect: (dayNumber: number) => void
}

export function DaySelector({ days, activeDay, onDaySelect }: DaySelectorProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeButton = scrollAreaRef.current?.querySelector(`[data-day="${activeDay}"]`)
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [activeDay])

  return (
    <div className="relative">
      <ScrollArea className="w-full" ref={scrollAreaRef}>
        <div className="flex items-center gap-2 px-4 py-3 min-w-max">
          {days.map((day) => {
            const isActive = activeDay === day.dayNumber
            const formattedDate = day.date
              ? format(parseISO(day.date), "MMM d")
              : null
            return (
              <Button
                key={day.dayNumber}
                data-day={day.dayNumber}
                variant={isActive ? "default" : "outline"}
                onClick={() => onDaySelect(day.dayNumber)}
                className={cn(
                  "flex flex-col items-start h-auto py-2 px-4 whitespace-nowrap",
                  isActive
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="font-semibold text-sm">Day {day.dayNumber}</span>
                {(formattedDate || day.activityCount != null) && (
                  <span className={cn("text-xs", isActive ? "text-pink-100" : "text-gray-500")}>
                    {[
                      formattedDate,
                      day.activityCount != null
                        ? `${day.activityCount} ${day.activityCount === 1 ? "place" : "places"}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

