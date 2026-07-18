// weddingCatalogMock을 시드 SQL 마이그레이션으로 변환하는 일회성 스크립트.
// 데이터 수정이 필요하면 목 파일을 고친 뒤 다시 실행한다:
//   pnpm dlx tsx scripts/generate-catalog-seed.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { weddingCatalogMock } from "../src/features/wedding/data/mock/wedding-catalog.mock";

const OUTPUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../supabase/migrations/202607180002_seed_wedding_catalog.sql",
);

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlNullableString(value: string | undefined | null): string {
  return value == null ? "null" : sqlString(value);
}

function sqlTextArray(values: string[]): string {
  if (values.length === 0) {
    return "'{}'::text[]";
  }

  return `array[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlJson(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlNullableJson(value: unknown): string {
  return value == null ? "null" : sqlJson(value);
}

const lines: string[] = [
  "-- weddingCatalogMock에서 생성된 카탈로그 시드입니다.",
  "-- 직접 수정하지 말고 scripts/generate-catalog-seed.ts를 다시 실행하세요.",
  "",
];

const { artists, stylingShops } = weddingCatalogMock;

// 제휴 관계는 작가/샵 양쪽 배열로 이중 저장돼 있다.
// 정션 테이블 하나로 수렴하기 전에 두 배열이 대칭인지 검증한다.
for (const artist of artists) {
  for (const shopId of artist.partnerStylingShopIds) {
    const shop = stylingShops.find((item) => item.id === shopId);

    if (!shop || !shop.partnerArtistIds.includes(artist.id)) {
      throw new Error(
        `제휴 관계 불일치: ${artist.id} → ${shopId} 방향이 샵 쪽에 없습니다.`,
      );
    }
  }
}

for (const shop of stylingShops) {
  for (const artistId of shop.partnerArtistIds) {
    const artist = artists.find((item) => item.id === artistId);

    if (!artist || !artist.partnerStylingShopIds.includes(shop.id)) {
      throw new Error(
        `제휴 관계 불일치: ${shop.id} → ${artistId} 방향이 작가 쪽에 없습니다.`,
      );
    }
  }
}

artists.forEach((artist, artistIndex) => {
  lines.push(
    "insert into public.snap_artists (id, studio_name, artist_name, introduction, profile_image_url, scenes, tones, keywords, package_summary, price_from, duration_hours, delivery_days, reservation_lead_days, sort_order) values (" +
      [
        sqlString(artist.id),
        sqlString(artist.studioName),
        sqlString(artist.artistName),
        sqlString(artist.introduction),
        sqlString(artist.profileImageUrl),
        sqlTextArray(artist.scenes),
        sqlTextArray(artist.tones),
        sqlTextArray(artist.keywords),
        sqlString(artist.packageSummary),
        artist.priceFrom,
        artist.durationHours,
        artist.deliveryDays,
        artist.reservationLeadDays,
        artistIndex,
      ].join(", ") +
      ");",
  );

  artist.packages.forEach((snapPackage, packageIndex) => {
    lines.push(
      "insert into public.snap_packages (id, artist_id, name, description, price, duration_hours, outfit_count_minimum, outfit_count_maximum, scene_count, color_corrected_count, basic_retouched_count, selected_retouched_count, included_services, recommended_for, add_ons, sort_order) values (" +
        [
          sqlString(snapPackage.id),
          sqlString(artist.id),
          sqlString(snapPackage.name),
          sqlString(snapPackage.description),
          snapPackage.price,
          snapPackage.durationHours,
          snapPackage.outfitCountMinimum,
          snapPackage.outfitCountMaximum,
          snapPackage.sceneCount,
          snapPackage.colorCorrectedCount,
          snapPackage.basicRetouchedCount,
          snapPackage.selectedRetouchedCount,
          sqlTextArray(snapPackage.includedServices),
          sqlTextArray(snapPackage.recommendedFor),
          sqlJson(snapPackage.addOns),
          packageIndex,
        ].join(", ") +
        ");",
    );
  });
});

lines.push("");

stylingShops.forEach((shop, shopIndex) => {
  lines.push(
    "insert into public.styling_shops (id, name, introduction, keywords, inventory_description, sort_order) values (" +
      [
        sqlString(shop.id),
        sqlString(shop.name),
        sqlString(shop.introduction),
        sqlTextArray(shop.keywords),
        sqlString(shop.inventoryDescription),
        shopIndex,
      ].join(", ") +
      ");",
  );

  shop.products.forEach((product, productIndex) => {
    lines.push(
      "insert into public.styling_products (shop_id, id, kind, name, description, regular_price, partner_price, included_services, add_ons, notice, sort_order) values (" +
        [
          sqlString(shop.id),
          sqlString(product.id),
          sqlString(product.kind),
          sqlString(product.name),
          sqlString(product.description),
          sqlJson(product.regularPrice),
          sqlNullableJson(product.partnerPrice),
          sqlTextArray(product.includedServices),
          sqlJson(product.addOns),
          sqlNullableString(product.notice),
          productIndex,
        ].join(", ") +
        ");",
    );
  });
});

lines.push("");

for (const shop of stylingShops) {
  for (const artistId of shop.partnerArtistIds) {
    lines.push(
      `insert into public.artist_styling_partners (artist_id, shop_id) values (${sqlString(artistId)}, ${sqlString(shop.id)});`,
    );
  }
}

lines.push("");
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, lines.join("\n"));

console.log(
  `시드 생성 완료: 작가 ${artists.length}명, 샵 ${stylingShops.length}곳 → ${OUTPUT_PATH}`,
);
