import { NextResponse, type NextRequest } from "next/server";

import { createPhotoSpotRepository } from "@/features/photo-spot/data/repository/photo-spot.repository.impl";
import { getJejuSnapSpotsPage } from "@/features/photo-spot/domain/usecase/get-jeju-snap-spots-page";

const photoSpotRepository = createPhotoSpotRepository();

export async function GET(request: NextRequest) {
  const pageNo = Math.max(
    1,
    Number(request.nextUrl.searchParams.get("page")) || 1,
  );

  const page = await getJejuSnapSpotsPage(photoSpotRepository, pageNo);

  return NextResponse.json(page);
}
