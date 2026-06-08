// Mock POI data for Notre-Dame Cathedral
export const POI_DATA = {
  name: "Nhà Thờ Đức Bà",
  fullName: "Saigon Notre-Dame Cathedral Basilica",
  address: "01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
  ratingAvg: 4.7,
  totalReviews: 12402,
};

// Mock photos from travelers
export const TRAVELER_PHOTOS = [
  "https://images.unsplash.com/photo-1667412069803-270c58412317?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Main cathedral exterior
  "https://images.unsplash.com/photo-1667412069803-270c58412317?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Cathedral detail
  "https://images.unsplash.com/photo-1709041360672-373d715c16d9?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Interior
  "https://images.unsplash.com/photo-1758629277649-3dd5c0749dc0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Stained glass
  "https://images.unsplash.com/photo-1561556024-b584625bde48?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// Extended mock reviews
export const MOCK_REVIEWS = [
  {
    id: "r1",
    authorName: "Alice M.",
    date: "Oct 2024",
    tripType: "Family trip",
    rating: 5,
    title: "Worth the wait for the sunset!",
    content:
      "We booked our tickets about 2 months in advance for the summit access. The elevator ride up is part of the experience. We timed it to be at the top right before sunset, and the view of Paris lighting up is unforgettable. It was crowded, but everyone was respectful.",
    photos: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&q=80",
    ],
    reactions: { helpful: 124, love: 45, wow: 28 },
  },
  {
    id: "r2",
    authorName: "James K.",
    date: "Sep 2024",
    tripType: "Couple trip",
    rating: 4,
    title: "Beautiful but too many stairs if you walk",
    content:
      "Decided to take the stairs to the second floor to skip the elevator line. It was a good workout but definitely tiring if you aren't prepared! The view from the second floor is actually better for photos than the summit because you can still see the details of the city buildings.",
    photos: [],
    reactions: { helpful: 89, love: 23, wow: 12 },
  },
  {
    id: "r3",
    authorName: "Chen L.",
    date: "Aug 2024",
    tripType: "Solo trip",
    rating: 5,
    title: "Iconic for a reason",
    content:
      "I was worried it would be a tourist trap, but seeing the structure up close is genuinely impressive. The engineering is marvel. Suggest going early morning to beat the rush.",
    photos: [],
    reactions: { helpful: 203, love: 78, wow: 34 },
  },
  {
    id: "r4",
    authorName: "Maria G.",
    date: "Jul 2024",
    tripType: "Friends",
    rating: 5,
    title: "Stunning architecture and peaceful interior",
    content:
      "The red brick facade is absolutely gorgeous, especially in the golden hour light. We visited during a quiet weekday afternoon and the interior was peaceful and serene. The stained glass windows are beautiful. Don't forget to visit the nearby post office too!",
    photos: [
      "https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=200&q=80",
    ],
    reactions: { helpful: 156, love: 92, wow: 41 },
  },
  {
    id: "r5",
    authorName: "David T.",
    date: "Jun 2024",
    tripType: "Family trip",
    rating: 4,
    title: "Great landmark but under renovation",
    content:
      "Beautiful French colonial architecture in the heart of Saigon. When we visited, parts were under renovation so we couldn't access the full interior. Still worth the visit for photos outside. The square in front is nice for relaxing and watching people.",
    photos: [],
    reactions: { helpful: 178, love: 34, wow: 19 },
  },
  {
    id: "r6",
    authorName: "Sophie B.",
    date: "May 2024",
    tripType: "Couple trip",
    rating: 5,
    title: "Romantic and historic",
    content:
      "Perfect stop for couples exploring District 1. The cathedral is beautiful and makes for great photos. We attended a Sunday mass which was a lovely cultural experience. The atmosphere is calm despite being in a busy area.",
    photos: [
      "https://images.unsplash.com/photo-1561556024-b584625bde48?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    reactions: { helpful: 132, love: 156, wow: 22 },
  },
  {
    id: "r7",
    authorName: "Minh N.",
    date: "Apr 2024",
    tripType: "Solo trip",
    rating: 4,
    title: "Iconic Saigon landmark",
    content:
      "As a local, I've passed by this cathedral countless times. It's a piece of history right in the city center. Best visited early morning when there are fewer tourists. The architecture is a reminder of the French colonial period.",
    photos: [],
    reactions: { helpful: 94, love: 38, wow: 15 },
  },
  {
    id: "r8",
    authorName: "Emma W.",
    date: "Mar 2024",
    tripType: "Family trip",
    rating: 5,
    title: "Must-see for first-time visitors",
    content:
      "This was on our must-see list and it didn't disappoint. The kids enjoyed the square and the cathedral is impressive. We combined it with a visit to the post office and the history museum nearby. Very walkable area with lots of photo opportunities.",
    photos: [],
    reactions: { helpful: 167, love: 89, wow: 31 },
  },
  {
    id: "r9",
    authorName: "Tom H.",
    date: "Feb 2024",
    tripType: "Couple trip",
    rating: 4,
    title: "Beautiful but crowded on weekends",
    content:
      "Visited on a Saturday afternoon and it was packed with tourists. Still managed to get some nice photos. The red bricks contrast beautifully with the blue sky. Would recommend visiting on a weekday for a more relaxed experience.",
    photos: [
      "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=200&q=80",
    ],
    reactions: { helpful: 112, love: 45, wow: 18 },
  },
  {
    id: "r10",
    authorName: "Lisa P.",
    date: "Jan 2024",
    tripType: "Friends",
    rating: 5,
    title: "Photogenic masterpiece",
    content:
      "Perfect for photography enthusiasts! The architecture is stunning from every angle. We spent about an hour just taking photos from different perspectives. The area around is also beautiful with trees and open space.",
    photos: [
      "https://images.unsplash.com/photo-1561556024-b584625bde48?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    reactions: { helpful: 198, love: 234, wow: 67 },
  },
  {
    id: "r11",
    authorName: "Robert C.",
    date: "Dec 2023",
    tripType: "Solo trip",
    rating: 4,
    title: "Impressive French colonial architecture",
    content:
      "The neo-Romanesque design is well-preserved and makes for an interesting contrast with the modern buildings nearby. Free to visit the exterior. Check the schedule if you want to go inside during mass times.",
    photos: [],
    reactions: { helpful: 143, love: 56, wow: 29 },
  },
  {
    id: "r12",
    authorName: "Anna K.",
    date: "Nov 2023",
    tripType: "Family trip",
    rating: 5,
    title: "Historical gem in the city center",
    content:
      "Loved learning about the history of this cathedral. Built with materials imported from France in the 1880s. The twin bell towers are iconic. Great for a quick visit or combining with a walking tour of District 1.",
    photos: [],
    reactions: { helpful: 187, love: 101, wow: 43 },
  },
];
