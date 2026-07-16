import type {
  SnapArtist,
  SnapPackage,
  SnapScene,
  SnapTeam,
  StylingProduct,
  StylingProductAddOn,
  StylingProductPrice,
  StylingShop,
  WeddingCatalog,
  WeddingTone,
} from "../entity/wedding-catalog.entity";

export interface ArtistFilter {
  scene?: SnapScene;
  tone?: WeddingTone;
}

export interface SnapTeamSelectionInput {
  artistId?: string;
  packageId?: string;
  stylingShopId?: string;
  stylingProductId?: string;
  stylingOptionIds?: string[];
}

export function filterSnapArtists(
  artists: SnapArtist[],
  filter: ArtistFilter,
): SnapArtist[] {
  return artists.filter((artist) => {
    const matchesScene = !filter.scene || artist.scenes.includes(filter.scene);
    const matchesTone = !filter.tone || artist.tones.includes(filter.tone);

    return matchesScene && matchesTone;
  });
}

export function findSnapArtist(
  catalog: WeddingCatalog,
  artistId: string | undefined,
): SnapArtist {
  return (
    catalog.artists.find((artist) => artist.id === artistId) ??
    catalog.artists[0]
  );
}

export function findStylingShop(
  catalog: WeddingCatalog,
  stylingShopId: string | undefined,
  artist?: SnapArtist,
): StylingShop {
  const shops = artist
    ? getStylingShopsForArtist(catalog, artist)
    : catalog.stylingShops;

  return (
    shops.find((shop) => shop.id === stylingShopId) ??
    shops[0] ??
    catalog.stylingShops[0]
  );
}

export function findSnapPackage(
  artist: SnapArtist,
  packageId: string | undefined,
): SnapPackage {
  return (
    artist.packages.find((snapPackage) => snapPackage.id === packageId) ??
    artist.packages[0]
  );
}

export function findStylingProduct(
  shop: StylingShop,
  stylingProductId: string | undefined,
): StylingProduct {
  return (
    shop.products.find((product) => product.id === stylingProductId) ??
    shop.products[0]
  );
}

export function getArtistDisplayScene(
  artist: SnapArtist,
  selectedScene: SnapScene | undefined,
): SnapScene {
  return selectedScene && artist.scenes.includes(selectedScene)
    ? selectedScene
    : artist.scenes[0];
}

export function getArtistDisplayTone(
  artist: SnapArtist,
  selectedTone: WeddingTone | undefined,
): WeddingTone {
  return selectedTone && artist.tones.includes(selectedTone)
    ? selectedTone
    : artist.tones[0];
}

export function getSceneLabel(
  catalog: WeddingCatalog,
  scene: SnapScene,
): string {
  return catalog.scenes.find((item) => item.id === scene)?.label ?? "제주 풍경";
}

export function getToneLabel(
  catalog: WeddingCatalog,
  tone: WeddingTone,
): string {
  return catalog.tones.find((item) => item.id === tone)?.label ?? "내추럴";
}

export function isPartnerStylingShop(
  shop: StylingShop,
  artist: SnapArtist,
): boolean {
  return shop.partnerArtistIds.includes(artist.id);
}

export function getStylingShopsForArtist(
  catalog: WeddingCatalog,
  artist: SnapArtist,
): StylingShop[] {
  const partnerShops = catalog.stylingShops.filter((shop) =>
    isPartnerStylingShop(shop, artist),
  );
  const otherShops = catalog.stylingShops.filter(
    (shop) => !isPartnerStylingShop(shop, artist),
  );

  return [...partnerShops, ...otherShops];
}

export function getStylingProductPrice(
  shop: StylingShop,
  product: StylingProduct,
  artist: SnapArtist | undefined,
): StylingProductPrice {
  if (artist && product.partnerPrice && isPartnerStylingShop(shop, artist)) {
    return product.partnerPrice;
  }

  return product.regularPrice;
}

export function getStylingProductAddOns(
  product: StylingProduct,
  selectedOptionIds: string[] | undefined,
): StylingProductAddOn[] {
  if (!selectedOptionIds) {
    return [];
  }

  return product.addOns.filter((addOn) => selectedOptionIds.includes(addOn.id));
}

export function resolveSnapTeam(
  catalog: WeddingCatalog,
  selection: SnapTeamSelectionInput,
): SnapTeam {
  const artist = findSnapArtist(catalog, selection.artistId);
  const snapPackage = findSnapPackage(artist, selection.packageId);
  const stylingShop = findStylingShop(catalog, selection.stylingShopId, artist);
  const stylingProduct = findStylingProduct(
    stylingShop,
    selection.stylingProductId,
  );
  const stylingPrice = getStylingProductPrice(stylingShop, stylingProduct, artist);
  const stylingAddOns = getStylingProductAddOns(
    stylingProduct,
    selection.stylingOptionIds,
  );
  const hasPartnerStylingPrice =
    Boolean(stylingProduct.partnerPrice) && isPartnerStylingShop(stylingShop, artist);

  return {
    artist,
    snapPackage,
    stylingShop,
    stylingProduct,
    stylingPrice,
    stylingAddOns,
    hasPartnerStylingPrice,
    totalPriceFrom:
      snapPackage.price +
      stylingPrice.total +
      stylingAddOns.reduce((total, addOn) => total + addOn.price, 0),
  };
}

export function formatPriceFrom(price: number): string {
  return `${formatPrice(price)}부터`;
}

export function formatPrice(price: number): string {
  const roundedPrice = Math.round(price / 10_000) * 10_000;

  return `${new Intl.NumberFormat("ko-KR").format(roundedPrice / 10_000)}만원`;
}
