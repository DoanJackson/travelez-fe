// Mock data for the Community page
import { CommunityPost, TrendingDestination, TopTraveler } from "../types/post";


// export const communityPosts: CommunityPost[] = [
//   // post-1 oldest (7d ago)
//   {
//     id: "post-1",
//     author: {
//       name: "Minh Trần",
//       username: "@minhtran.travel",
//       avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
//     },
//     timeAgo: "7d ago",
//     createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
//     location: "Hội An, Quảng Nam",
//     title: "A Weekend in Hội An: Lanterns, Tailor Streets & Bánh Mì",
//     body: "Spent two magical days wandering Hội An's Ancient Town and I'm still dreaming about the lantern-lit streets at dusk. The town's tailors are genuinely incredible — I had a custom áo dài made in under 4 hours for 350,000 VND. The bánh mì at Bánh Mì Phượng (yes, the one Anthony Bourdain raved about) is absolutely worth the queue. If you only visit one place in central Vietnam, make it Hội An.",
//     images: [
//       "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80",
//       "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80",
//     ],
//     likes: 234,
//     comments: 45,
//     comments_data: [
//       {
//         id: "c1",
//         author: {
//           name: "Linh Nguyễn",
//           username: "@linhng.wanders",
//           avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//         },
//         text: "The tailor shops here are amazing — got a suit made in 6 hours! Which one did you go to?",
//         timeAgo: "6d ago",
//       },
//       {
//         id: "c2",
//         author: {
//           name: "Tuấn Phạm",
//           username: "@tuanpham.exp",
//           avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
//         },
//         text: "Bánh Mì Phượng is absolutely worth the hype. Also try Cơm Gà Bà Buội nearby for the best chicken rice in Vietnam.",
//         timeAgo: "5d ago",
//       },
//       {
//         id: "c3",
//         author: {
//           name: "An Lê",
//           username: "@anle.journey",
//           avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
//         },
//         text: "Hội An at Tết is even more magical if you ever get the chance. Lanterns absolutely everywhere.",
//         timeAgo: "4d ago",
//       },
//     ],
//     isLiked: false,
//     isSaved: false,
//     category: "Itineraries",
//   },
//   // post-2 (5d ago)
//   {
//     id: "post-2",
//     author: {
//       name: "Linh Nguyễn",
//       username: "@linhng.wanders",
//       avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//     },
//     timeAgo: "5d ago",
//     createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
//     location: "Hạ Long Bay, Quảng Ninh",
//     title: "Hạ Long Bay on a Budget: What No One Tells You",
//     body: "Did Hạ Long Bay on a 2-day cruise for under $80 USD — here's how. Skip the overnight buses marketed to tourists and take the morning train from Hà Nội instead. We joined a small group boat with just 10 people, kayaked through hidden caves, and watched the sunrise over the limestone karsts from our cabin deck. The key: book at least 3 weeks ahead and go in spring before the summer crowds arrive.",
//     images: [
//       "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900&q=80",
//       "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80",
//       "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=900&q=80",
//     ],
//     likes: 312,
//     comments: 67,
//     comments_data: [
//       {
//         id: "c4",
//         author: {
//           name: "Minh Trần",
//           username: "@minhtran.travel",
//           avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
//         },
//         text: "Which boat company did you use? I've been planning this trip for months and everyone keeps recommending different operators.",
//         timeAgo: "4d ago",
//       },
//       {
//         id: "c5",
//         author: {
//           name: "Thu Hương",
//           username: "@thuhuong.explores",
//           avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
//         },
//         text: "The spring weather tip is so true — we went in July and the humidity was brutal. April is peak season for a reason.",
//         timeAgo: "3d ago",
//       },
//       {
//         id: "c6",
//         author: {
//           name: "Khoa Vũ",
//           username: "@khoavu.road",
//           avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
//         },
//         text: "Those kayak caves are unreal. Did you do the ones near Luồn Cave? That was the highlight of our whole Vietnam trip.",
//         timeAgo: "2d ago",
//       },
//     ],
//     isLiked: true,
//     isSaved: false,
//     category: "Photos",
//   },
//   // post-3 (3d ago)
//   {
//     id: "post-3",
//     author: {
//       name: "Tuấn Phạm",
//       username: "@tuanpham.exp",
//       avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
//     },
//     timeAgo: "3d ago",
//     createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
//     location: "Hà Nội",
//     title: "Hanoi's Old Quarter: The Ultimate Street Food Guide",
//     body: "I spent a week in Hà Nội's Old Quarter eating my way through 36 streets and I'm not even sorry. Bún chả on Hàng Mành, bánh cuốn at the tiny shop on Hàng Gà, and phở bò at a place with no English menu that costs 45,000 VND — this is the real Hà Nội. Tip: eat where locals eat. If the plastic stools are tiny and the menu is written on the wall in Vietnamese only, you're in the right place.",
//     images: [
//       "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=900&q=80",
//       "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80",
//     ],
//     likes: 89,
//     comments: 18,
//     comments_data: [
//       {
//         id: "c7",
//         author: {
//           name: "Linh Nguyễn",
//           username: "@linhng.wanders",
//           avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//         },
//         text: "The no-English-menu tip is gold. Locals always eat the best and cheapest food. Added this to my Hà Nội saved list!",
//         timeAgo: "2d ago",
//       },
//       {
//         id: "c8",
//         author: {
//           name: "An Lê",
//           username: "@anle.journey",
//           avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
//         },
//         text: "Bún chả on Hàng Mành — YES. Obama ate bún chả here and the whole street never let it go 😂",
//         timeAgo: "1d ago",
//       },
//     ],
//     isLiked: false,
//     isSaved: true,
//     category: "Tips",
//   },
//   // post-4 (2d ago)
//   {
//     id: "post-4",
//     author: {
//       name: "An Lê",
//       username: "@anle.journey",
//       avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
//     },
//     timeAgo: "2d ago",
//     createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
//     location: "Phú Quốc, Kiên Giang",
//     title: "Phú Quốc Island: Hidden Beaches You Need to Visit",
//     body: "Everyone knows about Phú Quốc's main beaches, but the north of the island is a completely different world. Rented a motorbike for 150,000 VND/day and discovered Bãi Dài stretching for kilometers with almost no one on it. The water here is crystal clear — nothing like the crowded south. Watch the sunset from Dinh Cậu Rock and grab a seafood dinner at the local market for a fraction of tourist prices.",
//     images: [
//       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
//       "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
//       "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80",
//     ],
//     likes: 178,
//     comments: 34,
//     comments_data: [
//       {
//         id: "c9",
//         author: {
//           name: "Minh Trần",
//           username: "@minhtran.travel",
//           avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
//         },
//         text: "Bãi Dài is so underrated. We drove there at 6am and had the entire beach to ourselves for two hours.",
//         timeAgo: "1d ago",
//       },
//       {
//         id: "c10",
//         author: {
//           name: "Thu Hương",
//           username: "@thuhuong.explores",
//           avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
//         },
//         text: "The night market seafood is ridiculously good value. Grilled scallops with spring onion for like 30k VND each!",
//         timeAgo: "20h ago",
//       },
//       {
//         id: "c11",
//         author: {
//           name: "Khoa Vũ",
//           username: "@khoavu.road",
//           avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
//         },
//         text: "Which motorbike rental did you use? Last time I rented from a hotel and got overcharged massively.",
//         timeAgo: "15h ago",
//       },
//     ],
//     isLiked: false,
//     isSaved: false,
//     category: "Photos",
//   },
//   // post-5 (18h ago)
//   {
//     id: "post-5",
//     author: {
//       name: "Thu Hương",
//       username: "@thuhuong.explores",
//       avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
//     },
//     timeAgo: "18h ago",
//     createdAt: Date.now() - 18 * 60 * 60 * 1000,
//     location: "Đà Lạt, Lâm Đồng",
//     title: "3 Days in Đà Lạt: Coffee, Flowers & Mountain Air",
//     body: "Three days in Đà Lạt felt like stepping into a different Vietnam entirely — misty mountains, pine forests, and French colonial villas around every corner. The flower farms outside the city are in full bloom right now, and a cup of weasel coffee at a local farm set me back just 60,000 VND. Rented a motorbike and got completely lost in the best possible way, stumbling onto a valley with strawberry farms and zero other tourists. Đà Lạt in the morning fog is something you genuinely can't do justice to in photos.",
//     images: [
//       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900&q=80",
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
//     ],
//     likes: 145,
//     comments: 28,
//     comments_data: [
//       {
//         id: "c12",
//         author: {
//           name: "Linh Nguyễn",
//           username: "@linhng.wanders",
//           avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//         },
//         text: "The flower farms are breathtaking. I went during hydrangea season and cried a little, honestly.",
//         timeAgo: "16h ago",
//       },
//       {
//         id: "c13",
//         author: {
//           name: "Tuấn Phạm",
//           username: "@tuanpham.exp",
//           avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
//         },
//         text: "Weasel coffee is controversial but I'm a believer. The Trung Nguyên farm tour is worth doing if you haven't already.",
//         timeAgo: "12h ago",
//       },
//     ],
//     isLiked: false,
//     isSaved: false,
//     category: "Itineraries",
//   },
//   // post-6 newest (3h ago)
//   {
//     id: "post-6",
//     author: {
//       name: "Khoa Vũ",
//       username: "@khoavu.road",
//       avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
//     },
//     timeAgo: "3h ago",
//     createdAt: Date.now() - 3 * 60 * 60 * 1000,
//     location: "Quận 1, TP.HCM",
//     title: "Surviving Saigon Traffic: A First-Timer's Guide",
//     body: "First day in Saigon and I nearly got taken out by a motorbike just crossing the road. Took me about 48 hours to figure out the system: don't stop, don't run, just walk steadily and trust the bikes to flow around you. Once I stopped being terrified I fell completely in love with the city's energy. The street food scene in District 4 after dark is unlike anything I've experienced — bánh tráng trộn for 15,000 VND and a plastic cup of cà phê đá to finish.",
//     images: [
//       "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=900&q=80",
//     ],
//     likes: 67,
//     comments: 12,
//     comments_data: [
//       {
//         id: "c14",
//         author: {
//           name: "An Lê",
//           username: "@anle.journey",
//           avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
//         },
//         text: "The road-crossing learning curve is real 😂 Takes exactly 2-3 days and then it clicks. Welcome to Saigon!",
//         timeAgo: "2h ago",
//       },
//       {
//         id: "c15",
//         author: {
//           name: "Minh Trần",
//           username: "@minhtran.travel",
//           avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
//         },
//         text: "District 4 street food after dark is the move. Also try Nguyễn Văn Cừ street in D5 for amazing Chinese-Vietnamese food.",
//         timeAgo: "1h ago",
//       },
//     ],
//     isLiked: false,
//     isSaved: false,
//     category: "Tips",
//   },
// ];

export const trendingDestinations: TrendingDestination[] = [
  { id: "hoian", name: "Hội An, Việt Nam", postsCount: "2.4k posts" },
  { id: "halong", name: "Hạ Long Bay, Việt Nam", postsCount: "1.8k posts" },
  { id: "dalat", name: "Đà Lạt, Việt Nam", postsCount: "1.3k posts" },
  { id: "phuquoc", name: "Phú Quốc, Việt Nam", postsCount: "980 posts" },
];

export const topTravelers: TopTraveler[] = [
  {
    id: "emma",
    name: "Emma Watson",
    username: "@emma_travels",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAW9lQwcuzPkSZhOmSHmlGBPL1ngh-haGcRjKDhWAYr7Sb5pOuzJdNh-2_K4Pjve7OPAbOxNxEdCVifI7j5Go_kBAUhBnW1qiTgZbE671-jEIHM8F7MePqoOMq2WkjukApTmKNDt2DmGPYcmTPCvOqaEM73cXnmgpyZoTG643dn_WKXT39EY7FFouTKZvOD7kfzU8RGfCh8RoqEvVkHeHwQDRJiPXiUIpCKTrASgX0pYkVZyw1On-tBipDNFPWZa7PlpTZyl_9__o",
    isFollowing: false,
  },
  {
    id: "david",
    name: "David Chen",
    username: "@dchen_nomad",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnDcZJYFQe2uHnTGtT6wcXyqrqwhcJkWscmiLVHzDJgy8GMVB_KrfauunSIPrD5v-QeiK6B6zpzLLJY7mNlvqqS2fjfsR65O73S88dvA09wt5KNQ03BP42rIzkU1CASfr4MZFAQYk8CTPlo4W9sTi8aG-xbbakoqEVZNV3x_zEs8dSPCVIOg1nQzowr6bMqGZFJverENfIOuKvw5tSw12pFJrOiiucGzfFF6OgY_QNg9oKvSTCHOOSjidGuk9nnKuZzofaeAlRkhs",
    isFollowing: false,
  },
  {
    id: "sophia",
    name: "Sophia Lee",
    username: "@sophia_wanders",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXKjWbX6uv6lFSv62HioTO6Prk8IvV71ZmhEcoNU8Vm4RHGhigIqI_XmRNSfzi-iFMjpdknj1HSJ71gnEfLpxMQ0O4IeUe2s86oZBV3x4aF_1F2JaBNMQEhGw8tGHyIgFXb6kYthWJlI6aM3Crj9xcTmAvoxfID_GNHad09QKVEW-n94SqTS6EInJuY77a72NoOMrmGR01UBBItxyf5oQqNZvAR0zcNGwStOJESvKV06WiA48M_RmddGvIFjjrONoR2jERZIPpi_8",
    isFollowing: false,
  },
];
