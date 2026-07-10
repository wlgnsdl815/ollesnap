"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { PLANNER_CALENDAR_INITIAL_MONTH } from "@/features/planner/domain/entity/planner-date-range.entity";
import {
  addPlannerCalendarMonths,
  canGoToNextPlannerMonth,
  canGoToPreviousPlannerMonth,
} from "@/features/planner/domain/planner-calendar-month";
import { formatPlannerDateRangeLabel } from "@/features/planner/domain/planner-date-formatter";

export function usePlannerDateRangeSelection() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarMonth, setCalendarMonth] = useState(
    PLANNER_CALENDAR_INITIAL_MONTH,
  );

  return {
    dateRange,
    setDateRange,
    calendarMonth,
    setCalendarMonth,
    dateRangeLabel: formatPlannerDateRangeLabel(dateRange),
    canContinue: Boolean(dateRange?.from && dateRange?.to),
    canGoPrevious: canGoToPreviousPlannerMonth(calendarMonth),
    canGoNext: canGoToNextPlannerMonth(calendarMonth),
    goToPreviousMonth: () =>
      setCalendarMonth((month) => addPlannerCalendarMonths(month, -1)),
    goToNextMonth: () =>
      setCalendarMonth((month) => addPlannerCalendarMonths(month, 1)),
  };
}
