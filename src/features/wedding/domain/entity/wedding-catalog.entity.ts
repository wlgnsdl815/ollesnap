export type SnapScene =
  | "oreum"
  | "sea"
  | "ranch"
  | "stone-wall"
  | "forest"
  | "sunset";

export type WeddingTone = "natural" | "warm" | "classic" | "film";

export type StylingKind = "dress" | "makeup";

export interface SnapSceneOption {
  id: SnapScene;
  label: string;
  description: string;
}

export interface WeddingToneOption {
  id: WeddingTone;
  label: string;
  description: string;
}

export interface SnapArtist {
  id: string;
  studioName: string;
  artistName: string;
  introduction: string;
  scenes: SnapScene[];
  tones: WeddingTone[];
  keywords: string[];
  packageSummary: string;
  priceFrom: number;
  durationHours: number;
  deliveryDays: number;
  reservationLeadDays: number;
  compatiblePartnerIds: string[];
}

export interface StylingPartner {
  id: string;
  kind: StylingKind;
  name: string;
  introduction: string;
  keywords: string[];
  priceFrom: number;
  preparationMinutes: number;
  includedService: string;
}

export interface WeddingCatalog {
  scenes: SnapSceneOption[];
  tones: WeddingToneOption[];
  artists: SnapArtist[];
  stylingPartners: StylingPartner[];
}

export interface SnapTeam {
  artist: SnapArtist;
  dress: StylingPartner;
  makeup: StylingPartner;
  totalPriceFrom: number;
}
