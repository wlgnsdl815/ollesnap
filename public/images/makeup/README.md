# 메이크업샵 사진

`src/features/wedding/data/mock/makeup-seeds.mock.ts`에 대응하는 메이크업샵별 사진입니다. (현재 `StylingSeed`에는 이미지 필드가 없어서, 사진이 채워지면 `mock-seed.entity.ts`에 필드 추가와 연결 작업이 필요합니다.)

## 파일명 규칙

`{shopId}-{순번}.jpg` — 샵당 1~3장 정도 권장.

예: `mood-on-makeup-1.jpg`, `mood-on-makeup-2.jpg`

`shopId` 목록 (총 30곳):

```
mood-on-makeup, ongyeol-makeup, soft-grain-makeup, dew-dawn-makeup, frame-makeup,
peach-hour, nude-note, hush-makeup, flower-face, calm-stroke,
one-scene, mellow-makeup, breeze-hair, muse-face, lumen-makeup,
taupe-studio, june-makeup, scene-on, paper-makeup, olive-stroke,
fine-line-makeup, satin-makeup, lilac-room, afterglow-makeup, sand-makeup,
petit-hair, morrow-makeup, pure-scene, falling-light, mild-makeup
```

## 이미지 스펙

- 비율: 4:5 세로 (얼굴 클로즈업은 상단 여백 넉넉히)
- 해상도: 1200×1500px 내외
- 용량: 장당 500KB 이하 (WebP 또는 JPEG q80 권장)
