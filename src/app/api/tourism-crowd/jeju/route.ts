import { NextResponse } from "next/server";

import {
  getJejuTourismCrowdForecasts,
  summarizeTourismCrowdForecasts,
} from "@/features/tourism-crowd/domain/usecases/get-jeju-tourism-crowd.usecase";

export const revalidate = 21600;

export async function GET() {
  const result = await getJejuTourismCrowdForecasts();
  const summaries = summarizeTourismCrowdForecasts(result.forecasts);

  return NextResponse.json({
    ...result,
    summaries,
  });
}
