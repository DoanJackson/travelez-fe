// Mock data for Vietnam Discover page

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

export interface Experience {
  id: string
  title: string
  description: string
  icon: string // lucide icon name
  imageUrl: string
  theme: string
}

export interface POI {
  id: string
  name: string
  nameVi: string
  category: "landmark" | "beach" | "cafe" | "viewpoint" | "market" | "temple" | "museum"
  city: string
  rating: number
  reviewCount: number
  imageUrl: string
  isTravelersChoice?: boolean
  isSaved?: boolean
}

export interface CityGuide {
  id: string
  title: string
  description: string
  imageUrl: string
  readTime: string
}

export const vietnamCities: City[] = [
  {
    id: "hanoi",
    name: "Hanoi",
    nameVi: "Hà Nội",
    region: "north",
    vibe: "Old Quarter streets & street food",
    tags: ["cultural", "foodie", "historic"],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    placesCount: 128,
    reviewsCount: 450,
  },
  {
    id: "hcmc",
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    region: "south",
    vibe: "Street food & nightlife",
    tags: ["foodie", "urban", "vibrant"],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    placesCount: 215,
    reviewsCount: 680,
  },
  {
    id: "danang",
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    region: "central",
    vibe: "Beaches & modern city",
    tags: ["beach", "modern", "nature"],
    imageUrl: "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    placesCount: 92,
    reviewsCount: 380,
  },
  {
    id: "dalat",
    name: "Da Lat",
    nameVi: "Đà Lạt",
    region: "central",
    vibe: "Cool climate & pine hills",
    tags: ["nature", "romantic", "cool"],
    imageUrl: "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?w=800&q=80",
    placesCount: 67,
    reviewsCount: 290,
  },
  {
    id: "nhatrang",
    name: "Nha Trang",
    nameVi: "Nha Trang",
    region: "central",
    vibe: "Beach resorts & island tours",
    tags: ["beach", "resort", "diving"],
    imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    placesCount: 78,
    reviewsCount: 340,
  },
  {
    id: "hoian",
    name: "Hoi An",
    nameVi: "Hội An",
    region: "central",
    vibe: "Ancient town & lanterns",
    tags: ["cultural", "historic", "romantic"],
    imageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80",
    placesCount: 54,
    reviewsCount: 420,
  },
  {
    id: "sapa",
    name: "Sa Pa",
    nameVi: "Sa Pa",
    region: "north",
    vibe: "Mountain trekking & rice terraces",
    tags: ["nature", "trekking", "ethnic"],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    placesCount: 41,
    reviewsCount: 210,
  },
  {
    id: "phuquoc",
    name: "Phu Quoc",
    nameVi: "Phú Quốc",
    region: "south",
    vibe: "Island paradise & seafood",
    tags: ["beach", "island", "nature"],
    imageUrl: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800&q=80",
    placesCount: 63,
    reviewsCount: 310,
  },
]

export const vietnamExperiences: Experience[] = [
  {
    id: "food",
    title: "Street food & cà phê sữa đá",
    description: "Discover Vietnam's legendary food culture",
    icon: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    theme: "food",
  },
  {
    id: "heritage",
    title: "Old towns & heritage streets",
    description: "Walk through centuries of history",
    icon: "Landmark",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    theme: "heritage",
  },
  {
    id: "beach",
    title: "Beaches & island escapes",
    description: "Turquoise waters and white sand",
    icon: "Waves",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    theme: "beach",
  },
  {
    id: "mountain",
    title: "Mountain trekking in the North",
    description: "Rice terraces and ethnic villages",
    icon: "Mountain",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
    theme: "mountain",
  },
  {
    id: "market",
    title: "Night markets & local life",
    description: "Experience authentic Vietnamese culture",
    icon: "Store",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    theme: "market",
  },
  {
    id: "temple",
    title: "Temples & spiritual sites",
    description: "Find peace in sacred places",
    icon: "Church",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80",
    theme: "temple",
  },
]

export const topRatedPOIs: POI[] = [
  {
    id: "nha-tho-duc-ba",
    name: "Notre-Dame Cathedral Basilica",
    nameVi: "Nhà Thờ Đức Bà Sài Gòn",
    category: "landmark",
    city: "Ho Chi Minh City",
    rating: 4.6,
    reviewCount: 1240,
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    isTravelersChoice: true,
  },
  {
    id: "cau-vang",
    name: "Golden Bridge",
    nameVi: "Cầu Vàng",
    category: "landmark",
    city: "Da Nang",
    rating: 4.8,
    reviewCount: 2150,
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    isTravelersChoice: true,
  },
  {
    id: "ha-long-bay",
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    category: "viewpoint",
    city: "Quang Ninh",
    rating: 4.9,
    reviewCount: 3200,
    imageUrl: "https://images.unsplash.com/photo-1561461221-959c3f16234b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isTravelersChoice: true,
  },
  {
    id: "hoi-an-ancient",
    name: "Hoi An Ancient Town",
    nameVi: "Phố Cổ Hội An",
    category: "landmark",
    city: "Hoi An",
    rating: 4.7,
    reviewCount: 1850,
    imageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80",
  },
  {
    id: "ben-thanh",
    name: "Ben Thanh Market",
    nameVi: "Chợ Bến Thành",
    category: "market",
    city: "Ho Chi Minh City",
    rating: 4.3,
    reviewCount: 980,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  },
  {
    id: "my-khe-beach",
    name: "My Khe Beach",
    nameVi: "Bãi Biển Mỹ Khê",
    category: "beach",
    city: "Da Nang",
    rating: 4.5,
    reviewCount: 760,
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
  },
]

export const cityGuides: CityGuide[] = [
  {
    id: "danang-3-days",
    title: "3 perfect days in Đà Nẵng",
    description: "Beaches, bridges, and bánh mì – a complete itinerary",
    imageUrl: "https://images.unsplash.com/photo-1750015198421-b8190d7562c5?q=80&w=2784&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: "8 min read",
  },
  {
    id: "dalat-best-time",
    title: "Best time to visit Đà Lạt",
    description: "Weather, festivals, and flower blooms guide",
    imageUrl: "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?w=600&q=80",
    readTime: "5 min read",
  },
  {
    id: "hanoi-old-quarter",
    title: "Where to stay in Hanoi's Old Quarter",
    description: "Neighborhoods, hotels, and local tips",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    readTime: "6 min read",
  },
  {
    id: "hcmc-food-guide",
    title: "Ultimate Saigon street food map",
    description: "From phở to cơm tấm – where locals eat",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    readTime: "10 min read",
  },
]
