// Mock data for city detail pages
// POIs and dining are fetched from the real API — no mock data for those.

export interface CityDetail {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  heroImage: string;
  tags: string[];
  placesCount: number;
  reviewsCount: number;
  description: string;
  /** Backend place ID used to scope POI fetches to this city. */
  placeId: number;
  /** Geographic center used for map initialisation. */
  lat: number;
  lng: number;
  quickFacts: {
    bestTime: string;
    weather: string;
    budget: string;
    popularStyles: string[];
    recommendedStay: string;
  };
}

export interface CityExperience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  price?: string;
}

export interface CityGuide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
  author?: string;
}

// Ho Chi Minh City Data

export const hoChiMinhCityHeroImages = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80",
  "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1600&q=80",
];

export const hoChiMinhCity: CityDetail = {
  id: "hcmc",
  slug: "ho-chi-minh-city",
  name: "Ho Chi Minh City",
  nameVi: "Thành phố Hồ Chí Minh",
  heroImage:
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80",
  tags: ["Urban", "Nightlife", "Foodie", "Culture"],
  placesCount: 215,
  reviewsCount: 680,
  placeId: 28,
  lat: 10.7769,
  lng: 106.7009,
  description:
    "Ho Chi Minh City is a vibrant blend of rich history, dynamic street life, and a thriving food culture. From bustling markets and timeless colonial architecture to modern cafés and lively nightlife, the city offers endless opportunities to explore, taste, and capture unforgettable moments. Whether you're wandering through charming alleyways or enjoying a bowl of iconic phở, Saigon welcomes you with energy, warmth, and a unique charm unlike anywhere else.",
  quickFacts: {
    bestTime: "December to April (dry season)",
    weather: "Tropical climate, avg 27-30°C year-round",
    budget: "₫500,000 - ₫1,500,000 per day (~$20-$60 USD)",
    popularStyles: ["Foodie", "Culture", "Nightlife", "Shopping"],
    recommendedStay: "3-5 days",
  },
};

export const hoChiMinhExperiences: CityExperience[] = [
  {
    id: "street-food-tour",
    title: "Saigon Street Food Tour by Motorbike",
    description: "Explore the city's best street food spots like a local",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    duration: "3-4 hours",
    price: "₫800,000",
  },
  {
    id: "night-cruise",
    title: "Saigon River Night Cruise",
    description: "Romantic dinner cruise with city skyline views",
    imageUrl:
      "https://images.unsplash.com/photo-1651901927035-61cc17296ac3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    duration: "2 hours",
    price: "₫1,200,000",
  },
  {
    id: "cu-chi-tunnels",
    title: "Củ Chi Tunnels Half-Day Trip",
    description: "Historic underground tunnel network from the Vietnam War",
    imageUrl:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80",
    duration: "Half day",
    price: "₫600,000",
  },
  {
    id: "coffee-culture",
    title: "Saigon Coffee Culture Walk",
    description: "Discover hidden cafés and local coffee traditions",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80",
    duration: "2-3 hours",
    price: "₫400,000",
  },
];

export const hoChiMinhGuides: CityGuide[] = [
  {
    id: "3-days-hcmc",
    title: "3 Perfect Days in Ho Chi Minh City",
    description: "A complete itinerary covering history, food, and culture",
    imageUrl:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
    readTime: "10 min read",
    author: "TravelEZ Team",
  },
  {
    id: "best-pho",
    title: "Where to Find the Best Phở in Saigon",
    description: "Local recommendations for authentic Vietnamese noodle soup",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    readTime: "6 min read",
    author: "Food Editor",
  },
  {
    id: "hidden-cafes",
    title: "10 Hidden Cafés Only Locals Know",
    description: "Escape the tourist trail with these secret coffee spots",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80",
    readTime: "8 min read",
    author: "Local Expert",
  },
  {
    id: "budget-guide",
    title: "How to Experience Saigon on a Budget",
    description: "Enjoy the city without breaking the bank",
    imageUrl:
      "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=600&q=80",
    readTime: "7 min read",
    author: "Budget Traveler",
  },
];

// Helper functions

export function getCityBySlug(slug: string): CityDetail | null {
  if (slug === "ho-chi-minh-city" || slug === "hcmc") {
    return hoChiMinhCity;
  }
  return null;
}

export function getCityExperiences(citySlug: string): CityExperience[] {
  if (citySlug === "ho-chi-minh-city" || citySlug === "hcmc") {
    return hoChiMinhExperiences;
  }
  return [];
}

export function getCityGuides(citySlug: string): CityGuide[] {
  if (citySlug === "ho-chi-minh-city" || citySlug === "hcmc") {
    return hoChiMinhGuides;
  }
  return [];
}

export function getCityHeroImages(citySlug: string): string[] {
  if (citySlug === "ho-chi-minh-city" || citySlug === "hcmc") {
    return hoChiMinhCityHeroImages;
  }
  return [];
}
