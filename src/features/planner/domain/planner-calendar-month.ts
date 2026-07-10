import {
  PLANNER_CALENDAR_END_MONTH,
  PLANNER_CALENDAR_START_MONTH,
} from "./entity/planner-date-range.entity";

export function getMonthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

export function clampPlannerCalendarMonth(date: Date): Date {
  const monthIndex = getMonthIndex(date);

  if (monthIndex < getMonthIndex(PLANNER_CALENDAR_START_MONTH)) {
    return PLANNER_CALENDAR_START_MONTH;
  }

  if (monthIndex > getMonthIndex(PLANNER_CALENDAR_END_MONTH)) {
    return PLANNER_CALENDAR_END_MONTH;
  }

  return date;
}

export function addPlannerCalendarMonths(date: Date, amount: number): Date {
  return clampPlannerCalendarMonth(
    new Date(date.getFullYear(), date.getMonth() + amount, 1),
  );
}

export function canGoToPreviousPlannerMonth(month: Date): boolean {
  return getMonthIndex(month) > getMonthIndex(PLANNER_CALENDAR_START_MONTH);
}

export function canGoToNextPlannerMonth(month: Date): boolean {
  return getMonthIndex(month) < getMonthIndex(PLANNER_CALENDAR_END_MONTH);
}
