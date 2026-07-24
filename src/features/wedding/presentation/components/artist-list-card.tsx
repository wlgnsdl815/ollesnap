import Image from "next/image";
import Link from "next/link";

import type {
  SnapArtist,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import { formatPriceFrom } from "../../domain/usecase/wedding-catalog.usecase";
import { TONE_PHOTO_FILTERS } from "../lib/scene-tone-visuals";

interface ArtistListCardProps {
  artist: SnapArtist;
  tone: WeddingTone;
  sceneLabel: string;
  toneLabel: string;
}

export function ArtistListCard({
  artist,
  tone,
  sceneLabel,
  toneLabel,
}: ArtistListCardProps) {
  const portfolioImageUrl = artist.portfolioImageUrls?.[0];

  if (!portfolioImageUrl) {
    return (
      <Link
        href={`/artists/${artist.id}`}
        className="flex flex-col gap-3 self-start overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors active:bg-muted"
      >
        <div className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-full">
            <Image
              src={artist.profileImageUrl}
              alt={`${artist.artistName} 작가`}
              fill
              sizes="48px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {artist.studioName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {sceneLabel} · {toneLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="truncate text-xs text-muted-foreground">
            {artist.artistName} 작가 · {artist.durationHours}시간
          </p>
          <p className="text-sm font-semibold">
            {formatPriceFrom(artist.priceFrom)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex flex-col self-start overflow-hidden rounded-2xl border border-border bg-card transition-colors active:bg-muted"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        <Image
          src={portfolioImageUrl}
          alt={`${artist.studioName}의 대표 씬 — ${sceneLabel}, ${toneLabel} 톤`}
          fill
          sizes="(min-width: 640px) 240px, 45vw"
          className="object-cover"
          style={{ filter: TONE_PHOTO_FILTERS[tone] }}
        />
        <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {sceneLabel} · {toneLabel}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-center gap-2">
          <span className="relative size-7 shrink-0 overflow-hidden rounded-full">
            <Image
              src={artist.profileImageUrl}
              alt={`${artist.artistName} 작가`}
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold">
            {artist.studioName}
          </p>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {artist.artistName} 작가 · {artist.durationHours}시간
        </p>
        <p className="text-sm font-semibold">
          {formatPriceFrom(artist.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
