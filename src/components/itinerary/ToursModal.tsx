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
import { Clock, Users, DollarSign, Star } from "lucide-react"
import { Activity } from "@/types/itinerary"

interface ToursModalProps {
  isOpen: boolean
  onClose: () => void
  activity: Activity | null
}

export function ToursModal({ isOpen, onClose, activity }: ToursModalProps) {
  if (!activity) return null

  const tours = [
    {
      id: "tour-1",
      title: "Historical Walking Tour",
      duration: "3 hours",
      groupSize: "8-12 people",
      price: "450,000 VND",
      rating: 4.9,
      description: "Explore the historical sites with a local guide",
    },
    {
      id: "tour-2",
      title: "Food & Culture Experience",
      duration: "4 hours",
      groupSize: "6-10 people",
      price: "550,000 VND",
      rating: 4.8,
      description: "Taste local cuisine and learn about Vietnamese culture",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tours at {activity.title}</DialogTitle>
          <DialogDescription>
            Available guided tours and experiences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {tours.map((tour) => (
            <Card key={tour.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{tour.title}</h4>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold">{tour.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{tour.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{tour.groupSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{tour.price}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  View details
                </Button>
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
                  Book now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

