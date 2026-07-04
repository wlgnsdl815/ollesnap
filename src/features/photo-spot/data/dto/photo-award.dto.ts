export interface PhotoAwardApiItem {
  contentId: string;
  koTitle: string;
  lDongRegnCd: string;
  koFilmst: string;
  filmDay: string;
  koCmanNm: string;
  koWnprzDiz: string;
  koKeyWord: string;
  orgImage?: string;
  thumbImage?: string;
}

export interface PhotoAwardApiResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body?: {
      items?: { item?: PhotoAwardApiItem[] | PhotoAwardApiItem };
      totalCount?: number;
    };
  };
}
