# 작가 포트폴리오 사진

`ArtistPortfolioGallery`(`src/features/wedding/presentation/components/artist-portfolio-gallery.tsx`)에서 쓰는 작가별 포트폴리오 사진입니다.

## 파일명 규칙

`{artistId}-{순번}.jpg` — 작가당 3~5장 정도 권장.

예: `mare-snap-1.jpg`, `mare-snap-2.jpg`, `mare-snap-3.jpg`

`artistId` 목록 (`src/features/wedding/data/mock/artist-seeds.mock.ts` 기준, 총 30명):

```
mare-snap, afternoon-island, mono-jeju, between-studio, breeze-film,
morning-oreum, sand-letter, hue-studio, green-hour, blue-room,
jeju-frame, slow-moment, sunny-side, still-jeju, little-wave,
season-note, field-day, warm-stone, blank-film, cobalt-snap,
camellia-day, open-sky, soft-shadow, island-letter, fern-studio,
horizon-day, quiet-peak, daylight-archive, after-rain, golden-hour-jeju
```

## 이미지 스펙

- 비율: 4:5 세로
- 해상도: 1200×1500px 내외
- 용량: 장당 500KB 이하 (WebP 또는 JPEG q80 권장)

사진을 채워 넣으면 `wedding-catalog.mock.ts`에 `portfolioImageUrls` 매핑을 연결해줄게.
