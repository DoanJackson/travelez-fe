import { Star, Wallet, Clock, Sun, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PoiQuickInfoProps {
  rating: number
  reviewCount: number
  entryFee: string
  duration: string
  bestTime: string
  address: string
  onViewMap?: () => void
}

export function PoiQuickInfo({
  rating,
  reviewCount,
  entryFee,
  duration,
  bestTime,
  address,
  onViewMap,
}: PoiQuickInfoProps) {
  return (
    <Card className="border border-gray-200 bg-white rounded-xl shadow-sm">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-4 sm:p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900">{rating}</div>
            <div className="text-xs text-gray-600">{reviewCount.toLocaleString()} Reviews</div>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden lg:block h-10" />

        {/* Duration */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Visit Duration</div>
            <div className="text-sm font-semibold text-gray-900">{duration}</div>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden lg:block h-10" />

        {/* Entry Fee */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="p-2 bg-green-50 rounded-lg">
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Entrance Fee</div>
            <div className="text-sm font-semibold text-gray-900">{entryFee}</div>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden lg:block h-10" />

        {/* Best Time */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Sun className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Best For Photos</div>
            <div className="text-sm font-semibold text-gray-900">{bestTime}</div>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden lg:block h-10" />

        {/* Location */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="p-2 bg-pink-50 rounded-lg">
            <MapPin className="h-5 w-5 text-pink-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">Address</div>
            <button
              onClick={onViewMap}
              className="text-sm font-medium text-pink-600 hover:underline truncate block w-full text-left"
            >
              View on map
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
