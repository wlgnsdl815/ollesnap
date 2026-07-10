"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import {
  PLANNER_CALENDAR_END_MONTH,
  PLANNER_CALENDAR_START_MONTH,
} from "@/features/planner/domain/entity/planner-date-range.entity";
import { formatPlannerYearMonth } from "@/features/planner/domain/planner-date-formatter";
import { Calendar } from "@/shared/components/ui/calendar";

import { usePlannerDateRangeSelection } from "../hooks/use-planner-date-range-selection";

interface PlannerDateStepProps {
  onContinue: () => void;
}

export function PlannerDateStep({ onContinue }: PlannerDateStepProps) {
  const {
    dateRange,
    setDateRange,
    calendarMonth,
    setCalendarMonth,
    dateRangeLabel,
    canContinue,
    canGoPrevious,
    canGoNext,
    goToPreviousMonth,
    goToNextMonth,
  } = usePlannerDateRangeSelection();

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-3 shadow-sm">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <button
              type="button"
              aria-label="이전 달"
              disabled={!canGoPrevious}
              onClick={goToPreviousMonth}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-35"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="min-w-0 flex-1 text-center text-base font-black">
              {formatPlannerYearMonth(calendarMonth)}
            </p>
            <button
              type="button"
              aria-label="다음 달"
              disabled={!canGoNext}
              onClick={goToNextMonth}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-35"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <Calendar
            mode="range"
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selected={dateRange}
            onSelect={setDateRange}
            captionLayout="label"
            startMonth={PLANNER_CALENDAR_START_MONTH}
            endMonth={PLANNER_CALENDAR_END_MONTH}
            hideNavigation
            numberOfMonths={1}
            showOutsideDays={false}
            formatters={{
              formatCaption: (month) => formatPlannerYearMonth(month),
            }}
            className="w-full bg-card [--cell-size:2.5rem]"
            classNames={{
              root: "w-full",
              month_caption: "sr-only",
              caption_label: "text-sm font-black",
              months: "flex w-full flex-col",
              month: "flex w-full flex-col gap-4",
              month_grid: "w-full border-collapse",
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <CalendarDays className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground">
              선택한 제주 일정
            </p>
            <p className="truncate text-sm font-black">{dateRangeLabel}</p>
          </div>
        </div>
      </section>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
      >
        다음 단계로
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
