"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type {
  SnapArtistPage,
  SnapScene,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";

interface UseSnapArtistInfiniteQueryParams {
  scene?: SnapScene;
  tone?: WeddingTone;
}

export function useSnapArtistInfiniteQuery({
  scene,
  tone,
}: UseSnapArtistInfiniteQueryParams) {
  const query = useInfiniteQuery({
    queryKey: ["snap-artists", scene ?? "all", tone ?? "all"],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const searchParams = new URLSearchParams({ page: String(pageParam) });

      if (scene) {
        searchParams.set("scene", scene);
      }

      if (tone) {
        searchParams.set("tone", tone);
      }

      const response = await fetch(`/api/snap-artists?${searchParams}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error("작가 목록을 불러오지 못했습니다.");
      }

      return (await response.json()) as SnapArtistPage;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
  const artists = query.data?.pages.flatMap((page) => page.artists) ?? [];
  const totalCount = query.data?.pages[0]?.totalCount ?? 0;

  return { ...query, artists, totalCount };
}
