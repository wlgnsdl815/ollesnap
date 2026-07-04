import type { AttractionRepository } from "../../domain/repository/attraction.repository";
import { JEJU_LDONG_REGN_CD } from "../../domain/jeju-region";
import { getServerEnv } from "@/shared/env/server-env";

import {
  fetchDetailCommon2,
  searchKeyword2,
} from "../datasource/kor-service-datasource";
import { toAttraction } from "../mapper/attraction.mapper";

export function createAttractionRepository(): AttractionRepository {
  return {
    async findByPlaceName(placeName) {
      const { tourApiKorServiceKey } = getServerEnv();

      if (!tourApiKorServiceKey) {
        return null;
      }

      try {
        const candidates = await searchKeyword2({
          serviceKey: tourApiKorServiceKey,
          keyword: placeName,
          lDongRegnCd: JEJU_LDONG_REGN_CD,
        });

        const match = candidates.find(
          (candidate) =>
            candidate.title.includes(placeName) ||
            placeName.includes(candidate.title),
        );

        if (!match) {
          return null;
        }

        const detail = await fetchDetailCommon2({
          serviceKey: tourApiKorServiceKey,
          contentId: match.contentid,
        });

        return detail ? toAttraction(detail) : null;
      } catch {
        return null;
      }
    },
  };
}
