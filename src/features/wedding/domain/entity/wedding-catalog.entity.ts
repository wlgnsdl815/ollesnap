export type SnapScene =
  | "oreum"
  | "sea"
  | "ranch"
  | "stone-wall"
  | "forest"
  | "sunset";

export type WeddingTone = "natural" | "warm" | "classic" | "film";

export type StylingProductKind = "single" | "package";

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

export interface SnapPackageAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  notice?: string;
}

export interface SnapPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationHours: number;
  outfitCountMinimum: number;
  outfitCountMaximum: number;
  sceneCount: number;
  colorCorrectedCount: number;
  basicRetouchedCount: number;
  selectedRetouchedCount: number;
  includedServices: string[];
  recommendedFor: string[];
  addOns: SnapPackageAddOn[];
}

export interface SnapArtist {
  id: string;
  studioName: string;
  artistName: string;
  introduction: string;
  profileImageUrl: string;
  scenes: SnapScene[];
  tones: WeddingTone[];
  keywords: string[];
  packageSummary: string;
  priceFrom: number;
  durationHours: number;
  deliveryDays: number;
  reservationLeadDays: number;
  packages: SnapPackage[];
  partnerStylingShopIds: string[];
}

export interface SnapArtistPage {
  artists: SnapArtist[];
  totalCount: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface StylingProductPrice {
  total: number;
  vatAmount: number;
  maximumTotal?: number;
  taxIncluded: boolean;
}

export interface StylingProductAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface StylingProduct {
  id: string;
  kind: StylingProductKind;
  name: string;
  description: string;
  regularPrice: StylingProductPrice;
  partnerPrice?: StylingProductPrice;
  includedServices: string[];
  addOns: StylingProductAddOn[];
  notice?: string;
}

export interface StylingShop {
  id: string;
  name: string;
  introduction: string;
  keywords: string[];
  inventoryDescription: string;
  partnerArtistIds: string[];
  products: StylingProduct[];
}

export interface WeddingCatalog {
  scenes: SnapSceneOption[];
  tones: WeddingToneOption[];
  artists: SnapArtist[];
  stylingShops: StylingShop[];
}

export interface SnapTeam {
  artist: SnapArtist;
  snapPackage: SnapPackage;
  stylingShop: StylingShop;
  stylingProduct: StylingProduct;
  stylingPrice: StylingProductPrice;
  stylingAddOns: StylingProductAddOn[];
  hasPartnerStylingPrice: boolean;
  totalPriceFrom: number;
}
