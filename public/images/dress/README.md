# 드레스샵 사진

`src/features/wedding/data/mock/dress-seeds.mock.ts`에 대응하는 드레스샵별 사진입니다. (현재 `StylingSeed`에는 이미지 필드가 없어서, 사진이 채워지면 `mock-seed.entity.ts`에 필드 추가와 연결 작업이 필요합니다.)

## 파일명 규칙

`{shopId}-{순번}.jpg` — 샵당 1~3장 정도 권장.

예: `ore-dress-1.jpg`, `ore-dress-2.jpg`

`shopId` 목록 (총 30곳):

```
ore-dress, sodam-dress, midnight-dress, camellia-dress, shore-dress,
atelier-nine, bloom-dress, meadow-bridal, silk-route, dear-dress,
white-fern, muse-bridal, day-one-dress, soft-hanger, river-dress,
house-of-veil, pearl-closet, reveal-dress, studio-lily, line-bridal,
morrow-dress, petal-room, blank-bridal, seafoam-dress, slow-bride,
noble-dress, sand-closet, veiling-day, dawn-dress, mode-atelier
```

## 이미지 스펙

- 비율: 4:5 세로
- 해상도: 1200×1500px 내외
- 용량: 장당 500KB 이하 (WebP 또는 JPEG q80 권장)
