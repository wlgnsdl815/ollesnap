import Image from "next/image";
import Link from "next/link";

import type {
  SnapArtist,
  StylingShop,
} from "../../domain/entity/wedding-catalog.entity";
import {
  formatPriceFrom,
  getMaxPartnerDiscount,
  isPartnerStylingShop,
} from "../../domain/usecase/wedding-catalog.usecase";

interface StylingShopCardProps {
  shop: StylingShop;
  artist?: SnapArtist;
  selectedPackageId?: string;
}

export function StylingShopCard({
  shop,
  artist,
  selectedPackageId,
}: StylingShopCardProps) {
  const searchParams = new URLSearchParams();
  const packageProducts = shop.products.filter(
    (product) => product.kind === "package",
  );
  const singleProducts = shop.products.filter(
    (product) => product.kind === "single",
  );
  const isPartner = artist ? isPartnerStylingShop(shop, artist) : false;
  const maxPartnerDiscount = isPartner ? getMaxPartnerDiscount(shop) : 0;

  if (artist) {
    searchParams.set("artist", artist.id);
  }

  if (selectedPackageId) {
    searchParams.set("package", selectedPackageId);
  }

  const href = searchParams.size
    ? `/styling/${shop.id}?${searchParams.toString()}`
    : `/styling/${shop.id}`;
  const portfolioImageUrl = shop.portfolioImageUrls?.[0];

  return (
    <Link
      href={href}
      className="flex flex-col self-start overflow-hidden rounded-2xl border border-border bg-card transition-colors active:bg-muted"
    >
      {portfolioImageUrl ? (
        <div className="relative aspect-4/5 overflow-hidden">
          <Image
            src={portfolioImageUrl}
            alt={`${shop.name} 촬영 사진`}
            fill
            sizes="(min-width: 640px) 240px, 45vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5 p-3">
        {isPartner ? (
          <p className="truncate text-xs font-semibold text-primary">
            {maxPartnerDiscount > 0
              ? `${artist?.artistName} 작가 제휴`
              : "제휴 작가 혜택"}
          </p>
        ) : null}
        <p className="truncate text-sm font-semibold">{shop.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          패키지 {packageProducts.length}개 · 단품 {singleProducts.length}개
        </p>
        <p className="text-sm font-semibold text-primary">
          단품 {formatPriceFrom(singleProducts[0]?.regularPrice.total ?? 0)}
        </p>
      </div>
    </Link>
  );
}
