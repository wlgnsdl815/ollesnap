import type { PhotoSpot } from "@/features/photo-spot/domain/entity/photo-spot.entity";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 홈 히어로에 걸 수상작을 하루 한 장, 날짜 기반으로 결정적으로 고른다.
// 새로고침마다 바뀌지 않고, 한국 시간 기준 자정에 다음 사진으로 넘어간다.
export function pickDailyHeroSpot(
  spots: PhotoSpot[],
  now: Date,
): PhotoSpot | null {
  const candidates = spots.filter((spot) => spot.fullImageUrl);

  if (candidates.length === 0) {
    return null;
  }

  const kstDayNumber = Math.floor((now.getTime() + KST_OFFSET_MS) / DAY_MS);

  return candidates[kstDayNumber % candidates.length];
}
