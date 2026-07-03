"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  TourismCrowdAttractionSummary,
  TourismCrowdForecastResult,
} from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";
import { tourismCrowdQueryKeys } from "@/features/tourism-crowd/presentation/queries/tourism-crowd-query-keys";
import { fetchJson } from "@/shared/http/fetch-json";

export interface JejuTourismCrowdQueryResult
  extends TourismCrowdForecastResult {
  summaries: TourismCrowdAttractionSummary[];
}

export function useJejuTourismCrowdQuery() {
  return useQuery({
    queryKey: tourismCrowdQueryKeys.jeju(),
    queryFn: () =>
      fetchJson<JejuTourismCrowdQueryResult>("/api/tourism-crowd/jeju", {
        errorMessage: "Failed to fetch Jeju tourism crowd forecasts",
      }),
  });
}
