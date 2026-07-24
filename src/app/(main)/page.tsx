import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { createPhotoSpotRepository } from "@/features/photo-spot/data/repository/photo-spot.repository.impl";
import { getJejuSnapSpots } from "@/features/photo-spot/domain/usecase/get-jeju-snap-spots";
import { pickDailyHeroSpot } from "@/features/home/domain/pick-daily-hero-spot";
import { HomeScreen } from "@/features/home/presentation/pages/home-screen";
import { getWeddingCatalog } from "@/features/wedding/data/server/get-wedding-catalog";

const photoSpotRepository = createPhotoSpotRepository();

// 히어로 후보로 쓸 수상작 풀 크기 — 한 달치 이상 돌아가며 보여줄 만큼.
const HERO_POOL_SIZE = 40;

export default async function HomePage() {
  const [catalog, heroPool, userWeddingState] = await Promise.all([
    getWeddingCatalog(),
    getJejuSnapSpots(photoSpotRepository, HERO_POOL_SIZE).catch(
      (): never[] => [],
    ),
    getUserWeddingState(),
  ]);
  const heroSpot = pickDailyHeroSpot(heroPool, new Date());

  return (
    <HomeScreen
      catalog={catalog}
      heroSpot={heroSpot}
      savedArtistIds={userWeddingState.savedArtistIds}
      savedStylingShopIds={userWeddingState.savedStylingShopIds}
    />
  );
}
