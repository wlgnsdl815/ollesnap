import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { findSnapArtist } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";
import { StylingScreen } from "@/features/wedding/presentation/pages/styling-screen";

interface StylingPageProps {
  searchParams: Promise<{ artist?: string; dress?: string; makeup?: string }>;
}

export default async function StylingPage({ searchParams }: StylingPageProps) {
  const query = await searchParams;
  const artist = findSnapArtist(weddingCatalogMock, query.artist);

  return (
    <StylingScreen
      artist={artist}
      catalog={weddingCatalogMock}
      selectedDressId={query.dress}
      selectedMakeupId={query.makeup}
    />
  );
}
