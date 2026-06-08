import { Camera, Church, Flower, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { POIActivity } from "@/types/poi"

interface PoiActivitiesSectionProps {
  activities: POIActivity[]
}

const iconMap: Record<string, LucideIcon> = {
  Camera: Camera,
  Church: Church,
  Flower: Flower,
}

export function PoiActivitiesSection({ activities }: PoiActivitiesSectionProps) {
  return (
    <section id="activities" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        What you can do here
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {activities.map((activity) => {
          const IconComponent = iconMap[activity.icon] || Camera
          return (
            <Card key={activity.id} className="rounded-xl border bg-background p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 rounded-lg shrink-0">
                  <IconComponent className="h-5 w-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <span className="text-xs text-gray-500">~2 hours round trip</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
