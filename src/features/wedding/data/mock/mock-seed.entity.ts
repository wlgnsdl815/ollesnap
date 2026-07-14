import type {
  SnapScene,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";

export interface ArtistSeed {
  id: string;
  studioName: string;
  artistName: string;
  introduction: string;
  scenes: SnapScene[];
  tones: WeddingTone[];
  keywords: string[];
  durationHours: number;
}

export interface StylingSeed {
  id: string;
  name: string;
  introduction: string;
  keywords: string[];
}
