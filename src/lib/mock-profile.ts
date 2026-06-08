import type { ProfileReview } from "@/types/profile";
// import { communityPosts } from "@/lib/mock-community";
import type { CommunityPost } from "@/types/post";

// ─── Mock profile user ────────────────────────────────────────────────────
// Fallback values used when GET /api/users/me is unavailable.
// joinDate and role have no API equivalent and remain here as fallbacks.

export const mockProfileUser = {
  fullName: "Nguyen Traveler",
  username: "nguyentraveler",
  joinDate: "January 2024",
  initials: "NT",
  role: "TRAVELER",
  email: "nguyen.traveler@travelez.com",
  dob: "1992-05-14",
  gender: "other",
};

// ─── Mock reviews ─────────────────────────────────────────────────────────

export const mockProfileReviews: ProfileReview[] = [
  {
    id: 1,
    poi: {
      id: 10,
      name: "Bến Thành Market",
      imageUrl:
        "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?auto=format&fit=crop&w=800&q=80",
      category: "Market",
      area: "District 1, Ho Chi Minh City",
    },
    rating: 4,
    content:
      "A chaotic but wonderful sensory experience. The night market outside is less touristy and far more fun — arrive hungry.",
    createdAt: "2024-10-12T08:00:00Z",
    medias: [],
  },
  {
    id: 2,
    poi: {
      id: 11,
      name: "Notre-Dame Cathedral",
      imageUrl:
        "https://images.unsplash.com/photo-1597149577156-6b604d43dd5e?auto=format&fit=crop&w=800&q=80",
      category: "Landmark",
      area: "District 1, Ho Chi Minh City",
    },
    rating: 5,
    content:
      "Beautiful French colonial architecture. Best visited early morning before the crowds arrive — the light is incredible.",
    createdAt: "2024-09-05T09:00:00Z",
    medias: [],
  },
  {
    id: 3,
    poi: {
      id: 12,
      name: "War Remnants Museum",
      imageUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
      category: "Museum",
      area: "District 3, Ho Chi Minh City",
    },
    rating: 5,
    content:
      "Deeply moving and essential. Set aside 2–3 hours and be prepared for heavy content. Not to be missed.",
    createdAt: "2024-08-20T10:00:00Z",
    medias: [],
  },
];

// ─── Mock posts ───────────────────────────────────────────────────────────
// Sliced from communityPosts to avoid data duplication.

// export const mockProfilePosts: CommunityPost[] = communityPosts.slice(0, 3);
