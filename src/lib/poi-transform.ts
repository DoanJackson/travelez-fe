import {
  BackendPoiType,
  POIResponseData,
  POIDetailResponseData,
  POIDetail,
} from "@/types/poi";
import { POI, DiningVenue, Experience } from "@/types/discover";

// --- POI Type UI Map ---
// Single source of truth: maps each backend poiType to the label and Tailwind
// color classes that were previously carried by the "category" vocabulary.
// Visual output is identical to the old category-based system.

export interface PoiTypeUi {
  label: string;
  color: string;
}

const DEFAULT_UI: PoiTypeUi = { label: "Landmark", color: "bg-pink-50 text-pink-600" };

export const POI_TYPE_UI_MAP: Record<BackendPoiType, PoiTypeUi> = {
  ATTRACTION:   { label: "Landmark",       color: "bg-pink-50 text-pink-600"    },
  NATURE:       { label: "Nature & Views", color: "bg-sky-50 text-sky-600"      },
  RELIGIOUS:    { label: "Religious",      color: "bg-indigo-50 text-indigo-600" },
  NIGHTLIFE:    { label: "Culture",        color: "bg-purple-50 text-purple-600" },
  CAFE_DESSERT: { label: "Food & Drink",   color: "bg-amber-50 text-amber-600"  },
  STREET_FOOD:  { label: "Food & Drink",   color: "bg-amber-50 text-amber-600"  },
  RESTAURANT:   { label: "Food & Drink",   color: "bg-amber-50 text-amber-600"  },
  OTHER:        { label: "Landmark",       color: "bg-pink-50 text-pink-600"    },
};

/** Returns UI metadata for a given poiType string. Falls back to Landmark style. */
export function getPoiTypeUi(poiType: string): PoiTypeUi {
  return POI_TYPE_UI_MAP[poiType as BackendPoiType] ?? DEFAULT_UI;
}

// --- Transform functions ---

export function transformToPOI(raw: POIResponseData): POI {
  return {
    id: String(raw.id),
    name: raw.name,
    nameVi: "",
    poiType: raw.poiType as BackendPoiType,
    description: raw.description ?? "",
    imageUrl: raw.medias?.find((m) => m.type === "IMAGE")?.url ?? "",
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    neighborhood: undefined,
    isTravelersChoice: false,
    isSaved: false,
  };
}

export function transformToDiningVenue(raw: POIResponseData): DiningVenue {
  return {
    id: String(raw.id),
    name: raw.name,
    nameVi: "",
    poiType: raw.poiType as BackendPoiType,
    description: raw.description ?? "",
    imageUrl: raw.medias?.find((m) => m.type === "IMAGE")?.url ?? "",
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    neighborhood: undefined,
    priceRange: undefined,
    isSaved: false,
  };
}

export function transformToExperience(raw: POIResponseData): Experience {
  return {
    id: String(raw.id),
    title: raw.name,
    description: raw.description ?? "",
    imageUrl: raw.medias?.find((m) => m.type === "IMAGE")?.url ?? "",
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
  };
}

// --- POI Detail transform (for poi/[id]/page.tsx) ---

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80";

function padGalleryImages(images: string[]): string[] {
  if (images.length === 0) return [FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE];
  if (images.length === 1) return [images[0], images[0], images[0]];
  if (images.length === 2) return [images[0], images[1], images[0]];
  return images;
}

function parseDistrictFromAddress(address: string): string {
  const parts = address.split(",");
  return parts[parts.length - 1]?.trim() ?? "";
}

function parseBestTimeFromOpeningHours(
  openingHour: POIDetailResponseData["openingHour"],
): string {
  if (!openingHour || openingHour.length === 0) return "Check opening hours";
  return openingHour[0].hours;
}

export function transformDetailToPoiDetail(raw: POIDetailResponseData): POIDetail {
  const images = (raw.medias ?? [])
    .filter((m) => m.type === "IMAGE")
    .map((m) => m.url);

  return {
    id: String(raw.id),
    slug: String(raw.id),
    name: raw.name,
    categories: [raw.poiType],
    location: {
      lat: raw.latitude,
      lng: raw.longitude,
      address: raw.address,
      district: parseDistrictFromAddress(raw.address),
      city: "",
    },
    stats: {
      rating: raw.rating,
      reviewCount: raw.reviewCount,
    },
    galleryImages: padGalleryImages(images),
    meta: {
      entryFee: "Check on-site",
      duration: "Check on-site",
      bestTime: parseBestTimeFromOpeningHours(raw.openingHour),
      suitableFor: [],
    },
    overview: raw.description ?? "",
    activities: [],
    highlights: [],
    photoSpots: [],
    nearbyPlaces: [],
    reviewSummary: {
      average: raw.rating,
      total: raw.reviewCount,
      distribution: {
        5: raw.reviewsDistribution?.fiveStar ?? 0,
        4: raw.reviewsDistribution?.fourStar ?? 0,
        3: raw.reviewsDistribution?.threeStar ?? 0,
        2: raw.reviewsDistribution?.twoStar ?? 0,
        1: raw.reviewsDistribution?.oneStar ?? 0,
      },
    },
    isSaved: false,
    isFollowed: false,
  };
}
