import type { PlannerDateRange } from "./entity/planner-date-range.entity";

export function formatPlannerDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function formatPlannerYearMonth(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatPlannerDateRangeLabel(
  dateRange: PlannerDateRange | undefined,
): string {
  if (!dateRange?.from) {
    return "일정 미선택";
  }

  if (!dateRange.to) {
    return `${formatPlannerDate(dateRange.from)} 출발`;
  }

  return `${formatPlannerDate(dateRange.from)} - ${formatPlannerDate(dateRange.to)}`;
}

export function formatPlannerDateLabel(dateValue: string): string {
  if (!dateValue) {
    return "날짜 미정";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "날짜 미정";
  }

  return formatPlannerDate(date);
}
