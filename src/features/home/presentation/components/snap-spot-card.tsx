import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

interface SnapSpotCardProps {
  spot: PhotoSpot;
}

export function SnapSpotCard({ spot }: SnapSpotCardProps) {
  return (
    <Link
      href={`/spots/${spot.id}`}
      className="relative flex h-52 w-[18.75rem] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <Image
        src={spot.imageUrl}
        alt={spot.title}
        fill
        sizes="300px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-muted-foreground">
        <MapPin className="size-5" />
      </div>
      <div className="relative flex flex-col gap-2 p-4 text-white">
        {spot.keywords.length > 0 && (
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            {spot.keywords.map((keyword) => (
              <span
                key={keyword}
                className="shrink-0 truncate rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold backdrop-blur-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="truncate text-lg font-black">{spot.title}</p>
          <p className="truncate text-xs font-medium text-white/80">
            {spot.location}
          </p>
        </div>
      </div>
    </Link>
  );
}
