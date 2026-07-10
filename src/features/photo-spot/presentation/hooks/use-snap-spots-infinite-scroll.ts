"use client";

import { useEffect, useRef, useState } from "react";

import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

interface SnapSpotsPageResponse {
  spots: PhotoSpot[];
  hasMore: boolean;
}

interface UseSnapSpotsInfiniteScrollParams {
  initialSpots: PhotoSpot[];
  initialHasMore: boolean;
}

export function useSnapSpotsInfiniteScroll({
  initialSpots,
  initialHasMore,
}: UseSnapSpotsInfiniteScrollParams) {
  const [spots, setSpots] = useState(initialSpots);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || isFetchingRef.current) {
          return;
        }

        void loadNextPage();
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();

    async function loadNextPage() {
      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const nextPage = page + 1;
        const response = await fetch(
          `/api/photo-spots/jeju?page=${nextPage}`,
        );
        const data: SnapSpotsPageResponse = await response.json();

        setSpots((current) => [...current, ...data.spots]);
        setHasMore(data.hasMore);
        setPage(nextPage);
      } catch {
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [page, hasMore]);

  return { spots, hasMore, isLoading, sentinelRef };
}
