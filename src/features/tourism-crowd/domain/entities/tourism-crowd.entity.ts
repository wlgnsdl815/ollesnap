export type TourismCrowdFetchStatus =
  | "ready"
  | "missing-service-key"
  | "api-error";

export interface TourismCrowdForecast {
  baseDate: string;
  areaCode: string;
  areaName: string;
  districtCode: string;
  districtName: string;
  attractionName: string;
  concentrationRate: number;
}

export interface TourismCrowdForecastResult {
  forecasts: TourismCrowdForecast[];
  status: TourismCrowdFetchStatus;
  message?: string;
}

export interface TourismCrowdAttractionSummary {
  attractionName: string;
  areaName: string;
  districtName: string;
  averageRate: number;
  latestRate: number;
  latestBaseDate: string;
  forecastDays: number;
}
