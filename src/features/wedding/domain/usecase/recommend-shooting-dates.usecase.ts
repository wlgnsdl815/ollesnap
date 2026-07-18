import type { SavedTravelPlanItem } from "@/features/account/domain/entity/user-wedding.entity";
import type {
  CongestionLevel,
  TourismCongestionEntry,
} from "@/features/photo-spot/domain/entity/congestion-forecast.entity";
import { extractPlaceName } from "@/features/photo-spot/domain/extract-place-name";
import {
  findSpotCongestionForecast,
  toCongestionLevel,
} from "@/features/photo-spot/domain/usecase/congestion.usecase";

export interface ShootingDateCandidate {
  date: string;
  averageRate: number;
  level: CongestionLevel;
  isRecommended: boolean;
}

export type ShootingDateBasis = "saved-spots" | "jeju-overall";

export interface ShootingDateRecommendation {
  basis: ShootingDateBasis;
  basisSpotNames: string[];
  candidates: ShootingDateCandidate[];
  /** 체류 기간 중 예측 데이터가 없어 제외된 날 수 */
  uncoveredDayCount: number;
}

interface RecommendShootingDatesInput {
  stayStartDate: string;
  stayEndDate: string;
  travelPlanItems: SavedTravelPlanItem[];
  congestionPool: TourismCongestionEntry[];
}

// 집중률 예측이 향후 30일까지만 제공되므로 체류일 나열도 같은 폭으로 제한한다.
const STAY_DAY_MAXIMUM = 31;

export function recommendShootingDates({
  stayStartDate,
  stayEndDate,
  travelPlanItems,
  congestionPool,
}: RecommendShootingDatesInput): ShootingDateRecommendation | null {
  const stayDates = enumerateDates(stayStartDate, stayEndDate);

  if (stayDates.length === 0 || congestionPool.length === 0) {
    return null;
  }

  const savedSpotForecasts = collectSavedSpotForecasts(
    travelPlanItems,
    congestionPool,
  );
  const basis: ShootingDateBasis =
    savedSpotForecasts.size > 0 ? "saved-spots" : "jeju-overall";
  const ratesByDate =
    basis === "saved-spots"
      ? collectRatesByDate(
          congestionPool.filter((entry) =>
            savedSpotForecasts.has(entry.placeName),
          ),
        )
      : collectRatesByDate(congestionPool);

  const candidates: ShootingDateCandidate[] = [];
  let uncoveredDayCount = 0;

  for (const date of stayDates) {
    const rates = ratesByDate.get(date);

    if (!rates || rates.length === 0) {
      uncoveredDayCount += 1;
      continue;
    }

    const averageRate =
      rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

    candidates.push({
      date,
      averageRate,
      level: toCongestionLevel(averageRate),
      isRecommended: false,
    });
  }

  if (candidates.length === 0) {
    return { basis, basisSpotNames: [], candidates, uncoveredDayCount };
  }

  const recommended = candidates.reduce((best, candidate) =>
    candidate.averageRate < best.averageRate ? candidate : best,
  );
  recommended.isRecommended = true;

  return {
    basis,
    basisSpotNames: [...savedSpotForecasts],
    candidates,
    uncoveredDayCount,
  };
}

function collectSavedSpotForecasts(
  travelPlanItems: SavedTravelPlanItem[],
  congestionPool: TourismCongestionEntry[],
): Set<string> {
  const matchedNames = new Set<string>();

  for (const item of travelPlanItems) {
    if (item.kind !== "sight") {
      continue;
    }

    const placeName = extractPlaceName(item.location ?? item.title);
    const forecast = findSpotCongestionForecast(congestionPool, placeName);

    if (forecast) {
      matchedNames.add(forecast.matchedName);
    }
  }

  return matchedNames;
}

function collectRatesByDate(
  entries: TourismCongestionEntry[],
): Map<string, number[]> {
  const ratesByDate = new Map<string, number[]>();

  for (const entry of entries) {
    const rates = ratesByDate.get(entry.date);

    if (rates) {
      rates.push(entry.rate);
    } else {
      ratesByDate.set(entry.date, [entry.rate]);
    }
  }

  return ratesByDate;
}

function enumerateDates(startDate: string, endDate: string): string[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }

  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end && dates.length < STAY_DAY_MAXIMUM) {
    dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}
