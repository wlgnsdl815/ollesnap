"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { FoodSpotPage } from "../../domain/entity/food-spot.entity";
import type { JejuCityFilter } from "../../domain/jeju-region";

interface UseFoodSpotInfiniteQueryParams {
  cityFilter?: JejuCityFilter;
}

export function useFoodSpotInfiniteQuery({
  cityFilter,
}: UseFoodSpotInfiniteQueryParams) {
  const query = useInfiniteQuery({
    queryKey: ["food-spots", cityFilter ?? "all"],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const searchParams = new URLSearchParams({ page: String(pageParam) });

      if (cityFilter) {
        searchParams.set("region", cityFilter);
      }

      const response = await fetch(`/api/food-spots/jeju?${searchParams}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error("맛집·카페 목록을 불러오지 못했습니다.");
      }

      return (await response.json()) as FoodSpotPage;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
  const spots = query.data?.pages.flatMap((page) => page.spots) ?? [];
  const totalCount = query.data?.pages[0]?.totalCount ?? 0;

  return { ...query, spots, totalCount };
}
