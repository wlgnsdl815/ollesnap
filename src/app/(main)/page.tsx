import { createPhotoSpotRepository } from "@/features/photo-spot/data/repository/photo-spot.repository.impl";
import { getJejuSnapSpots } from "@/features/photo-spot/domain/usecase/get-jeju-snap-spots";
import { HomeScreen } from "@/features/home/presentation/pages/home-screen";

const photoSpotRepository = createPhotoSpotRepository();

export default async function HomePage() {
  const jejuSnapSpots = await getJejuSnapSpots(photoSpotRepository);

  return <HomeScreen jejuSnapSpots={jejuSnapSpots} />;
}
