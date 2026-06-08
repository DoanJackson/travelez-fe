// Mock data for TravelEZ Home Page
// Focus: POI Discovery, Destinations, and Experiences (NOT booking/tours)

import { LucideIcon } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Category for POI types (used in the top icon bar)
 */
export interface POICategory {
  id: string
  name: string
  icon: string // Lucide icon name as string
  count: number
}

/**
 * Highlight item within an activity card
 * CRITICAL: Must be objects (not strings) to enable hover interactions
 */
export interface ActivityHighlight {
  id: string
  name: string
  image: string
  location?: string
}

/**
 * Main Activity Card (re-purposed for POI Discovery)
 * Represents a themed collection of destinations/POIs
 */
export interface ActivityCard {
  id: string
  title: string
  badgeText: string // e.g., "120+ Spots", "Top Rated"
  defaultImage: string // Fallback background image
  highlights: ActivityHighlight[] // Array of specific places (for hover effect)
  cta: string // Call-to-action text, e.g., "Discover Places"
}

/**
 * Tag for categorizing attractions
 */
export interface AttractionTag {
  id: string
  label: string
  variant?: "default" | "secondary" | "outline"
}

/**
 * Best Attraction (Recommendation Focus)
 * Represents a specific POI with community metrics
 */
export interface BestAttraction {
  id: string
  slug: string
  name: string
  nameVi?: string
  location: string
  city: string
  distance: string
  rating: number
  reviewCount: number
  checkIns: number // Community engagement metric
  tags: string[] // e.g., "Historic", "Nature", "Photography"
  imageUrl: string
  isTravelersChoice?: boolean
  isSaved?: boolean
  description?: string
}

/**
 * Hot Topic for trending travel content
 */
export interface HotTopic {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  category: "guide" | "trend" | "tip"
  readTime?: string
}

/**
 * Travel News Item
 */
export interface TravelNews {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  publishedAt: string
  category: string
  readTime: string
}

// ============================================================================
// POI CATEGORIES (Top Icon Bar)
// ============================================================================

export const poiCategories: POICategory[] = [
  {
    id: "ruins",
    name: "Ancient Sites",
    icon: "Mountain",
    count: 87,
  },
  {
    id: "snorkel",
    name: "Beach & Dive",
    icon: "Waves",
    count: 124,
  },
  {
    id: "cycling",
    name: "City Tours",
    icon: "Bike",
    count: 156,
  },
  {
    id: "trekking",
    name: "Mountain Trek",
    icon: "Footprints",
    count: 93,
  },
  {
    id: "food",
    name: "Food Spots",
    icon: "UtensilsCrossed",
    count: 245,
  },
  {
    id: "cruise",
    name: "River Cruise",
    icon: "Ship",
    count: 45,
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: "Sparkles",
    count: 67,
  },
  {
    id: "roadtrip",
    name: "Scenic Routes",
    icon: "Car",
    count: 52,
  },
]

// ============================================================================
// ACTIVITY CARDS (POI Discovery by Theme)
// ============================================================================

export const activityCards: ActivityCard[] = [
  {
    id: "cultural",
    title: "Must-Visit Cultural Spots",
    badgeText: "120+ Spots",
    defaultImage: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80",
    highlights: [
      {
        id: "h1",
        name: "Hoi An Ancient Town",
        location: "Hội An, Quảng Nam",
        image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80",
      },
      {
        id: "h2",
        name: "Imperial City of Huế",
        location: "Huế, Thừa Thiên Huế",
        image: "https://images.unsplash.com/photo-1555217851-5f8c7f9f6c2c?w=600&q=80",
      },
      {
        id: "h3",
        name: "Temple of Literature",
        location: "Hanoi",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
      },
      {
        id: "h4",
        name: "My Son Sanctuary",
        location: "Quảng Nam",
        image: "https://images.unsplash.com/photo-1604486702268-f9bb2d1b50e6?w=600&q=80",
      },
      {
        id: "h5",
        name: "Notre-Dame Cathedral",
        location: "Ho Chi Minh City",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
      },
    ],
    cta: "Discover Places",
  },
  {
    id: "nature",
    title: "Nature & Adventure Zones",
    badgeText: "85+ Spots",
    defaultImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    highlights: [
      {
        id: "h6",
        name: "Fansipan Peak",
        location: "Sa Pa, Lào Cai",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      },
      {
        id: "h7",
        name: "Ha Long Bay",
        location: "Quảng Ninh",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
      },
      {
        id: "h8",
        name: "Phong Nha Cave",
        location: "Quảng Bình",
        image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
      },
      {
        id: "h9",
        name: "Ba Na Hills",
        location: "Đà Nẵng",
        image: "https://images.unsplash.com/photo-1583074323905-f5b13af4be1d?w=600&q=80",
      },
      {
        id: "h10",
        name: "Cát Tiên National Park",
        location: "Đồng Nai",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
      },
    ],
    cta: "Discover Places",
  },
  {
    id: "beach",
    title: "Top Beach Destinations",
    badgeText: "95+ Beaches",
    defaultImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    highlights: [
      {
        id: "h11",
        name: "My Khe Beach",
        location: "Đà Nẵng",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
      },
      {
        id: "h12",
        name: "Nha Trang Beach",
        location: "Khánh Hòa",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
      },
      {
        id: "h13",
        name: "Long Beach",
        location: "Phú Quốc",
        image: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=600&q=80",
      },
      {
        id: "h14",
        name: "An Bang Beach",
        location: "Hội An",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80",
      },
      {
        id: "h15",
        name: "Mui Ne Beach",
        location: "Bình Thuận",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
      },
    ],
    cta: "Discover Places",
  },
  {
    id: "foodie",
    title: "Authentic Food Experiences",
    badgeText: "200+ Venues",
    defaultImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    highlights: [
      {
        id: "h16",
        name: "Ben Thanh Market",
        location: "Ho Chi Minh City",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      },
      {
        id: "h17",
        name: "Old Quarter Street Food",
        location: "Hanoi",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
      },
      {
        id: "h18",
        name: "Hoi An Night Market",
        location: "Hội An",
        image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80",
      },
      {
        id: "h19",
        name: "Dong Xuan Market",
        location: "Hanoi",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
      },
      {
        id: "h20",
        name: "Cai Rang Floating Market",
        location: "Cần Thơ",
        image: "https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=600&q=80",
      },
    ],
    cta: "Discover Places",
  },
]

// ============================================================================
// BEST ATTRACTIONS (Ho Chi Minh City Focus)
// ============================================================================

export const bestAttractions: BestAttraction[] = [
  {
    id: "saigon-zoo",
    slug: "saigon-zoo-botanical-gardens",
    name: "Saigon Zoo & Botanical Gardens",
    nameVi: "Thảo Cầm Viên Sài Gòn",
    location: "District 1, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "8.6 km from city center",
    rating: 4.2,
    reviewCount: 1847,
    checkIns: 12400,
    tags: ["Nature", "Family-Friendly", "Photography"],
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80",
    isTravelersChoice: true,
    description: "One of the oldest zoos in the world, featuring diverse wildlife and lush botanical gardens in the heart of Saigon.",
  },
  {
    id: "cu-chi",
    slug: "cu-chi-tunnels",
    name: "Cu Chi Tunnels",
    nameVi: "Địa Đạo Củ Chi",
    location: "Cu Chi, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "45 km from city center",
    rating: 4.6,
    reviewCount: 3254,
    checkIns: 28500,
    tags: ["Historic", "Educational", "Adventure"],
    imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80",
    isTravelersChoice: true,
    description: "Historic underground tunnel network used during the Vietnam War, offering a glimpse into wartime resilience.",
  },
  {
    id: "ben-thanh",
    slug: "ben-thanh-market",
    name: "Ben Thanh Market",
    nameVi: "Chợ Bến Thành",
    location: "District 1, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "2.3 km from city center",
    rating: 4.0,
    reviewCount: 2891,
    checkIns: 45600,
    tags: ["Shopping", "Food", "Crowded", "Cultural"],
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    description: "Iconic market offering local food, souvenirs, and a vibrant atmosphere showcasing Saigon's commercial spirit.",
  },
  {
    id: "independence-palace",
    slug: "independence-palace",
    name: "Independence Palace",
    nameVi: "Dinh Độc Lập",
    location: "District 1, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "1.5 km from city center",
    rating: 4.4,
    reviewCount: 2156,
    checkIns: 18900,
    tags: ["Historic", "Architecture", "Museum", "Photography"],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    isTravelersChoice: true,
    description: "Historic palace marking the end of the Vietnam War, preserved with original 1960s-70s architecture and furnishings.",
  },
  {
    id: "war-remnants",
    slug: "war-remnants-museum",
    name: "War Remnants Museum",
    nameVi: "Bảo Tàng Chứng Tích Chiến Tranh",
    location: "District 3, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "3.2 km from city center",
    rating: 4.7,
    reviewCount: 4102,
    checkIns: 32100,
    tags: ["Historic", "Educational", "Photography"],
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80",
    isTravelersChoice: true,
    description: "Powerful museum documenting the Vietnam War through photographs, artifacts, and military equipment.",
  },
  {
    id: "notre-dame",
    slug: "notre-dame-cathedral-saigon",
    name: "Notre-Dame Cathedral Basilica",
    nameVi: "Nhà Thờ Đức Bà Sài Gòn",
    location: "District 1, Ho Chi Minh City",
    city: "Ho Chi Minh City",
    distance: "2.1 km from city center",
    rating: 4.5,
    reviewCount: 3567,
    checkIns: 41200,
    tags: ["Historic", "Architecture", "Photography", "Religious"],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    isTravelersChoice: true,
    description: "Iconic French colonial cathedral built in the late 19th century, featuring stunning Neo-Romanesque architecture.",
  },
]

// ============================================================================
// HOT TOPICS (Trending Content)
// ============================================================================

export const hotTopics: HotTopic[] = [
  {
    id: "topic-1",
    title: "Best Coffee Spots in Hanoi",
    subtitle: "Where locals go for their daily cà phê",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    category: "guide",
    readTime: "7 min read",
  },
  {
    id: "topic-2",
    title: "Hidden Gems in Ho Chi Minh",
    subtitle: "Beyond the tourist trail",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    category: "tip",
    readTime: "5 min read",
  },
  {
    id: "topic-3",
    title: "Best Time to Visit Ha Long Bay",
    subtitle: "Weather, crowds, and optimal months",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
    category: "guide",
    readTime: "6 min read",
  },
  {
    id: "topic-4",
    title: "Trending: Eco-Tourism in Vietnam",
    subtitle: "Sustainable travel is on the rise",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
    category: "trend",
    readTime: "8 min read",
  },
]

// ============================================================================
// TRAVEL NEWS
// ============================================================================

export const travelNews: TravelNews[] = [
  {
    id: "news-1",
    title: "Heritage Trail Opens",
    excerpt: "Explore the newly inaugurated trail connecting ethnic minority villages and showcasing traditional crafts in the Central Highlands.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    publishedAt: "2025-12-15",
    category: "Destinations",
    readTime: "4 min read",
  },
  {
    id: "news-2",
    title: "The Ultimate Guide to Backpacking Through Northern Vietnam During the Rainy Season: Essential Tips, Hidden Gems, and Local Insights",
    excerpt: "Everything you need to know about traveling through Sapa, Ha Giang, and beyond when the mountains come alive with misty landscapes and fewer tourists.",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
    publishedAt: "2025-12-12",
    category: "Travel Guide",
    readTime: "12 min read",
  },
  {
    id: "news-3",
    title: "Ho Chi Minh City River Promenade Gets Major Upgrade",
    excerpt: "The revitalized Saigon River waterfront now features pedestrian zones, cafes, and public art installations.",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    publishedAt: "2025-12-10",
    category: "Urban Development",
    readTime: "5 min read",
  },
  {
    id: "news-4",
    title: "Night Cave Tours Launch at Phong Nha",
    excerpt: "Experience the world's largest cave system after dark with expert-led expeditions starting this month.",
    imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
    publishedAt: "2025-12-08",
    category: "Adventure",
    readTime: "3 min read",
  },
  {
    id: "news-5",
    title: "UNESCO Recognizes Vietnamese Culinary Traditions",
    excerpt: "Traditional food preparation methods from the Mekong Delta receive international heritage status.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    publishedAt: "2025-12-06",
    category: "Culture",
    readTime: "6 min read",
  },
  {
    id: "news-6",
    title: "New Eco-Tourism Initiative in Phu Quoc: Sustainable Travel Programs Connect Visitors with Marine Conservation Efforts",
    excerpt: "Island resorts partner with local conservation groups to offer immersive programs focused on coral reef restoration and sea turtle protection.",
    imageUrl: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=600&q=80",
    publishedAt: "2025-12-04",
    category: "Sustainability",
    readTime: "8 min read",
  },
]

// ============================================================================
// HERO SECTION DATA
// ============================================================================

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  cta: string
  ctaLink: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Plan Your Perfect Vietnam Adventure",
    subtitle: "AI-powered itineraries tailored to your travel style",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80",
    cta: "Start Planning",
    ctaLink: "/planning",
  },
  {
    id: "slide-2",
    title: "Discover Hidden Gems",
    subtitle: "Explore authentic experiences beyond the guidebooks",
    imageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1600&q=80",
    cta: "Explore Now",
    ctaLink: "/discover",
  },
  {
    id: "slide-3",
    title: "Connect with Local Culture",
    subtitle: "Experience Vietnam through the eyes of locals",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80",
    cta: "Learn More",
    ctaLink: "/discover",
  },
]

// ============================================================================
// AI PLANNER STATS
// ============================================================================

export interface PlannerStat {
  id: string
  value: string
  label: string
  icon: string // Lucide icon name
}

export const plannerStats: PlannerStat[] = [
  {
    id: "stat-1",
    value: "50K+",
    label: "Itineraries Created",
    icon: "MapPin",
  },
  {
    id: "stat-2",
    value: "2,500+",
    label: "Places Covered",
    icon: "Compass",
  },
  {
    id: "stat-3",
    value: "4.8/5",
    label: "User Satisfaction",
    icon: "Star",
  },
  {
    id: "stat-4",
    value: "95%",
    label: "Recommendation Accuracy",
    icon: "ThumbsUp",
  },
]
