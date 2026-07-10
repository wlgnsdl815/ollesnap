"use client";

import { Loader2, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

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

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-7" />
        </span>
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
          <SnapSpotGridCard key={spot.id} spot={spot} />
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

interface SnapSpotGridCardProps {
  spot: PhotoSpot;
}

function SnapSpotGridCard({ spot }: SnapSpotGridCardProps) {
  return (
    <Link href={`/spots/${spot.id}`} className="flex flex-col gap-2">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={spot.imageUrl}
          alt={spot.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground">
          <MapPin className="size-4" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="truncate text-sm font-bold">{spot.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {spot.location}
        </p>
      </div>
    </Link>
  );
}
