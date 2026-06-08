import type { ApiReview } from "@/types/review";
import type { ProfileReview } from "@/types/profile";

export function apiReviewToProfileReview(r: ApiReview): ProfileReview {
  return {
    id: r.id,
    poi: {
      id: r.poi?.id ?? 0,
      name: r.poi?.name ?? "Unknown Place",
      imageUrl: r.medias?.[0]?.url ?? "",
      category: r.poi?.poiTypeDetail ?? r.poi?.poiType ?? "",
      area: "",
    },
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt,
    medias: r.medias ?? [],
  };
}
