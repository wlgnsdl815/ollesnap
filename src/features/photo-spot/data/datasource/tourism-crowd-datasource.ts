import { fetchJson } from "@/shared/http/fetch-json";
import {
  extractOpenApiXmlErrorMessage,
  normalizeServiceKey,
} from "@/shared/http/open-api";

import type { TourismCrowdApiItem } from "../dto/tourism-crowd.dto";
import type { KorServiceListResponse } from "../dto/kor-service.dto";

const TOURISM_CROWD_LIST_URL =
  "https://apis.data.go.kr/B551011/TatsCnctrRateService/tatsCnctrRatedList";

export interface FetchTourismCrowdListParams {
  serviceKey: string;
  areaCd: string;
  signguCd: string;
  numOfRows?: number;
  pageNo?: number;
  revalidateSeconds?: number;
}

export async function fetchTourismCrowdList({
  serviceKey,
  areaCd,
  signguCd,
  numOfRows = 1000,
  pageNo = 1,
  revalidateSeconds = 3600,
}: FetchTourismCrowdListParams): Promise<TourismCrowdApiItem[]> {
  const query = new URLSearchParams({
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    MobileOS: "WEB",
    MobileApp: "ollesnap",
    _type: "json",
    areaCd,
    signguCd,
  });

  const url = `${TOURISM_CROWD_LIST_URL}?serviceKey=${normalizeServiceKey(serviceKey)}&${query.toString()}`;

  const data = await fetchJson<KorServiceListResponse<TourismCrowdApiItem>>(
    url,
    {
      errorMessage: "관광지 집중률 정보를 불러오지 못했습니다.",
      init: { next: { revalidate: revalidateSeconds } },
      validateResponseText: (responseText) => {
        const errorMessage = extractOpenApiXmlErrorMessage(responseText);
        if (errorMessage) {
          throw new Error(errorMessage);
        }
      },
    },
  );

  const item = data.response.body?.items?.item;

  return item ? (Array.isArray(item) ? item : [item]) : [];
}
