import { Check, CheckCircle2, Sparkles } from "lucide-react";

import { getCongestionLevelLabel } from "@/features/photo-spot/domain/usecase/congestion.usecase";
import {
  CONGESTION_DOT_CLASS,
  CONGESTION_TEXT_CLASS,
} from "@/features/photo-spot/presentation/lib/congestion-visuals";

import type { ShootingDateRecommendation } from "../../domain/usecase/recommend-shooting-dates.usecase";

interface ShootingDateRecommendationSectionProps {
  recommendation: ShootingDateRecommendation;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export function ShootingDateRecommendationSection({
  recommendation,
  selectedDate,
  onSelectDate,
}: ShootingDateRecommendationSectionProps) {
  const { basis, basisSpotNames, candidates, uncoveredDayCount } =
    recommendation;
  const recommended = candidates.find((candidate) => candidate.isRecommended);
  const isRecommendedSelected =
    recommended != null && recommended.date === selectedDate;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">촬영하기 좋은 날</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          체류 기간의 관광지 혼잡도 예측으로 여유로운 날을 골라봤어요.
          {onSelectDate ? " 날짜를 누르면 촬영 예정일로 담겨요." : ""}
        </p>
      </div>

      {candidates.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-sm">
          {recommended ? (
            <div className="flex flex-col gap-3 rounded-xl bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="size-3.5" />
                    이 날이 가장 여유로워요
                  </span>
                  <span className="text-lg font-semibold">
                    {formatFullDate(recommended.date)}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${CONGESTION_TEXT_CLASS[recommended.level]}`}
                >
                  {getCongestionLevelLabel(recommended.level)}
                </span>
              </div>
              {onSelectDate ? (
                <button
                  type="button"
                  onClick={() => onSelectDate(recommended.date)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold ${
                    isRecommendedSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-primary text-primary-foreground active:bg-primary/90"
                  }`}
                >
                  {isRecommendedSelected ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      촬영 예정일에 담았어요
                    </>
                  ) : (
                    "이 날로 촬영일 정하기"
                  )}
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            {candidates.map((candidate) => {
              const isSelected =
                onSelectDate != null && candidate.date === selectedDate;
              const rowCells = (
                <>
                  <span
                    className={`w-16 shrink-0 text-sm ${
                      isSelected || candidate.isRecommended
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatShortDate(candidate.date)}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full rounded-full ${CONGESTION_DOT_CLASS[candidate.level]}`}
                      style={{
                        width: `${clampRate(candidate.averageRate)}%`,
                      }}
                    />
                  </span>
                  <span
                    className={`w-9 shrink-0 text-right text-xs font-semibold ${CONGESTION_TEXT_CLASS[candidate.level]}`}
                  >
                    {getCongestionLevelLabel(candidate.level)}
                  </span>
                  {onSelectDate ? (
                    <span className="flex w-4 shrink-0 justify-end">
                      {isSelected ? (
                        <Check className="size-4 text-primary" />
                      ) : null}
                    </span>
                  ) : null}
                </>
              );

              return onSelectDate ? (
                <button
                  key={candidate.date}
                  type="button"
                  onClick={() => onSelectDate(candidate.date)}
                  className={`-mx-2 flex min-h-11 items-center gap-3 rounded-lg px-2 text-left ${
                    isSelected ? "bg-secondary" : "active:bg-muted"
                  }`}
                >
                  {rowCells}
                </button>
              ) : (
                <div
                  key={candidate.date}
                  className="flex min-h-11 items-center gap-3"
                >
                  {rowCells}
                </div>
              );
            })}
          </div>

          <p className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
            {basis === "saved-spots"
              ? `일정에 담은 ${formatSpotNames(basisSpotNames)}의 집중률 평균`
              : "제주 주요 관광지의 집중률 평균"}
            {" · "}관광지 집중률 예측 공공데이터
            {uncoveredDayCount > 0
              ? ` · 예측이 없는 ${uncoveredDayCount}일은 제외했어요`
              : ""}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/50 p-5">
          <p className="text-base font-semibold">
            아직 이 기간의 예측이 없어요
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            혼잡도 예측은 오늘부터 약 30일까지 제공돼요. 체류일이 가까워지면
            여기에서 여유로운 날을 골라드릴게요.
          </p>
        </div>
      )}
    </section>
  );
}

function clampRate(rate: number): number {
  return Math.min(100, Math.max(6, Math.round(rate)));
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function parseDate(dateIso: string): Date {
  return new Date(`${dateIso}T00:00:00`);
}

function formatShortDate(dateIso: string): string {
  const date = parseDate(dateIso);

  return `${date.getMonth() + 1}.${date.getDate()} (${WEEKDAY_LABELS[date.getDay()]})`;
}

function formatFullDate(dateIso: string): string {
  const date = parseDate(dateIso);

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAY_LABELS[date.getDay()]}요일`;
}

function formatSpotNames(spotNames: string[]): string {
  if (spotNames.length === 0) {
    return "장소";
  }

  if (spotNames.length <= 2) {
    return spotNames.join("·");
  }

  return `${spotNames[0]} 외 ${spotNames.length - 1}곳`;
}
