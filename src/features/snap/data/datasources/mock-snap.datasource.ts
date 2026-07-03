import type {
  CourseStop,
  PhotoBookEntry,
  PlannerSlot,
  SnapSpot,
} from "@/features/snap/domain/entities/snap.entity";

export const plannerSlots: PlannerSlot[] = [
  {
    time: "06:20",
    title: "일출 스냅",
    weather: "구름 적음",
    light: "금빛 역광",
    crowdLevel: 28,
    note: "성산 방향이 가장 안정적입니다.",
  },
  {
    time: "10:30",
    title: "오름 산책",
    weather: "맑음",
    light: "선명한 자연광",
    crowdLevel: 54,
    note: "바람이 약해 베일 컷에 좋습니다.",
  },
  {
    time: "16:50",
    title: "해변 골든아워",
    weather: "맑음",
    light: "부드러운 황금빛",
    crowdLevel: 41,
    note: "협재 해변과 카페 코스가 자연스럽습니다.",
  },
  {
    time: "19:10",
    title: "블루아워",
    weather: "흐림",
    light: "차분한 바다색",
    crowdLevel: 32,
    note: "돌담길 실루엣 컷을 추천합니다.",
  },
];

export const snapSpots: SnapSpot[] = [
  {
    id: "seongsan",
    name: "성산일출봉",
    region: "동부",
    mood: "일출 · 웅장함",
    description: "바다와 능선이 함께 잡히는 제주 대표 일출 스냅 명소",
    bestTime: "06:20",
    crowdLevel: 28,
    accentColor: "#C9A24B",
    mapPosition: {
      top: "31%",
      left: "74%",
    },
    tags: ["일출", "바다", "드레스"],
  },
  {
    id: "hyeopjae",
    name: "협재 해수욕장",
    region: "서부",
    mood: "바다 · 청량함",
    description: "밝은 모래와 얕은 바다가 화사한 커플 컷에 어울리는 곳",
    bestTime: "16:50",
    crowdLevel: 41,
    accentColor: "#5E8693",
    mapPosition: {
      top: "45%",
      left: "19%",
    },
    tags: ["골든아워", "바다", "카페"],
  },
  {
    id: "saebyeol",
    name: "새별오름",
    region: "서부",
    mood: "오름 · 자연색",
    description: "능선 실루엣과 들판 질감이 살아나는 제주 자연색 포인트",
    bestTime: "10:30",
    crowdLevel: 54,
    accentColor: "#4E7A5E",
    mapPosition: {
      top: "54%",
      left: "37%",
    },
    tags: ["오름", "능선", "피크닉"],
  },
  {
    id: "camellia",
    name: "카멜리아힐",
    region: "서귀포",
    mood: "정원 · 로즈톤",
    description: "계절 꽃과 산책로가 포토북 커버 컷으로 잘 어울리는 정원",
    bestTime: "14:40",
    crowdLevel: 63,
    accentColor: "#A9685C",
    mapPosition: {
      top: "67%",
      left: "45%",
    },
    tags: ["정원", "로즈", "포토북"],
  },
];

export const courseStops: CourseStop[] = [
  {
    time: "06:20",
    type: "촬영",
    title: "성산일출봉 일출 스냅",
    area: "성산",
    duration: "80분",
    note: "바람 방향을 고려해 해안 산책로부터 시작합니다.",
    accentColor: "#C9A24B",
  },
  {
    time: "08:10",
    type: "아침",
    title: "해녀의 집 조식",
    area: "오조리",
    duration: "50분",
    note: "촬영 후 이동 부담이 적은 근거리 식사 코스입니다.",
    accentColor: "#B07B45",
  },
  {
    time: "10:00",
    type: "산책",
    title: "종달리 돌담길",
    area: "구좌",
    duration: "60분",
    note: "사람이 적은 골목 컷과 자연스러운 데이트 컷을 이어갑니다.",
    accentColor: "#4E7A5E",
  },
  {
    time: "12:00",
    type: "카페",
    title: "바다 앞 로스터리",
    area: "세화",
    duration: "70분",
    note: "포토북에 넣을 휴식 컷과 영수증 기록을 남깁니다.",
    accentColor: "#5E8693",
  },
];

export const photoBookEntries: PhotoBookEntry[] = [
  {
    title: "첫 빛",
    place: "성산일출봉",
    date: "2026.05.23",
    accentColor: "#C9A24B",
  },
  {
    title: "돌담길",
    place: "종달리",
    date: "2026.05.23",
    accentColor: "#4E7A5E",
  },
  {
    title: "바다 앞 쉼",
    place: "세화",
    date: "2026.05.23",
    accentColor: "#5E8693",
  },
];
