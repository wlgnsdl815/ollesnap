"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import {
  buildTravelPlanKey,
  useSavedTravelPlanKeys,
} from "@/features/account/presentation/hooks/use-saved-travel-plan-keys";

import type { JejuCityFilter } from "../../domain/jeju-region";
import { PlaceGridCard } from "../components/place-grid-card";
import { useFoodSpotInfiniteQuery } from "../hooks/use-food-spot-infinite-query";

export function FoodSpotsInfiniteGrid() {
  const [cityFilter, setCityFilter] = useState<JejuCityFilter | undefined>(
    undefined,
  );
  const {
    spots,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
  } = useFoodSpotInfiniteQuery({ cityFilter });
  const savedTravelPlanKeys = useSavedTravelPlanKeys();
  const { ref: sentinelRef } = useInView({
    rootMargin: "300px",
    skip: !hasNextPage || isFetchingNextPage,
    onChange: (isInView) => {
      if (isInView) {
        void fetchNextPage();
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <CityFilterChip
            isActive={!cityFilter}
            label="전체"
            onClick={() => setCityFilter(undefined)}
          />
          <CityFilterChip
            isActive={cityFilter === "jeju-city"}
            label="제주시"
            onClick={() => setCityFilter("jeju-city")}
          />
          <CityFilterChip
            isActive={cityFilter === "seogwipo"}
            label="서귀포시"
            onClick={() => setCityFilter("seogwipo")}
          />
        </div>
      </div>

      {isPending ? (
        <FoodSpotGridSkeleton />
      ) : isError && spots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-bold">맛집·카페 목록을 불러오지 못했어요</p>
          <p className="text-xs leading-6 text-muted-foreground">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      ) : spots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-bold">아직 표시할 맛집이 없어요</p>
          <p className="text-xs leading-6 text-muted-foreground">
            다른 지역을 선택해보세요.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {spots.map((spot) => (
              <PlaceGridCard
                key={spot.id}
                href={`/spots/food/${spot.id}`}
                imageUrl={spot.imageUrl}
                title={spot.title}
                subtitle={spot.address}
                isSaved={savedTravelPlanKeys.has(
                  buildTravelPlanKey("food", spot.id),
                )}
              />
            ))}
          </div>

          {hasNextPage ? (
            <div ref={sentinelRef} className="flex justify-center py-4">
              {isFetchingNextPage && (
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
              )}
            </div>
          ) : (
            <p className="py-4 text-center text-xs font-medium text-muted-foreground">
              제주의 맛집·카페를 모두 둘러봤어요.
            </p>
          )}
        </>
      )}
    </div>
  );
}

interface CityFilterChipProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function CityFilterChip({ isActive, label, onClick }: CityFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-9 shrink-0 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-secondary-foreground active:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

function FoodSpotGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="맛집·카페 목록 불러오는 중"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="aspect-4/5 animate-pulse rounded-2xl bg-muted"
        />
      ))}
    </div>
  );
}
