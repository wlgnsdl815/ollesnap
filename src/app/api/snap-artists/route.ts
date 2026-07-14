import { NextResponse, type NextRequest } from "next/server";

import { getSnapArtistPage } from "@/features/wedding/data/server/get-snap-artist-page";
import { weddingCatalogMock } from "@/features/wedding/data/mock/wedding-catalog.mock";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scene = weddingCatalogMock.scenes.find(
    (option) => option.id === searchParams.get("scene"),
  )?.id;
  const tone = weddingCatalogMock.tones.find(
    (option) => option.id === searchParams.get("tone"),
  )?.id;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  return NextResponse.json(getSnapArtistPage({ page, scene, tone }));
}
