import { Calendar } from "@/shared/components/ui/calendar";

import type { SpotCongestionForecast } from "../../domain/entity/congestion-forecast.entity";
import { CONGESTION_DOT_CLASS } from "../lib/congestion-visuals";

interface CongestionForecastCalendarProps {
  forecast: SpotCongestionForecast;
}

export function CongestionForecastCalendar({
  forecast,
}: CongestionForecastCalendarProps) {
  if (forecast.days.length === 0) {
    return null;
  }

  const lowDates = forecast.days
    .filter((day) => day.level === "low")
    .map((day) => parseIsoDate(day.date));
  const highDates = forecast.days
    .filter((day) => day.level === "high")
    .map((day) => parseIsoDate(day.date));
  const firstMonth = parseIsoDate(forecast.days[0].date);
  const lastMonth = parseIsoDate(forecast.days[forecast.days.length - 1].date);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">언제 가면 여유로울까요?</p>
        <p className="text-xs text-muted-foreground">
          한국관광공사 관광지 집중률 예측 데이터 기준 · 향후 30일
        </p>
      </div>
      <Calendar
        defaultMonth={firstMonth}
        startMonth={firstMonth}
        endMonth={lastMonth}
        showOutsideDays={false}
        modifiers={{ low: lowDates, high: highDates }}
        modifiersClassNames={{
          low: "bg-chart-2/15 text-chart-2",
          high: "bg-destructive/15 text-destructive",
        }}
        className="w-full bg-card p-0 [--cell-size:2.5rem]"
        classNames={{
          root: "w-full",
          month: "flex w-full flex-col gap-3",
          month_grid: "w-full border-collapse",
        }}
      />
      <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${CONGESTION_DOT_CLASS.low}`} />
          여유
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className={`size-2 rounded-full ${CONGESTION_DOT_CLASS.high}`}
          />
          붐빔
        </span>
      </div>
    </div>
  );
}

function parseIsoDate(dateIso: string): Date {
  return new Date(`${dateIso}T00:00:00`);
}
