import { MapPin } from "lucide-react";

import type { CourseSuggestionGroup } from "../../domain/usecase/related-spots.usecase";
import { buildMapSearchLink, formatSpotName } from "../lib/spot-map-link";

interface CourseSuggestionsProps {
  groups: CourseSuggestionGroup[];
}

export function CourseSuggestions({ groups }: CourseSuggestionsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">함께 가면 좋은 곳</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          일정에 담은 장소에서 이어 가기 좋은 곳들이에요. 눌러서 지도로 확인해
          보세요.
        </p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
        {groups.map((group) => (
          <div key={group.baseTitle} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {group.baseTitle} 근처
            </p>
            <div className="flex flex-wrap gap-2">
              {group.spots.map((spot) => (
                <a
                  key={spot.id}
                  href={buildMapSearchLink(spot.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-semibold active:bg-muted"
                >
                  {formatSpotName(spot.name)}
                  <MapPin className="size-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        ))}
        <p className="border-t border-border pt-3 text-xs text-muted-foreground">
          관광지별 연관 관광지 공공데이터 기준
        </p>
      </div>
    </section>
  );
}
