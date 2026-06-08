"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Activity, DayItinerary } from "@/types/itinerary";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ActivityMeta {
  globalIndex: number;
  dayColor: string;
}

interface MapPanelProps {
  days: DayItinerary[];
  activeDay: number;
  activeActivityId: string | null;
  onMarkerClick: (activity: Activity) => void;
  activityMeta: Map<string, ActivityMeta>;
  /** Override the initial map center. Defaults to HCMC [10.8231, 106.6297]. */
  initialCenter?: [number, number];
  /** Override the initial zoom level. Defaults to 13. */
  initialZoom?: number;
  /** Receives the Leaflet map instance once initialised, for external control. */
  mapInstanceRef?: React.RefObject<any>;
  /** "numbered" (default) shows a numbered bubble; "pin" shows a small dot. */
  markerType?: "numbered" | "pin";
}

export function MapPanel({
  days,
  activeDay,
  activeActivityId,
  onMarkerClick,
  activityMeta,
  initialCenter = [10.8231, 106.6297],
  initialZoom = 13,
  mapInstanceRef,
  markerType = "numbered",
}: MapPanelProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const dayActivities = useMemo(
    () => days.find((d) => d.dayNumber === activeDay)?.activities ?? [],
    [days, activeDay],
  );

  // Effect 1: Load Leaflet library
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;

      const leaflet = await import("leaflet");

      // Fix default marker icon issue
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      setL(leaflet);
    };

    loadLeaflet();
  }, []);

  // Effect 2: Initialize map (runs once after Leaflet is loaded)
  useEffect(() => {
    if (!L) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    if (mapInstanceRef) mapInstanceRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L]);

  // Effect 3: Add/update markers and polyline for active day only
  useEffect(() => {
    if (!mapRef.current || !L || dayActivities.length === 0) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current.clear();

    // Add markers for active day only
    dayActivities.forEach((activity) => {
      if (activity.lat == null || activity.lng == null) return;
      const isActive = activity.id === activeActivityId;
      const meta = activityMeta.get(activity.id);
      const color = meta?.dayColor ?? "#6b7280";
      const num = meta?.globalIndex ?? 0;

      const icon =
        markerType === "pin"
          ? L.divIcon({
              html: `<div style="width:14px;height:14px;border-radius:50%;background:#EC4899;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
              className: "",
              iconAnchor: [7, 7],
            })
          : L.divIcon({
              html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            transform: ${isActive ? "scale(1.2)" : "scale(1)"};
            transition: all 0.2s;
          ">
            ${num}
          </div>
        `,
              className: "",
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

      try {
        const marker = L.marker([activity.lat, activity.lng], { icon })
          .addTo(map)
          .on("click", () => onMarkerClick(activity))
          .bindTooltip(activity.title, {
            permanent: false,
            direction: "top",
            className: "leaflet-tooltip-custom",
            offset: [0, -8],
          });

        markersRef.current.set(activity.id, marker);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    // Fit bounds to active day markers
    try {
      const geocoded = dayActivities.filter((a) => a.lat != null && a.lng != null);
      if (geocoded.length > 0) {
        const bounds = L.latLngBounds(geocoded.map((a) => [a.lat!, a.lng!] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [L, dayActivities, activeActivityId, onMarkerClick, activityMeta]);

  // Effect 4: Center map on active activity
  useEffect(() => {
    if (!mapRef.current || !activeActivityId) return;

    const activeActivity = dayActivities.find((a) => a.id === activeActivityId);
    if (activeActivity && activeActivity.lat != null && activeActivity.lng != null) {
      try {
        mapRef.current.setView([activeActivity.lat, activeActivity.lng], 15, {
          animate: true,
          duration: 0.5,
        });
      } catch (error) {
        console.error("Error setting view:", error);
      }
    }
  }, [activeActivityId, dayActivities]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[450px] bg-gray-100"
      />
      {!L && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
        <Button variant="outline" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          View on map
        </Button>
      </div>
    </div>
  );
}
