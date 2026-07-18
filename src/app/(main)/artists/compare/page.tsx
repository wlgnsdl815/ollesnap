import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { CompareArtistsScreen } from "@/features/wedding/presentation/pages/compare-artists-screen";

export default async function CompareArtistsPage() {
  const [userWeddingState, catalog] = await Promise.all([
    getUserWeddingState(),
    getWeddingCatalog(),
  ]);
  const savedArtists = catalog.artists.filter((artist) =>
    userWeddingState.savedArtistIds.includes(artist.id),
  );

  return (
    <CompareArtistsScreen
      savedArtists={savedArtists}
      catalog={catalog}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
