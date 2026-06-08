import Link from "next/link"
import { ChevronRight, Heart, Bell, Share2, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPoiTypeUi } from "@/lib/poi-transform"

interface PoiHeaderProps {
  name: string
  categories: string[]
  city: string
  district: string
  poiTypeDetail?: string
  isSaved: boolean
  isFollowed: boolean
  onSave: () => void
  onFollow: () => void
  onShare: () => void
}

export function PoiHeader({
  name,
  categories,
  city,
  poiTypeDetail,
  isSaved,
  isFollowed,
  onSave,
  onFollow,
  onShare,
}: PoiHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {/* <Link href="/discover" className="hover:text-pink-600 transition-colors">
            Discover
          </Link>
          {city && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/discover/${city.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-pink-600 transition-colors">
                {city}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{name}</span> 
          */}
          <Link
            href="/discover/hcmc"
            className="flex items-center gap-0.5 text-gray-400 hover:text-pink-600 transition-colors shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </nav>

        {/* Title & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {getPoiTypeUi(category).label}
                </Badge>
              ))}
              {poiTypeDetail && (
                <Badge variant="outline" className="text-gray-600">
                  {poiTypeDetail}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onSave}
              className={isSaved ? "text-pink-600 border-pink-600" : ""}
              aria-label="Save POI"
            >
              <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onFollow}
              className={isFollowed ? "text-pink-600 border-pink-600" : ""}
              aria-label="Follow POI"
            >
              <Bell className={`h-5 w-5 ${isFollowed ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
              aria-label="Share POI"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
