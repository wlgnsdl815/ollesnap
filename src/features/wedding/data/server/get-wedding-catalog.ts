import "server-only";

import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import type {
  SnapArtist,
  SnapPackage,
  SnapPackageAddOn,
  SnapScene,
  StylingProduct,
  StylingProductAddOn,
  StylingProductKind,
  StylingProductPrice,
  StylingShop,
  WeddingCatalog,
  WeddingTone,
} from "../../domain/entity/wedding-catalog.entity";
import { WEDDING_SCENES, WEDDING_TONES } from "../../domain/wedding-taxonomy";

// 카탈로그는 시드 데이터라 거의 바뀌지 않는다 — 짧은 주기는 만료 직후
// 첫 방문자의 탭 전환을 수 초씩 늦추므로 1시간으로 둔다.
const CATALOG_REVALIDATE_SECONDS = 3600;

interface SnapArtistRow {
  id: string;
  studio_name: string;
  artist_name: string;
  introduction: string;
  profile_image_url: string;
  portfolio_image_urls: string[] | null;
  scenes: SnapScene[];
  tones: WeddingTone[];
  keywords: string[];
  package_summary: string;
  price_from: number;
  duration_hours: number;
  delivery_days: number;
  reservation_lead_days: number;
}

interface SnapPackageRow {
  id: string;
  artist_id: string;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  outfit_count_minimum: number;
  outfit_count_maximum: number;
  scene_count: number;
  color_corrected_count: number;
  basic_retouched_count: number;
  selected_retouched_count: number;
  included_services: string[];
  recommended_for: string[];
  add_ons: SnapPackageAddOn[];
}

interface StylingShopRow {
  id: string;
  name: string;
  introduction: string;
  keywords: string[];
  inventory_description: string;
}

interface StylingProductRow {
  shop_id: string;
  id: string;
  kind: StylingProductKind;
  name: string;
  description: string;
  regular_price: StylingProductPrice;
  partner_price: StylingProductPrice | null;
  included_services: string[];
  add_ons: StylingProductAddOn[];
  notice: string | null;
}

interface PartnerRow {
  artist_id: string;
  shop_id: string;
}

// 카탈로그는 공개 읽기 데이터라 세션(쿠키) 없는 클라이언트로 조회한다.
// unstable_cache 안에서는 cookies()를 쓸 수 없기 때문이기도 하다.
function createCatalogClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

async function fetchWeddingCatalog(): Promise<WeddingCatalog> {
  const supabase = createCatalogClient();
  const [artistsResult, packagesResult, shopsResult, productsResult, partnersResult] =
    await Promise.all([
      supabase.from("snap_artists").select("*").order("sort_order"),
      supabase.from("snap_packages").select("*").order("sort_order"),
      supabase.from("styling_shops").select("*").order("sort_order"),
      supabase.from("styling_products").select("*").order("sort_order"),
      supabase.from("artist_styling_partners").select("artist_id, shop_id"),
    ]);
  const firstError =
    artistsResult.error ??
    packagesResult.error ??
    shopsResult.error ??
    productsResult.error ??
    partnersResult.error;

  if (firstError) {
    throw new Error(`웨딩 카탈로그를 불러오지 못했습니다: ${firstError.message}`);
  }

  const artistRows = (artistsResult.data ?? []) as SnapArtistRow[];
  const packageRows = (packagesResult.data ?? []) as SnapPackageRow[];
  const shopRows = (shopsResult.data ?? []) as StylingShopRow[];
  const productRows = (productsResult.data ?? []) as StylingProductRow[];
  const partnerRows = (partnersResult.data ?? []) as PartnerRow[];

  const packagesByArtistId = groupBy(packageRows, (row) => row.artist_id);
  const productsByShopId = groupBy(productRows, (row) => row.shop_id);
  const shopIdsByArtistId = groupBy(partnerRows, (row) => row.artist_id);
  const artistIdsByShopId = groupBy(partnerRows, (row) => row.shop_id);

  const artists: SnapArtist[] = artistRows.map((row) => ({
    id: row.id,
    studioName: row.studio_name,
    artistName: row.artist_name,
    introduction: row.introduction,
    profileImageUrl: row.profile_image_url,
    portfolioImageUrls: row.portfolio_image_urls ?? [],
    scenes: row.scenes,
    tones: row.tones,
    keywords: row.keywords,
    packageSummary: row.package_summary,
    priceFrom: row.price_from,
    durationHours: row.duration_hours,
    deliveryDays: row.delivery_days,
    reservationLeadDays: row.reservation_lead_days,
    packages: (packagesByArtistId.get(row.id) ?? []).map(mapSnapPackage),
    partnerStylingShopIds: (shopIdsByArtistId.get(row.id) ?? []).map(
      (partner) => partner.shop_id,
    ),
  }));

  const stylingShops: StylingShop[] = shopRows.map((row) => ({
    id: row.id,
    name: row.name,
    introduction: row.introduction,
    keywords: row.keywords,
    inventoryDescription: row.inventory_description,
    partnerArtistIds: (artistIdsByShopId.get(row.id) ?? []).map(
      (partner) => partner.artist_id,
    ),
    products: (productsByShopId.get(row.id) ?? []).map(mapStylingProduct),
  }));

  return {
    scenes: WEDDING_SCENES,
    tones: WEDDING_TONES,
    artists,
    stylingShops,
  };
}

function mapSnapPackage(row: SnapPackageRow): SnapPackage {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    durationHours: row.duration_hours,
    outfitCountMinimum: row.outfit_count_minimum,
    outfitCountMaximum: row.outfit_count_maximum,
    sceneCount: row.scene_count,
    colorCorrectedCount: row.color_corrected_count,
    basicRetouchedCount: row.basic_retouched_count,
    selectedRetouchedCount: row.selected_retouched_count,
    includedServices: row.included_services,
    recommendedFor: row.recommended_for,
    addOns: row.add_ons,
  };
}

function mapStylingProduct(row: StylingProductRow): StylingProduct {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    description: row.description,
    regularPrice: row.regular_price,
    partnerPrice: row.partner_price ?? undefined,
    includedServices: row.included_services,
    addOns: row.add_ons,
    notice: row.notice ?? undefined,
  };
}

function groupBy<Item>(
  items: Item[],
  getKey: (item: Item) => string,
): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();

  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key);

    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}

export const getWeddingCatalog = unstable_cache(
  fetchWeddingCatalog,
  ["wedding-catalog"],
  { revalidate: CATALOG_REVALIDATE_SECONDS },
);
