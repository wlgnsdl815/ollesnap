import { NextResponse, type NextRequest } from "next/server";

import { getSnapArtistPage } from "@/features/wedding/data/server/get-snap-artist-page";
import {
  WEDDING_SCENES,
  WEDDING_TONES,
} from "@/features/wedding/domain/wedding-taxonomy";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scene = WEDDING_SCENES.find(
    (option) => option.id === searchParams.get("scene"),
  )?.id;
  const tone = WEDDING_TONES.find(
    (option) => option.id === searchParams.get("tone"),
  )?.id;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  return NextResponse.json(await getSnapArtistPage({ page, scene, tone }));
}
