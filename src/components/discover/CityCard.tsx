import { motion } from "framer-motion"
import { Heart, Bell, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { City } from "@/lib/mock-discover-data"

export interface CityCardProps {
  city: City
  isSaved: boolean
  isFollowed: boolean
  onSave: () => void
  onFollow: () => void
  index: number
}

export function CityCard({
  city,
  isSaved,
  isFollowed,
  onSave,
  onFollow,
  index,
}: CityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/discover/${city.id}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <div className="relative h-48 overflow-hidden bg-slate-100">
            {city.imageUrl ? (
              <Image
                src={city.imageUrl}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-slate-300" />
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">
                {city.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{city.vibe}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {city.placesCount} places
              </span>
              <span>{city.reviewsCount} reviews</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  onSave()
                }}
                className={isSaved ? "text-pink-600" : "text-gray-400"}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  onFollow()
                }}
                className={isFollowed ? "text-pink-600" : "text-gray-400"}
              >
                <Bell className={`h-5 w-5 ${isFollowed ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
