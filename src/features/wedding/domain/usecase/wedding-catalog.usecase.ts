import type {
  SnapArtist,
  SnapPackage,
  SnapScene,
  SnapTeam,
  StylingKind,
  StylingPartner,
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
  dressId?: string;
  makeupId?: string;
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

export function getStylingPartners(
  catalog: WeddingCatalog,
  kind: StylingKind,
): StylingPartner[] {
  return catalog.stylingPartners.filter((partner) => partner.kind === kind);
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

export function getCompatiblePartners(
  catalog: WeddingCatalog,
  artist: SnapArtist,
  kind: StylingKind,
): StylingPartner[] {
  return getStylingPartners(catalog, kind).filter((partner) =>
    artist.compatiblePartnerIds.includes(partner.id),
  );
}

export function resolveSnapTeam(
  catalog: WeddingCatalog,
  selection: SnapTeamSelectionInput,
): SnapTeam {
  const artist = findSnapArtist(catalog, selection.artistId);
  const snapPackage = findSnapPackage(artist, selection.packageId);
  const compatibleDresses = getCompatiblePartners(catalog, artist, "dress");
  const compatibleMakeup = getCompatiblePartners(catalog, artist, "makeup");
  const dress =
    compatibleDresses.find((partner) => partner.id === selection.dressId) ??
    compatibleDresses[0];
  const makeup =
    compatibleMakeup.find((partner) => partner.id === selection.makeupId) ??
    compatibleMakeup[0];

  return {
    artist,
    snapPackage,
    dress,
    makeup,
    totalPriceFrom: snapPackage.price + dress.priceFrom + makeup.priceFrom,
  };
}

export function formatPriceFrom(price: number): string {
  return `${formatPrice(price)}부터`;
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ko-KR").format(price / 10_000)}만원`;
}
