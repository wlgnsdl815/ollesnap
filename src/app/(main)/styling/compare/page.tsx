import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { CompareStylingShopsScreen } from "@/features/wedding/presentation/pages/compare-styling-shops-screen";

export const metadata = {
  title: "스드메 샵 비교",
};

export default async function CompareStylingShopsPage() {
  const [userWeddingState, catalog] = await Promise.all([
    getUserWeddingState(),
    getWeddingCatalog(),
  ]);
  const savedStylingShops = catalog.stylingShops.filter((shop) =>
    userWeddingState.savedStylingShopIds.includes(shop.id),
  );

  return (
    <CompareStylingShopsScreen
      savedStylingShops={savedStylingShops}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
