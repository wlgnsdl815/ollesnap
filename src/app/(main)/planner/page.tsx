import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import type { SavedTravelPlanItem } from "@/features/account/domain/entity/user-wedding.entity";
import { createCongestionRepository } from "@/features/photo-spot/data/repository/congestion.repository.impl";
import { createRelatedSpotRepository } from "@/features/photo-spot/data/repository/related-spot.repository.impl";
import type {
  CongestionLevel,
  TourismCongestionEntry,
} from "@/features/photo-spot/domain/entity/congestion-forecast.entity";
import { extractPlaceName } from "@/features/photo-spot/domain/extract-place-name";
import {
  findSpotCongestionForecast,
  pickForecastDay,
} from "@/features/photo-spot/domain/usecase/congestion.usecase";
import { buildCourseSuggestions } from "@/features/photo-spot/domain/usecase/related-spots.usecase";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { recommendShootingDates } from "@/features/wedding/domain/usecase/recommend-shooting-dates.usecase";
import { resolveSnapTeam } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { JejuScheduleScreen } from "@/features/wedding/presentation/pages/jeju-schedule-screen";

const congestionRepository = createCongestionRepository();
const relatedSpotRepository = createRelatedSpotRepository();

// 일정에 담은 장소가 많아도 코스 추천용 연관 관광지 조회는 앞쪽 몇 곳이면 충분하다.
const COURSE_SUGGESTION_BASE_MAXIMUM = 3;

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
  const [userWeddingState, congestionPool, catalog] = await Promise.all([
    getUserWeddingState(),
    congestionRepository.getForecastPool(),
    getWeddingCatalog(),
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
  const congestionLevelByItemId = getCongestionLevelByItemId(
    userWeddingState.travelPlanItems,
    congestionPool,
  );
  const shootingDateRecommendation =
    savedPlan?.stayStartDate && savedPlan?.stayEndDate
      ? recommendShootingDates({
          stayStartDate: savedPlan.stayStartDate,
          stayEndDate: savedPlan.stayEndDate,
          travelPlanItems: userWeddingState.travelPlanItems,
          congestionPool,
        })
      : null;
  const courseSuggestionBases = await Promise.all(
    userWeddingState.travelPlanItems
      .filter((item) => item.kind === "sight")
      .slice(0, COURSE_SUGGESTION_BASE_MAXIMUM)
      .map(async (item) => ({
        title: item.title,
        spots: await relatedSpotRepository.getRelatedSpots(
          extractPlaceName(item.location ?? item.title),
        ),
      })),
  );
  const courseSuggestions = buildCourseSuggestions(
    courseSuggestionBases,
    userWeddingState.travelPlanItems.map((item) => item.title),
  );

  return (
    <JejuScheduleScreen
      team={team}
      initialSavedPlan={savedPlan}
      isAuthenticated={userWeddingState.isAuthenticated}
      travelPlanItems={userWeddingState.travelPlanItems}
      congestionLevelByItemId={congestionLevelByItemId}
      shootingDateRecommendation={shootingDateRecommendation}
      courseSuggestions={courseSuggestions}
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
