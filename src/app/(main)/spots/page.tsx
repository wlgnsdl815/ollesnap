import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { createPhotoSpotRepository } from "@/features/photo-spot/data/repository/photo-spot.repository.impl";
import { getJejuSnapSpotsPage } from "@/features/photo-spot/domain/usecase/get-jeju-snap-spots-page";
import { JejuExploreScreen } from "@/features/photo-spot/presentation/pages/jeju-explore-screen";

const photoSpotRepository = createPhotoSpotRepository();

export default async function JejuSnapSpotsPage() {
  const spotsPage = await getJejuSnapSpotsPage(photoSpotRepository, 1);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center gap-1 rounded-full pr-3 text-sm font-bold text-muted-foreground active:bg-muted"
        >
          <ChevronLeft className="size-5" />
          홈
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black leading-tight text-balance">
            제주 이곳저곳
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            스냅 촬영 앞뒤로 남는 시간, 갈 곳과 먹을 곳을 함께 살펴보세요.
          </p>
        </div>
      </header>

      <JejuExploreScreen
        initialSpots={spotsPage.spots}
        initialSpotsHasMore={spotsPage.hasMore}
      />
    </div>
  );
}
