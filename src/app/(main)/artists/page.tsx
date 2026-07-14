import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { ArtistsScreen } from "@/features/wedding/presentation/pages/artists-screen";

interface ArtistsPageProps {
  searchParams: Promise<{ scene?: string; tone?: string }>;
}

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const query = await searchParams;
  const initialScene = weddingCatalogMock.scenes.find(
    (scene) => scene.id === query.scene,
  )?.id;
  const initialTone = weddingCatalogMock.tones.find(
    (tone) => tone.id === query.tone,
  )?.id;

  return (
    <ArtistsScreen
      catalog={weddingCatalogMock}
      initialScene={initialScene}
      initialTone={initialTone}
    />
  );
}
