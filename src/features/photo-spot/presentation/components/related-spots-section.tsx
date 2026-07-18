import { MapPin } from "lucide-react";

import type { RelatedSpot } from "../../domain/entity/related-spot.entity";
import {
  groupRelatedSpots,
  hasAnyRelatedSpot,
} from "../../domain/usecase/related-spots.usecase";
import { buildMapSearchLink, formatSpotName } from "../lib/spot-map-link";

interface RelatedSpotsSectionProps {
  baseSpotTitle: string;
  relatedSpots: RelatedSpot[];
}

export function RelatedSpotsSection({
  baseSpotTitle,
  relatedSpots,
}: RelatedSpotsSectionProps) {
  const groups = groupRelatedSpots(relatedSpots);

  if (!hasAnyRelatedSpot(groups)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">함께 들르기 좋은 곳</p>
        <p className="text-xs text-muted-foreground">
          {baseSpotTitle}에 다녀간 사람들이 함께 많이 찾은 곳이에요.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <RelatedSpotGroup label="볼거리" spots={groups.attractions} />
        <RelatedSpotGroup label="맛집 · 카페" spots={groups.foods} />
        <RelatedSpotGroup label="숙소" spots={groups.stays} />
      </div>

      <p className="border-t border-border pt-3 text-xs text-muted-foreground">
        관광지별 연관 관광지 공공데이터 기준
      </p>
    </div>
  );
}

interface RelatedSpotGroupProps {
  label: string;
  spots: RelatedSpot[];
}

function RelatedSpotGroup({ label, spots }: RelatedSpotGroupProps) {
  if (spots.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-col">
        {spots.map((spot) => (
          <a
            key={spot.id}
            href={buildMapSearchLink(spot.name)}
            target="_blank"
            rel="noreferrer"
            className="-mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 active:bg-muted"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {formatSpotName(spot.name)}
              </span>
              {spot.categoryDetail ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {spot.categoryDetail}
                  {spot.sigunguName ? ` · ${spot.sigunguName}` : ""}
                </span>
              ) : null}
            </span>
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
