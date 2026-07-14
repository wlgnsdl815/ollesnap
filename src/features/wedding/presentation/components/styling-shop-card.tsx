import { ArrowUpRight, Handshake, PackageCheck } from "lucide-react";
import Link from "next/link";

import type {
  SnapArtist,
  StylingShop,
} from "../../domain/entity/wedding-catalog.entity";
import {
  formatPriceFrom,
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

  if (artist) {
    searchParams.set("artist", artist.id);
  }

  if (selectedPackageId) {
    searchParams.set("package", selectedPackageId);
  }

  const href = searchParams.size
    ? `/styling/${shop.id}?${searchParams.toString()}`
    : `/styling/${shop.id}`;

  return (
    <Link
      href={href}
      className="flex min-h-48 flex-col justify-between rounded-2xl border border-border bg-card p-4 active:bg-muted"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isPartner ? <Handshake className="size-5" /> : <PackageCheck className="size-5" />}
        </span>
        <ArrowUpRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          {isPartner ? (
            <p className="mb-1 text-xs font-semibold text-primary">제휴 작가 혜택</p>
          ) : null}
          <p className="text-base font-semibold">{shop.name}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {shop.introduction}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            패키지 {packageProducts.length}개
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            단품 {singleProducts.length}개
          </span>
        </div>
        <p className="text-sm font-semibold text-primary">
          단품 {formatPriceFrom(singleProducts[0]?.regularPrice.total ?? 0)}
        </p>
      </div>
    </Link>
  );
}
