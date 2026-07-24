import { ArrowRight, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FavoriteArtistButton } from "@/features/account/presentation/components/favorite-artist-button";

import { PortfolioGallery } from "../components/portfolio-gallery";

import type {
  SnapArtist,
  SnapPackage,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import {
  formatPrice,
  formatPriceFrom,
  getSceneLabel,
  getStylingShopsForArtist,
  getToneLabel,
} from "../../domain/usecase/wedding-catalog.usecase";
import { TONE_PHOTO_FILTERS } from "../lib/scene-tone-visuals";

interface ArtistDetailScreenProps {
  artist: SnapArtist;
  catalog: WeddingCatalog;
  isArtistSaved: boolean;
  isAuthenticated: boolean;
}

export function ArtistDetailScreen({
  artist,
  catalog,
  isArtistSaved,
  isAuthenticated,
}: ArtistDetailScreenProps) {
  const linkedStylingShops = getStylingShopsForArtist(catalog, artist).filter(
    (shop) => shop.partnerArtistIds.includes(artist.id),
  );
  const portfolioImageUrl = artist.portfolioImageUrls?.[0];

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        {portfolioImageUrl ? (
          <section className="relative aspect-4/5 overflow-hidden rounded-3xl text-white">
            <Image
              src={portfolioImageUrl}
              alt={`${artist.studioName}의 대표 씬 — ${getSceneLabel(catalog, artist.scenes[0])}`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, (min-width: 640px) 672px, 100vw"
              className="object-cover"
              style={{ filter: TONE_PHOTO_FILTERS[artist.tones[0]] }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/15" />
            <div className="absolute inset-0 flex flex-col justify-end gap-6 p-6">
              <div className="flex flex-col gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/50">
                  <Image
                    src={artist.profileImageUrl}
                    alt={`${artist.artistName} 작가`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <h1 className="text-3xl font-semibold leading-tight text-balance">
                  {artist.studioName}
                </h1>
                <p className="text-sm leading-6 text-white/85">
                  {artist.artistName} 작가 · {artist.introduction}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {artist.scenes.map((scene) => (
                  <span
                    key={scene}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                  >
                    {getSceneLabel(catalog, scene)}
                  </span>
                ))}
                {artist.tones.map((tone) => (
                  <span
                    key={tone}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                  >
                    {getToneLabel(catalog, tone)}
                  </span>
                ))}
              </div>
              <FavoriteArtistButton
                artistId={artist.id}
                initialIsSaved={isArtistSaved}
                isAuthenticated={isAuthenticated}
                returnPath={`/artists/${artist.id}`}
              />
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={artist.profileImageUrl}
                  alt={`${artist.artistName} 작가`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold leading-tight text-balance">
                  {artist.studioName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {artist.artistName} 작가
                </p>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {artist.introduction}
            </p>
            <div className="flex flex-wrap gap-2">
              {artist.scenes.map((scene) => (
                <span
                  key={scene}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  {getSceneLabel(catalog, scene)}
                </span>
              ))}
              {artist.tones.map((tone) => (
                <span
                  key={tone}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  {getToneLabel(catalog, tone)}
                </span>
              ))}
            </div>
            <FavoriteArtistButton
              artistId={artist.id}
              initialIsSaved={isArtistSaved}
              isAuthenticated={isAuthenticated}
              returnPath={`/artists/${artist.id}`}
            />
          </section>
        )}
      </header>

      <section className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card">
        <InfoMetric label="상품" value={`${artist.packages.length}개`} />
        <InfoMetric label="보정본" value={`${artist.deliveryDays}일 내`} />
        <InfoMetric label="예약" value={`${artist.reservationLeadDays}일 전`} />
      </section>

      <PortfolioGallery
        imageUrls={artist.portfolioImageUrls ?? []}
        altPrefix={artist.studioName}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">촬영 상품</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          촬영 시간, 의상 수, 사진 제공 방식과 추가 옵션은 상품마다 달라요.
          마음에 드는 상품을 먼저 고른 뒤 스드메를 조합해보세요.
        </p>
        <div className="flex flex-col gap-3">
          {artist.packages.map((snapPackage) => (
            <SnapPackageCard
              key={snapPackage.id}
              artist={artist}
              snapPackage={snapPackage}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">이 작가와 연계된 스드메 샵</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          제휴 작가로 진행하면 샵별 패키지와 일부 단품에 제휴가가 적용돼요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {linkedStylingShops.map((shop) => (
            <Link
              key={shop.id}
              href={`/styling/${shop.id}?artist=${artist.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-xs font-medium text-primary">제휴 스드메 샵</p>
                <p className="truncate text-sm font-semibold">{shop.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {shop.keywords.join(" · ")}
                </p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-primary">
                패키지 {shop.products.filter((product) => product.kind === "package").length}개
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

interface SnapPackageCardProps {
  artist: SnapArtist;
  snapPackage: SnapPackage;
}

function SnapPackageCard({ artist, snapPackage }: SnapPackageCardProps) {
  const stylingHref = `/artists?tab=styling&artist=${artist.id}&package=${snapPackage.id}`;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">{snapPackage.name}</p>
          <p className="text-lg font-semibold">{snapPackage.description}</p>
        </div>
        <p className="shrink-0 text-base font-semibold text-primary">
          {formatPriceFrom(snapPackage.price)}
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border rounded-xl bg-muted/50">
        <PackageMetric label="촬영" value={`${snapPackage.durationHours}시간`} />
        <PackageMetric
          label="의상"
          value={`${snapPackage.outfitCountMinimum}~${snapPackage.outfitCountMaximum}벌`}
        />
        <PackageMetric label="촬영 씬" value={`${snapPackage.sceneCount}개`} />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
        <p>색감 보정본 {snapPackage.colorCorrectedCount}장</p>
        <p>기본 인물 보정 {snapPackage.basicRetouchedCount}장</p>
        <p>선택 인물 보정 {snapPackage.selectedRetouchedCount}장</p>
        <p>총 보정 {snapPackage.basicRetouchedCount + snapPackage.selectedRetouchedCount}장</p>
      </div>

      <ul className="flex flex-col gap-2">
        {snapPackage.includedServices.map((service) => (
          <li
            key={service}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="size-4 shrink-0 text-primary" />
            {service}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {snapPackage.recommendedFor.map((item) => (
          <span
            key={item}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
          >
            {item}
          </span>
        ))}
      </div>

      <details className="group rounded-xl border border-border bg-muted/50">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-semibold text-secondary-foreground">
          선택 옵션 {snapPackage.addOns.length}개 보기
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-3 border-t border-border p-3">
          {snapPackage.addOns.map((addOn) => (
            <div key={addOn.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{addOn.name}</p>
                <p className="shrink-0 text-sm font-semibold text-primary">
                  +{formatPrice(addOn.price)}
                </p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {addOn.description}
              </p>
              {addOn.notice ? (
                <p className="rounded-lg bg-card px-2.5 py-2 text-xs leading-5 text-muted-foreground">
                  {addOn.notice}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </details>

      <Link
        href={stylingHref}
        className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
      >
        이 상품으로 촬영팀 만들기
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

interface PackageMetricProps {
  label: string;
  value: string;
}

function PackageMetric({ label, value }: PackageMetricProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

interface InfoMetricProps {
  label: string;
  value: string;
}

function InfoMetric({ label, value }: InfoMetricProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
