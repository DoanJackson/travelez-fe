// Shared types for Discover pages

import { BackendPoiType } from "./poi";

export interface City {
  id: string
  name: string
  nameVi: string
  region: "north" | "central" | "south"
  vibe: string
  tags: string[]
  imageUrl: string
  placesCount: number
  reviewsCount: number
  isSaved?: boolean
  isFollowed?: boolean
}

export interface POI {
  id: string
  name: string
  nameVi: string
  poiType: BackendPoiType
  description: string
  imageUrl: string
  rating: number
  reviewCount: number
  neighborhood?: string
  isTravelersChoice?: boolean
  isSaved?: boolean
}

export interface Experience {
  id: string
  title: string
  description: string
  imageUrl: string
  rating: number
  reviewCount: number
}

export interface Guide {
  id: string
  title: string
  description: string
  imageUrl: string
  readTime: string
  author?: string
}

export interface DiningVenue {
  id: string
  name: string
  nameVi: string
  poiType: BackendPoiType
  description: string
  imageUrl: string
  rating: number
  reviewCount: number
  neighborhood?: string
  priceRange?: string
  isSaved?: boolean
}

export interface FilterOption {
  id: string
  label: string
}
