"use client";

import { Suspense, use, useState } from "react";

import type { SaveSnapPlanInput } from "@/features/account/data/actions/user-wedding.actions";
import type { SavedSnapPlan } from "@/features/account/domain/entity/user-wedding.entity";
import { SaveSnapPlanCard } from "@/features/account/presentation/components/save-snap-plan-card";
import { Skeleton } from "@/shared/components/ui/skeleton";

import type { ShootingDateRecommendation } from "../../domain/usecase/recommend-shooting-dates.usecase";
import { ShootingDateRecommendationSection } from "./shooting-date-recommendation";

interface PlannerScheduleGroupProps {
  recommendationPromise: Promise<ShootingDateRecommendation | null>;
  /** 체류일이 저장돼 있어 추천 섹션이 나올 자리가 있는지 (로딩 카드 노출 여부) */
  expectsRecommendation: boolean;
  showSaveCard: boolean;
  plan: SaveSnapPlanInput;
  initialSavedPlan: SavedSnapPlan | null;
  isAuthenticated: boolean;
  returnPath: string;
}

// 추천 날짜를 누르면 저장 카드의 촬영 예정일에 바로 담기도록
// 두 카드가 촬영일 상태 하나를 공유한다. 혼잡도 추천은 화면 진입을
// 막지 않도록 Suspense 경계 안에서 나중에 채워진다.
export function PlannerScheduleGroup({
  recommendationPromise,
  expectsRecommendation,
  showSaveCard,
  plan,
  initialSavedPlan,
  isAuthenticated,
  returnPath,
}: PlannerScheduleGroupProps) {
  const [shootingDate, setShootingDate] = useState(
    initialSavedPlan?.shootingDate ?? "",
  );
  const canPickDate = isAuthenticated && showSaveCard;

  return (
    <>
      {expectsRecommendation ? (
        <Suspense fallback={<RecommendationFallback />}>
          <RecommendationResolver
            recommendationPromise={recommendationPromise}
            selectedDate={canPickDate ? shootingDate : undefined}
            onSelectDate={canPickDate ? setShootingDate : undefined}
          />
        </Suspense>
      ) : null}
      {showSaveCard ? (
        <SaveSnapPlanCard
          plan={plan}
          initialSavedPlan={initialSavedPlan}
          isAuthenticated={isAuthenticated}
          returnPath={returnPath}
          shootingDate={shootingDate}
          onShootingDateChange={setShootingDate}
        />
      ) : null}
    </>
  );
}

interface RecommendationResolverProps {
  recommendationPromise: Promise<ShootingDateRecommendation | null>;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

function RecommendationResolver({
  recommendationPromise,
  selectedDate,
  onSelectDate,
}: RecommendationResolverProps) {
  const recommendation = use(recommendationPromise);

  if (!recommendation) {
    return null;
  }

  return (
    <ShootingDateRecommendationSection
      recommendation={recommendation}
      selectedDate={selectedDate}
      onSelectDate={onSelectDate}
    />
  );
}

function RecommendationFallback() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">촬영하기 좋은 날</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          체류 기간의 관광지 혼잡도 예측을 불러오는 중이에요.
        </p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
    </section>
  );
}
