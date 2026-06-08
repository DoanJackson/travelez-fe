import { Heart, Lightbulb, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { POIHighlight } from "@/types/poi"

interface PoiHighlightsSectionProps {
  highlights: POIHighlight[]
}

const highlightConfig = {
  love: {
    icon: Heart,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  know: {
    icon: Lightbulb,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  aware: {
    icon: AlertCircle,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
}

export function PoiHighlightsSection({ highlights }: PoiHighlightsSectionProps) {
  // Group highlights by type
  const loveItems = highlights.filter((h) => h.type === "love")
  const knowItems = highlights.filter((h) => h.type === "know")
  const awareItems = highlights.filter((h) => h.type === "aware")

  return (
    <section id="highlights" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Traveler highlights</h2>

      <Card className="rounded-xl border bg-background divide-y divide-gray-200">
        {/* PEOPLE LOVE */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">PEOPLE LOVE</h3>
          </div>
          <ul className="space-y-2">
            {loveItems.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{item.description}</span>
              </li>
            ))}
            <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>The atmosphere offers a peaceful oasis</span>
            </li>
            <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Minimal crowds offer a serene vibe</span>
            </li>
          </ul>
        </div>

        {/* PRO TIPS */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">PRO TIPS</h3>
          </div>
          <ul className="space-y-2">
            {knowItems.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{item.description}</span>
              </li>
            ))}
            <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Go at high up for fewer crowds</span>
            </li>
            <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Wear comfortable shoes</span>
            </li>
          </ul>
        </div>

        {/* BE AWARE */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">BE AWARE</h3>
          </div>
          <ul className="space-y-2">
            {awareItems.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{item.description}</span>
              </li>
            ))}
            <li className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Watch out for vendors and tippers can appear</span>
            </li>
          </ul>
        </div>
      </Card>
    </section>
  )
}
