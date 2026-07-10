export type ServiceSlotId = "snap" | "dress" | "makeup";

export interface ServiceSlot {
  id: ServiceSlotId;
  label: string;
  description: string;
}

export const SERVICE_SLOTS: ServiceSlot[] = [
  {
    id: "snap",
    label: "스냅",
    description: "촬영 스타일과 컷 구성을 고릅니다.",
  },
  {
    id: "dress",
    label: "드레스",
    description: "촬영 장소에 어울리는 의상을 고릅니다.",
  },
  {
    id: "makeup",
    label: "메이크업",
    description: "헤어와 메이크업 일정을 맞춥니다.",
  },
];
