import Image from "next/image";
import Link from "next/link";

import type { SnapArtist } from "../../domain/entity/wedding-catalog.entity";
import { formatPriceFrom } from "../../domain/usecase/wedding-catalog.usecase";
import {
  SCENE_IMAGES,
  TONE_PHOTO_FILTERS,
} from "../lib/scene-tone-visuals";

interface ArtistListCardProps {
  artist: SnapArtist;
  sceneLabel: string;
  toneLabel: string;
}

export function ArtistListCard({
  artist,
  sceneLabel,
  toneLabel,
}: ArtistListCardProps) {
  const primaryScene = artist.scenes[0];
  const primaryTone = artist.tones[0];

  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors active:bg-muted"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={SCENE_IMAGES[primaryScene]}
          alt={`${artist.studioName}의 대표 씬 — ${sceneLabel}, ${toneLabel} 톤`}
          fill
          sizes="(min-width: 640px) 320px, 85vw"
          className="object-cover"
          style={{ filter: TONE_PHOTO_FILTERS[primaryTone] }}
        />
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {sceneLabel} · {toneLabel}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 p-4">
        <p className="text-base font-semibold">{artist.studioName}</p>
        <p className="text-xs text-muted-foreground">
          {artist.artistName} 작가 · {artist.durationHours}시간 촬영
        </p>
        <p className="pt-1.5 text-sm font-semibold">
          {formatPriceFrom(artist.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
