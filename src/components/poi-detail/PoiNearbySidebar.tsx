import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { POINearbyPlace } from "@/types/poi"

interface PoiNearbySidebarProps {
  places: POINearbyPlace[]
}

export function PoiNearbySidebar({ places }: PoiNearbySidebarProps) {
  if (places.length === 0) return null

  return (
    <Card className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Nearby</h3>

      <div className="space-y-3">
        {places.slice(0, 4).map((place) => (
          <Link
            key={place.id}
            href={`/poi/${place.id}`}
            className="flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-0.5">
                {place.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>{place.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  <span>{place.distance}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="#nearby"
        className="block text-center text-sm font-medium text-pink-600 hover:text-pink-700 mt-4 pt-3 border-t"
      >
        View all nearby places
      </Link>
    </Card>
  )
}
