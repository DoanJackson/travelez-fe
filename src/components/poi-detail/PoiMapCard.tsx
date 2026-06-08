import { MapPin, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PoiMapCardProps {
  cityName: string
  address: string
  lat: number
  lng: number
}

export function PoiMapCard({ cityName, address, lat, lng }: PoiMapCardProps) {
  const handleViewMap = () => {
    // Open in Google Maps
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    )
  }

  return (
    <Card className="overflow-hidden rounded-xl border bg-background">
      <div className="relative h-56 sm:h-64 bg-gray-100">
        {/* Static map placeholder - In production, use react-leaflet or Google Maps */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-pink-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <MapPin className="h-12 w-12 text-pink-600 drop-shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-pink-600/30 blur-sm rounded-full" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <p className="text-xs text-gray-600 line-clamp-1">{address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={handleViewMap}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Google Maps
        </Button>
      </div>
    </Card>
  )
}
