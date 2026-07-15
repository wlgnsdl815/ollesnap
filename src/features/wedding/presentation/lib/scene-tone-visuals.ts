import type {
  SnapScene,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";

// 씬별 대표 사진 (출처: public/images/scenes/CREDITS.md)
export const SCENE_IMAGES: Record<SnapScene, string> = {
  oreum: "/images/scenes/oreum.jpg",
  sea: "/images/scenes/sea.jpg",
  ranch: "/images/scenes/ranch.jpg",
  "stone-wall": "/images/scenes/stone-wall.jpg",
  forest: "/images/scenes/forest.jpg",
  sunset: "/images/scenes/sunset.jpg",
};

// 톤별 색보정 — 같은 씬 사진이 작가의 사진 톤에 따라 다르게 보이도록 하는 CSS filter 값.
export const TONE_PHOTO_FILTERS: Record<WeddingTone, string> = {
  natural: "none",
  warm: "sepia(0.22) saturate(1.25) brightness(1.04)",
  classic: "saturate(0.8) contrast(1.1)",
  film: "sepia(0.18) saturate(0.72) contrast(0.9) brightness(1.05)",
};
