"use client";
import { useState, useEffect } from "react";
import { POIDetailResponseData } from "@/types/poi";
import { getPOIDetails } from "@/services/poiService";

interface UsePoiDetailResult {
  poi: POIDetailResponseData | null;
  isLoading: boolean;
  error: string | null;
}

export function usePoiDetail(poiId: number | null): UsePoiDetailResult {
  const [poi, setPoi] = useState<POIDetailResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (poiId === null || isNaN(poiId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getPOIDetails(poiId)
      .then((data) => setPoi(data))
      .catch((err: { message?: string }) =>
        setError(err.message ?? "Failed to load place details"),
      )
      .finally(() => setIsLoading(false));
  }, [poiId]);

  return { poi, isLoading, error };
}
