import { CalendarDays, Camera, Globe, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

import { createAttractionRepository } from "@/features/photo-spot/data/repository/attraction.repository.impl";
import { createCongestionRepository } from "@/features/photo-spot/data/repository/congestion.repository.impl";
import { createPhotoSpotRepository } from "@/features/photo-spot/data/repository/photo-spot.repository.impl";
import { createRelatedSpotRepository } from "@/features/photo-spot/data/repository/related-spot.repository.impl";
import { extractPlaceName } from "@/features/photo-spot/domain/extract-place-name";
import { findSpotCongestionForecast } from "@/features/photo-spot/domain/usecase/congestion.usecase";
import { getJejuSnapSpotDetail } from "@/features/photo-spot/domain/usecase/get-jeju-snap-spot-detail";
import { CongestionForecastCalendar } from "@/features/photo-spot/presentation/components/congestion-forecast-calendar";
import { RelatedSpotsSection } from "@/features/photo-spot/presentation/components/related-spots-section";
import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";
import { TravelPlanItemButton } from "@/features/account/presentation/components/travel-plan-item-button";

const photoSpotRepository = createPhotoSpotRepository();
const attractionRepository = createAttractionRepository();
const congestionRepository = createCongestionRepository();
const relatedSpotRepository = createRelatedSpotRepository();

interface SnapSpotDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SnapSpotDetailPage({
  params,
}: SnapSpotDetailPageProps) {
  const { id } = await params;
  // 혼잡도·연관 관광지는 화면 진입을 막지 않도록 Suspense로 나중에 채운다.
  const [spot, userWeddingState] = await Promise.all([
    getJejuSnapSpotDetail(photoSpotRepository, attractionRepository, id),
    getUserWeddingState(),
  ]);
  const attraction = spot?.attraction;
  const mapLink =
    attraction?.mapx && attraction?.mapy
      ? `https://map.kakao.com/link/map/${encodeURIComponent(spot?.title ?? "")},${attraction.mapy},${attraction.mapx}`
      : undefined;

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

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-muted shadow-sm">
        <Image
          src={spot.fullImageUrl}
          alt={spot.title}
          fill
          priority
          sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        {spot.award && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground">
            {spot.award}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black leading-tight text-balance">
            {spot.title}
          </h1>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span>{spot.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex min-w-28 flex-1 items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">공모전 수상작 촬영 시기</span>
              <span className="text-sm font-bold">{spot.filmedAt}</span>
            </div>
          </div>
          <div className="flex min-w-28 flex-1 items-center gap-2">
            <Camera className="size-4 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">촬영자</span>
              <span className="text-sm font-bold">{spot.photographer}</span>
            </div>
          </div>
        </div>

        {spot.allKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {spot.allKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {attraction && (
          <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-sm font-bold">이 장소에 대해</p>
            {attraction.overview && (
              <p className="text-sm leading-6 text-muted-foreground">
                {attraction.overview}
              </p>
            )}
            <div className="flex flex-col gap-2 text-sm">
              {attraction.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    {attraction.address}
                  </span>
                </div>
              )}
              {attraction.tel && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-primary" />
                  <a
                    href={`tel:${attraction.tel}`}
                    className="font-semibold text-foreground"
                  >
                    {attraction.tel}
                  </a>
                </div>
              )}
              {attraction.homepageUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="size-4 shrink-0 text-primary" />
                  <a
                    href={attraction.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-semibold text-foreground"
                  >
                    {attraction.homepageUrl}
                  </a>
                </div>
              )}
            </div>
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

        <Suspense fallback={null}>
          <CongestionCalendarAsync
            placeName={extractPlaceName(spot.location)}
          />
        </Suspense>

        <Suspense fallback={null}>
          <RelatedSpotsAsync
            placeName={extractPlaceName(spot.location)}
            baseSpotTitle={spot.title}
          />
        </Suspense>

        <TravelPlanItemButton
          spotId={spot.id}
          kind="sight"
          title={spot.title}
          location={spot.location}
          imageUrl={spot.fullImageUrl}
          initialIsSaved={userWeddingState.travelPlanItems.some(
            (item) => item.spotId === spot.id && item.kind === "sight",
          )}
          isAuthenticated={userWeddingState.isAuthenticated}
          returnPath={`/spots/${spot.id}`}
        />

        <p className="text-xs text-muted-foreground">
          사진 제공: 관광공모전 수상작 공공데이터
        </p>
      </div>
    </div>
  );
}

async function CongestionCalendarAsync({ placeName }: { placeName: string }) {
  const congestionPool = await congestionRepository.getForecastPool();
  const forecast = findSpotCongestionForecast(congestionPool, placeName);

  if (!forecast) {
    return null;
  }

  return <CongestionForecastCalendar forecast={forecast} />;
}

async function RelatedSpotsAsync({
  placeName,
  baseSpotTitle,
}: {
  placeName: string;
  baseSpotTitle: string;
}) {
  const relatedSpots = await relatedSpotRepository.getRelatedSpots(placeName);

  if (relatedSpots.length === 0) {
    return null;
  }

  return (
    <RelatedSpotsSection
      baseSpotTitle={baseSpotTitle}
      relatedSpots={relatedSpots}
    />
  );
}
