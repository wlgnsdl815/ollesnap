import { ArrowRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

import type {
  SnapArtist,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";
import {
  getStylingShopsForArtist,
  isPartnerStylingShop,
} from "../../domain/usecase/wedding-catalog.usecase";
import { StylingShopCard } from "../components/styling-shop-card";

type ShopView = "partner" | "all";

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
  const [shopView, setShopView] = useState<ShopView>("partner");
  const [isBrowsingAllShops, setIsBrowsingAllShops] = useState(false);
  const shops = artist
    ? getStylingShopsForArtist(catalog, artist)
    : catalog.stylingShops;
  const partnerShops = artist
    ? shops.filter((shop) => isPartnerStylingShop(shop, artist))
    : [];
  const hasPartnerTabs = Boolean(artist) && partnerShops.length > 0;
  const visibleShops =
    hasPartnerTabs && shopView === "partner" ? partnerShops : shops;
  const showNoArtistGate = !artist && !isBrowsingAllShops;

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
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            {artist
              ? `${artist.studioName}과 연계된 스드메`
              : "제주 웨딩 스냅을 위한 스드메"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {artist
              ? "제휴가가 적용되는 샵만 먼저 보여드려요. 다른 샵은 전체 샵 탭에서 볼 수 있어요."
              : "드레스·메이크업은 작가의 사진 톤과 묶어 고를 때 가장 잘 어울려요."}
          </p>
        </div>
      </header>

      {showNoArtistGate ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">
              스드메는 작가와 묶어 볼 때 가장 정확해요
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              작가를 먼저 고르면 그 작가와 제휴된 샵의 제휴가와 예상 총비용을
              바로 비교할 수 있어요.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onSelectArtists}
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
            >
              작가부터 고르기
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsBrowsingAllShops(true)}
              className="flex min-h-12 items-center justify-center rounded-md bg-secondary px-4 text-base font-semibold text-secondary-foreground active:bg-muted"
            >
              전체 샵 둘러보기
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="flex flex-col gap-3 rounded-2xl bg-accent p-5">
            <div className="flex items-start gap-3">
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
            <h2 className="text-xl font-semibold">스드메 샵</h2>
            {hasPartnerTabs ? (
              <div className="flex gap-2">
                <ShopViewChip
                  isActive={shopView === "partner"}
                  label="제휴 샵"
                  onClick={() => setShopView("partner")}
                />
                <ShopViewChip
                  isActive={shopView === "all"}
                  label="전체 샵"
                  onClick={() => setShopView("all")}
                />
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleShops.map((shop) => (
                <StylingShopCard
                  key={shop.id}
                  shop={shop}
                  artist={artist}
                  selectedPackageId={selectedPackageId}
                />
              ))}
            </div>
          </section>
        </>
      )}

    </div>
  );
}

interface ShopViewChipProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function ShopViewChip({ isActive, label, onClick }: ShopViewChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-secondary-foreground active:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
