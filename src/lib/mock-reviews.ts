// Mock data for the Review Hub page
import type { ReviewLocation } from "@/types/review";

// export interface ReviewLocation {
//   id: number;
//   name: string;
//   imageUrl: string;
//   address?: string;
//   poiType?: string;
//   poiTypeDetail?: string;
//   rating?: number;
//   reviewCount?: number;
// }

export interface RecentReview {
  id: number;
  location: ReviewLocation;
  /** Numeric rating 1.0 – 5.0 */
  rating: number;
  excerpt: string;
  /** Relative time string, e.g. "2 days ago" */
  reviewedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────

export const recentReviews: RecentReview[] = [
  {
    id: 1,
    location: {
      id: 1,
      name: "Ba Na Hills",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5H0Q5z2JgxVhWeaWM3Lt8NDt11Cj6B52hrb9F4jYjnjVIQhedlZxPhpKLMrAgPOVh7wocYC3VytELh5_imdzBRsh5GZpgDIifn0xl3VK2Ju-DFNggrMcK7L5k0GuRDc5pMDB-UEGEAF11wr-yOMcmlVu3re4DB7zhsDsZXcpeL55X-IrSOx1zyP-SdXsXn5tgX-IXYHPYnWyL1iO81IaNHdZJBABf5eVFKIkvPfIT1EEDVFE80tNvwYrRF9BTh6PzKL-OE3-bJ9s",
    },
    rating: 4.8,
    excerpt:
      "Breathtaking views and the weather was perfect. A bit crowded but worth the trip...",
    reviewedAt: "2 days ago",
  },
  {
    id: 2,
    location: {
      id: 2,
      name: "Hoi An Ancient Town",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-2UlG9_uv9LxdSa0PimzOA5kS_ZkdIF8gfBB5q7uhvbEnyZlbZyYmqTphDsN0JzVC75yBzjuBH5G-wA6Eyo_61DnuEviFAEjFbq5jz4K8j5AjYFYr88rL81G_omfipF6Y0YrKSa8FeqpxlnU396O_r_UL7VPP9rNyJQMNU8iU0JCurlJJeB655wEhlFaM9yDTBB83JnadBV_TcR5WnxaRWhtP5W34FWPsAuRV0ZHPgUUblJL9aWQzipqVNglHZLnq4KadaDHdZpc",
    },
    rating: 5.0,
    excerpt:
      "The lanterns at night are magical. Make sure to try the Cao Lau at the market!",
    reviewedAt: "5 days ago",
  },
  {
    id: 3,
    location: {
      id: 3,
      name: "Dalat Pine Forest",
      imageUrl:
        "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?w=600&q=80",
    },
    rating: 4,
    excerpt:
      "Cool misty mornings and endless pine trees. The flower gardens near the city centre are a hidden gem.",
    reviewedAt: "1 week ago",
  },
];

// ─── Searchable locations (for the LocationSearchBar autocomplete) ──────────

export const searchableLocations: ReviewLocation[] = [
  ...recentReviews.map((r) => r.location),
  {
    id: 1,
    name: "Ha Long Bay",
    imageUrl:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
  },
  {
    id: 2,
    name: "Sapa Rice Terraces",
    imageUrl:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
  },
];
