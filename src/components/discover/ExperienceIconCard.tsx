import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import {
  UtensilsCrossed,
  Landmark,
  Waves,
  Mountain,
  Store,
  Church,
} from "lucide-react"
import type { Experience } from "@/lib/mock-discover-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Landmark,
  Waves,
  Mountain,
  Store,
  Church,
}

export interface ExperienceIconCardProps {
  experience: Experience
}

export function ExperienceIconCard({ experience }: ExperienceIconCardProps) {
  const IconComponent = iconMap[experience.icon] || UtensilsCrossed

  return (
    <Link href={`/discover?theme=${experience.theme}`}>
      <Card className="group inline-block w-80 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="flex gap-4 p-4">
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
              <Image
                src={experience.imageUrl}
                alt={experience.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-1">
              {experience.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {experience.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
