export interface PhotoSpotAttraction {
  overview?: string;
  address?: string;
  tel?: string;
  homepageUrl?: string;
  mapx?: string;
  mapy?: string;
}

export interface PhotoSpot {
  id: string;
  title: string;
  location: string;
  filmedAt: string;
  photographer: string;
  award: string;
  keywords: string[];
  allKeywords: string[];
  imageUrl: string;
  fullImageUrl: string;
  attraction?: PhotoSpotAttraction;
}
