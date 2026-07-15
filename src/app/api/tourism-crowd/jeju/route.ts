import { NextResponse } from "next/server";

import { createCongestionRepository } from "@/features/photo-spot/data/repository/congestion.repository.impl";

export const revalidate = 21600;

const congestionRepository = createCongestionRepository();

export async function GET() {
  const forecasts = await congestionRepository.getForecastPool();

  return NextResponse.json({ forecasts });
}
