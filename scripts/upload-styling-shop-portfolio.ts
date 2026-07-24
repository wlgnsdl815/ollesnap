// public/images/dress의 로컬 테스트 사진을 Supabase Storage에 업로드하고
// 정렬 순서 상위 N개 샵의 styling_shops.portfolio_image_urls를 채우는 일회성 스크립트.
//   pnpm dlx tsx scripts/upload-styling-shop-portfolio.ts

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createAdminClient } from "../src/shared/supabase/admin";

const BUCKET = "styling-shop-portfolio";
const IMAGES_PER_SHOP = 3;
const LOCAL_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/dress",
);

async function main() {
  const supabase = createAdminClient();

  const files = readdirSync(LOCAL_DIR)
    .filter((name) => name.endsWith(".webp"))
    .sort((a, b) => Number(a.replace(".webp", "")) - Number(b.replace(".webp", "")));

  const shopCount = Math.floor(files.length / IMAGES_PER_SHOP);

  const { data: shops, error: shopsError } = await supabase
    .from("styling_shops")
    .select("id")
    .order("sort_order")
    .limit(shopCount);

  if (shopsError) {
    throw new Error(`샵 목록 조회 실패: ${shopsError.message}`);
  }

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });

  if (bucketError && !bucketError.message.includes("already exists")) {
    throw new Error(`버킷 생성 실패: ${bucketError.message}`);
  }

  for (let shopIndex = 0; shopIndex < shops.length; shopIndex += 1) {
    const shop = shops[shopIndex];
    const shopFiles = files.slice(
      shopIndex * IMAGES_PER_SHOP,
      (shopIndex + 1) * IMAGES_PER_SHOP,
    );
    const publicUrls: string[] = [];

    for (let photoIndex = 0; photoIndex < shopFiles.length; photoIndex += 1) {
      const localFile = shopFiles[photoIndex];
      const objectPath = `${shop.id}/${photoIndex + 1}.webp`;
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
      .from("styling_shops")
      .update({ portfolio_image_urls: publicUrls })
      .eq("id", shop.id);

    if (updateError) {
      throw new Error(`DB 업데이트 실패 (${shop.id}): ${updateError.message}`);
    }

    console.log(`${shop.id}: ${publicUrls.length}장 연결 완료`);
  }

  console.log(`완료: 샵 ${shops.length}곳, 사진 ${files.length}장`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
