import type { TourismCongestionEntry } from "../../domain/entity/congestion-forecast.entity";
import type { TourismCrowdApiItem } from "../dto/tourism-crowd.dto";

export function toTourismCongestionEntry(
  item: TourismCrowdApiItem,
): TourismCongestionEntry {
  return {
    date: formatBaseYmd(item.baseYmd),
    placeName: item.tAtsNm,
    rate: Number(item.cnctrRate),
  };
}

function formatBaseYmd(baseYmd: string): string {
  if (!/^\d{8}$/.test(baseYmd)) {
    return baseYmd;
  }

  return `${baseYmd.slice(0, 4)}-${baseYmd.slice(4, 6)}-${baseYmd.slice(6, 8)}`;
}
