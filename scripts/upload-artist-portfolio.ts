// public/images/portfolio의 로컬 테스트 사진을 Supabase Storage에 업로드하고
// 정렬 순서 상위 N명의 snap_artists.portfolio_image_urls를 채우는 일회성 스크립트.
//   pnpm dlx tsx scripts/upload-artist-portfolio.ts

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createAdminClient } from "../src/shared/supabase/admin";

const BUCKET = "artist-portfolio";
const IMAGES_PER_ARTIST = 3;
const LOCAL_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/portfolio",
);

async function main() {
  const supabase = createAdminClient();

  const files = readdirSync(LOCAL_DIR)
    .filter((name) => name.endsWith(".webp"))
    .sort((a, b) => Number(a.replace(".webp", "")) - Number(b.replace(".webp", "")));

  const artistCount = Math.floor(files.length / IMAGES_PER_ARTIST);

  const { data: artists, error: artistsError } = await supabase
    .from("snap_artists")
    .select("id")
    .order("sort_order")
    .limit(artistCount);

  if (artistsError) {
    throw new Error(`작가 목록 조회 실패: ${artistsError.message}`);
  }

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });

  if (bucketError && !bucketError.message.includes("already exists")) {
    throw new Error(`버킷 생성 실패: ${bucketError.message}`);
  }

  for (let artistIndex = 0; artistIndex < artists.length; artistIndex += 1) {
    const artist = artists[artistIndex];
    const artistFiles = files.slice(
      artistIndex * IMAGES_PER_ARTIST,
      (artistIndex + 1) * IMAGES_PER_ARTIST,
    );
    const publicUrls: string[] = [];

    for (let photoIndex = 0; photoIndex < artistFiles.length; photoIndex += 1) {
      const localFile = artistFiles[photoIndex];
      const objectPath = `${artist.id}/${photoIndex + 1}.webp`;
      const fileBuffer = readFileSync(join(LOCAL_DIR, localFile));

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, fileBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`업로드 실패 (${objectPath}): ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(objectPath);

      publicUrls.push(publicUrlData.publicUrl);
    }

    const { error: updateError } = await supabase
      .from("snap_artists")
      .update({ portfolio_image_urls: publicUrls })
      .eq("id", artist.id);

    if (updateError) {
      throw new Error(`DB 업데이트 실패 (${artist.id}): ${updateError.message}`);
    }

    console.log(`${artist.id}: ${publicUrls.length}장 연결 완료`);
  }

  console.log(`완료: 작가 ${artists.length}명, 사진 ${files.length}장`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
