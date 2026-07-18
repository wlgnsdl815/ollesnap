export type RelatedSpotCategory = "attraction" | "food" | "stay";

export interface RelatedSpot {
  id: string;
  name: string;
  category: RelatedSpotCategory;
  /** 사용자에게 보여줄 세부 분류명 (예: 자연관광, 카페/찻집, 호텔) */
  categoryDetail: string | null;
  sigunguName: string | null;
  rank: number;
}
