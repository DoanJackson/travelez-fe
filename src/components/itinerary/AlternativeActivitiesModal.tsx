"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, MapPin, Star } from "lucide-react"
import { Activity } from "@/types/itinerary"

interface AlternativeActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  originalActivity: Activity | null
  onReplace: (newActivity: Activity) => void
}

export function AlternativeActivitiesModal({
  isOpen,
  onClose,
  originalActivity,
  onReplace,
}: AlternativeActivitiesModalProps) {
  if (!originalActivity) return null

  const alternatives: Activity[] = [
    {
      id: "alt-1",
      title: "Vintage Cafe & Roastery",
      startTime: "8:00",
      endTime: "9:00",
      price: "50,000 VND",
      address: "23B Nguyen Thi Minh Khai, District 1, Ho Chi Minh city",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
      aiTip: "Known for authentic Vietnamese coffee experience",
      lat: 10.7769,
      lng: 106.7009,
    },
    {
      id: "alt-2",
      title: "Saigon Breakfast House",
      startTime: "8:00",
      endTime: "9:30",
      price: "45,000 VND",
      address: "45 Le Thanh Ton, District 1, Ho Chi Minh city",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      aiTip: "Best banh mi in the area",
      lat: 10.7741,
      lng: 106.6988,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find alternative for "{originalActivity.title}"</DialogTitle>
          <DialogDescription>
            Choose a replacement activity for the same time slot
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {alternatives.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{activity.price}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{activity.address}</span>
                    </div>
                  </div>

                  {activity.aiTip && (
                    <p className="text-xs text-purple-900 bg-purple-50 border border-purple-200 rounded p-2 mb-3">
                      {activity.aiTip}
                    </p>
                  )}

                  <Button
                    onClick={() => {
                      onReplace(activity)
                      onClose()
                    }}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Replace with this
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

