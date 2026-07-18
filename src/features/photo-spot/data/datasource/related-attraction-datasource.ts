import { fetchJson } from "@/shared/http/fetch-json";
import {
  extractOpenApiXmlErrorMessage,
  normalizeServiceKey,
} from "@/shared/http/open-api";

import type { KorServiceListResponse } from "../dto/kor-service.dto";
import type { RelatedAttractionApiItem } from "../dto/related-attraction.dto";

const RELATED_ATTRACTION_SEARCH_URL =
  "https://apis.data.go.kr/B551011/TarRlteTarService1/searchKeyword1";

export interface FetchRelatedAttractionListParams {
  serviceKey: string;
  areaCd: string;
  signguCd: string;
  keyword: string;
  baseYm: string;
  numOfRows?: number;
  pageNo?: number;
  revalidateSeconds?: number;
}

export async function fetchRelatedAttractionList({
  serviceKey,
  areaCd,
  signguCd,
  keyword,
  baseYm,
  numOfRows = 100,
  pageNo = 1,
  revalidateSeconds = 3600,
}: FetchRelatedAttractionListParams): Promise<RelatedAttractionApiItem[]> {
  const query = new URLSearchParams({
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    MobileOS: "WEB",
    MobileApp: "ollesnap",
    _type: "json",
    baseYm,
    areaCd,
    signguCd,
    keyword,
  });

  const url = `${RELATED_ATTRACTION_SEARCH_URL}?serviceKey=${normalizeServiceKey(serviceKey)}&${query.toString()}`;

  const data = await fetchJson<
    KorServiceListResponse<RelatedAttractionApiItem>
  >(url, {
    errorMessage: "연관 관광지 정보를 불러오지 못했습니다.",
    init: { next: { revalidate: revalidateSeconds } },
    validateResponseText: (responseText) => {
      const errorMessage = extractOpenApiXmlErrorMessage(responseText);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },
  });

  const item = data.response.body?.items?.item;

  return item ? (Array.isArray(item) ? item : [item]) : [];
}
