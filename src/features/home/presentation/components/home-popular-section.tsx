import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type {
  SnapArtist,
  StylingShop,
} from "@/features/wedding/domain/entity/wedding-catalog.entity";
import { formatPriceFrom } from "@/features/wedding/domain/usecase/wedding-catalog.usecase";

interface PopularArtistsSectionProps {
  artists: SnapArtist[];
  savedArtistIds: string[];
}

export function PopularArtistsSection({
  artists,
  savedArtistIds,
}: PopularArtistsSectionProps) {
  if (artists.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">인기 작가</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          지금 가장 많이 찜한 작가들이에요.
        </p>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {artists.map((artist) => {
          const isSaved = savedArtistIds.includes(artist.id);

          return (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className="flex w-36 shrink-0 flex-col gap-2"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted">
                {artist.portfolioImageUrls?.[0] ? (
                  <Image
                    src={artist.portfolioImageUrls[0]}
                    alt={`${artist.studioName} 대표 사진`}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <Heart
                    className={`size-3 ${isSaved ? "fill-primary text-primary" : "fill-white"}`}
                  />
                  {artist.savedCount}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="truncate text-sm font-semibold">
                  {artist.studioName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatPriceFrom(artist.priceFrom)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

interface PopularStylingShopsSectionProps {
  stylingShops: StylingShop[];
  savedStylingShopIds: string[];
}

export function PopularStylingShopsSection({
  stylingShops,
  savedStylingShopIds,
}: PopularStylingShopsSectionProps) {
  if (stylingShops.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">인기 스드메 샵</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          지금 가장 많이 찜한 스드메 샵이에요.
        </p>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {stylingShops.map((shop) => {
          const packageCount = shop.products.filter(
            (product) => product.kind === "package",
          ).length;
          const isSaved = savedStylingShopIds.includes(shop.id);

          return (
            <Link
              key={shop.id}
              href={`/styling/${shop.id}`}
              className="flex w-36 shrink-0 flex-col gap-2"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted">
                {shop.portfolioImageUrls?.[0] ? (
                  <Image
                    src={shop.portfolioImageUrls[0]}
                    alt={`${shop.name} 촬영 사진`}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <Heart
                    className={`size-3 ${isSaved ? "fill-primary text-primary" : "fill-white"}`}
                  />
                  {shop.savedCount}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="truncate text-sm font-semibold">{shop.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  패키지 {packageCount}개
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
