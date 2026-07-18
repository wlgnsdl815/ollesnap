import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
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

export const metadata = {
  title: "작가 찾기",
};

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const [query, userWeddingState, catalog] = await Promise.all([
    searchParams,
    getUserWeddingState(),
    getWeddingCatalog(),
  ]);
  const initialScene = catalog.scenes.find(
    (scene) => scene.id === query.scene,
  )?.id;
  const initialTone = catalog.tones.find(
    (tone) => tone.id === query.tone,
  )?.id;
  const initialArtist = catalog.artists.find(
    (artist) => artist.id === query.artist,
  );
  const initialTab = query.tab === "styling" ? "styling" : "artists";

  return (
    <WeddingCatalogScreen
      catalog={catalog}
      initialArtist={initialArtist}
      initialScene={initialScene}
      initialTab={initialTab}
      initialTone={initialTone}
      savedArtistCount={userWeddingState.savedArtistIds.length}
      selectedPackageId={query.package}
    />
  );
}
