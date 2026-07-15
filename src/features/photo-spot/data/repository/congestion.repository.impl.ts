import type { CongestionRepository } from "../../domain/repository/congestion.repository";
import { JEJU_AREA_CD, JEJU_SIGNGU_CODES } from "../../domain/jeju-region";
import { getServerEnv } from "@/shared/env/server-env";

import { fetchTourismCrowdList } from "../datasource/tourism-crowd-datasource";
import { toTourismCongestionEntry } from "../mapper/tourism-crowd.mapper";

export function createCongestionRepository(): CongestionRepository {
  return {
    async getForecastPool() {
      const { tourApiTourismCrowdServiceKey } = getServerEnv();

      if (!tourApiTourismCrowdServiceKey) {
        return [];
      }

      try {
        const lists = await Promise.all(
          JEJU_SIGNGU_CODES.map((signguCd) =>
            fetchTourismCrowdList({
              serviceKey: tourApiTourismCrowdServiceKey,
              areaCd: JEJU_AREA_CD,
              signguCd,
            }),
          ),
        );

        return lists.flat().map(toTourismCongestionEntry);
      } catch {
        return [];
      }
    },
  };
}
