import type { RelatedSpot } from "../entity/related-spot.entity";

export interface RelatedSpotRepository {
  /** 관광지명으로 함께 많이 찾는 연관 관광지 목록을 조회한다 (연관순위 오름차순). */
  getRelatedSpots(placeName: string): Promise<RelatedSpot[]>;
}
