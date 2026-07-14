import type { SnapScene, WeddingTone } from "./wedding-catalog.entity";

export type PlanningPriority = "artist" | "styling" | "budget" | "schedule";

export type DateReadiness = "unknown" | "season" | "month" | "fixed";

export type StayLength = "unknown" | "two-nights" | "three-nights";

export interface PreparationGuideAnswers {
  scene?: SnapScene;
  tone?: WeddingTone;
  priority?: PlanningPriority;
  dateReadiness: DateReadiness;
  stayLength: StayLength;
}

export interface PreparationGuideResult {
  stageLabel: string;
  title: string;
  description: string;
  decideNow: string[];
  decideWithPhotographer: string[];
  nextActionLabel: string;
}
