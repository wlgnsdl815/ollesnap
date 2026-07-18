import { NextResponse } from "next/server";

import { getUserWeddingState } from "@/features/account/data/server/user-wedding.server";

// 정적 캐시되는 목록 화면에서 사용자별 "일정에 담음" 표시를 붙이기 위한
// 최소 정보(spotId, kind)만 내려준다. 비로그인에는 빈 목록.
export async function GET() {
  const userWeddingState = await getUserWeddingState();

  return NextResponse.json(
    {
      items: userWeddingState.travelPlanItems.map((item) => ({
        spotId: item.spotId,
        kind: item.kind,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
