import { Globe, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { TravelPlanItemButton } from "@/features/account/presentation/components/travel-plan-item-button";
import { createFoodSpotRepository } from "@/features/photo-spot/data/repository/food-spot.repository.impl";

const foodSpotRepository = createFoodSpotRepository();

interface FoodSpotDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FoodSpotDetailPage({
  params,
}: FoodSpotDetailPageProps) {
  const { id } = await params;
  const [spot, userWeddingState] = await Promise.all([
    foodSpotRepository.getById(id),
    getUserWeddingState(),
  ]);

  if (!spot) {
    return (
      <div className="flex flex-col gap-6 pb-4">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-bold">이 장소를 찾을 수 없어요</p>
          <p className="text-xs leading-6 text-muted-foreground">
            목록에서 다시 선택해 주세요.
          </p>
        </div>
      </div>
    );
  }

  const mapLink =
    spot.mapx && spot.mapy
      ? `https://map.kakao.com/link/map/${encodeURIComponent(spot.title)},${spot.mapy},${spot.mapx}`
      : undefined;

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-muted shadow-sm">
        <Image
          src={spot.imageUrl}
          alt={spot.title}
          fill
          priority
          sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black leading-tight text-balance">
            {spot.title}
          </h1>
          {spot.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{spot.address}</span>
            </div>
          )}
        </div>

        {spot.overview && (
          <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-sm font-bold">이 장소에 대해</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {spot.overview}
            </p>
          </div>
        )}

        {(spot.tel || mapLink) && (
          <div className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-sm">
            {spot.tel && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${spot.tel}`} className="font-semibold text-foreground">
                  {spot.tel}
                </a>
              </div>
            )}
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary/10 text-sm font-bold text-primary active:bg-primary/20"
              >
                <MapPin className="size-4" />
                지도에서 보기
              </a>
            )}
          </div>
        )}

        <TravelPlanItemButton
          spotId={spot.id}
          kind="food"
          title={spot.title}
          location={spot.address}
          imageUrl={spot.imageUrl}
          initialIsSaved={userWeddingState.travelPlanItems.some(
            (item) => item.spotId === spot.id && item.kind === "food",
          )}
          isAuthenticated={userWeddingState.isAuthenticated}
          returnPath={`/spots/food/${spot.id}`}
        />

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="size-3.5 shrink-0" />
          정보 제공: 공공 관광데이터
        </p>
      </div>
    </div>
  );
}
