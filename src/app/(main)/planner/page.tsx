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
import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
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

export default async function JejuSchedulePage({
  searchParams,
}: JejuSchedulePageProps) {
  const selection = await searchParams;
  const [userWeddingState, congestionPool] = await Promise.all([
    getUserWeddingState(),
    congestionRepository.getForecastPool(),
  ]);
  const savedPlan = userWeddingState.snapPlan;
  const team = resolveSnapTeam(weddingCatalogMock, {
    artistId: selection.artist ?? savedPlan?.artistId ?? undefined,
    packageId: selection.package ?? savedPlan?.packageId ?? undefined,
    stylingShopId: selection.stylingShop ?? savedPlan?.stylingShopId ?? undefined,
    stylingProductId:
      selection.stylingProduct ?? savedPlan?.stylingProductId ?? undefined,
    stylingOptionIds: selection.stylingOptions
      ? selection.stylingOptions.split(",").filter(Boolean)
      : savedPlan?.stylingOptionIds,
  });
  const congestionLevelByItemId = getCongestionLevelByItemId(
    userWeddingState.travelPlanItems,
    congestionPool,
  );

  return (
    <JejuScheduleScreen
      team={team}
      initialSavedPlan={savedPlan}
      isAuthenticated={userWeddingState.isAuthenticated}
      travelPlanItems={userWeddingState.travelPlanItems}
      congestionLevelByItemId={congestionLevelByItemId}
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
