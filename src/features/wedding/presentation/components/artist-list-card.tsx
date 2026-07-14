import { ArrowUpRight, Camera } from "lucide-react";
import Link from "next/link";

import type { SnapArtist } from "../../domain/entity/wedding-catalog.entity";

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
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="flex min-h-44 flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-colors active:bg-muted"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </span>
        <ArrowUpRight className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold">{artist.studioName}</p>
          <p className="text-xs text-muted-foreground">
            {artist.artistName} 작가 · {artist.durationHours}시간 촬영
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {sceneLabel}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {toneLabel}
          </span>
        </div>
        <p className="text-sm font-semibold text-primary">
          {artist.priceFrom / 10_000}만원부터
        </p>
      </div>
    </Link>
  );
}
