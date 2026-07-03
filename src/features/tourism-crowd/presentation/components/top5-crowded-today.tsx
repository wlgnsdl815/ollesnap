"use client";

import { Flame } from "lucide-react";
import { useMemo } from "react";

import { useJejuTourismCrowdQuery } from "@/features/tourism-crowd/presentation/hooks/use-jeju-tourism-crowd-query";

interface CrowdedSpot {
  rank: number;
  attractionName: string;
  districtName: string;
  concentrationRate: number;
}

const RANK_LABEL = ["01", "02", "03", "04", "05"] as const;

const RANK_COLORS = [
  { text: "#C9A24B", bg: "#FEF9ED", border: "#C9A24B" },
  { text: "#8A8175", bg: "#FAF7F1", border: "#ECE7DD" },
  { text: "#8A8175", bg: "#FAF7F1", border: "#ECE7DD" },
  { text: "#8A8175", bg: "white", border: "#ECE7DD" },
  { text: "#8A8175", bg: "white", border: "#ECE7DD" },
] as const;

export function Top5CrowdedToday() {
  const { data, isLoading } = useJejuTourismCrowdQuery();

  const { spots, dateLabel } = useMemo(() => {
    if (!data) return { spots: [], dateLabel: "" };

    const todayKey = toDateKey(new Date());
    const todayForecasts = (data.forecasts ?? []).filter(
      (f) => f.baseDate === todayKey,
    );

    if (todayForecasts.length > 0) {
      const sorted = [...todayForecasts]
        .sort((a, b) => b.concentrationRate - a.concentrationRate)
        .slice(0, 5);
      return {
        spots: sorted.map((f, i) => ({
          rank: i + 1,
          attractionName: f.attractionName,
          districtName: f.districtName,
          concentrationRate: f.concentrationRate,
        })),
        dateLabel: formatDateLabel(todayKey),
      };
    }

    if (data.summaries?.length) {
      const sorted = [...data.summaries]
        .sort((a, b) => b.latestRate - a.latestRate)
        .slice(0, 5);
      return {
        spots: sorted.map((s, i) => ({
          rank: i + 1,
          attractionName: s.attractionName,
          districtName: s.districtName,
          concentrationRate: s.latestRate,
        })),
        dateLabel: formatDateLabel(sorted[0]?.latestBaseDate ?? ""),
      };
    }

    return { spots: [], dateLabel: "" };
  }, [data]);

  const maxRate = spots[0]?.concentrationRate ?? 1;

  return (
    <section className="rounded-xl border border-[#ECE7DD] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#A9685C]/10">
            <Flame className="size-4 text-[#A9685C]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8A8175]">실시간</p>
            <h2 className="text-base font-bold leading-tight text-[#2E2A24]">
              오늘 혼잡 TOP 5
            </h2>
          </div>
        </div>
        {dateLabel && (
          <span className="rounded-md bg-[#ECE7DD] px-2.5 py-1 text-xs font-semibold text-[#8A8175]">
            {dateLabel}
          </span>
        )}
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : spots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#D8D0C2] bg-[#FAF7F1] px-4 py-8 text-center text-sm font-semibold text-[#8A8175]">
          혼잡도 데이터를 불러오는 중입니다.
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {spots.map((spot) => (
            <SpotItem key={spot.rank} spot={spot} maxRate={maxRate} />
          ))}
        </ol>
      )}
    </section>
  );
}

function SpotItem({
  spot,
  maxRate,
}: {
  spot: CrowdedSpot;
  maxRate: number;
}) {
  const color = RANK_COLORS[spot.rank - 1];
  const barWidth = `${Math.round((spot.concentrationRate / maxRate) * 100)}%`;
  const isFirst = spot.rank === 1;

  return (
    <li
      className="overflow-hidden rounded-lg border px-4 py-3 transition-colors"
      style={{
        borderColor: color.border,
        backgroundColor: color.bg,
        borderLeftWidth: isFirst ? "3px" : "1px",
        borderLeftColor: isFirst ? color.border : color.border,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="shrink-0 font-mono text-sm font-black"
          style={{ color: color.text }}
        >
          {RANK_LABEL[spot.rank - 1]}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`truncate font-bold text-[#2E2A24] ${isFirst ? "text-base" : "text-sm"}`}
              >
                {spot.attractionName}
              </p>
              <p className="mt-0.5 text-xs text-[#8A8175]">
                {spot.districtName}
              </p>
            </div>
            <span
              className={`shrink-0 font-black tabular-nums ${isFirst ? "text-base" : "text-sm"}`}
              style={{ color: isFirst ? "#A9685C" : "#4E7A5E" }}
            >
              {spot.concentrationRate.toFixed(1)}%
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ECE7DD]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: barWidth,
                backgroundColor: isFirst ? "#A9685C" : "#4E7A5E",
                opacity: 1 - (spot.rank - 1) * 0.12,
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

function SkeletonList() {
  return (
    <ol className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-lg border border-[#ECE7DD] bg-[#FAF7F1] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 w-6 rounded bg-[#ECE7DD]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-[#ECE7DD]" />
              <div className="h-1.5 rounded-full bg-[#ECE7DD]" />
            </div>
            <div className="h-4 w-12 rounded bg-[#ECE7DD]" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDateLabel(dateKey: string): string {
  if (dateKey.length !== 8) return dateKey;
  const year = dateKey.slice(0, 4);
  const month = dateKey.slice(4, 6);
  const day = dateKey.slice(6);
  return `${year}.${month}.${day}`;
}
