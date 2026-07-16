import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { CompareArtistsScreen } from "@/features/wedding/presentation/pages/compare-artists-screen";

export default async function CompareArtistsPage() {
  const userWeddingState = await getUserWeddingState();
  const savedArtists = weddingCatalogMock.artists.filter((artist) =>
    userWeddingState.savedArtistIds.includes(artist.id),
  );

  return (
    <CompareArtistsScreen
      savedArtists={savedArtists}
      catalog={weddingCatalogMock}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
