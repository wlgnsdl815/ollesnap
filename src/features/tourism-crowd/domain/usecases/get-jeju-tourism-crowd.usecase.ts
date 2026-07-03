import { fetchTourismCrowdForecastsByDistrict } from "@/features/tourism-crowd/data/datasources/tourism-crowd.datasource";
import type {
  TourismCrowdAttractionSummary,
  TourismCrowdFetchStatus,
  TourismCrowdForecast,
  TourismCrowdForecastResult,
} from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";
import { getServerEnv } from "@/shared/env/server-env";

export const JEJU_AREA_CODE = "50";

export const JEJU_DISTRICTS = [
  {
    code: "50110",
    name: "제주시",
  },
  {
    code: "50130",
    name: "서귀포시",
  },
] as const;

export async function getJejuTourismCrowdForecasts(): Promise<TourismCrowdForecastResult> {
  const { tourApiTourismCrowdServiceKey } = getServerEnv();

  if (!tourApiTourismCrowdServiceKey) {
    return {
      forecasts: [],
      status: "missing-service-key",
      message:
        "TOUR_API_TOURISM_CROWD_SERVICE_KEY and TOUR_API_SERVICE_KEY are empty.",
    };
  }

  const districtResults = await Promise.allSettled(
    JEJU_DISTRICTS.map((district) =>
      fetchTourismCrowdForecastsByDistrict({
        serviceKey: tourApiTourismCrowdServiceKey,
        areaCode: JEJU_AREA_CODE,
        districtCode: district.code,
      }),
    ),
  );

  const forecasts = districtResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (forecasts.length > 0) {
    return {
      forecasts,
      status: "ready",
    };
  }

  const failedResult = districtResults.find(
    (result) => result.status === "rejected",
  );

  return {
    forecasts: [],
    status: "api-error",
    message:
      failedResult?.status === "rejected"
        ? getErrorMessage(failedResult.reason)
        : "No tourism crowd forecast data was returned.",
  };
}

export function summarizeTourismCrowdForecasts(
  forecasts: TourismCrowdForecast[],
): TourismCrowdAttractionSummary[] {
  const groupedForecasts = forecasts.reduce(
    (groups, forecast) => {
      const key = `${normalizeAttractionName(forecast.attractionName)}-${forecast.districtCode}`;
      const group = groups.get(key) ?? [];

      groups.set(key, [...group, forecast]);

      return groups;
    },
    new Map<string, TourismCrowdForecast[]>(),
  );

  return Array.from(groupedForecasts.values())
    .map((group) => {
      const sortedGroup = [...group].sort((a, b) =>
        b.baseDate.localeCompare(a.baseDate),
      );
      const latestForecast = sortedGroup[0];
      const averageRate =
        group.reduce((sum, forecast) => sum + forecast.concentrationRate, 0) /
        group.length;

      return {
        attractionName: latestForecast.attractionName,
        areaName: latestForecast.areaName,
        districtName: latestForecast.districtName,
        averageRate: Math.round(averageRate),
        latestRate: Math.round(latestForecast.concentrationRate),
        latestBaseDate: latestForecast.baseDate,
        forecastDays: group.length,
      };
    })
    .sort((a, b) => a.averageRate - b.averageRate);
}

export function getTourismCrowdStatusLabel(
  status: TourismCrowdFetchStatus,
): string {
  if (status === "ready") {
    return "관광공사 예측값";
  }

  if (status === "missing-service-key") {
    return "서비스 키 대기";
  }

  return "기본 예측값";
}

export function formatBaseDate(baseDate: string): string {
  if (baseDate.length !== 8) {
    return baseDate;
  }

  return `${baseDate.slice(0, 4)}.${baseDate.slice(4, 6)}.${baseDate.slice(6)}`;
}

function normalizeAttractionName(name: string): string {
  return name.replace(/\s/g, "").toLowerCase();
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown tourism API error.";
}
