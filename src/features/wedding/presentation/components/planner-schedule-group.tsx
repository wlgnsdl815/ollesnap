"use client";

import { useState } from "react";

import type { SaveSnapPlanInput } from "@/features/account/data/actions/user-wedding.actions";
import type { SavedSnapPlan } from "@/features/account/domain/entity/user-wedding.entity";
import { SaveSnapPlanCard } from "@/features/account/presentation/components/save-snap-plan-card";

import type { ShootingDateRecommendation } from "../../domain/usecase/recommend-shooting-dates.usecase";
import { ShootingDateRecommendationSection } from "./shooting-date-recommendation";

interface PlannerScheduleGroupProps {
  recommendation: ShootingDateRecommendation | null;
  showSaveCard: boolean;
  plan: SaveSnapPlanInput;
  initialSavedPlan: SavedSnapPlan | null;
  isAuthenticated: boolean;
  returnPath: string;
}

// 추천 날짜를 누르면 저장 카드의 촬영 예정일에 바로 담기도록
// 두 카드가 촬영일 상태 하나를 공유한다.
export function PlannerScheduleGroup({
  recommendation,
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
      {recommendation ? (
        <ShootingDateRecommendationSection
          recommendation={recommendation}
          selectedDate={canPickDate ? shootingDate : undefined}
          onSelectDate={canPickDate ? setShootingDate : undefined}
        />
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
