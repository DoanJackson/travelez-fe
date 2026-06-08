"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin } from "lucide-react"

interface CityMapProps {
  cityName: string
  coordinates?: [number, number] // [lat, lng]
  className?: string
}

export function CityMap({ cityName, coordinates = [10.8231, 106.6297], className }: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [L, setL] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        const leaflet = await import("leaflet")
        
        // Fix default marker icon issue
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })
        
        setL(leaflet)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
        setIsLoading(false)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return

    try {
      const map = L.map(mapContainerRef.current, {
        center: coordinates,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add city center marker
      L.marker(coordinates)
        .addTo(map)
        .bindPopup(`<b>${cityName}</b><br/>City Center`)

      mapRef.current = map
    } catch (error) {
      console.error("Failed to initialize map:", error)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [L, coordinates, cityName])

  if (isLoading || !L) {
    return (
      <Card className="rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-[360px] bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapPin className="h-12 w-12 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl shadow-sm overflow-hidden">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="h-[360px] w-full"
          style={{ zIndex: 0 }}
        />
        <div className="p-4 border-t bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{cityName} Center</span>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View larger map
          </Button>
        </div>
      </div>
    </Card>
  )
}
