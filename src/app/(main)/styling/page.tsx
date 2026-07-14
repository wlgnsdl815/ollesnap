import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { StylingScreen } from "@/features/wedding/presentation/pages/styling-screen";

interface StylingPageProps {
  searchParams: Promise<{
    artist?: string;
    package?: string;
  }>;
}

export default async function StylingPage({ searchParams }: StylingPageProps) {
  const query = await searchParams;
  const selectedArtist = weddingCatalogMock.artists.find(
    (artist) => artist.id === query.artist,
  );

  return (
    <StylingScreen
      artist={selectedArtist}
      catalog={weddingCatalogMock}
      selectedPackageId={query.package}
    />
  );
}
