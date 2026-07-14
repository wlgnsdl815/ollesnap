import { notFound } from "next/navigation";

import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";
import { ArtistDetailScreen } from "@/features/wedding/presentation/pages/artist-detail-screen";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({
  params,
}: ArtistDetailPageProps) {
  const { id } = await params;
  const artist = weddingCatalogMock.artists.find((item) => item.id === id);

  if (!artist) {
    notFound();
  }

  const userWeddingState = await getUserWeddingState();

  return (
    <ArtistDetailScreen
      artist={artist}
      catalog={weddingCatalogMock}
      isArtistSaved={userWeddingState.savedArtistIds.includes(artist.id)}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
