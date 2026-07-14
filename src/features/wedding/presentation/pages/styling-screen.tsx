import { ArrowRight, ChevronLeft, Shirt, Sparkles } from "lucide-react";
import Link from "next/link";

import type {
  SnapArtist,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import { getCompatiblePartners } from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";
import { StylingPartnerCard } from "../components/styling-partner-card";

interface StylingScreenProps {
  artist: SnapArtist;
  catalog: WeddingCatalog;
  selectedDressId?: string;
  selectedMakeupId?: string;
}

export function StylingScreen({
  artist,
  catalog,
  selectedDressId,
  selectedMakeupId,
}: StylingScreenProps) {
  const dresses = getCompatiblePartners(catalog, artist, "dress");
  const makeupArtists = getCompatiblePartners(catalog, artist, "makeup");

  return (
    <div className="flex flex-col gap-8 pb-4">
      <header className="flex flex-col gap-4">
        <Link
          href="/artists"
          className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
        >
          <ChevronLeft className="size-5" />
          작가 고르기
        </Link>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">드레스 · 메이크업</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            {artist.studioName}과 어울리는 스드메
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            작가의 사진 톤과 준비 시간을 기준으로 함께 보기 좋은 후보를
            묶었어요. 원하는 항목을 누르면 촬영팀 브리프에 반영됩니다.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl bg-accent p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-card text-primary">
            <Sparkles className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">선택한 스냅 작가</p>
            <p className="text-lg font-semibold">{artist.studioName}</p>
            <p className="text-xs text-muted-foreground">
              {artist.artistName} 작가 · {artist.keywords.join(" · ")}
            </p>
          </div>
        </div>
        <Link
          href={`/planner?artist=${artist.id}`}
          className="flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-primary"
        >
          스드메 없이 팀 브리프 먼저 보기
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Shirt className="size-5 text-primary" />
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold">드레스</h2>
            <p className="text-sm text-muted-foreground">
              야외 촬영을 고려한 피팅과 구성
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {dresses.map((partner) => (
            <StylingPartnerCard
              key={partner.id}
              artist={artist}
              partner={partner}
              selectedDressId={selectedDressId}
              selectedMakeupId={selectedMakeupId}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-semibold">메이크업</h2>
            <p className="text-sm text-muted-foreground">
              제주 햇살과 바람 속에서도 편안한 표현
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {makeupArtists.map((partner) => (
            <StylingPartnerCard
              key={partner.id}
              artist={artist}
              partner={partner}
              selectedDressId={selectedDressId}
              selectedMakeupId={selectedMakeupId}
            />
          ))}
        </div>
      </section>

      <CatalogDemoNotice />
    </div>
  );
}
