"use client";

import { CalendarDays, Camera, Home, Sparkles } from "lucide-react";
import { ko } from "date-fns/locale";
import { useMemo, useState } from "react";

import type { TourismCrowdForecast } from "@/features/tourism-crowd/domain/entities/tourism-crowd.entity";
import { useJejuTourismCrowdQuery } from "@/features/tourism-crowd/presentation/hooks/use-jeju-tourism-crowd-query";
import { Top5CrowdedToday } from "@/features/tourism-crowd/presentation/components/top5-crowded-today";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

type TabValue = "home" | "plan" | "etc";

const TAB_ITEMS = [
  { value: "home" as TabValue, label: "홈", icon: Home },
  { value: "plan" as TabValue, label: "일정관리", icon: CalendarDays },
  { value: "etc" as TabValue, label: "미정", icon: Sparkles },
];

export function PlanTab() {
  const [activeTab, setActiveTab] = useState<TabValue>("home");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { data, error, isError, isLoading } = useJejuTourismCrowdQuery();
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : undefined;
  const selectedForecasts = useMemo(
    () =>
      selectedDateKey
        ? (data?.forecasts ?? []).filter(
            (forecast) => forecast.baseDate === selectedDateKey,
          )
        : [],
    [data?.forecasts, selectedDateKey],
  );

  return (
    <main className="min-h-screen bg-[#F3EEE4] text-[#2E2A24]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8 md:pb-8">

        {/* 탭 상태를 하나로 관리: 데스크탑 TabsList + 모바일 바텀 네비가 같은 값을 공유 */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
          className="flex flex-1 flex-col gap-0"
        >
          <header>
            <div className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-xs font-semibold text-[#8A8175]">제주 스냅 여행</p>
                <h1 className="text-2xl font-bold tracking-normal text-[#2E2A24]">
                  올레스냅
                </h1>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#4E7A5E] text-[#FAF7F1] shadow-sm">
                <Camera className="size-5" aria-hidden="true" />
              </div>
            </div>

            {/* 데스크탑 상단 탭 — md 이상에서만 표시 */}
            <TabsList
              variant="line"
              className="hidden h-auto w-full rounded-none border-b border-[#ECE7DD] bg-transparent p-0 md:flex"
            >
              {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-auto flex-1 gap-1.5 py-3 text-sm font-semibold"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </header>

          <TabsContent value="home" className="flex-1 pt-4">
            <Top5CrowdedToday />
          </TabsContent>

          <TabsContent value="plan" className="flex-1">
            <section className="grid flex-1 items-start gap-4 py-4 lg:grid-cols-[360px_minmax(0,1fr)]">
              <div className="rounded-lg border border-[#ECE7DD] bg-white p-4 shadow-sm">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  captionLayout="dropdown"
                  locale={ko}
                  className="w-full"
                  classNames={{
                    root: "w-full",
                    month: "w-full",
                    month_grid: "w-full",
                  }}
                />
              </div>
              <SelectedDateForecastList
                errorMessage={isError ? getErrorMessage(error) : undefined}
                forecasts={selectedForecasts}
                isLoading={isLoading}
                selectedDate={selectedDate}
              />
            </section>
          </TabsContent>

          <TabsContent value="etc" className="flex-1 pt-4">
            <EtcPlaceholder />
          </TabsContent>
        </Tabs>
      </div>

      {/* 모바일 바텀 네비 — md 미만에서만 표시 */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-stretch border-t border-[#ECE7DD]/20 bg-[#2E2A24] md:hidden">
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => {
          const isActive = activeTab === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                isActive ? "text-[#C9A24B]" : "text-[#FAF7F1]/60"
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </nav>
    </main>
  );
}

function EtcPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#E7EFE9] text-[#4E7A5E]">
        <Sparkles className="size-8" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-bold text-[#2E2A24]">준비 중</p>
        <p className="mt-1 text-sm text-[#8A8175]">곧 새로운 기능이 추가될 예정이에요.</p>
      </div>
    </div>
  );
}

interface SelectedDateForecastListProps {
  errorMessage?: string;
  forecasts: TourismCrowdForecast[];
  isLoading: boolean;
  selectedDate?: Date;
}

function SelectedDateForecastList({
  errorMessage,
  forecasts,
  isLoading,
  selectedDate,
}: SelectedDateForecastListProps) {
  return (
    <section className="rounded-lg border border-[#ECE7DD] bg-white p-4 shadow-sm lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#8A8175]">선택 날짜 예측 데이터</p>
          <h2 className="mt-1 text-2xl font-bold text-[#2E2A24]">
            {selectedDate ? formatDisplayDate(selectedDate) : "날짜를 선택하세요"}
          </h2>
        </div>
        <span className="rounded-md bg-[#E7EFE9] px-3 py-1 text-sm font-bold text-[#4E7A5E]">
          {forecasts.length}건
        </span>
      </div>

      <div className="mt-5">
        {!selectedDate ? (
          <EmptyState message="캘린더에서 날짜를 선택하면 해당 날짜의 명소별 혼잡도 예측을 전부 보여줍니다." />
        ) : isLoading ? (
          <EmptyState message="제주 명소 혼잡도 예측을 불러오는 중입니다." />
        ) : errorMessage ? (
          <EmptyState message={errorMessage} />
        ) : forecasts.length === 0 ? (
          <EmptyState message="선택한 날짜에 해당하는 예측 데이터가 없습니다." />
        ) : (
          <ForecastResultList forecasts={forecasts} />
        )}
      </div>
    </section>
  );
}

function ForecastResultList({ forecasts }: { forecasts: TourismCrowdForecast[] }) {
  return (
    <>
      <div className="grid gap-2 sm:hidden">
        {forecasts.map((forecast) => (
          <article
            key={`${forecast.baseDate}-${forecast.districtCode}-${forecast.attractionName}`}
            className="rounded-lg border border-[#ECE7DD] bg-[#FAF7F1] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#8A8175]">
                  {forecast.districtName}
                </p>
                <h3 className="mt-1 wrap-break-word text-base font-bold text-[#2E2A24]">
                  {forecast.attractionName}
                </h3>
              </div>
              <span className="shrink-0 rounded-md bg-[#E7EFE9] px-2.5 py-1 text-sm font-bold text-[#4E7A5E]">
                {forecast.concentrationRate.toFixed(2)}%
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden max-h-155 overflow-auto rounded-lg border border-[#ECE7DD] sm:block">
        <Table>
          <TableHeader className="sticky top-0 bg-[#FAF7F1] text-xs font-bold text-[#8A8175]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-3 py-3">시군구</TableHead>
              <TableHead className="px-3 py-3">관광지명</TableHead>
              <TableHead className="px-3 py-3 text-right">집중률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecasts.map((forecast) => (
              <TableRow
                key={`${forecast.baseDate}-${forecast.districtCode}-${forecast.attractionName}`}
              >
                <TableCell className="px-3 py-3 text-[#8A8175]">
                  {forecast.districtName}
                </TableCell>
                <TableCell className="px-3 py-3 font-semibold text-[#2E2A24]">
                  {forecast.attractionName}
                </TableCell>
                <TableCell className="px-3 py-3 text-right font-bold text-[#4E7A5E]">
                  {forecast.concentrationRate.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#D8D0C2] bg-[#FAF7F1] px-4 py-10 text-center text-sm font-semibold leading-6 text-[#8A8175]">
      {message}
    </div>
  );
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(date);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "제주 명소 혼잡도 예측을 불러오지 못했습니다.";
}
