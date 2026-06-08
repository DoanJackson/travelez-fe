export interface Itinerary {
  id: string
  title: string
  createdAt: string
  durationDays: number
  locations: string[]
  thumbnailUrl?: string
  ownerUsername?: string
  isPublic?: boolean
}

export const mockItineraries: Itinerary[] = [
  {
    id: "1",
    title: "Ho Chi Minh — 3 days",
    createdAt: "2025-12-05",
    durationDays: 3,
    locations: ["Ho Chi Minh City", "Vung Tau"],
    thumbnailUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  },
  {
    id: "2",
    title: "Tokyo Adventure — 7 days",
    createdAt: "2025-11-28",
    durationDays: 7,
    locations: ["Tokyo", "Kyoto", "Osaka"],
    thumbnailUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  },
  {
    id: "3",
    title: "Hanoi Heritage Tour — 4 days",
    createdAt: "2025-11-20",
    durationDays: 4,
    locations: ["Hanoi", "Ha Long Bay"],
    thumbnailUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  },
  {
    id: "4",
    title: "Seoul & Busan — 6 days",
    createdAt: "2025-11-15",
    durationDays: 6,
    locations: ["Seoul", "Busan", "Jeju Island"],
    thumbnailUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80",
  },
  {
    id: "5",
    title: "Da Nang Beach Escape — 5 days",
    createdAt: "2025-11-10",
    durationDays: 5,
    locations: ["Da Nang", "Hoi An"],
    thumbnailUrl: "https://images.unsplash.com/photo-1558002890-c0b30998d1e6?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    title: "Singapore Getaway — 2 days",
    createdAt: "2025-11-02",
    durationDays: 2,
    locations: ["Singapore"],
    thumbnailUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  },
  {
    id: "7",
    title: "Bali Retreat — 8 days",
    createdAt: "2025-10-25",
    durationDays: 8,
    locations: ["Denpasar", "Ubud", "Seminyak"],
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  },
  {
    id: "8",
    title: "Bangkok Explorer — 4 days",
    createdAt: "2025-10-18",
    durationDays: 4,
    locations: ["Bangkok", "Ayutthaya"],
    thumbnailUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  },
]
