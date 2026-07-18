import { notFound } from "next/navigation";

import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";
import { ArtistDetailScreen } from "@/features/wedding/presentation/pages/artist-detail-screen";

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({
  params,
}: ArtistDetailPageProps) {
  const [{ id }, catalog] = await Promise.all([params, getWeddingCatalog()]);
  const artist = catalog.artists.find((item) => item.id === id);

  if (!artist) {
    notFound();
  }

  const userWeddingState = await getUserWeddingState();

  return (
    <ArtistDetailScreen
      artist={artist}
      catalog={catalog}
      isArtistSaved={userWeddingState.savedArtistIds.includes(artist.id)}
      isAuthenticated={userWeddingState.isAuthenticated}
    />
  );
}
