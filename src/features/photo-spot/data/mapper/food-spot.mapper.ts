import type { FoodSpot } from "../../domain/entity/food-spot.entity";
import type {
  KorServiceAreaBasedItem,
  KorServiceCommonDetail,
} from "../dto/kor-service.dto";
import { stripHtml } from "./attraction.mapper";

export function isDisplayableAreaBasedItem(
  item: KorServiceAreaBasedItem,
): boolean {
  return Boolean(item.title && item.firstimage);
}

export function toFoodSpot(item: KorServiceAreaBasedItem): FoodSpot {
  return {
    id: item.contentid,
    title: item.title,
    address: joinAddress(item.addr1, item.addr2),
    imageUrl: item.firstimage || item.firstimage2 || "",
    tel: item.tel || undefined,
    mapx: item.mapx || undefined,
    mapy: item.mapy || undefined,
  };
}

export function toFoodSpotFromDetail(
  detail: KorServiceCommonDetail,
): FoodSpot | null {
  if (!detail.title) {
    return null;
  }

  return {
    id: detail.contentid,
    title: detail.title,
    address: joinAddress(detail.addr1, detail.addr2),
    imageUrl: detail.firstimage || detail.firstimage2 || "",
    tel: detail.tel || undefined,
    overview: stripHtml(detail.overview),
    mapx: detail.mapx || undefined,
    mapy: detail.mapy || undefined,
  };
}

function joinAddress(addr1?: string, addr2?: string): string {
  return [addr1, addr2].filter(Boolean).join(" ").trim();
}
