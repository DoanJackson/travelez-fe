import { POIDetail } from "@/types/poi";

export const notreDameCathedral: POIDetail = {
  id: "notre-dame",
  slug: "nha-tho-duc-ba-sai-gon",
  name: "Nhà Thờ Đức Bà Sài Gòn",
  categories: ["landmark", "architecture"],
  location: {
    lat: 10.7797,
    lng: 106.699,
    address: "01 Công xã Paris, Bến Nghé, District 1",
    district: "District 1",
    city: "Ho Chi Minh City",
  },
  stats: {
    rating: 4.8,
    reviewCount: 2471,
    totalVisitors: "500K+ visitors",
    savedCount: 3200,
  },
  galleryImages: [
    "https://images.unsplash.com/photo-1667412069803-270c58412317?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Main cathedral exterior
    "https://images.unsplash.com/photo-1667412069803-270c58412317?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Cathedral detail
    "https://images.unsplash.com/photo-1709041360672-373d715c16d9?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Interior
    "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80", // Stained glass
    "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80", // Architecture detail
  ],
  meta: {
    entryFee: "Free admission",
    duration: "30-60 mins",
    bestTime: "6 AM - 7 PM",
    suitableFor: [
      "Solo",
      "Couples",
      "Families",
      "Photography",
      "History lovers",
      "Culture seekers",
    ],
  },
  overview:
    "Notre-Dame Cathedral of Saigon, with its iconic twin bell towers and striking red-brick façade, is one of Ho Chi Minh City's most recognizable landmarks. Built in the late 19th century in classic French architectural style, the cathedral offers a serene and elegant atmosphere that appeals to history lovers, culture seekers, and photography enthusiasts alike. Located in the heart of District 1, it is also a convenient starting point for exploring nearby attractions.",
  activities: [
    {
      id: "act-1",
      icon: "Camera",
      title: "Photography & Architecture Walk",
      description:
        "Capture the stunning neo-Romanesque architecture, red-brick exterior, and beautiful stained glass windows.",
    },
    {
      id: "act-2",
      icon: "Church",
      title: "Attend Mass (Check schedule)",
      description:
        "Experience a traditional Catholic service in Vietnamese or Latin in this historic cathedral.",
    },
    {
      id: "act-3",
      icon: "Flower",
      title: "Peaceful contemplation in the garden",
      description:
        "Sit in the quiet garden area surrounding the cathedral for reflection and relaxation.",
    },
  ],
  highlights: [
    {
      type: "love",
      title: "What visitors love",
      description: "Stunning colonial architecture and central location",
    },
    {
      type: "know",
      title: "Good to know",
      description: "Ongoing renovation may limit access to some areas",
    },
    {
      type: "aware",
      title: "Things to be aware of",
      description: "Can be crowded; dress formally for entry",
    },
  ],
  photoSpots: [
    {
      id: "spot-1",
      title: "Front facade with twin towers",
      imageUrl:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80",
      description: "Best view from the plaza in front",
    },
    {
      id: "spot-2",
      title: "Stained glass interior",
      imageUrl:
        "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&q=80",
      description: "Capture the colorful light patterns",
    },
    {
      id: "spot-3",
      title: "Gothic arches and ceiling",
      imageUrl:
        "https://images.unsplash.com/photo-1558514542-ec1508abe6f5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Dramatic architectural details",
    },
  ],
  nearbyPlaces: [
    {
      id: "nearby-1",
      name: "Central Post Office",
      category: "landmark",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Saigon_Central_Post_Office_%2852681461470%29.jpg/960px-Saigon_Central_Post_Office_%2852681461470%29.jpg",
      distance: "200m",
      rating: 4.7,
    },
    {
      id: "nearby-2",
      name: "Saigon Opera House",
      category: "architecture",
      imageUrl:
        "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400&q=80",
      distance: "800m",
      rating: 4.6,
    },
    {
      id: "nearby-3",
      name: "Reunification Palace",
      category: "landmark",
      imageUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80",
      distance: "1.2km",
      rating: 4.5,
    },
  ],
  reviewSummary: {
    average: 4.8,
    total: 2471,
    distribution: {
      5: 1850,
      4: 480,
      3: 98,
      2: 28,
      1: 15,
    },
  },
  isSaved: false,
  isFollowed: false,
};

// Helper function to get POI by id or slug
export function getPOIBySlug(idOrSlug: string): POIDetail | null {
  if (
    idOrSlug === notreDameCathedral.id ||
    idOrSlug === notreDameCathedral.slug
  ) {
    return notreDameCathedral;
  }
  return null;
}
