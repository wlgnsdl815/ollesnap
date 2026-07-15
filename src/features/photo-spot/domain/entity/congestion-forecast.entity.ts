export type CongestionLevel = "low" | "medium" | "high";

export interface CongestionForecastDay {
  date: string;
  rate: number;
  level: CongestionLevel;
}

export interface SpotCongestionForecast {
  matchedName: string;
  days: CongestionForecastDay[];
}

export interface TourismCongestionEntry {
  date: string;
  placeName: string;
  rate: number;
}
