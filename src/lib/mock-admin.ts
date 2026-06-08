import type { Activity, AdminUser, StatCard, UserDetail } from "@/types/admin";

export const MOCK_STAT_CARDS: StatCard[] = [
  {
    label: "Total Users",
    value: "12,430",
    subtitle: "+12% from last month",
    variant: "default",
  },
  {
    label: "New Content",
    value: "3,847",
    subtitle: "Vietnam Guides & Reviews",
    variant: "default",
  },
  {
    label: "Pending Reports",
    value: "24",
    subtitle: "Action Required",
    variant: "error",
  },
  {
    label: "Locked Accounts",
    value: "6",
    subtitle: "Post-moderation phase",
    variant: "default",
  },
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  // IDs 1–8 — original seed users
  { id:  1, username: "elena.r",   email: "elena@example.com",   fullName: "Elena Rodriguez",  role: "ADMIN",    status: "ACTIVE", createdAt: "2024-01-15T09:00:00Z", avatar: null },
  { id:  2, username: "marcus.c",  email: "marcus@example.com",  fullName: "Marcus Chen",      role: "PROVIDER", status: "ACTIVE", createdAt: "2024-02-20T10:30:00Z", avatar: null },
  { id:  3, username: "sarah.j",   email: "sarah@example.com",   fullName: "Sarah Jenkins",    role: "TRAVELER", status: "BANNED", createdAt: "2024-03-05T08:15:00Z", avatar: null },
  { id:  4, username: "david.m",   email: "david@example.com",   fullName: "David Miller",     role: "TRAVELER", status: "ACTIVE", createdAt: "2024-03-18T14:00:00Z", avatar: null },
  { id:  5, username: "amara.o",   email: "amara@example.com",   fullName: "Amara Okafor",     role: "ADMIN",    status: "ACTIVE", createdAt: "2024-04-02T11:00:00Z", avatar: null },
  { id:  6, username: "james.w",   email: "james@example.com",   fullName: "James Wilson",     role: "TRAVELER", status: "ACTIVE", createdAt: "2024-04-10T16:45:00Z", avatar: null },
  { id:  7, username: "lena.k",    email: "lena@example.com",    fullName: "Lena Kim",         role: "PROVIDER", status: "ACTIVE", createdAt: "2024-05-01T09:30:00Z", avatar: null },
  { id:  8, username: "carlos.m",  email: "carlos@example.com",  fullName: "Carlos Mendez",    role: "TRAVELER", status: "BANNED", createdAt: "2024-05-22T13:00:00Z", avatar: null },
  // IDs 9–12 — expansion cohort
  { id:  9, username: "yuki.t",    email: "yuki@example.com",    fullName: "Yuki Tanaka",      role: "PROVIDER", status: "ACTIVE", createdAt: "2024-06-03T08:00:00Z", avatar: null },
  { id: 10, username: "fatima.a",  email: "fatima@example.com",  fullName: "Fatima Al-Rashid", role: "ADMIN",    status: "ACTIVE", createdAt: "2024-06-18T11:30:00Z", avatar: null },
  { id: 11, username: "noah.b",    email: "noah@example.com",    fullName: "Noah Bennett",     role: "TRAVELER", status: "ACTIVE", createdAt: "2024-07-07T14:15:00Z", avatar: null },
  { id: 12, username: "priya.s",   email: "priya@example.com",   fullName: "Priya Sharma",     role: "PROVIDER", status: "ACTIVE", createdAt: "2024-07-22T09:45:00Z", avatar: null },
  // IDs 13–15
  { id: 13, username: "elena.r2",  email: "elena2@example.com",  fullName: "Elena Rodriguez",  role: "ADMIN",    status: "ACTIVE", createdAt: "2024-08-01T09:00:00Z", avatar: null },
  { id: 14, username: "marcus.c2", email: "marcus2@example.com", fullName: "Marcus Chen",      role: "TRAVELER", status: "ACTIVE", createdAt: "2024-08-14T10:30:00Z", avatar: null },
  { id: 15, username: "sarah.j2",  email: "sarah2@example.com",  fullName: "Sarah Jenkins",    role: "TRAVELER", status: "BANNED", createdAt: "2024-08-28T08:15:00Z", avatar: null },
  // IDs 16–20 — second expansion cohort
  { id: 16, username: "david.m2",  email: "david2@example.com",  fullName: "David Miller",     role: "TRAVELER", status: "ACTIVE", createdAt: "2024-09-10T14:00:00Z", avatar: null },
  { id: 17, username: "amara.o2",  email: "amara2@example.com",  fullName: "Amara Okafor",     role: "ADMIN",    status: "ACTIVE", createdAt: "2024-09-25T11:00:00Z", avatar: null },
  { id: 18, username: "james.w2",  email: "james2@example.com",  fullName: "James Wilson",     role: "TRAVELER", status: "ACTIVE", createdAt: "2024-10-08T16:45:00Z", avatar: null },
  { id: 19, username: "lena.k2",   email: "lena2@example.com",   fullName: "Lena Kim",         role: "TRAVELER", status: "ACTIVE", createdAt: "2024-10-21T09:30:00Z", avatar: null },
  { id: 20, username: "carlos.m2", email: "carlos2@example.com", fullName: "Carlos Mendez",    role: "TRAVELER", status: "BANNED", createdAt: "2024-11-05T13:00:00Z", avatar: null },
];

export const MOCK_ADMIN_USER_DETAILS: UserDetail[] = [
  { id:  3, username: "sarah.j",   email: "sarah@example.com",   fullName: "Sarah Jenkins",    role: "TRAVELER", status: "BANNED", gender: "FEMALE", dob: "1988-11-15", avatar: null, createdAt: "2024-03-05T08:15:00Z", updatedAt: "2024-10-10T11:00:00Z", authProvider: "LOCAL"  },
  { id:  4, username: "david.m",   email: "david@example.com",   fullName: "David Miller",     role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1992-05-30", avatar: null, createdAt: "2024-03-18T14:00:00Z", updatedAt: "2024-11-05T08:00:00Z", authProvider: "LOCAL"  },
  { id:  6, username: "james.w",   email: "james@example.com",   fullName: "James Wilson",     role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1993-02-18", avatar: null, createdAt: "2024-04-10T16:45:00Z", updatedAt: "2024-10-01T00:00:00Z", authProvider: "LOCAL"  },
  { id:  8, username: "carlos.m",  email: "carlos@example.com",  fullName: "Carlos Mendez",    role: "TRAVELER", status: "BANNED", gender: "MALE",   dob: "1991-12-03", avatar: null, createdAt: "2024-05-22T13:00:00Z", updatedAt: "2024-09-15T14:30:00Z", authProvider: "LOCAL"  },
  { id: 11, username: "noah.b",    email: "noah@example.com",    fullName: "Noah Bennett",     role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1999-01-20", avatar: null, createdAt: "2024-07-07T14:15:00Z", updatedAt: "2024-10-01T00:00:00Z", authProvider: "LOCAL"  },
  { id: 14, username: "marcus.c2", email: "marcus2@example.com", fullName: "Marcus Chen",      role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1995-07-08", avatar: null, createdAt: "2024-08-14T10:30:00Z", updatedAt: "2024-12-01T09:15:00Z", authProvider: "GOOGLE" },
  { id: 15, username: "sarah.j2",  email: "sarah2@example.com",  fullName: "Sarah Jenkins",    role: "TRAVELER", status: "BANNED", gender: "FEMALE", dob: "1988-11-15", avatar: null, createdAt: "2024-08-28T08:15:00Z", updatedAt: "2024-10-10T11:00:00Z", authProvider: "LOCAL"  },
  { id: 16, username: "david.m2",  email: "david2@example.com",  fullName: "David Miller",     role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1992-05-30", avatar: null, createdAt: "2024-09-10T14:00:00Z", updatedAt: "2024-11-05T08:00:00Z", authProvider: "LOCAL"  },
  { id: 18, username: "james.w2",  email: "james2@example.com",  fullName: "James Wilson",     role: "TRAVELER", status: "ACTIVE", gender: "MALE",   dob: "1993-02-18", avatar: null, createdAt: "2024-10-08T16:45:00Z", updatedAt: "2024-10-01T00:00:00Z", authProvider: "LOCAL"  },
  { id: 19, username: "lena.k2",   email: "lena2@example.com",   fullName: "Lena Kim",         role: "TRAVELER", status: "ACTIVE", gender: "FEMALE", dob: "1997-06-25", avatar: null, createdAt: "2024-10-21T09:30:00Z", updatedAt: "2024-11-28T10:00:00Z", authProvider: "GOOGLE" },
  { id: 20, username: "carlos.m2", email: "carlos2@example.com", fullName: "Carlos Mendez",    role: "TRAVELER", status: "BANNED", gender: "MALE",   dob: "1991-12-03", avatar: null, createdAt: "2024-11-05T13:00:00Z", updatedAt: "2024-09-15T14:30:00Z", authProvider: "LOCAL"  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  // CONTENT — Mod 5 pattern
  {
    id: "act-001",
    timestamp: "10:42 AM",
    category: "CONTENT",
    description: "Moderator_Alex approved Review #2045 for Ben Thanh Market",
    status: "action_taken",
  },
  {
    id: "act-002",
    timestamp: "10:05 AM",
    category: "CONTENT",
    description: "New user report #3012 submitted for Image #85 in Ho Chi Minh City gallery",
    status: "pending_review",
  },
  {
    id: "act-003",
    timestamp: "09:30 AM",
    category: "CONTENT",
    description: "Moderator_Linh removed Post #441 (spam) from Hanoi Old Quarter thread",
    status: "action_taken",
  },
  {
    id: "act-004",
    timestamp: "08:50 AM",
    category: "CONTENT",
    description: "Review #2061 for Hoi An Ancient Town flagged by user @traveler_99 for misinformation",
    status: "pending_review",
  },
  {
    id: "act-005",
    timestamp: "08:15 AM",
    category: "CONTENT",
    description: "Moderator_Kim approved 12 batch-queued itinerary posts for Da Nang region",
    status: "action_taken",
  },

  // USER — Mod 8 pattern
  {
    id: "act-006",
    timestamp: "10:15 AM",
    category: "USER",
    description: "Admin_Mark locked account @user_spam_99 for multiple policy violations",
    status: "action_taken",
  },
  {
    id: "act-007",
    timestamp: "09:55 AM",
    category: "USER",
    description: "Account @nguyentravel suspended pending identity verification review",
    status: "pending_review",
  },
  {
    id: "act-008",
    timestamp: "09:20 AM",
    category: "USER",
    description: "Admin_Trang unlocked account @phamtour after successful appeal",
    status: "action_taken",
  },
  {
    id: "act-009",
    timestamp: "08:40 AM",
    category: "USER",
    description: "New guide application from @saigon_explorer flagged for duplicate profile check",
    status: "auto_flagged",
  },
  {
    id: "act-010",
    timestamp: "08:00 AM",
    category: "USER",
    description: "Bulk account import (32 users) from partner agency completed — 3 flagged for review",
    status: "pending_review",
  },
  {
    id: "act-011",
    timestamp: "07:45 AM",
    category: "USER",
    description: "Admin_Mark elevated @viet_local_guide to verified guide tier",
    status: "action_taken",
  },
  {
    id: "act-012",
    timestamp: "07:20 AM",
    category: "USER",
    description: "Suspicious login attempt from unknown IP detected for @backpacker_joe",
    status: "auto_flagged",
  },
  {
    id: "act-013",
    timestamp: "07:00 AM",
    category: "USER",
    description: "Account @hanoifoodie voluntarily deactivated — data retention policy applied",
    status: "action_taken",
  },

  // SYSTEM — Mod 9 pattern
  {
    id: "act-014",
    timestamp: "10:30 AM",
    category: "SYSTEM",
    description: "System auto-flagged Review #2048 for offensive language (confidence: 94%)",
    status: "auto_flagged",
  },
  {
    id: "act-015",
    timestamp: "09:45 AM",
    category: "SYSTEM",
    description: "AI Agent updated POI: Notre-Dame Cathedral with corrected historical data",
    status: "master_update",
  },
  {
    id: "act-016",
    timestamp: "09:10 AM",
    category: "SYSTEM",
    description: "Scheduled data sync from Google Places API completed — 148 POIs updated",
    status: "master_update",
  },
  {
    id: "act-017",
    timestamp: "08:30 AM",
    category: "SYSTEM",
    description: "Auto-moderation pipeline flagged 7 new reviews for hate speech review queue",
    status: "auto_flagged",
  },
  {
    id: "act-018",
    timestamp: "07:55 AM",
    category: "SYSTEM",
    description: "Recommendation engine retrained on Q1 2026 interaction data — deployed to staging",
    status: "master_update",
  },
  {
    id: "act-019",
    timestamp: "07:30 AM",
    category: "SYSTEM",
    description: "Database backup completed successfully (23.4 GB, duration: 4m 12s)",
    status: "action_taken",
  },
  {
    id: "act-020",
    timestamp: "06:00 AM",
    category: "SYSTEM",
    description: "Nightly content digest email dispatched to 4,210 subscribers — 3 bounced",
    status: "master_update",
  },
  {
    id: "act-021",
    timestamp: "03:00 AM",
    category: "SYSTEM",
    description: "Rate-limit threshold exceeded on /api/itinerary/generate — auto-throttle applied",
    status: "auto_flagged",
  },
  {
    id: "act-022",
    timestamp: "02:15 AM",
    category: "SYSTEM",
    description: "Stale session cleanup job purged 1,832 expired tokens from cache",
    status: "action_taken",
  },
];
