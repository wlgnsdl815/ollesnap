import type {
  CongestionForecastDay,
  CongestionLevel,
  SpotCongestionForecast,
  TourismCongestionEntry,
} from "../entity/congestion-forecast.entity";

export function findSpotCongestionForecast(
  pool: TourismCongestionEntry[],
  placeName: string,
): SpotCongestionForecast | null {
  const trimmedName = placeName.trim();

  if (!trimmedName) {
    return null;
  }

  const matchedName = pool.find(
    (entry) =>
      entry.placeName.includes(trimmedName) ||
      trimmedName.includes(entry.placeName),
  )?.placeName;

  if (!matchedName) {
    return null;
  }

  const days = pool
    .filter((entry) => entry.placeName === matchedName)
    .map(
      (entry): CongestionForecastDay => ({
        date: entry.date,
        rate: entry.rate,
        level: toCongestionLevel(entry.rate),
      }),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  return { matchedName, days };
}

export function pickForecastDay(
  forecast: SpotCongestionForecast,
  date: string,
): CongestionForecastDay | undefined {
  return forecast.days.find((day) => day.date === date);
}

export function getCongestionLevelLabel(level: CongestionLevel): string {
  switch (level) {
    case "low":
      return "여유";
    case "medium":
      return "보통";
    case "high":
      return "붐빔";
  }
}

// 한국관광공사 API는 집중률(%) 수치만 제공하고 등급 기준을 정의하지 않아
// 데모 표시용으로 임의 구간을 나눈 값입니다.
function toCongestionLevel(rate: number): CongestionLevel {
  if (rate >= 70) {
    return "high";
  }

  if (rate >= 40) {
    return "medium";
  }

  return "low";
}
