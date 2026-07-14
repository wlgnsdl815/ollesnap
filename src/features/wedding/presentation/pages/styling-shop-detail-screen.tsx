"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Handshake,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type {
  SnapArtist,
  StylingProduct,
  StylingProductKind,
  StylingShop,
} from "../../domain/entity/wedding-catalog.entity";
import {
  formatPrice,
  getStylingProductPrice,
  isPartnerStylingShop,
} from "../../domain/usecase/wedding-catalog.usecase";
import { CatalogDemoNotice } from "../components/catalog-demo-notice";

interface StylingShopDetailScreenProps {
  shop: StylingShop;
  artist?: SnapArtist;
  selectedSnapPackageId?: string;
}

export function StylingShopDetailScreen({
  shop,
  artist,
  selectedSnapPackageId,
}: StylingShopDetailScreenProps) {
  const [selectedKind, setSelectedKind] = useState<StylingProductKind>("package");
  const products = shop.products.filter((product) => product.kind === selectedKind);
  const isPartner = artist ? isPartnerStylingShop(shop, artist) : false;
  const backHref = artist
    ? `/artists?tab=styling&artist=${artist.id}${selectedSnapPackageId ? `&package=${selectedSnapPackageId}` : ""}`
    : "/artists?tab=styling";

  return (
    <div className="flex flex-col gap-7 pb-4">
      <header className="flex flex-col gap-4">
        <Link
          href={backHref}
          className="flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-muted-foreground active:text-foreground"
        >
          <ChevronLeft className="size-5" />
          스드메 샵
        </Link>
        <div className="flex flex-col gap-2">
          {isPartner ? (
            <p className="flex items-center gap-1 text-sm font-semibold text-primary">
              <Handshake className="size-4" />
              {artist?.artistName} 작가 제휴 샵
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
            {shop.name}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">{shop.introduction}</p>
        </div>
      </header>

      <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">준비 구성</p>
        <p className="text-sm leading-6 text-muted-foreground">
          {shop.inventoryDescription}
        </p>
      </section>

      {isPartner ? (
        <section className="flex items-start gap-3 rounded-2xl bg-accent p-4">
          <Handshake className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-6 text-secondary-foreground">
            {artist?.studioName}으로 진행하면 패키지와 헤어·메이크업 상품에 제휴가가 적용돼요.
          </p>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <ProductKindButton
          isActive={selectedKind === "package"}
          label="패키지"
          onClick={() => setSelectedKind("package")}
        />
        <ProductKindButton
          isActive={selectedKind === "single"}
          label="기본 단품"
          onClick={() => setSelectedKind("single")}
        />
      </div>

      <section className="flex flex-col gap-3">
        {products.map((product) => (
          <StylingProductCard
            key={product.id}
            shop={shop}
            product={product}
            artist={artist}
            selectedSnapPackageId={selectedSnapPackageId}
          />
        ))}
      </section>

      <CatalogDemoNotice />
    </div>
  );
}

interface ProductKindButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function ProductKindButton({ isActive, label, onClick }: ProductKindButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-lg px-3 text-sm font-semibold ${
        isActive
          ? "bg-foreground text-primary-foreground"
          : "text-secondary-foreground active:bg-card"
      }`}
    >
      {label}
    </button>
  );
}

interface StylingProductCardProps {
  shop: StylingShop;
  product: StylingProduct;
  artist?: SnapArtist;
  selectedSnapPackageId?: string;
}

function StylingProductCard({
  shop,
  product,
  artist,
  selectedSnapPackageId,
}: StylingProductCardProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const selectedPrice = getStylingProductPrice(shop, product, artist);
  const hasPartnerPrice =
    Boolean(artist && product.partnerPrice && isPartnerStylingShop(shop, artist));
  const plannerHref = createPlannerHref(
    shop,
    product,
    artist,
    selectedSnapPackageId,
    selectedOptionIds,
  );

  function toggleOption(optionId: string) {
    setSelectedOptionIds((currentIds) =>
      currentIds.includes(optionId)
        ? currentIds.filter((id) => id !== optionId)
        : [...currentIds, optionId],
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">{product.name}</p>
          <p className="text-base font-semibold">{product.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          {hasPartnerPrice ? <p className="text-xs font-semibold text-primary">제휴가</p> : null}
          <p className="text-base font-semibold text-primary">
            {formatProductPrice(selectedPrice.total, selectedPrice.maximumTotal)}
          </p>
          {hasPartnerPrice ? (
            <p className="text-xs text-muted-foreground line-through">
              {formatProductPrice(product.regularPrice.total, product.regularPrice.maximumTotal)}
            </p>
          ) : null}
        </div>
      </div>

      <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground">
        {selectedPrice.taxIncluded
          ? "VAT 포함 가격"
          : "VAT 별도 · 실제 상담가를 확인해주세요."}
      </p>

      <ul className="flex flex-col gap-2">
        {product.includedServices.map((service) => (
          <li key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 shrink-0 text-primary" />
            {service}
          </li>
        ))}
      </ul>

      {product.addOns.length > 0 ? (
        <details className="group rounded-xl border border-border bg-muted/40">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-semibold text-secondary-foreground">
            선택 옵션 {product.addOns.length}개
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="flex flex-col gap-2 border-t border-border p-3">
            {product.addOns.map((addOn) => {
              const isSelected = selectedOptionIds.includes(addOn.id);

              return (
                <button
                  key={addOn.id}
                  type="button"
                  onClick={() => toggleOption(addOn.id)}
                  className={`flex min-h-12 items-start gap-3 rounded-lg border p-3 text-left ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-card active:bg-muted"
                  }`}
                >
                  <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}>
                    {isSelected ? <Check className="size-3" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{addOn.name}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {addOn.description}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    +{formatPrice(addOn.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </details>
      ) : null}

      {product.notice ? (
        <p className="text-xs leading-5 text-muted-foreground">{product.notice}</p>
      ) : null}

      <Link
        href={plannerHref}
        className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-semibold text-primary-foreground active:bg-primary/90"
      >
        {artist ? "이 구성으로 촬영팀 만들기" : "작가를 고른 뒤 이 구성 선택"}
        {artist ? <ArrowRight className="size-4" /> : <Plus className="size-4" />}
      </Link>
    </article>
  );
}

function createPlannerHref(
  shop: StylingShop,
  product: StylingProduct,
  artist: SnapArtist | undefined,
  selectedSnapPackageId: string | undefined,
  selectedOptionIds: string[],
): string {
  if (!artist) {
    return "/artists";
  }

  const searchParams = new URLSearchParams({
    artist: artist.id,
    stylingShop: shop.id,
    stylingProduct: product.id,
  });

  if (selectedSnapPackageId) {
    searchParams.set("package", selectedSnapPackageId);
  }

  if (selectedOptionIds.length > 0) {
    searchParams.set("stylingOptions", selectedOptionIds.join(","));
  }

  return `/planner?${searchParams.toString()}`;
}

function formatProductPrice(price: number, maximumPrice: number | undefined): string {
  if (maximumPrice) {
    return `${formatPrice(price)}~${formatPrice(maximumPrice)}`;
  }

  return formatPrice(price);
}
