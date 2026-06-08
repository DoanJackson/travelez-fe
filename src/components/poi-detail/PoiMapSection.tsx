"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PoiMapSectionProps {
  name: string
  address: string
  lat: number
  lng: number
}

export function PoiMapSection({ name, address, lat, lng }: PoiMapSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return

    import("leaflet").then((L) => {
      // Guard against double-init (Strict Mode, HMR, re-mount)
      if (!mapContainerRef.current || mapRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      const customIcon = L.divIcon({
        html: `<div style="background: #ec4899; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      L.marker([lat, lng], { icon: customIcon }).addTo(map)
    })

    // Cleanup returned from useEffect so React actually runs it on unmount
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [lat, lng])

  const handleOpenInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    )
  }

  return (
    <section id="map" className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Map</h2>

      <Card className="rounded-xl border bg-background overflow-hidden">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <div
          ref={mapContainerRef}
          className="w-full h-[320px] sm:h-[400px] bg-gray-100"
          style={{ zIndex: 0 }}
        />

        <div className="p-4 border-t border-gray-200 bg-white space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-pink-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900 mb-0.5">{name}</div>
              <div className="text-xs text-gray-600">{address}</div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={handleOpenInGoogleMaps}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
        </div>
      </Card>
    </section>
  )
}
