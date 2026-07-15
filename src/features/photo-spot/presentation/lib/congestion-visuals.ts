import type { CongestionLevel } from "../../domain/entity/congestion-forecast.entity";

// success/error 전용 토큰이 globals.css에 없어 기존에 유선 연결된 chart-2(#0da796, design.md의
// success 색과 동일)와 destructive를 재사용한다 — 새 채도색을 추가하지 않기 위함.
export const CONGESTION_DOT_CLASS: Record<CongestionLevel, string> = {
  low: "bg-chart-2",
  medium: "bg-muted-foreground/50",
  high: "bg-destructive",
};

export const CONGESTION_TEXT_CLASS: Record<CongestionLevel, string> = {
  low: "text-chart-2",
  medium: "text-muted-foreground",
  high: "text-destructive",
};
