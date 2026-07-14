import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { resolveSnapTeam } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { MySnapTeamScreen } from "@/features/wedding/presentation/pages/my-snap-team-screen";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";

interface MySnapTeamPageProps {
  searchParams: Promise<{
    artist?: string;
    package?: string;
    stylingShop?: string;
    stylingProduct?: string;
    stylingOptions?: string;
  }>;
}

export default async function MySnapTeamPage({
  searchParams,
}: MySnapTeamPageProps) {
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
    <MySnapTeamScreen
      team={team}
      initialSavedPlan={savedPlan}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
