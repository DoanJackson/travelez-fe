"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { POIResponseData } from "@/types/poi"

interface SearchMapProps {
  pois: POIResponseData[]
  center: [number, number]
  highlightedId: string | null
  onMarkerClick?: (id: string) => void
}

export function SearchMap({ pois, center, highlightedId, onMarkerClick }: SearchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const [L, setL] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Store center in ref so map init doesn't re-run on every render
  const centerRef = useRef(center)

  // Load Leaflet dynamically (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return
    import("leaflet")
      .then((leaflet) => {
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        setL(leaflet)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: centerRef.current,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current.clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L])

  // Rebuild markers whenever the poi list changes
  useEffect(() => {
    if (!mapRef.current || !L) return
    const map = mapRef.current

    // Remove previous markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    const validPois = pois.filter((p) => p.latitude && p.longitude)
    if (validPois.length === 0) return

    const bounds: [number, number][] = []

    validPois.forEach((poi) => {
      const id = String(poi.id)
      const isHighlighted = id === highlightedId
      const icon = createMarkerIcon(L, isHighlighted)

      const marker = L.marker([poi.latitude, poi.longitude], { icon }).addTo(map)

      marker.bindPopup(
        `<div style="font-family:system-ui,sans-serif;min-width:160px;">
          <p style="font-weight:600;font-size:14px;margin:0 0 4px;">${poi.name}</p>
          <p style="font-size:12px;color:#6b7280;margin:0;">
            ⭐ ${poi.rating?.toFixed(1) ?? "—"} · ${poi.reviewCount ?? 0} reviews
          </p>
        </div>`,
        { maxWidth: 220, closeButton: false }
      )

      marker.on("mouseover", () => marker.openPopup())

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(id))
      }

      markersRef.current.set(id, marker)
      bounds.push([poi.latitude, poi.longitude])
    })

    // Fit map to show all markers
    try {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
    } catch {
      // fitBounds can fail if bounds are empty; ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pois, L])

  // Update marker icons when highlighted id changes (no full rebuild)
  useEffect(() => {
    if (!L) return
    markersRef.current.forEach((marker, id) => {
      const isHighlighted = id === highlightedId
      marker.setIcon(createMarkerIcon(L, isHighlighted))
    })
  }, [highlightedId, L])

  if (isLoading || !L) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-2 animate-pulse" />
          <p className="text-sm">Loading map…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Leaflet CSS — injected at runtime to avoid SSR issues */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />
    </>
  )
}

// Helper: build a divIcon for normal / highlighted state
function createMarkerIcon(L: any, highlighted: boolean) {
  const size = highlighted ? 40 : 32
  const bg = highlighted ? "#ec4899" : "#ffffff"
  const border = highlighted ? "#db2777" : "#94a3b8"
  const shadow = highlighted
    ? "0 4px 12px rgba(236,72,153,0.45)"
    : "0 2px 8px rgba(0,0,0,0.15)"

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border:2.5px solid ${border};
      border-radius:50%;
      box-shadow:${shadow};
      transition:all 0.18s ease;
    "></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
