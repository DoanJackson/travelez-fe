"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

interface TripTypeSelectorProps {
  value: string | null
  onChange: (type: 'solo' | 'partner' | 'friends' | 'family') => void
}

const tripTypes = [
  { 
    id: 'solo', 
    label: 'Solo trip', 
    icon: '👤',
    desc: 'Flexible schedule, self-paced exploration'
  },
  { 
    id: 'partner', 
    label: 'Partner trip', 
    icon: '💑',
    desc: 'Romantic spots, couple-friendly activities'
  },
  { 
    id: 'friends', 
    label: 'Friends trip', 
    icon: '👥',
    desc: 'Group activities, social experiences'
  },
  { 
    id: 'family', 
    label: 'Family trip', 
    icon: '👨‍👩‍👧‍👦',
    desc: 'Family-friendly, varied age activities'
  },
]

export default function TripTypeSelector({ value, onChange }: TripTypeSelectorProps) {
  const selectedType = tripTypes.find(t => t.id === value)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tripTypes.map((type) => (
          <Card
            key={type.id}
            className={`
              relative cursor-pointer p-6 flex flex-col items-center justify-center gap-3
              transition-all hover:shadow-md
              ${value === type.id ? 'border-2 border-pink-500 bg-pink-50' : 'border'}
            `}
            onClick={() => onChange(type.id as any)}
          >
            {value === type.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="text-5xl">{type.icon}</div>
            <div className="text-center">
              <div className="text-sm font-medium">{type.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Show description for selected type */}
      {selectedType && (
        <div className="text-center p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{selectedType.label}:</span> {selectedType.desc}
          </p>
        </div>
      )}
    </div>
  )
}
