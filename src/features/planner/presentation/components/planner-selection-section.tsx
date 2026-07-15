"use client";

import { CalendarDays, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  SERVICE_SLOTS,
  type ServiceSlot,
  type ServiceSlotId,
} from "@/features/planner/domain/entity/service-slot.entity";
import { formatPlannerDateLabel } from "@/features/planner/domain/planner-date-formatter";

export function PlannerSelectionSection() {
  const [selectedDate, setSelectedDate] = useState("");
  const [activeServiceSlotId, setActiveServiceSlotId] =
    useState<ServiceSlotId>("snap");
  const activeServiceSlot =
    SERVICE_SLOTS.find((slot) => slot.id === activeServiceSlotId) ??
    SERVICE_SLOTS[0];
  const selectedDateLabel = formatPlannerDateLabel(selectedDate);
  const completedCount = selectedDate ? 1 : 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-foreground p-4 text-primary-foreground shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-xs font-semibold text-primary-foreground/70">
              준비 상태
            </p>
            <h2 className="truncate text-lg font-black">
              {selectedDateLabel}
            </h2>
          </div>
          <span className="flex min-h-9 shrink-0 items-center rounded-full bg-white/15 px-3 text-xs font-bold">
            {completedCount} / 3 선택
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <SummaryPill isActive={Boolean(selectedDate)} label="날짜" />
          <SummaryPill isActive={false} label="스냅" />
          <SummaryPill isActive={false} label="스드메" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading eyebrow="01" title="날짜 선택" />
        <label className="flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm">
          <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs font-semibold text-muted-foreground">
              촬영 예정일
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="min-h-8 w-full bg-transparent text-base font-bold text-foreground outline-none"
            />
          </span>
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading eyebrow="02" title="스냅 작가 선택" />
        <button
          type="button"
          className="flex min-h-20 w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm active:bg-muted"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-base font-black">스냅 작가를 선택하세요</span>
            <span className="text-sm leading-5 text-muted-foreground">
              작가 데이터가 연결되면 포트폴리오와 예약 가능 일정이 표시됩니다.
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading eyebrow="03" title="스드메 선택" />
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-3 pb-1">
            {SERVICE_SLOTS.map((slot) => (
              <ServiceSlotCard
                key={slot.id}
                slot={slot}
                isActive={slot.id === activeServiceSlotId}
                onSelect={() => setActiveServiceSlotId(slot.id)}
              />
            ))}
          </div>
        </div>
        <div className="flex min-h-24 items-center gap-3 rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-sm font-black">
              {activeServiceSlot.label} 후보를 불러올 준비가 됐어요
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              실제 업체 데이터 연결 후 이 영역에서 비교하고 선택할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface SummaryPillProps {
  isActive: boolean;
  label: string;
}

function SummaryPill({ isActive, label }: SummaryPillProps) {
  return (
    <span
      className={`flex min-h-9 items-center justify-center gap-1 rounded-full px-2 text-xs font-bold ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-white/10 text-primary-foreground/70"
      }`}
    >
      {isActive ? <Check className="size-3.5" /> : null}
      {label}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
        {eyebrow}
      </span>
      <h2 className="text-lg font-black">{title}</h2>
    </div>
  );
}

interface ServiceSlotCardProps {
  slot: ServiceSlot;
  isActive: boolean;
  onSelect: () => void;
}

function ServiceSlotCard({ slot, isActive, onSelect }: ServiceSlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-28 w-[15.5rem] shrink-0 snap-start flex-col justify-between rounded-2xl border p-4 text-left shadow-sm ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground"
      }`}
    >
      <span className="flex items-start justify-end">
        {isActive ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
            <Check className="size-4" />
          </span>
        ) : null}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-lg font-black">{slot.label}</span>
        <span
          className={`text-xs leading-5 ${
            isActive ? "text-primary-foreground/75" : "text-muted-foreground"
          }`}
        >
          {slot.description}
        </span>
      </span>
    </button>
  );
}
