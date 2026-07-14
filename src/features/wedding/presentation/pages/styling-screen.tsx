import { ArrowRight, ChevronLeft, Handshake, Sparkles } from "lucide-react";

import type {
  SnapArtist,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import { getStylingShopsForArtist } from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";
import { StylingShopCard } from "../components/styling-shop-card";

interface StylingScreenProps {
  artist?: SnapArtist;
  catalog: WeddingCatalog;
  onSelectArtists?: () => void;
  selectedPackageId?: string;
}

export function StylingScreen({
  artist,
  catalog,
  onSelectArtists,
  selectedPackageId,
}: StylingScreenProps) {
  const shops = artist
    ? getStylingShopsForArtist(catalog, artist)
    : catalog.stylingShops;

  return (
    <div className="flex flex-col gap-8 pb-4">
      <header className="flex flex-col gap-4">
        {artist ? (
          <button
            type="button"
            onClick={onSelectArtists}
            className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
          >
            <ChevronLeft className="size-5" />
            작가 고르기
          </button>
        ) : null}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">
            드레스 · 메이크업
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            {artist
              ? `${artist.studioName}과 연계된 스드메`
              : "제주 웨딩 스냅을 위한 스드메"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {artist
              ? "제휴 샵을 먼저 보여드려요. 각 샵의 단품·패키지·옵션과 제휴가를 비교해보세요."
              : "샵별 단품과 패키지를 먼저 둘러보세요. 작가를 고르면 제휴 혜택을 바로 확인할 수 있어요."}
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl bg-accent p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <Handshake className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">
              {artist
                ? "제휴가가 있는 샵부터 비교하세요"
                : "작가와 샵은 여러 곳이 연계될 수 있어요"}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {artist
                ? `${artist.artistName} 작가와 제휴된 샵은 일반가 대신 제휴가가 적용돼요.`
                : "작가를 고르면 해당 작가와 연결된 샵을 목록 상단에서 먼저 확인할 수 있어요."}
            </p>
          </div>
        </div>
        {!artist ? (
          <button
            type="button"
            onClick={onSelectArtists}
            className="flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-primary"
          >
            작가 먼저 고르기
            <ArrowRight className="size-4" />
          </button>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">스드메 샵</h2>
            <p className="text-sm text-muted-foreground">{shops.length}개 샵</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {shops.map((shop) => (
            <StylingShopCard
              key={shop.id}
              shop={shop}
              artist={artist}
              selectedPackageId={selectedPackageId}
            />
          ))}
        </div>
      </section>

      <CatalogDemoNotice />
    </div>
  );
}
