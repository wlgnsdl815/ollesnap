import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { resolveSnapTeam } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { JejuScheduleScreen } from "@/features/wedding/presentation/pages/jeju-schedule-screen";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";

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
  const userWeddingState = await getUserWeddingState();
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

  return (
    <JejuScheduleScreen
      team={team}
      initialSavedPlan={savedPlan}
      isAuthenticated={userWeddingState.isAuthenticated}
      travelPlanItems={userWeddingState.travelPlanItems}
    />
  );
}
