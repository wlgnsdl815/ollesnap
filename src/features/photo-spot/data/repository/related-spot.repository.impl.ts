import { getServerEnv } from "@/shared/env/server-env";

import { JEJU_AREA_CD, JEJU_SIGNGU_CODES } from "../../domain/jeju-region";
import type { RelatedSpot } from "../../domain/entity/related-spot.entity";
import type { RelatedSpotRepository } from "../../domain/repository/related-spot.repository";
import { fetchRelatedAttractionList } from "../datasource/related-attraction-datasource";
import { toRelatedSpot } from "../mapper/related-spot.mapper";

export function createRelatedSpotRepository(): RelatedSpotRepository {
  return {
    async getRelatedSpots(placeName) {
      const { tourApiRelatedAttractionServiceKey } = getServerEnv();
      const keyword = placeName.trim();

      if (!tourApiRelatedAttractionServiceKey || !keyword) {
        return [];
      }

      try {
        // 데이터가 매월 8일에 갱신되어 월초에는 당월 데이터가 없을 수 있어
        // 당월 조회 결과가 비면 전월로 한 번 더 조회한다.
        for (const baseYm of recentBaseMonths()) {
          const spots = await fetchForAllSigngu(
            tourApiRelatedAttractionServiceKey,
            keyword,
            baseYm,
          );

          if (spots.length > 0) {
            return spots;
          }
        }

        return [];
      } catch {
        return [];
      }
    },
  };
}

async function fetchForAllSigngu(
  serviceKey: string,
  keyword: string,
  baseYm: string,
): Promise<RelatedSpot[]> {
  const lists = await Promise.all(
    JEJU_SIGNGU_CODES.map((signguCd) =>
      fetchRelatedAttractionList({
        serviceKey,
        areaCd: JEJU_AREA_CD,
        signguCd,
        keyword,
        baseYm,
      }),
    ),
  );

  const spotById = new Map<string, RelatedSpot>();

  for (const item of lists.flat()) {
    const spot = toRelatedSpot(item);

    if (spot && !spotById.has(spot.id)) {
      spotById.set(spot.id, spot);
    }
  }

  return [...spotById.values()].sort((a, b) => a.rank - b.rank);
}

function recentBaseMonths(): string[] {
  const now = new Date();
  const currentMonth = formatYearMonth(now);
  now.setMonth(now.getMonth() - 1);
  const previousMonth = formatYearMonth(now);

  return [currentMonth, previousMonth];
}

function formatYearMonth(date: Date): string {
  return `${date.getFullYear()}${`${date.getMonth() + 1}`.padStart(2, "0")}`;
}
