import type {
  SnapSceneOption,
  WeddingToneOption,
} from "./entity/wedding-catalog.entity";

// 씬·톤은 서비스가 정의하는 취향 분류 체계라 DB가 아닌 코드에서 관리한다.

export const WEDDING_SCENES: SnapSceneOption[] = [
  {
    id: "oreum",
    label: "오름·초원",
    description: "바람과 넓은 초록을 담아요",
  },
  { id: "sea", label: "바다·해안", description: "파도와 수평선이 어울려요" },
  {
    id: "ranch",
    label: "목장·들판",
    description: "여유로운 제주 풍경이에요",
  },
  {
    id: "stone-wall",
    label: "돌담·마을",
    description: "제주다운 결을 남겨요",
  },
  {
    id: "forest",
    label: "숲길·동백",
    description: "차분하고 깊은 초록이에요",
  },
  {
    id: "sunset",
    label: "노을·야간",
    description: "빛이 바뀌는 순간을 담아요",
  },
];

export const WEDDING_TONES: WeddingToneOption[] = [
  { id: "natural", label: "내추럴", description: "있는 그대로의 온도" },
  { id: "warm", label: "따뜻한 색감", description: "햇살 같은 결" },
  { id: "classic", label: "클래식", description: "시간이 지나도 단정하게" },
  { id: "film", label: "필름 무드", description: "조금 더 선명한 취향" },
];
