import type {
  SnapArtist,
  SnapPackage,
  SnapPackageAddOn,
  StylingProduct,
  StylingShop,
  WeddingCatalog,
} from "../../domain/entity/wedding-catalog.entity";

import { artistSeeds } from "./artist-seeds.mock";
import { dressSeeds } from "./dress-seeds.mock";
import { makeupSeeds } from "./makeup-seeds.mock";
import type { ArtistSeed, StylingSeed } from "./mock-seed.entity";

// 제휴 전 공모전 데모용 카탈로그입니다. 실제 입점/승인 데이터로 각 데이터 파일만 교체합니다.

const STYLING_SHOP_IDS = dressSeeds.map((seed) => `shop-${seed.id}`);

const artists = artistSeeds.map((seed, index): SnapArtist => {
  const packages = createSnapPackages(seed, index);
  const representativePackage = packages[0];

  return {
    ...seed,
    profileImageUrl: getArtistProfileImageUrl(index),
    packageSummary: `${representativePackage.durationHours}시간 촬영 · 색감 보정본 ${representativePackage.colorCorrectedCount}장 · 인물 보정 ${representativePackage.basicRetouchedCount + representativePackage.selectedRetouchedCount}장`,
    priceFrom: representativePackage.price,
    durationHours: representativePackage.durationHours,
    deliveryDays: 18 + (index % 5) * 3,
    reservationLeadDays: 30 + (index % 4) * 15,
    packages,
    partnerStylingShopIds: getPartnerStylingShopIds(index),
  };
});

const stylingShops: StylingShop[] = dressSeeds.map((dressSeed, index) =>
  createStylingShop(dressSeed, makeupSeeds[index], index),
);

export const weddingCatalogMock: WeddingCatalog = {
  scenes: [
    {
      id: "oreum",
      label: "오름·초원",
      description: "바람과 넓은 초록을 담아요",
    },
    { id: "sea", label: "바다·해안", description: "파도와 수평선이 어울려요" },
    {
      id: "ranch",
      label: "목장·들판",
      description: "여유로운 제주 풍경이에요",
    },
    {
      id: "stone-wall",
      label: "돌담·마을",
      description: "제주다운 결을 남겨요",
    },
    {
      id: "forest",
      label: "숲길·동백",
      description: "차분하고 깊은 초록이에요",
    },
    {
      id: "sunset",
      label: "노을·야간",
      description: "빛이 바뀌는 순간을 담아요",
    },
  ],
  tones: [
    { id: "natural", label: "내추럴", description: "있는 그대로의 온도" },
    { id: "warm", label: "따뜻한 색감", description: "햇살 같은 결" },
    { id: "classic", label: "클래식", description: "시간이 지나도 단정하게" },
    { id: "film", label: "필름 무드", description: "조금 더 선명한 취향" },
  ],
  artists,
  stylingShops,
};

// 제휴 전 데모 단계의 작가 프로필 사진입니다. 실제 입점 데이터로 교체 시
// DB에 저장된 작가별 URL로 대체합니다 (artistSeeds 순서와 1:1 대응, 01~30).
function getArtistProfileImageUrl(index: number): string {
  const fileNumber = String(index + 1).padStart(2, "0");
  return `/images/profile/${fileNumber}.png`;
}

function getPartnerStylingShopIds(index: number): string[] {
  return [
    STYLING_SHOP_IDS[index % STYLING_SHOP_IDS.length],
    STYLING_SHOP_IDS[(index + 7) % STYLING_SHOP_IDS.length],
    STYLING_SHOP_IDS[(index + 14) % STYLING_SHOP_IDS.length],
    STYLING_SHOP_IDS[(index + 21) % STYLING_SHOP_IDS.length],
  ];
}

function createStylingShop(
  dressSeed: StylingSeed,
  makeupSeed: StylingSeed,
  index: number,
): StylingShop {
  const partnerArtistIds = [
    artistSeeds[index % artistSeeds.length].id,
    artistSeeds[(index + 9) % artistSeeds.length].id,
    artistSeeds[(index + 16) % artistSeeds.length].id,
    artistSeeds[(index + 23) % artistSeeds.length].id,
  ];

  return {
    id: STYLING_SHOP_IDS[index],
    name: dressSeed.name,
    introduction: `${dressSeed.introduction} ${makeupSeed.introduction}`,
    keywords: [...dressSeed.keywords.slice(0, 2), makeupSeed.keywords[0]],
    inventoryDescription:
      index === 0
        ? "드레스는 종류와 사이즈별로 약 600벌을 보유하고, 턱시도는 95·100·105 사이즈를 기본으로 준비해요."
        : `야외 촬영용 드레스와 신랑 예복, ${makeupSeed.name}의 헤어·메이크업을 한곳에서 준비할 수 있어요.`,
    partnerArtistIds,
    products: createStylingProducts(index),
  };
}

function createStylingProducts(index: number): StylingProduct[] {
  const packagePriceOffset = index * 10_000;
  const isFirstShop = index === 0;
  const partnerDiscount = isFirstShop ? 110_000 : 90_000 + (index % 3) * 10_000;
  const packageProducts = [
    createStylingPackage("A", 700_000 + packagePriceOffset, partnerDiscount, [
      "신랑·신부 헤어 메이크업",
      "메인 롱드레스 1벌",
      "턱시도 1벌",
    ]),
    createStylingPackage("B", 750_000 + packagePriceOffset, partnerDiscount, [
      "신랑·신부 헤어 메이크업",
      "메인 롱드레스 1벌",
      "빈티지 드레스 1벌",
      "턱시도 1벌",
    ]),
    createStylingPackage("C", 860_000 + packagePriceOffset, partnerDiscount, [
      "신랑·신부 헤어 메이크업",
      "메인 롱드레스 2벌",
      "빈티지 드레스 1벌",
      "턱시도 1벌",
    ]),
    createStylingPackage("Special", 1_320_000 + packagePriceOffset, partnerDiscount, [
      "신랑·신부 헤어 메이크업",
      "메인 롱드레스 3벌 · 턱시도 2벌",
      "생화 부케 세트 · 셔츠 · 구두 · 베일 · 이어링",
    ]),
  ];

  return [
    ...packageProducts,
    {
      id: `single-dress-${index}`,
      kind: "single",
      name: "드레스 대여",
      description: "드레스 한 벌을 취향과 촬영 씬에 맞춰 골라요.",
      regularPrice: {
        total: 150_000,
        maximumTotal: 400_000,
        vatAmount: 0,
        taxIncluded: false,
      },
      includedServices: ["드레스 1벌", "기본 피팅", "사이즈 상담"],
      addOns: createStylingAddOns(index, false),
      notice: "드레스 디자인과 등급에 따라 금액이 달라지고 VAT는 별도예요.",
    },
    {
      id: `single-tuxedo-${index}`,
      kind: "single",
      name: "턱시도 대여",
      description: "신랑 예복 상·하의 한 벌을 준비해요.",
      regularPrice: { total: 110_000, vatAmount: 0, taxIncluded: false },
      includedServices: ["턱시도 상·하의 세트", "95·100·105 사이즈 피팅"],
      addOns: [
        {
          id: `shirt-${index}`,
          name: "셔츠 대여",
          price: 10_000,
          description: "턱시도와 어울리는 기본 셔츠를 함께 대여해요.",
        },
      ],
      notice: "110 사이즈는 일부 기본 색상으로 상담 후 준비할 수 있어요.",
    },
    {
      id: `single-hair-makeup-${index}`,
      kind: "single",
      name: "신랑·신부 헤어 메이크업",
      description: "두 분 기준의 촬영용 헤어·메이크업 구성입니다.",
      regularPrice: { total: 390_000, vatAmount: 40_000, taxIncluded: true },
      partnerPrice: { total: 330_000, vatAmount: 30_000, taxIncluded: true },
      includedServices: ["신부 메이크업 · 헤어", "신랑 메이크업 · 헤어", "수정 키트"],
      addOns: createStylingAddOns(index, true),
      notice: "신부님만 진행해도 기본 비용은 동일할 수 있어 상담에서 확인해요.",
    },
  ];
}

function createStylingPackage(
  name: string,
  total: number,
  partnerDiscount: number,
  includedServices: string[],
): StylingProduct {
  const vatAmount = Math.round(total / 100_000) * 10_000;
  const partnerTotal = total - partnerDiscount;
  const partnerVatAmount = Math.round(partnerTotal / 100_000) * 10_000;

  return {
    id: `package-${name.toLowerCase()}`,
    kind: "package",
    name: `패키지 ${name}`,
    description: "드레스와 예복, 헤어·메이크업을 한 번에 준비하는 구성입니다.",
    regularPrice: { total, vatAmount, taxIncluded: true },
    partnerPrice: {
      total: partnerTotal,
      vatAmount: partnerVatAmount,
      taxIncluded: true,
    },
    includedServices,
    addOns: [
      {
        id: `studio-${name.toLowerCase()}`,
        name: "스튜디오 촬영 옵션",
        price: name === "Special" ? 180_000 : 150_000,
        description: "날씨 변수에 대비한 실내 스튜디오 촬영을 추가해요.",
      },
    ],
    notice: "턱시도와 빈티지 드레스는 구성에 따라 교차 변경할 수 있어요.",
  };
}

function createStylingAddOns(
  index: number,
  includesHair: boolean,
) {
  const addOns = [
    {
      id: `hanbok-${index}`,
      name: "신랑·신부 한복 세트",
      price: 330_000,
      description: "두 분 한복과 기본 소품을 함께 준비해요.",
    },
  ];

  if (includesHair) {
    addOns.push({
      id: `flower-hair-${index}`,
      name: "생화 헤어장식",
      price: 30_000,
      description: "촬영 톤에 맞춘 생화 장식을 더해요.",
    });
  }

  return addOns;
}

function createSnapPackages(seed: ArtistSeed, index: number): SnapPackage[] {
  const packageNames = [
    ["라이트", "시그니처", "제주 데이"],
    ["원 씬", "투 씬", "올데이"],
    ["퍼스트 컷", "스토리 컷", "롱 스테이"],
    ["브리즈", "웨이브", "호라이즌"],
    ["소프트", "무드", "아카이브"],
  ][index % 5];
  const basePrice =
    650_000 + (index % 6) * 70_000 + Math.floor(index / 6) * 60_000;
  const lightDuration = index % 3 === 0 ? 1.5 : 2;
  const signatureDuration = index % 2 === 0 ? 3.5 : 4;
  const fullDuration = index % 3 === 1 ? 5.5 : 5;

  return [
    {
      id: `${seed.id}-light`,
      name: packageNames[0],
      description: "한 가지 제주 씬에 집중해 가볍고 자연스럽게 남기는 촬영이에요.",
      price: basePrice,
      durationHours: lightDuration,
      outfitCountMinimum: 1,
      outfitCountMaximum: 2,
      sceneCount: 1,
      colorCorrectedCount: 500 + (index % 5) * 50,
      basicRetouchedCount: 8 + (index % 4) * 2,
      selectedRetouchedCount: 5,
      includedServices: [
        "작가 1인 촬영",
        "색감 보정본 전체 제공",
        "촬영 전 온라인 브리핑",
      ],
      recommendedFor: ["셀프웨딩", "짧은 제주 여행", "한 가지 씬 집중"],
      addOns: createPackageAddOns(index, "light"),
    },
    {
      id: `${seed.id}-signature`,
      name: packageNames[1],
      description: "의상과 장면을 나누어 제주에서의 하루를 가장 균형 있게 담아요.",
      price: basePrice + 360_000 + (index % 3) * 30_000,
      durationHours: signatureDuration,
      outfitCountMinimum: 2,
      outfitCountMaximum: 3,
      sceneCount: 2 + (index % 2),
      colorCorrectedCount: 1_100 + (index % 5) * 100,
      basicRetouchedCount: 15 + (index % 4) * 2,
      selectedRetouchedCount: 10 + (index % 3) * 2,
      includedServices: [
        "작가 1인 촬영",
        "색감 보정본 전체 제공",
        "인물 보정본 제공",
        "촬영 전 온라인 브리핑",
      ],
      recommendedFor: ["본식 전 웨딩 스냅", "2~3벌 의상", "제주 대표 씬 조합"],
      addOns: createPackageAddOns(index, "signature"),
    },
    {
      id: `${seed.id}-day`,
      name: packageNames[2],
      description: "낮의 초록부터 노을까지, 여유 있게 여러 장면을 이어가는 촬영이에요.",
      price: basePrice + 700_000 + (index % 4) * 40_000,
      durationHours: fullDuration,
      outfitCountMinimum: 3,
      outfitCountMaximum: 4,
      sceneCount: 4 + (index % 2),
      colorCorrectedCount: 1_800 + (index % 5) * 100,
      basicRetouchedCount: 25 + (index % 4) * 3,
      selectedRetouchedCount: 20 + (index % 3) * 3,
      includedServices: [
        "작가 1인 촬영",
        "색감 보정본 전체 제공",
        "인물 보정본 제공",
        "촬영 전 온라인 브리핑",
        "노을 또는 야간 씬 조율",
      ],
      recommendedFor: ["여유 있는 제주 체류", "3~4벌 의상", "낮부터 노을까지"],
      addOns: createPackageAddOns(index, "day"),
    },
  ];
}

function createPackageAddOns(
  index: number,
  packageSize: "light" | "signature" | "day",
): SnapPackageAddOn[] {
  const addOns: SnapPackageAddOn[] = [
    {
      id: `film-${packageSize}`,
      name: "필름 카메라 추가",
      price: packageSize === "light" ? 80_000 : 120_000,
      description: "디지털 촬영과 별도로 필름 질감의 셀렉 컷을 더해요.",
    },
  ];

  if (index % 4 === 0) {
    addOns.push({
      id: `drone-${packageSize}`,
      name: "드론 하이라이트",
      price: packageSize === "day" ? 220_000 : 180_000,
      description: "제주 풍경을 넓게 담는 짧은 드론 하이라이트를 추가해요.",
      notice:
        "비행 가능 구역, 날씨, 풍속, 현장 허가 조건에 따라 진행 여부가 달라질 수 있어요.",
    });
  }

  if (index % 4 === 1) {
    addOns.push({
      id: `night-${packageSize}`,
      name: "야간 조명 씬",
      price: 100_000,
      description: "해가 진 뒤 조명 장비를 활용한 한 장면을 추가해요.",
    });
  }

  if (index % 4 === 2) {
    addOns.push({
      id: `reels-${packageSize}`,
      name: "세로 릴스 스케치",
      price: 130_000,
      description: "촬영 중 주요 순간을 세로 영상으로 짧게 기록해요.",
    });
  }

  if (index % 4 === 3) {
    addOns.push({
      id: `album-${packageSize}`,
      name: "미니 포토북",
      price: 90_000,
      description: "선택한 사진으로 작은 포토북을 제작해요.",
    });
  }

  return addOns;
}
