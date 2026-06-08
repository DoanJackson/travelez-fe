import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiningVenue } from "@/types/discover"
import { getPoiTypeUi } from "@/lib/poi-transform"

interface DiningCardProps {
  venue: DiningVenue
  isSaved: boolean
  onSave: () => void
  index?: number
  href?: string
}

export function DiningCard({ venue, isSaved, onSave, index = 0, href = "#" }: DiningCardProps) {
  const [imgError, setImgError] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative h-56 overflow-hidden">
          {venue.imageUrl && !imgError ? (
            <Image
              src={venue.imageUrl}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={getPoiTypeUi(venue.poiType).color}>
              {getPoiTypeUi(venue.poiType).label}
            </Badge>
          </div>

          {/* Save Button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                onSave()
              }}
              className={`rounded-full ${isSaved ? "text-pink-600" : ""}`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
            {venue.name}
          </h3>

          {/* <p className="text-sm text-gray-600 line-clamp-2">
            {venue.description}
          </p> */}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-gray-900">{venue.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({venue.reviewCount} reviews)
            </span>
          </div>

          {venue.neighborhood && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {venue.neighborhood}
            </div>
          )}

          {venue.priceRange && (
            <div className="text-sm font-medium text-gray-700">
              {venue.priceRange}
            </div>
          )}
        </div>
      </Card>
      </Link>
    </motion.div>
  )
}
