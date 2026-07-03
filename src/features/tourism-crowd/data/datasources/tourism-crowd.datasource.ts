import type {
  TourismCrowdApiItemDto,
  TourismCrowdApiResponseDto,
} from "@/features/tourism-crowd/data/dto/tourism-crowd-api.dto";
import type { TourismCrowdForecast } from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";
import { fetchJson } from "@/shared/http/fetch-json";

const TOURISM_CROWD_SERVICE_URL =
  "https://apis.data.go.kr/B551011/TatsCnctrRateService";
const TOURISM_CROWD_LIST_OPERATION = "tatsCnctrRatedList";
const MOBILE_OS = "WEB";
const MOBILE_APP = "OlleSnap";
const DEFAULT_ROWS = 1000;
const REVALIDATE_SECONDS = 60 * 60 * 6;

export interface FetchTourismCrowdForecastsParams {
  serviceKey: string;
  areaCode: string;
  districtCode: string;
}

export async function fetchTourismCrowdForecastsByDistrict({
  serviceKey,
  areaCode,
  districtCode,
}: FetchTourismCrowdForecastsParams): Promise<TourismCrowdForecast[]> {
  const apiResponse = await fetchJson<TourismCrowdApiResponseDto>(
    buildTourismCrowdListUrl({
      serviceKey,
      areaCode,
      districtCode,
    }),
    {
      init: {
        next: {
          revalidate: REVALIDATE_SECONDS,
        },
      },
      errorMessage: "Tourism API request failed",
      validateResponseText: (responseText) => {
        const xmlErrorMessage = extractOpenApiXmlErrorMessage(responseText);

        if (xmlErrorMessage) {
          throw new Error(xmlErrorMessage);
        }
      },
    },
  );
  const header = apiResponse.response?.header;
  const resultCode = String(header?.resultCode ?? "");

  if (resultCode !== "0000" && resultCode !== "00") {
    throw new Error(header?.resultMsg ?? "Tourism API returned an error.");
  }

  return getApiItems(apiResponse).flatMap((item) => {
    const forecast = toTourismCrowdForecast(item);

    return forecast ? [forecast] : [];
  });
}

function buildTourismCrowdListUrl({
  serviceKey,
  areaCode,
  districtCode,
}: FetchTourismCrowdForecastsParams): string {
  const searchParams = new URLSearchParams({
    numOfRows: String(DEFAULT_ROWS),
    pageNo: "1",
    MobileOS: MOBILE_OS,
    MobileApp: MOBILE_APP,
    areaCd: areaCode,
    signguCd: districtCode,
    _type: "json",
  });

  return `${TOURISM_CROWD_SERVICE_URL}/${TOURISM_CROWD_LIST_OPERATION}?serviceKey=${normalizeServiceKey(serviceKey)}&${searchParams.toString()}`;
}

function normalizeServiceKey(serviceKey: string): string {
  try {
    return decodeURIComponent(serviceKey) === serviceKey
      ? encodeURIComponent(serviceKey)
      : serviceKey;
  } catch {
    return encodeURIComponent(serviceKey);
  }
}

function getApiItems(
  apiResponse: TourismCrowdApiResponseDto,
): TourismCrowdApiItemDto[] {
  const items = apiResponse.response?.body?.items;

  if (!items || typeof items === "string" || !items.item) {
    return [];
  }

  return Array.isArray(items.item) ? items.item : [items.item];
}

function toTourismCrowdForecast(
  item: TourismCrowdApiItemDto,
): TourismCrowdForecast | null {
  const concentrationRate = Number(item.cnctrRate);

  if (!Number.isFinite(concentrationRate) || !item.tAtsNm) {
    return null;
  }

  return {
    baseDate: String(item.baseYmd ?? ""),
    areaCode: String(item.areaCd ?? ""),
    areaName: item.areaNm ?? "",
    districtCode: String(item.signguCd ?? ""),
    districtName: item.signguNm ?? "",
    attractionName: item.tAtsNm,
    concentrationRate,
  };
}

function extractOpenApiXmlErrorMessage(responseText: string): string | null {
  if (!responseText.trimStart().startsWith("<")) {
    return null;
  }

  const authMessage = responseText.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/);
  const reasonCode = responseText.match(
    /<returnReasonCode>(.*?)<\/returnReasonCode>/,
  );

  if (authMessage?.[1]) {
    return reasonCode?.[1]
      ? `${authMessage[1]} (${reasonCode[1]})`
      : authMessage[1];
  }

  return "Tourism API returned an XML error response.";
}
