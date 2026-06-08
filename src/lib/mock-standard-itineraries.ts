import {
  Itinerary,
  DayItinerary,
  Activity,
  TravelIndicator,
  EstimatedBudget,
} from "@/types/itinerary";

// ─── Card display type ────────────────────────────────────────────────────────

export interface StandardItineraryCard {
  id: string;
  title: string;
  duration: string;
  style: string;
  image: string;
}

export const standardItineraryCards: StandardItineraryCard[] = [
  {
    id: "preview-hcm-culture-5d",
    title: "5 Days in Ho Chi Minh City",
    duration: "5 Days",
    style: "Culture",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  },
  {
    id: "preview-hcm-food-3d",
    title: "Saigon Street Food Trail",
    duration: "3 Days",
    style: "Food",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    id: "preview-hcm-history-2d",
    title: "Saigon War & History Sites",
    duration: "2 Days",
    style: "History",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80",
  },
  {
    id: "preview-hcm-adventure-4d",
    title: "Cu Chi & Mekong Explorer",
    duration: "4 Days",
    style: "Adventure",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
  },
  {
    id: "preview-hcm-nature-3d",
    title: "Saigon Gardens & Parks",
    duration: "3 Days",
    style: "Nature",
    image:
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80",
  },
  {
    id: "preview-hcm-coffee-2d",
    title: "Saigon Coffee Culture",
    duration: "2 Days",
    style: "Culture",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  },
];

// ─── Structure A: Culture / History (5 days) ─────────────────────────────────

const structureADay1: DayItinerary = {
  dayNumber: 1,
  title: "War & Colonial Saigon",
  date: "2026-04-01",
  activities: [
    {
      id: "a-d1-1",
      title: "THAIYEN CAFE",
      activityType: "CAFE_DESSERT",
      startTime: "8:00",
      endTime: "9:00",
      price: "65,000 VND",
      address: "40B Pham Ngoc Thach, Ward 6, District 3, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      aiTip:
        "Traditional Vietnamese drip coffee is a must-try — rich, slow-brewed and served over ice.",
      lat: 10.7769,
      lng: 106.7009,
    },
    {
      id: "a-d1-2",
      title: "War Remnants Museum",
      activityType: "ATTRACTION",
      startTime: "9:30",
      endTime: "11:30",
      price: "40,000 VND",
      address: "28 Vo Van Tan, Ward 6, District 3, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400&h=300&fit=crop",
      aiTip:
        "Allow at least 2 hours. The photo galleries on the upper floors are the most impactful.",
      lat: 10.7797,
      lng: 106.6928,
    },
    {
      id: "a-d1-3",
      title: "Phở Hoa Pasteur",
      activityType: "RESTAURANT",
      startTime: "12:00",
      endTime: "13:00",
      price: "100,000 VND",
      address: "260C Pasteur, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop",
      aiTip:
        "Serving locals since 1968. Order the classic phở bò chín — well-done beef in clear broth.",
      lat: 10.7871,
      lng: 106.6946,
    },
    {
      id: "a-d1-4",
      title: "Saigon Central Post Office",
      activityType: "ATTRACTION",
      startTime: "14:00",
      endTime: "14:45",
      address:
        "2 Công xã Paris, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop",
      aiTip:
        "Designed by Gustave Eiffel. Send a postcard home from one of the wooden writing desks.",
      lat: 10.7799,
      lng: 106.6996,
    },
    {
      id: "a-d1-5",
      title: "Notre-Dame Cathedral Basilica of Saigon",
      activityType: "ATTRACTION",
      startTime: "15:00",
      endTime: "15:45",
      address:
        "01 Công xã Paris, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
      aiTip:
        "The twin bell towers are the most photographed landmark in Saigon. Best light in late afternoon.",
      lat: 10.7798,
      lng: 106.6991,
    },
    {
      id: "a-d1-6",
      title: "Bitexco Financial Tower Sky Deck",
      activityType: "ATTRACTION",
      startTime: "16:30",
      endTime: "17:30",
      price: "200,000 VND",
      address:
        "36 Hồ Tùng Mậu, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop",
      aiTip:
        "49th-floor sky deck with 360° views. Arrive before sunset for the best cityscape photos.",
      lat: 10.7718,
      lng: 106.7044,
    },
  ],
  travelIndicators: [
    { id: "a-d1-1-t", type: "taxi", duration: "10 min" },
    { id: "a-d1-2-t", type: "walk", duration: "10 min" },
    { id: "a-d1-3-t", type: "walk", duration: "5 min" },
    { id: "a-d1-4-t", type: "walk", duration: "3 min" },
    { id: "a-d1-5-t", type: "walk", duration: "15 min" },
  ],
};

const structureADay2: DayItinerary = {
  dayNumber: 2,
  title: "Independence & Heritage",
  date: "2026-04-02",
  activities: [
    {
      id: "a-d2-1",
      title: "Ben Thanh Market",
      activityType: "SHOPPING",
      startTime: "9:00",
      endTime: "11:00",
      address:
        "Lê Lợi, Phường Bến Thành, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      aiTip:
        "Arrive before 10 AM for the best produce and fewer tourists. Bargain respectfully.",
      lat: 10.7723,
      lng: 106.6988,
    },
    {
      id: "a-d2-2",
      title: "Notre-Dame Cathedral & Post Office Square",
      activityType: "ATTRACTION",
      startTime: "11:30",
      endTime: "12:15",
      address:
        "Công xã Paris, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop",
      aiTip:
        "The square around the cathedral has shaded benches — perfect for a short rest between sights.",
      lat: 10.7798,
      lng: 106.6993,
    },
    {
      id: "a-d2-3",
      title: "Lunch at The Refinery",
      activityType: "RESTAURANT",
      startTime: "13:00",
      endTime: "14:30",
      price: "400,000 VND",
      address:
        "74 Hai Bà Trưng, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      aiTip:
        "French-Vietnamese fusion inside a restored 1930s opium refinery. Reserve ahead on weekends.",
      lat: 10.7756,
      lng: 106.7019,
    },
    {
      id: "a-d2-4",
      title: "Reunification Palace",
      activityType: "ATTRACTION",
      startTime: "15:00",
      endTime: "16:30",
      price: "65,000 VND",
      address:
        "135 Nam Kỳ Khởi Nghĩa, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
      aiTip:
        "Go to the basement war room to see original radio equipment and bunker maps from the 1970s.",
      lat: 10.7769,
      lng: 106.6955,
    },
    {
      id: "a-d2-5",
      title: "A O Show at Saigon Opera House",
      activityType: "ATTRACTION",
      startTime: "19:30",
      endTime: "21:00",
      price: "500,000 VND",
      address:
        "07 Công Trường Lam Sơn, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop",
      aiTip:
        "World-class Vietnamese contemporary circus combining bamboo acrobatics and traditional music.",
      lat: 10.7767,
      lng: 106.7025,
    },
  ],
  travelIndicators: [
    { id: "a-d2-1-t", type: "walk", duration: "8 min" },
    { id: "a-d2-2-t", type: "walk", duration: "8 min" },
    { id: "a-d2-3-t", type: "walk", duration: "10 min" },
    { id: "a-d2-4-t", type: "taxi", duration: "20 min" },
  ],
};

const structureADay3: DayItinerary = {
  dayNumber: 3,
  title: "Cholon & Chinatown",
  date: "2026-04-03",
  activities: [
    {
      id: "a-d3-1",
      title: "Jade Emperor Pagoda",
      activityType: "RELIGIOUS",
      startTime: "9:00",
      endTime: "10:30",
      address: "73 Mai Thị Lựu, Đa Kao, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
      aiTip:
        "Built in 1909 by the Cantonese community. The smell of incense and ornate carvings are unforgettable.",
      lat: 10.7873,
      lng: 106.6994,
    },
    {
      id: "a-d3-2",
      title: "Lunch at Pho Bi",
      activityType: "RESTAURANT",
      startTime: "11:00",
      endTime: "12:00",
      price: "80,000 VND",
      address: "7 Lý Thường Kiệt, Quận 10, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      aiTip:
        "A hidden local gem in District 10. Rich, deeply flavoured broth with generous beef portions.",
      lat: 10.7650,
      lng: 106.6710,
    },
    {
      id: "a-d3-3",
      title: "Binh Tay Market (Chợ Lớn)",
      activityType: "SHOPPING",
      startTime: "12:30",
      endTime: "14:30",
      address:
        "57A Tháp Mười, Phường 2, Quận 6, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      aiTip:
        "The heartbeat of Cholon. Wholesale goods, dried goods, and the original Saigon trading culture.",
      lat: 10.7546,
      lng: 106.6520,
    },
    {
      id: "a-d3-4",
      title: "Thien Hau Pagoda",
      activityType: "RELIGIOUS",
      startTime: "15:00",
      endTime: "16:00",
      address:
        "710 Nguyễn Trãi, Phường 11, Quận 5, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=400&h=300&fit=crop",
      aiTip:
        "The spiral incense coils hanging from the ceiling are a stunning photographic subject.",
      lat: 10.7535,
      lng: 106.6614,
    },
    {
      id: "a-d3-5",
      title: "District 5 Night Market Street Food",
      activityType: "RESTAURANT",
      startTime: "18:30",
      endTime: "20:30",
      price: "150,000 VND",
      address: "Lương Nhữ Học, Quận 5, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900152-b8b27e3b77b9?w=400&h=300&fit=crop",
      aiTip:
        "Try chè (sweet dessert soups), banh bao (steamed buns), and freshly made dim sum.",
      lat: 10.7530,
      lng: 106.6628,
    },
  ],
  travelIndicators: [
    { id: "a-d3-1-t", type: "taxi", duration: "20 min" },
    { id: "a-d3-2-t", type: "taxi", duration: "10 min" },
    { id: "a-d3-3-t", type: "taxi", duration: "8 min" },
    { id: "a-d3-4-t", type: "walk", duration: "15 min" },
  ],
};

const structureADay4: DayItinerary = {
  dayNumber: 4,
  title: "Museums & Arts Quarter",
  date: "2026-04-04",
  activities: [
    {
      id: "a-d4-1",
      title: "HCMC Museum of Fine Arts",
      activityType: "ATTRACTION",
      startTime: "9:00",
      endTime: "11:00",
      price: "30,000 VND",
      address:
        "97A Phó Đức Chính, Nguyễn Thái Bình, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop",
      aiTip:
        "Three floors of Vietnamese lacquer paintings, sculptures and contemporary art in a colonial villa.",
      lat: 10.7735,
      lng: 106.6966,
    },
    {
      id: "a-d4-2",
      title: "Bánh Mì Huỳnh Hoa",
      activityType: "RESTAURANT",
      startTime: "11:30",
      endTime: "12:00",
      price: "60,000 VND",
      address: "26 Lê Thị Riêng, Phạm Ngũ Lão, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop",
      aiTip:
        "The most famous bánh mì in Saigon — worth every minute of the queue. Try the special combo.",
      lat: 10.7691,
      lng: 106.6945,
    },
    {
      id: "a-d4-3",
      title: "HCMC Museum of History",
      activityType: "ATTRACTION",
      startTime: "12:30",
      endTime: "14:30",
      price: "30,000 VND",
      address:
        "2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400&h=300&fit=crop",
      aiTip:
        "Covers 8,000 years of Vietnamese history. The Cham sculpture and ancient bronze drums are highlights.",
      lat: 10.7879,
      lng: 106.7019,
    },
    {
      id: "a-d4-4",
      title: "Nguyễn Huệ Walking Street",
      activityType: "ATTRACTION",
      startTime: "15:00",
      endTime: "16:30",
      address:
        "Nguyễn Huệ, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop",
      aiTip:
        "Saigon's main pedestrian boulevard. The Ho Chi Minh City Hall lit up at sunset is unmissable.",
      lat: 10.7750,
      lng: 106.7010,
    },
    {
      id: "a-d4-5",
      title: "Rex Hotel Rooftop Bar",
      activityType: "CAFE_DESSERT",
      startTime: "17:00",
      endTime: "18:30",
      price: "200,000 VND",
      address:
        "141 Nguyễn Huệ, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      aiTip:
        "The iconic 5th-floor rooftop terrace was a famous press hangout during the 1960s-70s.",
      lat: 10.7745,
      lng: 106.7006,
    },
  ],
  travelIndicators: [
    { id: "a-d4-1-t", type: "taxi", duration: "10 min" },
    { id: "a-d4-2-t", type: "taxi", duration: "12 min" },
    { id: "a-d4-3-t", type: "taxi", duration: "10 min" },
    { id: "a-d4-4-t", type: "taxi", duration: "15 min" },
  ],
};

const structureADay5: DayItinerary = {
  dayNumber: 5,
  title: "Farewell Saigon",
  date: "2026-04-05",
  activities: [
    {
      id: "a-d5-1",
      title: "The Café Apartment",
      activityType: "CAFE_DESSERT",
      startTime: "8:00",
      endTime: "9:30",
      price: "80,000 VND",
      address:
        "42 Nguyễn Huệ, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      aiTip:
        "A 9-storey building with a different café on almost every floor. Ride the vintage lift to the top.",
      lat: 10.7752,
      lng: 106.7008,
    },
    {
      id: "a-d5-2",
      title: "Saigon Zoo & Botanical Gardens",
      activityType: "NATURE",
      startTime: "10:00",
      endTime: "12:00",
      price: "50,000 VND",
      address:
        "2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
      aiTip:
        "Founded in 1864, one of the oldest zoos in Asia. The botanical garden section is shaded and peaceful.",
      lat: 10.7879,
      lng: 106.7093,
    },
    {
      id: "a-d5-3",
      title: "Bánh Xèo 46A",
      activityType: "RESTAURANT",
      startTime: "12:30",
      endTime: "14:00",
      price: "120,000 VND",
      address:
        "46A Đinh Công Tráng, Tân Định, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      aiTip:
        "Legendary sizzling rice crepe restaurant. Wrap pieces in lettuce with herbs and dip in fish sauce.",
      lat: 10.7835,
      lng: 106.6973,
    },
    {
      id: "a-d5-4",
      title: "Đồng Khởi Street Shopping",
      activityType: "SHOPPING",
      startTime: "14:30",
      endTime: "16:00",
      address:
        "Đồng Khởi, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=300&fit=crop",
      aiTip:
        "Saigon's most elegant shopping street. Look for lacquerware, silk and ao dai tailors.",
      lat: 10.7770,
      lng: 106.7024,
    },
    {
      id: "a-d5-5",
      title: "Bạch Đằng Riverfront Promenade",
      activityType: "NATURE",
      startTime: "16:30",
      endTime: "17:30",
      address:
        "Bến Bạch Đằng, Nguyễn Huệ, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop",
      aiTip:
        "The Saigon River at sunset, watching river taxis and cargo boats glide past — a perfect farewell.",
      lat: 10.7784,
      lng: 106.7048,
    },
  ],
  travelIndicators: [
    { id: "a-d5-1-t", type: "taxi", duration: "10 min" },
    { id: "a-d5-2-t", type: "walk", duration: "5 min" },
    { id: "a-d5-3-t", type: "taxi", duration: "12 min" },
    { id: "a-d5-4-t", type: "walk", duration: "10 min" },
  ],
};

const structureADays: DayItinerary[] = [
  structureADay1,
  structureADay2,
  structureADay3,
  structureADay4,
  structureADay5,
];

// ─── Structure B: Food / Outdoor (4 days) ────────────────────────────────────

const structureBDay1: DayItinerary = {
  dayNumber: 1,
  title: "Saigon Markets & Street Food",
  date: "2026-04-01",
  activities: [
    {
      id: "b-d1-1",
      title: "Bánh Mì Huỳnh Hoa",
      activityType: "RESTAURANT",
      startTime: "8:00",
      endTime: "9:00",
      price: "60,000 VND",
      address: "26 Lê Thị Riêng, Phạm Ngũ Lão, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop",
      aiTip:
        "Queue early — the most famous bánh mì stall in Vietnam opens at 6 AM and sells out by midday.",
      lat: 10.7691,
      lng: 106.6945,
    },
    {
      id: "b-d1-2",
      title: "Ben Thanh Market Food Tour",
      activityType: "SHOPPING",
      startTime: "9:30",
      endTime: "11:30",
      address:
        "Lê Lợi, Phường Bến Thành, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      aiTip:
        "Go straight to the inner food stalls. Try bún bò Huế, chả giò and fresh sugarcane juice.",
      lat: 10.7723,
      lng: 106.6988,
    },
    {
      id: "b-d1-3",
      title: "Cơm Tấm Mộc",
      activityType: "RESTAURANT",
      startTime: "12:00",
      endTime: "13:00",
      price: "80,000 VND",
      address: "13 Đặng Văn Ngữ, Phú Nhuận, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      aiTip:
        "Broken rice with grilled pork chop, egg meatloaf and pickled vegetables — a Saigon staple.",
      lat: 10.7913,
      lng: 106.6835,
    },
    {
      id: "b-d1-4",
      title: "District 4 Seafood Walk",
      activityType: "RESTAURANT",
      startTime: "14:30",
      endTime: "16:30",
      address: "Vĩnh Khánh, Quận 4, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1559847844-d2e0c1ea0dc5?w=400&h=300&fit=crop",
      aiTip:
        "The 'seafood street' of Saigon. Try clams in lemongrass, grilled oysters and steamed mantis shrimp.",
      lat: 10.7555,
      lng: 106.7019,
    },
    {
      id: "b-d1-5",
      title: "Bùi Viện Walking Street Food Crawl",
      activityType: "RESTAURANT",
      startTime: "19:00",
      endTime: "21:00",
      price: "200,000 VND",
      address: "Bùi Viện, Phạm Ngũ Lão, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900152-b8b27e3b77b9?w=400&h=300&fit=crop",
      aiTip:
        "Saigon's famous backpacker strip comes alive at night. Try Vietnamese BBQ and fresh spring rolls.",
      lat: 10.7683,
      lng: 106.6954,
    },
  ],
  travelIndicators: [
    { id: "b-d1-1-t", type: "walk", duration: "10 min" },
    { id: "b-d1-2-t", type: "taxi", duration: "12 min" },
    { id: "b-d1-3-t", type: "taxi", duration: "15 min" },
    { id: "b-d1-4-t", type: "taxi", duration: "25 min" },
  ],
};

const structureBDay2: DayItinerary = {
  dayNumber: 2,
  title: "Cu Chi Tunnels Adventure",
  date: "2026-04-02",
  activities: [
    {
      id: "b-d2-1",
      title: "Morning Transfer to Cu Chi",
      activityType: "OTHER",
      startTime: "7:00",
      endTime: "9:00",
      price: "150,000 VND",
      address: "Mien Dong Bus Station, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
      aiTip:
        "Book a guided minibus tour from Pham Ngu Lao for the easiest experience — about 1.5 hours each way.",
      lat: 10.8058,
      lng: 106.7186,
    },
    {
      id: "b-d2-2",
      title: "Cu Chi Tunnels (Ben Dinh)",
      activityType: "ATTRACTION",
      startTime: "9:30",
      endTime: "12:30",
      price: "110,000 VND",
      address: "Phú Mỹ Hưng, Củ Chi, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop",
      aiTip:
        "You can crawl through a widened 40m tunnel section. Wear comfortable closed-toe shoes.",
      lat: 11.1371,
      lng: 106.4543,
    },
    {
      id: "b-d2-3",
      title: "Local Lunch at Cu Chi",
      activityType: "RESTAURANT",
      startTime: "13:00",
      endTime: "14:30",
      price: "120,000 VND",
      address: "Quốc lộ 22, Củ Chi, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1559847844-d2e0c1ea0dc5?w=400&h=300&fit=crop",
      aiTip:
        "Try the local specialty: cơm chiên (fried rice) and canh chua (tamarind soup) with river fish.",
      lat: 11.1200,
      lng: 106.4500,
    },
    {
      id: "b-d2-4",
      title: "Ben Duoc Memorial Site",
      activityType: "ATTRACTION",
      startTime: "15:00",
      endTime: "16:00",
      price: "30,000 VND",
      address: "Ben Duoc, Phu My Hung, Cu Chi, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400&h=300&fit=crop",
      aiTip:
        "A solemn memorial with a large bronze statue and underground chamber. Quieter than Ben Dinh.",
      lat: 11.1350,
      lng: 106.4560,
    },
    {
      id: "b-d2-5",
      title: "Return & Dinner at Bep Me In",
      activityType: "RESTAURANT",
      startTime: "19:00",
      endTime: "21:00",
      price: "350,000 VND",
      address:
        "138 Đường 3 Tháng 2, Quận 10, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      aiTip:
        "Authentic Vietnamese home cooking. Their signature claypot dishes are perfect comfort food.",
      lat: 10.7688,
      lng: 106.6676,
    },
  ],
  travelIndicators: [
    { id: "b-d2-1-t", type: "walk", duration: "10 min" },
    { id: "b-d2-2-t", type: "walk", duration: "15 min" },
    { id: "b-d2-3-t", type: "taxi", duration: "20 min" },
    { id: "b-d2-4-t", type: "taxi", duration: "90 min" },
  ],
};

const structureBDay3: DayItinerary = {
  dayNumber: 3,
  title: "Mekong Delta Day Trip",
  date: "2026-04-03",
  activities: [
    {
      id: "b-d3-1",
      title: "Transfer to My Tho",
      activityType: "OTHER",
      startTime: "7:00",
      endTime: "8:30",
      price: "200,000 VND",
      address: "Mien Tay Bus Station, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
      aiTip:
        "Book a Mekong Delta day tour — they include boat, guide and lunch for around $30 USD.",
      lat: 10.3490,
      lng: 106.3520,
    },
    {
      id: "b-d3-2",
      title: "Cai Be Floating Market Boat Tour",
      activityType: "ATTRACTION",
      startTime: "9:00",
      endTime: "11:00",
      price: "250,000 VND",
      address: "Cái Bè, Tiền Giang, Mekong Delta",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      aiTip:
        "Arrive early — traders start at 4 AM. Look for boats displaying their goods at the bow.",
      lat: 10.3692,
      lng: 106.0127,
    },
    {
      id: "b-d3-3",
      title: "Riverside Lunch at Local Restaurant",
      activityType: "RESTAURANT",
      startTime: "11:30",
      endTime: "13:00",
      price: "200,000 VND",
      address: "Ấp Mỹ Lợi B, Cái Bè, Tiền Giang",
      image:
        "https://images.unsplash.com/photo-1559847844-d2e0c1ea0dc5?w=400&h=300&fit=crop",
      aiTip:
        "Elephant ear fish (cá tai tượng) eaten wrapped in rice paper with fresh herbs — a Mekong classic.",
      lat: 10.3700,
      lng: 106.0200,
    },
    {
      id: "b-d3-4",
      title: "Coconut Candy Workshop & Fruit Orchards",
      activityType: "ATTRACTION",
      startTime: "13:30",
      endTime: "15:30",
      address: "Bến Tre Province, Mekong Delta",
      image:
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
      aiTip:
        "Watch coconut candy being made by hand, then visit longan, rambutan and jackfruit orchards.",
      lat: 10.2400,
      lng: 106.3750,
    },
    {
      id: "b-d3-5",
      title: "Return to Ho Chi Minh City",
      activityType: "OTHER",
      startTime: "16:00",
      endTime: "18:00",
      price: "200,000 VND",
      address: "Mien Tay Bus Station, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop",
      aiTip:
        "Stop at a riverside cafe in Ben Tre town for coconut ice cream before boarding the return bus.",
      lat: 10.5000,
      lng: 106.5000,
    },
  ],
  travelIndicators: [
    { id: "b-d3-1-t", type: "bus", duration: "40 min" },
    { id: "b-d3-2-t", type: "bus", duration: "20 min" },
    { id: "b-d3-3-t", type: "walk", duration: "10 min" },
    { id: "b-d3-4-t", type: "bus", duration: "45 min" },
  ],
};

const structureBDay4: DayItinerary = {
  dayNumber: 4,
  title: "Saigon Nature & Parks",
  date: "2026-04-04",
  activities: [
    {
      id: "b-d4-1",
      title: "Tao Dan Park Morning Walk",
      activityType: "NATURE",
      startTime: "8:00",
      endTime: "9:30",
      address:
        "55B Trương Định, Bến Thành, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      aiTip:
        "In the morning you'll find locals practicing tai chi, playing chess and singing traditional music.",
      lat: 10.7756,
      lng: 106.6963,
    },
    {
      id: "b-d4-2",
      title: "Saigon Zoo & Botanical Gardens",
      activityType: "NATURE",
      startTime: "10:00",
      endTime: "12:00",
      price: "50,000 VND",
      address:
        "2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
      aiTip:
        "The botanical garden section has century-old trees and a peaceful atmosphere away from the zoo.",
      lat: 10.7879,
      lng: 106.7093,
    },
    {
      id: "b-d4-3",
      title: "Lunch at Cục Gạch Quán",
      activityType: "RESTAURANT",
      startTime: "12:30",
      endTime: "14:00",
      price: "350,000 VND",
      address:
        "10 Đặng Tất, Tân Định, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      aiTip:
        "A beautifully restored colonial house with a garden courtyard. Vietnamese home-style cooking.",
      lat: 10.7851,
      lng: 106.6978,
    },
    {
      id: "b-d4-4",
      title: "Văn Thánh Tourism Park",
      activityType: "NATURE",
      startTime: "14:30",
      endTime: "16:00",
      address:
        "48 Đinh Tiên Hoàng, Bình Thạnh, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop",
      aiTip:
        "Calm riverside park with willow trees and small bridges — a favourite for local families.",
      lat: 10.7967,
      lng: 106.7167,
    },
    {
      id: "b-d4-5",
      title: "Rooftop Farewell Dinner — Chill Sky Bar",
      activityType: "RESTAURANT",
      startTime: "19:00",
      endTime: "21:00",
      price: "600,000 VND",
      address:
        "AB Tower, 76A Lê Lai, Bến Thành, Quận 1, Ho Chi Minh City",
      image:
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop",
      aiTip:
        "26th-floor rooftop with panoramic Saigon views. Reserve a table with a direct skyline view.",
      lat: 10.7724,
      lng: 106.6984,
    },
  ],
  travelIndicators: [
    { id: "b-d4-1-t", type: "taxi", duration: "12 min" },
    { id: "b-d4-2-t", type: "walk", duration: "5 min" },
    { id: "b-d4-3-t", type: "taxi", duration: "10 min" },
    { id: "b-d4-4-t", type: "taxi", duration: "15 min" },
  ],
};

const structureBDays: DayItinerary[] = [
  structureBDay1,
  structureBDay2,
  structureBDay3,
  structureBDay4,
];

// ─── Nature subset: Structure B days 2–4 re-numbered to 1–3 ─────────────────

const daysNature: DayItinerary[] = [
  { ...structureBDay2, dayNumber: 1, date: "2026-04-01" },
  { ...structureBDay3, dayNumber: 2, date: "2026-04-02" },
  { ...structureBDay4, dayNumber: 3, date: "2026-04-03" },
];

// ─── Estimated budgets ────────────────────────────────────────────────────────

const budgetCulture5d: EstimatedBudget = {
  total: 5200000,
  transportation: 800000,
  activity: 1200000,
  foodAndDrink: 2200000,
  accommodation: 1000000,
  currency: "VND",
};

const budgetHistory2d: EstimatedBudget = {
  total: 1800000,
  transportation: 300000,
  activity: 500000,
  foodAndDrink: 800000,
  accommodation: 0,
  currency: "VND",
};

const budgetFood3d: EstimatedBudget = {
  total: 2800000,
  transportation: 400000,
  activity: 200000,
  foodAndDrink: 1800000,
  accommodation: 400000,
  currency: "VND",
};

const budgetAdventure4d: EstimatedBudget = {
  total: 4500000,
  transportation: 1200000,
  activity: 800000,
  foodAndDrink: 1500000,
  accommodation: 1000000,
  currency: "VND",
};

const budgetNature3d: EstimatedBudget = {
  total: 3400000,
  transportation: 1000000,
  activity: 600000,
  foodAndDrink: 1200000,
  accommodation: 600000,
  currency: "VND",
};

const budgetCoffee2d: EstimatedBudget = {
  total: 1600000,
  transportation: 250000,
  activity: 450000,
  foodAndDrink: 700000,
  accommodation: 200000,
  currency: "VND",
};

// ─── Preview itineraries ──────────────────────────────────────────────────────

export const previewItineraries: Record<string, Itinerary> = {
  "preview-hcm-culture-5d": {
    id: "preview-hcm-culture-5d",
    tripTitle: "5 Days in Ho Chi Minh City",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-05",
    duration: "5 days",
    budget: "5,200,000 VND",
    tripType: "Cultural trip",
    estimatedBudget: budgetCulture5d,
    reasoningSummary:
      "A complete cultural immersion across Ho Chi Minh City — from colonial landmarks and war history to Cholon's Chinatown, the arts quarter and a final farewell along the Saigon River.",
    days: structureADays,
    hasUnsavedChanges: false,
  },

  "preview-hcm-history-2d": {
    id: "preview-hcm-history-2d",
    tripTitle: "Saigon War & History Sites",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-02",
    duration: "2 days",
    budget: "1,800,000 VND",
    tripType: "History trip",
    estimatedBudget: budgetHistory2d,
    reasoningSummary:
      "Two focused days covering Saigon's most important historical sites — the War Remnants Museum, Notre-Dame Cathedral, Saigon Central Post Office, Reunification Palace and the Opera House.",
    days: structureADays.slice(0, 2),
    hasUnsavedChanges: false,
  },

  "preview-hcm-food-3d": {
    id: "preview-hcm-food-3d",
    tripTitle: "Saigon Street Food Trail",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-03",
    duration: "3 days",
    budget: "2,800,000 VND",
    tripType: "Food trip",
    estimatedBudget: budgetFood3d,
    reasoningSummary:
      "A deep dive into Saigon's legendary food scene — from Ben Thanh Market and District 4 seafood to a Mekong Delta day trip for the ultimate riverside lunch experience.",
    days: structureBDays.slice(0, 3),
    hasUnsavedChanges: false,
  },

  "preview-hcm-adventure-4d": {
    id: "preview-hcm-adventure-4d",
    tripTitle: "Cu Chi & Mekong Explorer",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-04",
    duration: "4 days",
    budget: "4,500,000 VND",
    tripType: "Adventure trip",
    estimatedBudget: budgetAdventure4d,
    reasoningSummary:
      "Street food in the city, underground tunnels at Cu Chi, a boat ride through the Mekong Delta and a final evening in Saigon's green parks — the essential four-day adventure.",
    days: structureBDays,
    hasUnsavedChanges: false,
  },

  "preview-hcm-nature-3d": {
    id: "preview-hcm-nature-3d",
    tripTitle: "Saigon Gardens & Parks",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-03",
    duration: "3 days",
    budget: "3,400,000 VND",
    tripType: "Nature trip",
    estimatedBudget: budgetNature3d,
    reasoningSummary:
      "Cu Chi's forested wartime landscape, the waterways and fruit orchards of the Mekong Delta, and Saigon's lush zoo and botanical gardens — a greener side of the city.",
    days: daysNature,
    hasUnsavedChanges: false,
  },

  "preview-hcm-coffee-2d": {
    id: "preview-hcm-coffee-2d",
    tripTitle: "Saigon Coffee Culture",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-01",
    endDate: "2026-04-02",
    duration: "2 days",
    budget: "1,600,000 VND",
    tripType: "Cultural trip",
    estimatedBudget: budgetCoffee2d,
    reasoningSummary:
      "Saigon's café culture is inseparable from its colonial and community history. Two days visiting iconic cafés, the French colonial quarter and the city's most storied cultural landmarks.",
    days: structureADays.slice(0, 2),
    hasUnsavedChanges: false,
  },
};
