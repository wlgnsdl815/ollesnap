export interface KorServiceKeywordItem {
  contentid: string;
  title: string;
}

export interface KorServiceCommonDetail {
  contentid: string;
  title: string;
  addr1?: string;
  addr2?: string;
  tel?: string;
  homepage?: string;
  overview?: string;
  mapx?: string;
  mapy?: string;
}

export interface KorServiceListResponse<T> {
  response: {
    header: { resultCode: string; resultMsg: string };
    body?: { items?: { item?: T[] | T } };
  };
}
