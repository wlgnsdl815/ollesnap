import type {
  PreparationGuideAnswers,
  PreparationGuideResult,
} from "../entity/preparation-guide.entity";

export function createPreparationGuideResult(
  answers: PreparationGuideAnswers,
): PreparationGuideResult {
  const decideNow = createDecideNowItems(answers);
  const decideWithPhotographer = [
    "정확한 촬영 장소와 시간대",
    "날씨·바람에 따른 동선",
    "드레스와 메이크업의 최종 조합",
  ];

  if (answers.dateReadiness === "fixed") {
    return {
      stageLabel: "일정 우선 단계",
      title: "날짜를 기준으로 작가를 좁혀보세요",
      description:
        "촬영일이 정해졌다면 그 날짜에 상담 가능한 작가를 먼저 확인하는 편이 좋아요. 씬과 톤은 작가를 비교할 때 기준으로 쓰면 됩니다.",
      decideNow,
      decideWithPhotographer,
      nextActionLabel: "일정부터 물어볼 작가 찾기",
    };
  }

  if (answers.dateReadiness === "season" || answers.dateReadiness === "month") {
    return {
      stageLabel: "후보일 좁히기 단계",
      title: "취향에 맞는 작가를 먼저 저장해두세요",
      description:
        "계절이나 월만 정해도 충분해요. 마음에 드는 작가를 2~3명 찜해두고, 상담에서 가능한 날짜를 비교하면 됩니다.",
      decideNow,
      decideWithPhotographer,
      nextActionLabel: "취향에 맞는 작가 비교하기",
    };
  }

  if (answers.priority === "styling") {
    return {
      stageLabel: "스타일 찾기 단계",
      title: "드레스 취향을 사진 톤과 함께 보세요",
      description:
        "드레스가 가장 중요하다면 원하는 실루엣을 먼저 떠올려도 좋아요. 다만 최종 조합은 작가의 사진 톤과 함께 비교하는 편이 자연스럽습니다.",
      decideNow,
      decideWithPhotographer,
      nextActionLabel: "사진 톤이 맞는 작가 보기",
    };
  }

  if (answers.priority === "budget") {
    return {
      stageLabel: "예산 기준 찾기 단계",
      title: "시작가와 구성부터 가볍게 비교해보세요",
      description:
        "아직 날짜가 없어도 괜찮아요. 작가별 촬영 시간과 제공 구성, 스드메 시작가를 먼저 보면 현실적인 후보를 정하기 쉬워집니다.",
      decideNow,
      decideWithPhotographer,
      nextActionLabel: "예산과 구성을 비교할 작가 찾기",
    };
  }

  return {
    stageLabel: "취향 찾기 단계",
    title: "날짜보다 먼저, 남기고 싶은 제주를 골라보세요",
    description:
      "정확한 장소나 날짜가 없어도 시작할 수 있어요. 제주 씬과 사진 톤으로 작가를 몇 명만 좁혀도 다음 결정이 훨씬 쉬워집니다.",
    decideNow,
    decideWithPhotographer,
    nextActionLabel: "내 취향의 작가 찾기",
  };
}

function createDecideNowItems(
  answers: PreparationGuideAnswers,
): string[] {
  const items: string[] = [];

  if (answers.scene) {
    items.push("제주에서 남기고 싶은 장면");
  }

  if (answers.tone) {
    items.push("사진의 색감과 분위기");
  }

  if (answers.priority === "budget") {
    items.push("예산의 대략적인 상한선");
  }

  if (answers.dateReadiness === "season" || answers.dateReadiness === "month") {
    items.push("촬영을 생각하는 계절 또는 월");
  }

  if (answers.stayLength !== "unknown") {
    items.push("제주에서 머무를 대략적인 일수");
  }

  return items.length > 0
    ? items
    : ["작가 포트폴리오를 보며 끌리는 제주 씬 한 가지"];
}
