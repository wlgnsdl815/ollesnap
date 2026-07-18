"use client";

import { Loader2 } from "lucide-react";

import {
  buildTravelPlanKey,
  useSavedTravelPlanKeys,
} from "@/features/account/presentation/hooks/use-saved-travel-plan-keys";
import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

import { PlaceGridCard } from "../components/place-grid-card";
import { useSnapSpotsInfiniteScroll } from "../hooks/use-snap-spots-infinite-scroll";

interface SnapSpotsInfiniteGridProps {
  initialSpots: PhotoSpot[];
  initialHasMore: boolean;
}

export function SnapSpotsInfiniteGrid({
  initialSpots,
  initialHasMore,
}: SnapSpotsInfiniteGridProps) {
  const { spots, hasMore, isLoading, sentinelRef } =
    useSnapSpotsInfiniteScroll({ initialSpots, initialHasMore });
  const savedTravelPlanKeys = useSavedTravelPlanKeys();

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-bold">아직 표시할 장소가 없어요</p>
        <p className="text-xs leading-6 text-muted-foreground">
          관광 데이터 연결 후 제주 곳곳의 장소가 채워집니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {spots.map((spot) => (
          <PlaceGridCard
            key={spot.id}
            href={`/spots/${spot.id}`}
            imageUrl={spot.imageUrl}
            title={spot.title}
            subtitle={spot.location}
            isSaved={savedTravelPlanKeys.has(
              buildTravelPlanKey("sight", spot.id),
            )}
          />
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isLoading && (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          )}
        </div>
      ) : (
        <p className="py-4 text-center text-xs font-medium text-muted-foreground">
          제주의 모든 장소를 둘러봤어요.
        </p>
      )}
    </div>
  );
}
