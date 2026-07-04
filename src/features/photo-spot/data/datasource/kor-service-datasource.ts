import { fetchJson } from "@/shared/http/fetch-json";
import {
  extractOpenApiXmlErrorMessage,
  normalizeServiceKey,
} from "@/shared/http/open-api";

import type {
  KorServiceCommonDetail,
  KorServiceKeywordItem,
  KorServiceListResponse,
} from "../dto/kor-service.dto";

const KOR_SERVICE_BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

interface KorServiceFetchOptions {
  serviceKey: string;
  revalidateSeconds?: number;
}

export async function searchKeyword2({
  serviceKey,
  keyword,
  lDongRegnCd,
  numOfRows = 5,
  revalidateSeconds = 21600,
}: KorServiceFetchOptions & {
  keyword: string;
  lDongRegnCd?: string;
  numOfRows?: number;
}): Promise<KorServiceKeywordItem[]> {
  const query = new URLSearchParams({
    numOfRows: String(numOfRows),
    pageNo: "1",
    MobileOS: "WEB",
    MobileApp: "ollesnap",
    _type: "json",
    arrange: "A",
    keyword,
  });

  if (lDongRegnCd) {
    query.set("lDongRegnCd", lDongRegnCd);
  }

  const url = `${KOR_SERVICE_BASE_URL}/searchKeyword2?serviceKey=${normalizeServiceKey(serviceKey)}&${query.toString()}`;

  const data = await fetchJson<KorServiceListResponse<KorServiceKeywordItem>>(
    url,
    {
      errorMessage: "관광정보 키워드 검색에 실패했습니다.",
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

export async function fetchDetailCommon2({
  serviceKey,
  contentId,
  revalidateSeconds = 21600,
}: KorServiceFetchOptions & {
  contentId: string;
}): Promise<KorServiceCommonDetail | null> {
  const query = new URLSearchParams({
    numOfRows: "1",
    pageNo: "1",
    MobileOS: "WEB",
    MobileApp: "ollesnap",
    _type: "json",
    contentId,
  });

  const url = `${KOR_SERVICE_BASE_URL}/detailCommon2?serviceKey=${normalizeServiceKey(serviceKey)}&${query.toString()}`;

  const data = await fetchJson<KorServiceListResponse<KorServiceCommonDetail>>(
    url,
    {
      errorMessage: "관광지 상세 정보를 불러오지 못했습니다.",
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

  if (!item) {
    return null;
  }

  return Array.isArray(item) ? (item[0] ?? null) : item;
}
