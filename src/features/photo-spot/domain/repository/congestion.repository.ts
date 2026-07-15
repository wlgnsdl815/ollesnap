import type { TourismCongestionEntry } from "../entity/congestion-forecast.entity";

export interface CongestionRepository {
  getForecastPool(): Promise<TourismCongestionEntry[]>;
}
