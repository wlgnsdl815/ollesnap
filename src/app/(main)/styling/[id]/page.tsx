import { notFound } from "next/navigation";

import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { StylingShopDetailScreen } from "@/features/wedding/presentation/pages/styling-shop-detail-screen";

interface StylingShopPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ artist?: string; package?: string }>;
}

export default async function StylingShopPage({
  params,
  searchParams,
}: StylingShopPageProps) {
  const [{ id }, query, catalog, userWeddingState] = await Promise.all([
    params,
    searchParams,
    getWeddingCatalog(),
    getUserWeddingState(),
  ]);
  const shop = catalog.stylingShops.find((item) => item.id === id);

  if (!shop) {
    notFound();
  }

  const artist = catalog.artists.find((item) => item.id === query.artist);

  return (
    <StylingShopDetailScreen
      shop={shop}
      artist={artist}
      selectedSnapPackageId={query.package}
      isShopSaved={userWeddingState.savedStylingShopIds.includes(shop.id)}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
