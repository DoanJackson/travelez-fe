"use client"

import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TravelStyleSelectorProps {
  selectedStyles: string[]
  onToggle: (styleId: string) => void
  maxStyles?: number
}

const travelStyles = [
  { id: 'food-tourism', label: 'Food Tourism', icon: '🍴', desc: 'Local cuisine & dining' },
  { id: 'city-break', label: 'City Break', icon: '🏙️', desc: 'Urban exploration' },
  { id: 'nature-escape', label: 'Nature Escape', icon: '🌲', desc: 'Outdoor & hiking' },
  { id: 'cultural-tourism', label: 'Cultural', icon: '🏛️', desc: 'Museums & heritage' },
  { id: 'photography', label: 'Photography', icon: '📸', desc: 'Scenic spots' },
  { id: 'adventure', label: 'Adventure', icon: '⛰️', desc: 'Thrilling activities' },
  { id: 'relaxation', label: 'Relaxation', icon: '💆', desc: 'Spa & wellness' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', desc: 'Markets & boutiques' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃', desc: 'Bars & entertainment' },
]

export default function TravelStyleSelector({
  selectedStyles,
  onToggle,
  maxStyles = 10,
}: TravelStyleSelectorProps) {
  const canSelectMore = selectedStyles.length < maxStyles

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Selected Styles Chips */}
      {selectedStyles.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedStyles.map((styleId) => {
            const style = travelStyles.find(s => s.id === styleId)
            if (!style) return null
            return (
              <Badge
                key={styleId}
                variant="style"
                className="text-base py-2 px-4 cursor-pointer"
                onClick={() => onToggle(styleId)}
              >
                {style.icon} {style.label}
                <X className="ml-2 h-4 w-4" />
              </Badge>
            )
          })}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-sm text-center text-gray-600">
        Select up to {maxStyles} travel styles that match your preferences
        {selectedStyles.length > 0 && ` (${selectedStyles.length}/${maxStyles} selected)`}
      </p>

      {/* Style Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {travelStyles.map((style) => {
          const isSelected = selectedStyles.includes(style.id)
          const isDisabled = !isSelected && !canSelectMore

          return (
            <Card
              key={style.id}
              variant={isSelected ? "highlight" : "default"}
              className={`
                relative cursor-pointer p-6 flex flex-col items-center justify-center gap-3
                ${isSelected ? 'border-2 border-pink-400' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isDisabled && onToggle(style.id)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="text-4xl">{style.icon}</div>
              <div className="text-center">
                <div className="text-sm font-medium">{style.label}</div>
                <div className="text-xs text-gray-500 mt-1">{style.desc}</div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Optional Note */}
      <p className="text-xs text-center text-gray-500">
        Don't worry, you can customize your itinerary after it's generated
      </p>
    </div>
  )
}
