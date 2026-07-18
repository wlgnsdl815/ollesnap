import { getPreparationItemStates } from "@/features/account/data/server/preparation.server";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import type { SavedTravelPlanItem } from "@/features/account/domain/entity/user-wedding.entity";
import { createCongestionRepository } from "@/features/photo-spot/data/repository/congestion.repository.impl";
import type {
  CongestionLevel,
  TourismCongestionEntry,
} from "@/features/photo-spot/domain/entity/congestion-forecast.entity";
import { extractPlaceName } from "@/features/photo-spot/domain/extract-place-name";
import {
  findSpotCongestionForecast,
  pickForecastDay,
} from "@/features/photo-spot/domain/usecase/congestion.usecase";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { recommendShootingDates } from "@/features/wedding/domain/usecase/recommend-shooting-dates.usecase";
import { resolveSnapTeam } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { JejuScheduleScreen } from "@/features/wedding/presentation/pages/jeju-schedule-screen";

const congestionRepository = createCongestionRepository();

interface JejuSchedulePageProps {
  searchParams: Promise<{
    artist?: string;
    package?: string;
    stylingShop?: string;
    stylingProduct?: string;
    stylingOptions?: string;
  }>;
}

export const metadata = {
  title: "제주 일정",
};

export default async function JejuSchedulePage({
  searchParams,
}: JejuSchedulePageProps) {
  const selection = await searchParams;
  const [userWeddingState, catalog, preparationItemStates] = await Promise.all([
    getUserWeddingState(),
    getWeddingCatalog(),
    getPreparationItemStates(),
  ]);
  const savedPlan = userWeddingState.snapPlan;
  const selectedArtistId = selection.artist ?? savedPlan?.artistId ?? undefined;
  const team = selectedArtistId
    ? resolveSnapTeam(catalog, {
        artistId: selectedArtistId,
        packageId: selection.package ?? savedPlan?.packageId ?? undefined,
        stylingShopId:
          selection.stylingShop ?? savedPlan?.stylingShopId ?? undefined,
        stylingProductId:
          selection.stylingProduct ?? savedPlan?.stylingProductId ?? undefined,
        stylingOptionIds: selection.stylingOptions
          ? selection.stylingOptions.split(",").filter(Boolean)
          : savedPlan?.stylingOptionIds,
      })
    : null;

  // 혼잡도 풀은 화면 진입을 막지 않도록 await 없이 Suspense 경계로 흘려보낸다.
  const congestionPoolPromise = congestionRepository.getForecastPool();
  const congestionLevelByItemIdPromise = congestionPoolPromise.then((pool) =>
    getCongestionLevelByItemId(userWeddingState.travelPlanItems, pool),
  );
  const recommendationPromise =
    savedPlan?.stayStartDate && savedPlan?.stayEndDate
      ? congestionPoolPromise.then((pool) =>
          recommendShootingDates({
            stayStartDate: savedPlan.stayStartDate!,
            stayEndDate: savedPlan.stayEndDate!,
            travelPlanItems: userWeddingState.travelPlanItems,
            congestionPool: pool,
          }),
        )
      : Promise.resolve(null);

  return (
    <JejuScheduleScreen
      team={team}
      initialSavedPlan={savedPlan}
      isAuthenticated={userWeddingState.isAuthenticated}
      travelPlanItems={userWeddingState.travelPlanItems}
      congestionLevelByItemIdPromise={congestionLevelByItemIdPromise}
      recommendationPromise={recommendationPromise}
      preparationItemStates={preparationItemStates}
    />
  );
}

function getCongestionLevelByItemId(
  travelPlanItems: SavedTravelPlanItem[],
  congestionPool: TourismCongestionEntry[],
): Record<string, CongestionLevel> {
  const result: Record<string, CongestionLevel> = {};

  for (const item of travelPlanItems) {
    if (!item.plannedDate) {
      continue;
    }

    const placeName = extractPlaceName(item.location ?? item.title);
    const forecast = findSpotCongestionForecast(congestionPool, placeName);
    const day = forecast && pickForecastDay(forecast, item.plannedDate);

    if (day) {
      result[item.id] = day.level;
    }
  }

  return result;
}
