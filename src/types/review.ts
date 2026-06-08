export interface ReviewMedia {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
}

export interface ReviewAuthor {
  id: number;
  fullName: string;
  avatar: string;
}

export interface ApiReviewPoi {
  id: number;
  name: string;
  poiType?: string;
  poiTypeDetail?: string;
}

export interface ApiReview {
  id: number;
  userId?: number;
  status: string;
  content: string;
  rating: number;
  externalName: string | null;
  externalAvt: string | null;
  isCrawled: boolean;
  medias: ReviewMedia[] | null;
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthor | null;
  poi?: ApiReviewPoi;
}

export interface ReviewResponseData {
  content: ApiReview[];
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  empty: boolean;
}

export interface ReviewResponse {
  code: number;
  message: string;
  data: ReviewResponseData;
  success: boolean;
}

export interface ReviewRequest {
  content: string;
  rating: number;
  files: File[];
}

export interface ReviewData {
  id: number;
  status: string;
  content: string;
  rating: number;
  externalName: string;
  externalAvt: string;
  isCrawled: boolean;
  medias: ReviewMedia[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewLocation {
  id: number;
  name: string;
  imageUrl: string;
  address?: string;
  poiType?: string;
  poiTypeDetail?: string;
  rating?: number;
  reviewCount?: number;
}
