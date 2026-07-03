export interface TourismCrowdApiHeaderDto {
  resultCode?: string | number;
  resultMsg?: string;
}

export interface TourismCrowdApiItemDto {
  baseYmd?: string | number;
  areaCd?: string | number;
  areaNm?: string;
  signguCd?: string | number;
  signguNm?: string;
  tAtsNm?: string;
  cnctrRate?: string | number;
}

export interface TourismCrowdApiItemsDto {
  item?: TourismCrowdApiItemDto | TourismCrowdApiItemDto[];
}

export interface TourismCrowdApiBodyDto {
  items?: TourismCrowdApiItemsDto | string;
}

export interface TourismCrowdApiResponseDto {
  response?: {
    header?: TourismCrowdApiHeaderDto;
    body?: TourismCrowdApiBodyDto;
  };
}
