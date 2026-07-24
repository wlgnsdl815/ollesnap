// 홈 화면 "인기 작가/샵" 노출용 saved_count를 데모용으로 채우는 일회성 스크립트.
// 실제 찜 집계가 아니라, 정렬 순서 상위(=포트폴리오 사진이 있는) 항목이
// 자연스럽게 인기 상단에 오도록 가중치를 둔 랜덤값을 넣는다.
//   pnpm dlx tsx scripts/seed-saved-counts.ts

import { createAdminClient } from "../src/shared/supabase/admin";

const ARTIST_PHOTO_COUNT = 10;
const SHOP_PHOTO_COUNT = 20;

const HIGH_RANGE: [number, number] = [150, 400];
const LOW_RANGE: [number, number] = [5, 120];

function randomInRange([min, max]: [number, number]): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const supabase = createAdminClient();

  const { data: artists, error: artistsError } = await supabase
    .from("snap_artists")
    .select("id")
    .order("sort_order");

  if (artistsError) {
    throw new Error(`작가 목록 조회 실패: ${artistsError.message}`);
  }

  for (let index = 0; index < artists.length; index += 1) {
    const savedCount = randomInRange(
      index < ARTIST_PHOTO_COUNT ? HIGH_RANGE : LOW_RANGE,
    );
    const { error } = await supabase
      .from("snap_artists")
      .update({ saved_count: savedCount })
      .eq("id", artists[index].id);

    if (error) {
      throw new Error(`작가 saved_count 업데이트 실패 (${artists[index].id}): ${error.message}`);
    }
  }

  console.log(`작가 ${artists.length}명 saved_count 시드 완료`);

  const { data: shops, error: shopsError } = await supabase
    .from("styling_shops")
    .select("id")
    .order("sort_order");

  if (shopsError) {
    throw new Error(`샵 목록 조회 실패: ${shopsError.message}`);
  }

  for (let index = 0; index < shops.length; index += 1) {
    const savedCount = randomInRange(
      index < SHOP_PHOTO_COUNT ? HIGH_RANGE : LOW_RANGE,
    );
    const { error } = await supabase
      .from("styling_shops")
      .update({ saved_count: savedCount })
      .eq("id", shops[index].id);

    if (error) {
      throw new Error(`샵 saved_count 업데이트 실패 (${shops[index].id}): ${error.message}`);
    }
  }

  console.log(`샵 ${shops.length}곳 saved_count 시드 완료`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
