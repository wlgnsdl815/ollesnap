import { fetchJson } from "@/shared/http/fetch-json";
import {
  extractOpenApiXmlErrorMessage,
  normalizeServiceKey,
} from "@/shared/http/open-api";

import type {
  PhotoAwardApiItem,
  PhotoAwardApiResponse,
} from "../dto/photo-award.dto";

const PHOTO_AWARD_LIST_URL =
  "https://apis.data.go.kr/B551011/PhokoAwrdService/phokoAwrdList";

export interface FetchPhotoAwardListParams {
  serviceKey: string;
  lDongRegnCd: string;
  numOfRows?: number;
  pageNo?: number;
  arrange?: "A" | "C" | "D";
  revalidateSeconds?: number;
}

export interface PhotoAwardListResult {
  items: PhotoAwardApiItem[];
  totalCount: number;
}

export async function fetchPhotoAwardList({
  serviceKey,
  lDongRegnCd,
  numOfRows = 10,
  pageNo = 1,
  arrange = "C",
  revalidateSeconds = 3600,
}: FetchPhotoAwardListParams): Promise<PhotoAwardListResult> {
  const query = new URLSearchParams({
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    MobileOS: "WEB",
    MobileApp: "ollesnap",
    _type: "json",
    arrange,
    lDongRegnCd,
  });
  const url = `${PHOTO_AWARD_LIST_URL}?serviceKey=${normalizeServiceKey(serviceKey)}&${query.toString()}`;

  const data = await fetchJson<PhotoAwardApiResponse>(url, {
    errorMessage: "관광공모전 수상작 정보를 불러오지 못했습니다.",
    init: { next: { revalidate: revalidateSeconds } },
    validateResponseText: (responseText) => {
      const errorMessage = extractOpenApiXmlErrorMessage(responseText);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },
  });

  const item = data.response.body?.items?.item;
  const items = item ? (Array.isArray(item) ? item : [item]) : [];

  return { items, totalCount: data.response.body?.totalCount ?? 0 };
}
