"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PlannerDateStep } from "./planner-date-step";
import { PlannerSnapStep } from "./planner-snap-step";

const TOTAL_STEPS = 4;

export function NewPlannerFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const title =
    currentStep === 1
      ? "제주 전체 일정을 선택해주세요"
      : "스냅작가를 선택해주세요";

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <Link
          href="/planner"
          className="flex min-h-11 w-fit items-center gap-1 rounded-full pr-3 text-sm font-bold text-muted-foreground active:bg-muted"
        >
          <ChevronLeft className="size-5" />
          플래너
        </Link>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-primary">새 일정 만들기</p>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">
              {currentStep} / {TOTAL_STEPS}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <h1 className="text-2xl font-black leading-tight text-balance">
            {title}
          </h1>
        </div>
      </header>

      {currentStep === 1 ? (
        <PlannerDateStep onContinue={() => setCurrentStep(2)} />
      ) : (
        <PlannerSnapStep />
      )}
    </div>
  );
}
