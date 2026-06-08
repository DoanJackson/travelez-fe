export type ActivityCategory = "CONTENT" | "USER" | "SYSTEM";
export type AlertStatus = "PENDING" | "APPROVED" | "BANNED" | "AUTO_RESOLVED"
export type ModerationTargetType = "POST" | "REVIEW" | "POI"
export type KeywordSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type ActivityStatus =
  | "pending_review"
  | "auto_flagged"
  | "action_taken"
  | "master_update";

export interface Activity {
  id: string;
  time?: string;
  timestamp: string;
  category: ActivityCategory;
  description: string;
  status: ActivityStatus;
}

export interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  variant?: "default" | "error" | "warning";
}

export type ViolationCategory =
  | "spam"
  | "fraud"
  | "hate_speech"
  | "inappropriate"
  | "misinformation"

export type ReportStatus = "pending" | "resolved"

export interface ModerationReport {
  id: string
  date: string
  author: {
    name: string
    avatarUrl?: string
  }
  category: ViolationCategory
  reportCount: number
  status: ReportStatus
}

export type ResolutionAction = "approve" | "hide" | "delete_penalize"

// ─── User Management ──────────────────────────────────────────────────────────

export type UserRole = "TRAVELER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type UserGender = "MALE" | "FEMALE";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface AdminMediaItem {
  id: number;
  url: string;
  type: "IMAGE";
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar: AdminMediaItem | null;
}

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "TRAVELER";
  status: UserStatus;
  gender: UserGender;
  dob: string;
  avatar: AdminMediaItem | null;
  // cover, followerCount, followingCount, googleId excluded from UI (no moderation value / data exposure risk)
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserStatusPayload {
  action: "BAN" | "UNBAN";
  reason: string;
}

export interface AdminUsersQuery {
  keyword?: string;
  status?: UserStatus;
  page?: number;
  size?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface ReportEvidence {
  reporterCount: number
  violationType: string
  reasonDetail?: string
  reporter?: {
    id: number
    fullName: string
    avatarUrl?: string
  }
}

export interface ModerationReportDetail extends ModerationReport {
  content: string
  images?: string[]
  authorSince: string
  aiViolations: string[]
  evidence: ReportEvidence[]
  postStatus?: string
}

export interface ModerationAlert {
  id: number
  targetId: number
  targetType: ModerationTargetType
  violationType: string
  confidenceScore: number
  reason: string
  status: AlertStatus
  createdAt: string

  targetTitle?: string
  targetContent?: string
  targetAuthorName?: string

  adminNote?: string
  reviewedAt?: string
  reviewedBy?: {
    userId: number
    username: string
    fullName: string
  }
}
