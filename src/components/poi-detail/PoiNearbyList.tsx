import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { POINearbyPlace } from "@/types/poi"

interface PoiNearbyListProps {
  places: POINearbyPlace[]
}

export function PoiNearbyList({ places }: PoiNearbyListProps) {
  if (places.length === 0) return null

  return (
    <section id="nearby" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby places</h2>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/poi/${place.id}`}
              className="snap-start shrink-0 w-64 sm:w-72"
            >
              <Card className="overflow-hidden rounded-xl border bg-background hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative h-40">
                  <Image
                    src={place.imageUrl}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm capitalize"
                  >
                    {place.category}
                  </Badge>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {place.name}
                  </h3>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {place.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{place.distance}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
