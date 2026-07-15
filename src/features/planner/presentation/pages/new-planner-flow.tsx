"use client";

import { useState } from "react";

import {
  getPlannerStepTitle,
  TOTAL_PLANNER_STEPS,
  type PlannerFlowStep,
} from "@/features/planner/domain/planner-flow";

import { PlannerDateStep } from "../components/planner-date-step";
import { PlannerSnapStep } from "../components/planner-snap-step";

export function NewPlannerFlow() {
  const [currentStep, setCurrentStep] = useState<PlannerFlowStep>(1);
  const title = getPlannerStepTitle(currentStep);

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-4">
            <span className="shrink-0 text-xs font-bold text-muted-foreground">
              {currentStep} / {TOTAL_PLANNER_STEPS}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(currentStep / TOTAL_PLANNER_STEPS) * 100}%` }}
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
