"use client";

import { useParams } from "next/navigation";
import { PoiReviewsPage } from "@/components/poi-reviews/PoiReviewsPage";

export default function POIReviewsRoute() {
  const params = useParams();
  const id = params.id as string;

  return <PoiReviewsPage id={id} />;
}
