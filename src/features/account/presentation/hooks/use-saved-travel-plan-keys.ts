"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface TravelPlanItemKey {
  spotId: string;
  kind: "sight" | "food";
}

export const TRAVEL_PLAN_KEYS_QUERY_KEY = ["travel-plan-item-keys"] as const;

export function buildTravelPlanKey(
  kind: TravelPlanItemKey["kind"],
  spotId: string,
): string {
  return `${kind}:${spotId}`;
}

/** 현재 로그인 사용자가 일정에 담아둔 장소 키("kind:spotId") 집합. */
export function useSavedTravelPlanKeys(): Set<string> {
  const { data } = useQuery({
    queryKey: TRAVEL_PLAN_KEYS_QUERY_KEY,
    staleTime: 30_000,
    queryFn: async (): Promise<TravelPlanItemKey[]> => {
      const response = await fetch("/api/travel-plan/items");

      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as { items?: TravelPlanItemKey[] };

      return body.items ?? [];
    },
  });

  return useMemo(
    () =>
      new Set((data ?? []).map((item) => buildTravelPlanKey(item.kind, item.spotId))),
    [data],
  );
}
