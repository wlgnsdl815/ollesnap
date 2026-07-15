import { NextResponse, type NextRequest } from "next/server";

import { createFoodSpotRepository } from "@/features/photo-spot/data/repository/food-spot.repository.impl";
import { getJejuFoodSpotsPage } from "@/features/photo-spot/domain/usecase/get-jeju-food-spots-page";
import type { JejuCityFilter } from "@/features/photo-spot/domain/jeju-region";

const foodSpotRepository = createFoodSpotRepository();

function parseCityFilter(value: string | null): JejuCityFilter | undefined {
  return value === "jeju-city" || value === "seogwipo" ? value : undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pageNo = Math.max(1, Number(searchParams.get("page")) || 1);
  const cityFilter = parseCityFilter(searchParams.get("region"));

  const page = await getJejuFoodSpotsPage(foodSpotRepository, pageNo, cityFilter);

  return NextResponse.json(page);
}
