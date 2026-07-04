import type {
  PhotoSpotPage,
  PhotoSpotRepository,
} from "../../domain/repository/photo-spot.repository";
import { JEJU_LDONG_REGN_CD } from "../../domain/jeju-region";
import { getServerEnv } from "@/shared/env/server-env";

import { fetchPhotoAwardList } from "../datasource/photo-award-datasource";
import { isDisplayablePhotoAwardItem, toPhotoSpot } from "../mapper/photo-spot.mapper";

const MAX_LOOKUP_ROWS = 100;

export function createPhotoSpotRepository(): PhotoSpotRepository {
  return {
    async getPage(pageNo, pageSize): Promise<PhotoSpotPage> {
      const { tourApiPhotoAwardServiceKey } = getServerEnv();

      if (!tourApiPhotoAwardServiceKey) {
        return { spots: [], totalCount: 0, hasMore: false };
      }

      try {
        const { items, totalCount } = await fetchPhotoAwardList({
          serviceKey: tourApiPhotoAwardServiceKey,
          lDongRegnCd: JEJU_LDONG_REGN_CD,
          numOfRows: pageSize,
          pageNo,
        });

        const spots = items
          .filter(isDisplayablePhotoAwardItem)
          .map(toPhotoSpot);

        return { spots, totalCount, hasMore: pageNo * pageSize < totalCount };
      } catch {
        return { spots: [], totalCount: 0, hasMore: false };
      }
    },

    async getById(id) {
      const { tourApiPhotoAwardServiceKey } = getServerEnv();

      if (!tourApiPhotoAwardServiceKey) {
        return null;
      }

      try {
        const { items } = await fetchPhotoAwardList({
          serviceKey: tourApiPhotoAwardServiceKey,
          lDongRegnCd: JEJU_LDONG_REGN_CD,
          numOfRows: MAX_LOOKUP_ROWS,
        });

        const item = items
          .filter(isDisplayablePhotoAwardItem)
          .find((candidate) => candidate.contentId === id);

        return item ? toPhotoSpot(item) : null;
      } catch {
        return null;
      }
    },
  };
}
