import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface NeighborhoodCardProps {
  neighborhood: {
    id: string
    name: string
    description: string
    imageUrl: string
    placesCount: number
    recommendedFor: string
  }
  index?: number
  href?: string
}

export function NeighborhoodCard({ 
  neighborhood, 
  index = 0, 
  href = "#" 
}: NeighborhoodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={neighborhood.imageUrl}
              alt={neighborhood.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
              {neighborhood.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {neighborhood.description}
            </p>

            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="text-gray-500">{neighborhood.placesCount} key places</span>
              <span className="text-pink-600 font-medium">
                {neighborhood.recommendedFor}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
