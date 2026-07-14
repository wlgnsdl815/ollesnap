import {
  ArrowRight,
  CalendarClock,
  ChevronLeft,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import type {
  SnapArtist,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import {
  formatPriceFrom,
  getCompatiblePartners,
  getSceneLabel,
  getToneLabel,
} from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";
import { FavoriteArtistButton } from "@/features/account/presentation/components/favorite-artist-button";

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
  const compatibleDresses = getCompatiblePartners(catalog, artist, "dress");
  const compatibleMakeup = getCompatiblePartners(catalog, artist, "makeup");

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <Link
          href="/artists"
          className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
        >
          <ChevronLeft className="size-5" />
          작가 목록
        </Link>
        <section className="rounded-3xl bg-foreground p-6 text-primary-foreground">
          <div className="flex flex-col gap-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ImageIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-white/70">제주 웨딩 스냅</p>
              <h1 className="text-3xl font-semibold leading-tight text-balance">
                {artist.studioName}
              </h1>
              <p className="text-sm leading-6 text-white/80">
                {artist.artistName} 작가 · {artist.introduction}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {artist.scenes.map((scene) => (
                <span
                  key={scene}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium"
                >
                  {getSceneLabel(catalog, scene)}
                </span>
              ))}
              {artist.tones.map((tone) => (
                <span
                  key={tone}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium"
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
      </header>

      <section className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card">
        <InfoMetric label="촬영" value={`${artist.durationHours}시간`} />
        <InfoMetric label="보정본" value={`${artist.deliveryDays}일 내`} />
        <InfoMetric label="예약" value={`${artist.reservationLeadDays}일 전`} />
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-primary">대표 패키지</p>
            <h2 className="text-xl font-semibold">{artist.packageSummary}</h2>
          </div>
          <p className="shrink-0 text-base font-semibold text-primary">
            {formatPriceFrom(artist.priceFrom)}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          포즈를 정답처럼 요구하기보다, 선택한 씬 안에서 두 사람의 자연스러운
          흐름을 따라 촬영하는 구성이에요.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">이 작가와 잘 맞는 스드메</h2>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          목 데이터 기준으로 사진 톤과 준비 동선이 잘 맞는 후보예요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[...compatibleDresses, ...compatibleMakeup].map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-xs font-medium text-primary">
                  {partner.kind === "dress" ? "드레스" : "메이크업"}
                </p>
                <p className="truncate text-sm font-semibold">{partner.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {partner.keywords.join(" · ")}
                </p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-primary">
                {formatPriceFrom(partner.priceFrom)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-accent p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <CalendarClock className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">이 작가로 촬영팀 만들기</p>
            <p className="text-sm leading-6 text-muted-foreground">
              드레스와 메이크업 후보를 고르고, 촬영 브리프로 한 번에 확인해요.
            </p>
          </div>
        </div>
        <Link
          href={`/styling?artist=${artist.id}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
        >
          스드메 조합 보기
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <CatalogDemoNotice />
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
