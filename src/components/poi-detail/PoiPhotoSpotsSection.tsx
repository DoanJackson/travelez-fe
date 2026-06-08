import Image from "next/image"
import { Card } from "@/components/ui/card"
import { POIPhotoSpot } from "@/types/poi"

interface PoiPhotoSpotsSectionProps {
  photoSpots: POIPhotoSpot[]
}

export function PoiPhotoSpotsSection({ photoSpots }: PoiPhotoSpotsSectionProps) {
  if (photoSpots.length === 0) return null

  return (
    <section id="photos" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Best photo spots
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photoSpots.map((spot) => (
          <Card key={spot.id} className="overflow-hidden rounded-xl border bg-background group cursor-pointer">
            <div className="relative h-40 sm:h-48">
              <Image
                src={spot.imageUrl}
                alt={spot.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-900">
                  📸 {spot.title}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-600 leading-relaxed">{spot.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
