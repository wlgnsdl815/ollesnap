import type {
  RelatedSpot,
  RelatedSpotCategory,
} from "../../domain/entity/related-spot.entity";
import type { RelatedAttractionApiItem } from "../dto/related-attraction.dto";

const CATEGORY_BY_LARGE_CLASS: Record<string, RelatedSpotCategory> = {
  관광지: "attraction",
  음식: "food",
  숙박: "stay",
};

export function toRelatedSpot(
  item: RelatedAttractionApiItem,
): RelatedSpot | null {
  const category = CATEGORY_BY_LARGE_CLASS[item.rlteCtgryLclsNm ?? ""];

  if (!category) {
    return null;
  }

  return {
    id: item.rlteTatsCd,
    name: item.rlteTatsNm,
    category,
    // 관광지 소분류는 "자연경관(하천/해양)"처럼 기술적이라 중분류를,
    // 음식/숙박은 소분류("카페/찻집", "호텔")가 더 구체적이라 그쪽을 쓴다.
    categoryDetail:
      (category === "attraction"
        ? item.rlteCtgryMclsNm
        : (item.rlteCtgrySclsNm ?? item.rlteCtgryMclsNm)) ?? null,
    sigunguName: item.rlteSignguNm ?? null,
    rank: Number(item.rlteRank) || 0,
  };
}
