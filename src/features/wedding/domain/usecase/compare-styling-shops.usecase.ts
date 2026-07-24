import type { StylingShop } from "../entity/wedding-catalog.entity";
import { formatPriceFrom } from "./wedding-catalog.usecase";

export interface StylingShopComparisonValue {
  lines: string[];
  isBest: boolean;
}

export interface StylingShopComparisonRow {
  label: string;
  values: StylingShopComparisonValue[];
}

/**
 * 찜한 스드메 샵들을 같은 기준으로 견주는 행 목록.
 */
export function buildStylingShopComparisonRows(
  shops: StylingShop[],
): StylingShopComparisonRow[] {
  return [
    rankedRow(
      "패키지 최저가",
      shops,
      (shop) => cheapestPrice(shop, "package"),
      (shop) => [formatPriceFrom(cheapestPrice(shop, "package"))],
      "lowest",
    ),
    rankedRow(
      "단품 최저가",
      shops,
      (shop) => cheapestPrice(shop, "single"),
      (shop) => [formatPriceFrom(cheapestPrice(shop, "single"))],
      "lowest",
    ),
    plainRow("구성", shops, (shop) => [
      `패키지 ${countProducts(shop, "package")}개`,
      `단품 ${countProducts(shop, "single")}개`,
    ]),
    plainRow("키워드", shops, (shop) => shop.keywords),
  ];
}

function cheapestPrice(
  shop: StylingShop,
  kind: "package" | "single",
): number {
  const prices = shop.products
    .filter((product) => product.kind === kind)
    .map((product) => product.regularPrice.total);

  return prices.length > 0 ? Math.min(...prices) : 0;
}

function countProducts(shop: StylingShop, kind: "package" | "single"): number {
  return shop.products.filter((product) => product.kind === kind).length;
}

function plainRow(
  label: string,
  shops: StylingShop[],
  toLines: (shop: StylingShop) => string[],
): StylingShopComparisonRow {
  return {
    label,
    values: shops.map((shop) => ({ lines: toLines(shop), isBest: false })),
  };
}

function rankedRow(
  label: string,
  shops: StylingShop[],
  toNumber: (shop: StylingShop) => number,
  toLines: (shop: StylingShop) => string[],
  betterWhen: "lowest" | "highest",
): StylingShopComparisonRow {
  const numbers = shops.map(toNumber);
  const bestNumber =
    betterWhen === "lowest" ? Math.min(...numbers) : Math.max(...numbers);
  const hasDifference = numbers.some((number) => number !== bestNumber);

  return {
    label,
    values: shops.map((shop, index) => ({
      lines: toLines(shop),
      isBest: hasDifference && numbers[index] === bestNumber,
    })),
  };
}
