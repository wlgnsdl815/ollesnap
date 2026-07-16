import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { WeddingCatalogScreen } from "@/features/wedding/presentation/pages/wedding-catalog-screen";

interface ArtistsPageProps {
  searchParams: Promise<{
    artist?: string;
    package?: string;
    scene?: string;
    tab?: string;
    tone?: string;
  }>;
}

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const [query, userWeddingState] = await Promise.all([
    searchParams,
    getUserWeddingState(),
  ]);
  const initialScene = weddingCatalogMock.scenes.find(
    (scene) => scene.id === query.scene,
  )?.id;
  const initialTone = weddingCatalogMock.tones.find(
    (tone) => tone.id === query.tone,
  )?.id;
  const initialArtist = weddingCatalogMock.artists.find(
    (artist) => artist.id === query.artist,
  );
  const initialTab = query.tab === "styling" ? "styling" : "artists";

  return (
    <WeddingCatalogScreen
      catalog={weddingCatalogMock}
      initialArtist={initialArtist}
      initialScene={initialScene}
      initialTab={initialTab}
      initialTone={initialTone}
      savedArtistCount={userWeddingState.savedArtistIds.length}
      selectedPackageId={query.package}
    />
  );
}
