export interface PreparationItemDefinition {
  id: string;
  label: string;
}

export interface PreparationCategory {
  id: string;
  label: string;
  items: PreparationItemDefinition[];
}

// 제주 야외 스냅 기준 기본 준비물. 사용자가 체크하거나 직접 추가한 항목만 DB에 저장된다.
export const PREPARATION_CATEGORIES: PreparationCategory[] = [
  {
    id: "styling",
    label: "의상·스타일",
    items: [
      { id: "outfit-spare", label: "드레스·셔츠 여벌" },
      { id: "garment-cover", label: "구김 방지 커버·옷걸이" },
      { id: "underwear", label: "보정속옷·살색 양말" },
      { id: "accessory", label: "액세서리·부케 소품" },
    ],
  },
  {
    id: "jeju-weather",
    label: "제주 날씨 대비",
    items: [
      { id: "hair-fix", label: "바람 대비 헤어핀·스프레이" },
      { id: "spare-shoes", label: "모래사장용 여벌 신발" },
      { id: "rain-gear", label: "우비·큰 수건" },
      { id: "outerwear", label: "일교차 대비 겉옷" },
    ],
  },
  {
    id: "condition",
    label: "컨디션·소품",
    items: [
      { id: "water-snack", label: "생수·간단한 간식" },
      { id: "touch-up", label: "손거울·수정 화장품" },
      { id: "speaker", label: "블루투스 스피커" },
    ],
  },
  {
    id: "etc",
    label: "서류·기타",
    items: [
      { id: "reservation", label: "예약 확인 내역" },
      { id: "power-bank", label: "보조배터리" },
    ],
  },
];

export interface PreparationItemState {
  itemId: string;
  label: string;
  isChecked: boolean;
  isCustom: boolean;
}

export interface PreparationChecklistItemView {
  id: string;
  label: string;
  isChecked: boolean;
}

export interface PreparationChecklistView {
  categories: {
    id: string;
    label: string;
    items: PreparationChecklistItemView[];
  }[];
  customItems: PreparationChecklistItemView[];
  checkedCount: number;
  totalCount: number;
}

export function buildPreparationChecklist(
  states: PreparationItemState[],
): PreparationChecklistView {
  const stateByItemId = new Map(states.map((state) => [state.itemId, state]));
  const categories = PREPARATION_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    items: category.items.map((item) => ({
      id: item.id,
      label: item.label,
      isChecked: stateByItemId.get(item.id)?.isChecked ?? false,
    })),
  }));
  const customItems = states
    .filter((state) => state.isCustom)
    .map((state) => ({
      id: state.itemId,
      label: state.label,
      isChecked: state.isChecked,
    }));

  const allItems = [
    ...categories.flatMap((category) => category.items),
    ...customItems,
  ];

  return {
    categories,
    customItems,
    checkedCount: allItems.filter((item) => item.isChecked).length,
    totalCount: allItems.length,
  };
}
