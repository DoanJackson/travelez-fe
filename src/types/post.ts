import * as React from "react";
export interface PostAuthor {
  userId: number;
  username: string;
  fullName: string;
  avatar?: string;
}

export interface PostMedia {
  id: number;
  url: string;
  type: "IMAGE";
}

export interface PoiSummary {
  id: number;
  name: string;
  address: string;
  poiType?: string;
  poiTypeDetail?: string;
}

export interface ItinerarySummary {
  id: number;
  title: string;
  destinationCities: string[];
  styles: string[];
  startDate: string;
  endDate: string;
  status: "PLANNING" | "ONGOING" | "COMPLETED" | string;
  createdAt: string;
  ownerUsername: string;
  isPublic: boolean;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  topicTag: string;
  status: "PUBLISHED" | "ARCHIVED" | "BANNED";
  author: PostAuthor;
  poiSummary: PoiSummary | null;
  itinerarySummary: ItinerarySummary | null;
  medias: PostMedia[];
  commentCount: number;
  reactionCount: number;
  reactedByMe: boolean;
  followed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Cursor-based pagination shape returned by GET /api/posts */
export interface PostFeedPage {
  content: PostDetail[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  files: File[];
  poiId?: number;
  itineraryId?: number;
  topicTag: string;
  status: "PUBLISHED" | "ARCHIVED" | "BANNED";
}

export interface UpdatePostPayload {
  postId: number;
  title?: string;
  content?: string;
  keptMediaIds?: number[];
  newFiles?: File[];
}

export interface PostSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortDirection?: "ASC" | "DESC";
  topicTag?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CommentAuthor {
  userId: number;
  username: string;
  fullName: string;
}

export interface CommentMedia {
  id: number;
  url: string;
  type: string;
}

export interface CommentResponse {
  id: number;
  postId: number;
  parentCommentId: number | null;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  medias: CommentMedia[];
  childCommentCount: number;
  reactionCount?: number;
  reactedByMe?: boolean;
}

export interface EditCommentPayload {
  commentId: number;
  content: string;
  keptMediaIds: number[];
  newFiles: never[];
}

export interface CreateCommentPayload {
  postId: number;
  content: string;
  parentId?: number;
}

export type PostCategory = "Itineraries" | "Tips" | "Photos";

export interface CommentItem {
  id: string;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  text: string;
  timeAgo: string;
}

export interface CommunityPost {
  id: string;
  numericId?: number;
  location: string;
  poiSummary?: { id: number; name: string } | null;
  itinerarySummary?: ItinerarySummary | null;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
    userId: number;
  };
  timeAgo: string;
  createdAt: number;
  title: string;
  body: string;
  images: string[];
  likes: number;
  comments: number;
  comments_data: CommentItem[];
  isLiked: boolean;
  isSaved: boolean;
  followed: boolean;
  category: PostCategory;
}

export interface TrendingDestination {
  id: string;
  name: string;
  postsCount: string;
}

export interface TopTraveler {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
}

export interface ReactionToggleRequest {
  targetType: "POST" | "COMMENT";
  targetId: number;
}

export interface ReactionToggleResponse {
  action: "created" | "deleted";
}
