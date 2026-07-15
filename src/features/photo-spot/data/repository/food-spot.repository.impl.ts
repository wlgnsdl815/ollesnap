import type { FoodSpotPage } from "../../domain/entity/food-spot.entity";
import { JEJU_LDONG_REGN_CD } from "../../domain/jeju-region";
import type { FoodSpotRepository } from "../../domain/repository/food-spot.repository";
import { getServerEnv } from "@/shared/env/server-env";

import {
  areaBasedList2,
  fetchDetailCommon2,
} from "../datasource/kor-service-datasource";
import {
  isDisplayableAreaBasedItem,
  toFoodSpot,
  toFoodSpotFromDetail,
} from "../mapper/food-spot.mapper";

// 관광타입 ID 39 = 음식점 (카페 포함)
const RESTAURANT_CONTENT_TYPE_ID = "39";

// areaBasedList2의 lDongSignguCd(시군구) 필터는 2025-05 개편으로 새로 생긴
// 필드라 기존 음식점 데이터 대부분에 값이 채워져 있지 않아 실질적으로
// 매칭되지 않는다. 대신 항상 채워지는 주소(addr1) 텍스트로 시/군을 직접
// 구분하기 위해 지역 필터가 있을 때는 더 큰 묶음을 받아 직접 걸러낸다.
const CITY_FILTER_LOOKUP_ROWS = 200;

export function createFoodSpotRepository(): FoodSpotRepository {
  return {
    async getPage(pageNo, pageSize, cityFilter): Promise<FoodSpotPage> {
      const { tourApiKorServiceKey } = getServerEnv();

      if (!tourApiKorServiceKey) {
        return { spots: [], totalCount: 0, hasMore: false };
      }

      try {
        if (!cityFilter) {
          const { items, totalCount } = await areaBasedList2({
            serviceKey: tourApiKorServiceKey,
            contentTypeId: RESTAURANT_CONTENT_TYPE_ID,
            lDongRegnCd: JEJU_LDONG_REGN_CD,
            numOfRows: pageSize,
            pageNo,
          });

          const spots = items
            .filter(isDisplayableAreaBasedItem)
            .map(toFoodSpot);

          return { spots, totalCount, hasMore: pageNo * pageSize < totalCount };
        }

        const cityLabel = cityFilter === "jeju-city" ? "제주시" : "서귀포시";
        const { items } = await areaBasedList2({
          serviceKey: tourApiKorServiceKey,
          contentTypeId: RESTAURANT_CONTENT_TYPE_ID,
          lDongRegnCd: JEJU_LDONG_REGN_CD,
          numOfRows: CITY_FILTER_LOOKUP_ROWS,
        });

        const filtered = items
          .filter(isDisplayableAreaBasedItem)
          .filter((item) => item.addr1?.includes(cityLabel))
          .map(toFoodSpot);

        const start = (pageNo - 1) * pageSize;
        const spots = filtered.slice(start, start + pageSize);

        return {
          spots,
          totalCount: filtered.length,
          hasMore: start + pageSize < filtered.length,
        };
      } catch (error) {
        console.error("[food-spot] areaBasedList2 조회 실패", error);
        return { spots: [], totalCount: 0, hasMore: false };
      }
    },

    async getById(id) {
      const { tourApiKorServiceKey } = getServerEnv();

      if (!tourApiKorServiceKey) {
        return null;
      }

      try {
        const detail = await fetchDetailCommon2({
          serviceKey: tourApiKorServiceKey,
          contentId: id,
        });

        return detail ? toFoodSpotFromDetail(detail) : null;
      } catch {
        return null;
      }
    },
  };
}
