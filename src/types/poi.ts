import { BaseResponse, PaginatedData } from "./api";

// POI (Point of Interest) Type Definitions
export interface POIResponseData {
  id: number;
  name: string;
  poiType: string;
  poiTypeDetail: string;
  systemStatus: string;
  address: string;
  website: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  status: string;
  googleMapsUrl: string;
  description?: string;
  medias?: { id: number; url: string; type: string }[];
}

export type POIResponse = BaseResponse<PaginatedData<POIResponseData>>;

export type BackendPoiType =
  | "ATTRACTION"
  | "NATURE"
  | "RELIGIOUS"
  | "NIGHTLIFE"
  | "CAFE_DESSERT"
  | "STREET_FOOD"
  | "RESTAURANT"
  | "OTHER";

export interface POIDetailResponseData {
  id: number;
  placeId?: number;
  name: string;
  poiType: string;
  poiTypeDetail: string;
  systemStatus: string;
  address: string;
  website: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  status: string;
  googleMapsUrl: string;
  phoneNumber: string;
  description: string;
  googlePlaceId: string;
  openingHour: {
    day: string;
    hours: string;
  }[];
  reviewsDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  additionalInfo: Record<string, any>;
  medias: {
    id: number;
    url: string;
    type: string;
  }[];
}

export type POICategory = 
  | "landmark"
  | "architecture"
  | "culture"
  | "temple"
  | "museum"
  | "park"
  | "market"
  | "food-drink"
  | "views"

export type POISuitableFor = 
  | "Solo"
  | "Couples"
  | "Families"
  | "Groups"
  | "Photography"
  | "History lovers"
  | "Culture seekers"

export interface POILocation {
  lat: number
  lng: number
  address: string
  district: string
  city: string
}

export interface POIStats {
  rating: number
  reviewCount: number
  totalVisitors?: string
  savedCount?: number
}

export interface POIMeta {
  entryFee: string
  duration: string
  bestTime: string
  suitableFor: POISuitableFor[]
}

export interface POIActivity {
  id: string
  icon: string
  title: string
  description: string
}

export interface POIHighlight {
  type: "love" | "know" | "aware"
  title: string
  description: string
}

export interface POIPhotoSpot {
  id: string
  title: string
  imageUrl: string
  description: string
}

export interface POINearbyPlace {
  id: string
  name: string
  category: POICategory
  imageUrl: string
  distance: string
  rating: number
}

export interface POIReview {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  text: string
  images?: string[]
  helpful: number
}

export interface POIReviewSummary {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface POIDetail {
  id: string
  slug: string
  name: string
  categories: string[]
  location: POILocation
  stats: POIStats
  galleryImages: string[]
  meta: POIMeta
  overview: string
  activities: POIActivity[]
  highlights: POIHighlight[]
  photoSpots: POIPhotoSpot[]
  nearbyPlaces: POINearbyPlace[]
  reviewSummary: POIReviewSummary
  isSaved: boolean
  isFollowed: boolean
}
