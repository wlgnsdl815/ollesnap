import type { PhotoSpotAttraction } from "../../domain/entity/photo-spot.entity";
import type { KorServiceCommonDetail } from "../dto/kor-service.dto";

export function toAttraction(
  detail: KorServiceCommonDetail,
): PhotoSpotAttraction | null {
  const attraction: PhotoSpotAttraction = {
    overview: stripHtml(detail.overview),
    address:
      [detail.addr1, detail.addr2].filter(Boolean).join(" ").trim() ||
      undefined,
    tel: detail.tel || undefined,
    homepageUrl: extractHref(detail.homepage),
    mapx: detail.mapx || undefined,
    mapy: detail.mapy || undefined,
  };

  return Object.values(attraction).some(Boolean) ? attraction : null;
}

export function stripHtml(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const text = value.replace(/<[^>]*>/g, "").trim();

  return text || undefined;
}

function extractHref(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.match(/href=["']([^"']+)["']/i)?.[1];
}
