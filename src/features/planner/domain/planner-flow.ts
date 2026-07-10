export const TOTAL_PLANNER_STEPS = 4;

export type PlannerFlowStep = 1 | 2;

const PLANNER_STEP_TITLES: Record<PlannerFlowStep, string> = {
  1: "제주 전체 일정을 선택해주세요",
  2: "스냅작가를 선택해주세요",
};

export function getPlannerStepTitle(step: PlannerFlowStep): string {
  return PLANNER_STEP_TITLES[step];
}
