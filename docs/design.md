---
id: ollesnap
name: Ollesnap
display_name_kr: 올레스냅
country: KR
category: travel
homepage: ""
primary_color: "#ff6000"
logo:
  type: file
  slug: "/logo.svg"
verified: "2026-07-11"
added: "2026-07-11"
theme_source:
  name: "LikeLion Design System (borrowed)"
  url: "https://designsystem.likelion.net/"
  note: >
    Sections 1-9 (color, typography, spacing, radius, shadow, component specs) are
    borrowed verbatim from LikeLion's public design system as ollesnap's starting
    visual theme. Sections 10-15 (voice, brand narrative, principles, personas,
    states, motion) are ollesnap's own — not LikeLion's.
omd: "0.1-adapted"
tokens:
  source: borrowed-from-likelion
  extracted: "2026-07-11"
  note: "Identical to LikeLion DS tokens. See src/app/globals.css for the mapping onto shadcn CSS variables."
  colors:
    primary: "#ff6000"
    primary-hover: "#cc4d00"
    primary-tint: "#ffdfcc"
    primary-faint: "#ffefe5"
    ink: "#222222"
    gray-950: "#191f28"
    neutral-900: "#191c1f"
    black: "#000000"
    label: "#333d4b"
    muted: "#737373"
    faint: "#a3a3a3"
    disabled: "#b1b8c0"
    border: "#d1d6dc"
    hairline: "#e5e7ea"
    hairline-alt: "#e5e5e5"
    surface: "#f3f4f6"
    surface-alt: "#f5f5f5"
    surface-faint: "#f9fafb"
    canvas: "#ffffff"
    cream: "#fcf4ee"
    cream-alt: "#fff8e4"
    yellow: "#ffb700"
    success: "#0da796"
    error: "#f64c4c"
  typography:
    family: { primary: "Pretendard", note: "Pretendard Variable" }
    display-d1:  { size: 52, weight: 600, lineHeight: 1.30, use: "Largest display headline" }
    display-d2:  { size: 44, weight: 600, lineHeight: 1.30, use: "Secondary display headline" }
    display-d3:  { size: 32, weight: 600, lineHeight: 1.30, use: "Section display" }
    heading-h1:  { size: 31, weight: 600, lineHeight: 1.30, use: "Page heading" }
    subtitle:    { size: 17, weight: 600, lineHeight: 1.30, tracking: -0.3, use: "Subtitle / emphasis lead" }
    body:        { size: 16, weight: 400, lineHeight: 1.50, use: "Standard reading text / nav" }
    body-sm:     { size: 15, weight: 400, lineHeight: 1.60, tracking: -0.3, use: "Chip / tab / tag labels" }
    button:      { size: 16, weight: 600, lineHeight: 1.00, use: "Button label" }
    caption:     { size: 13, weight: 400, lineHeight: 1.50, use: "Captions, metadata" }
  spacing: { xs: 2, sm: 4, base: 8, md: 12, lg: 16, xl: 20, xxl: 24, block: 32, section: 48 }
  rounded: { xs: 2, sm: 4, md: 6, base: 8, lg: 12, xl: 16, xxl: 24, pill: 999, full: 9999 }
  shadow:
    none: "none"
    hairline-ring: "rgba(0,0,0,0.01) 0px 0px 0px 1px"
  components:
    button-primary: { type: button, bg: "#ff6000", fg: "#ffffff", radius: "6px", height: "48px", padding: "0 16px", font: "16px / 600", states: "hover #cc4d00 · disabled bg #f3f4f6 fg #b1b8c0", use: "Primary action" }
    button-neutral: { type: button, bg: "#191c1f", fg: "#ffffff", radius: "6px", height: "48px", padding: "0 16px", font: "16px / 600", use: "Secondary dark / neutral action" }
    button-assistive: { type: button, bg: "#f3f4f6", fg: "#333d4b", radius: "6px", height: "48px", padding: "0 16px", font: "16px / 600", use: "Tertiary / low-emphasis action" }
    textfield: { type: input, bg: "#ffffff", fg: "#000000", border: "1px solid #d1d6dc", radius: "8px", height: "48px", padding: "0 12px", font: "16px / 400", states: "focus border #333d4b", use: "Text input, 15px placeholder #333d4b" }
    chip-selected: { type: badge, bg: "#ff6000", fg: "#ffffff", radius: "999px", height: "30px", padding: "0 12px", font: "15px / 400", use: "Selected filter chip (filled) — e.g. spot category filters" }
    chip-outline: { type: badge, bg: "#ffefe5", fg: "#ff6000", border: "1px solid #ff6000", radius: "999px", height: "30px", padding: "0 12px", font: "15px / 400", use: "Selected chip, tinted outline variant" }
    tab-pill: { type: tab, bg: "#ffffff", fg: "#333d4b", border: "1px solid #d1d6dc", radius: "999px", height: "40px", padding: "0 16px", font: "15px / 400", active: "#ffffff text on #191f28 fill", use: "Segmented pill tab — e.g. 스팟/플래너 switch" }
    badge-count: { type: badge, bg: "#ff6000", fg: "#ffffff", radius: "10px", height: "20px", padding: "0 6.5px", font: "16px / 400", use: "Notification / count badge" }
    tag: { type: badge, bg: "#ff6000", fg: "#ffffff", radius: "4px", height: "28px", padding: "0 8px", font: "15px / 400", use: "Category tag — e.g. 코스, 맛집, 자연" }
    card-warm: { type: card, bg: "#fcf4ee", fg: "#222222", radius: "16px", padding: "40px", use: "Warm promo card" }
    card-plain: { type: card, bg: "#ffffff", fg: "#222222", border: "1px solid #e5e5e5", radius: "12px", use: "Spot / course card with hairline outline" }
  components_harvested: true
---

## 1. Visual Theme & Atmosphere

Ollesnap(올레스냅)은 제주 올레길 여행자를 위한 스팟 탐색·일정 플래너 앱으로, 2026 관광데이터 활용 공모전 제출작이다. 심사가 모바일 위주로 이뤄지는 만큼 UI는 390px 기준 뷰포트에서 먼저 완성되고, 큰 화면은 그 위에 자연스럽게 확장된다. 시각 테마는 LikeLion Design System에서 빌려왔다: 순백(`#ffffff`) 캔버스 위에 단일 채도의 오렌지(`#ff6000`)가 "다음 행동"을 표시하고, 나머지는 차분한 블루그레이 뉴트럴과 따뜻한 크림 서피스로 구성된다. 그림자는 거의 쓰지 않고, 톤 구분과 헤어라인으로 깊이를 표현한다.

**Key Characteristics:**
- 단일 오렌지(`#ff6000`)를 액션 컬러로만 사용 — 스팟 저장, 일정 추가 같은 핵심 액션에 집중
- Pretendard 전역 사용: 헤드라인은 weight 600, 본문/UI는 weight 400
- 블루그레이 뉴트럴 톤(`#191f28` → `#333d4b` → `#d1d6dc` → `#f9fafb`)으로 텍스트/보더 구성
- 크림 톤(`#fcf4ee`, `#fff8e4`)으로 프로모/하이라이트 카드에 온기 부여
- 거의 그림자 없는 플랫 시스템 — 헤어라인과 틴트 서피스로 구분
- 친근한 라운드: 버튼 6px, 인풋 8px, 카드 12–16px, 칩/탭은 완전 필(pill)

## 2. Color Palette & Roles

### Primary
- **Primary Orange** (`#ff6000`): 저장/추가/다음 단계 같은 핵심 액션 전용 색상.
- **Orange Hover** (`#cc4d00`): 프라이머리 버튼 hover/pressed.
- **Orange Tint** (`#ffdfcc`): 은은한 강조 배경.
- **Orange Faint** (`#ffefe5`): 선택된 칩의 outline 배경.

### Text
- **Ink** (`#222222`): 기본 헤딩/본문 텍스트.
- **Gray-950** (`#191f28`): 강조 텍스트, 선택된 탭의 다크 필.
- **Label** (`#333d4b`): 보조 텍스트, 인풋 포커스 보더.
- **Muted** (`#737373`) / **Faint** (`#a3a3a3`): 저강조 텍스트, 메타 정보(거리/시간 등).
- **Disabled** (`#b1b8c0`): 비활성 버튼 텍스트.

### Surface & Border
- **Canvas** (`#ffffff`): 페이지 배경.
- **Border** (`#d1d6dc`) / **Hairline** (`#e5e7ea`, `#e5e5e5`): 카드 보더, 구분선.
- **Surface** (`#f3f4f6`) / **Surface Alt** (`#f5f5f5`) / **Surface Faint** (`#f9fafb`): 섹션/보조 배경.
- **Cream** (`#fcf4ee`) / **Cream Alt** (`#fff8e4`): 프로모/추천 스팟 카드 배경.

### Semantic
- **Yellow** (`#ffb700`): 별점, 하이라이트.
- **Success** (`#0da796`): 저장 완료, 일정 등록 성공.
- **Error** (`#f64c4c`): 폼 에러, 삭제 확인.

## 3. Typography Rules

- **Family**: Pretendard Variable 단일 사용.
- 헤드라인/타이틀은 weight 600, 본문·UI 라벨은 weight 400.
- 서브타이틀·칩·탭 등 작은 라벨은 -0.3px 자간으로 살짝 조여준다.
- 본문/UI는 15–16px 하한 유지 (모바일 가독성).

| Role | Size | Weight | Line Height | 용도 |
|------|------|--------|-------------|------|
| Display D1 | 52px | 600 | 1.30 | 온보딩/랜딩 헤드라인 |
| Heading H1 | 31px | 600 | 1.30 | 페이지 타이틀 (스팟 상세 등) |
| Subtitle | 17px | 600 | 1.30 | 섹션 타이틀 |
| Body | 16px | 400 | 1.50 | 본문, 설명 |
| Body Small | 15px | 400 | 1.60 | 칩/탭/태그 라벨 |
| Button | 16px | 600 | 1.00 | 버튼 라벨 |
| Caption | 13px | 400 | 1.50 | 메타 정보, 캡션 |

## 4. Component Stylings

### Buttons
- **Primary**: bg `#ff6000`, fg `#ffffff`, radius 6px, height 48px, 16px/600. hover `#cc4d00`, disabled bg `#f3f4f6` fg `#b1b8c0`. → 저장, 일정 추가, 다음 단계.
- **Neutral**: bg `#191c1f`, fg `#ffffff`, 나머지 동일. → 보조 강조 액션.
- **Assistive**: bg `#f3f4f6`, fg `#333d4b`, 나머지 동일. → 취소, 낮은 우선순위 액션.

### Inputs
- **TextField**: bg `#ffffff`, border 1px `#d1d6dc`, radius 8px, height 48px, 16px/400. focus border `#333d4b`.

### Cards
- **Spot Card (card-plain)**: bg `#ffffff`, border 1px `#e5e5e5`, radius 12px, no shadow.
- **Promo/추천 Card (card-warm)**: bg `#fcf4ee`, radius 16px, padding 40px.

### Chips & Tags
- **Filter chip (selected)**: bg `#ff6000`, fg `#ffffff`, radius 999px, height 30px.
- **Filter chip (unselected)**: bg `#ffffff`, fg `#333d4b`, border 1px `#d1d6dc`, radius 999px.
- **Category tag**: bg `#ff6000`, fg `#ffffff`, radius 4px, height 28px.

### Tabs
- **Segmented pill**: height 40px, radius 999px. inactive bg `#ffffff` fg `#333d4b` border `#d1d6dc`; active bg `#191f28` fg `#ffffff`. → 예: 스팟/플래너 뷰 전환, 카테고리 탭.

## 5. Layout Principles

- 4px 기반, 8px 리듬 (`2/4/8/12/16/20/24/32/48`).
- 모바일(390px) 기준: 단일 컬럼, 카드 리스트는 세로 스택 또는 가로 스크롤 캐러셀.
- 섹션 구분은 배경 틴트(`#f5f5f5`/`#f9fafb` vs `#ffffff`)와 헤어라인으로, 그림자 사용하지 않음.
- 라운드 스케일: 버튼 6px · 인풋 8px · 카드 12–16px · 칩/탭 999px.

## 6. Depth & Elevation

| Level | 처리 | 용도 |
|-------|------|------|
| Flat | shadow 없음 | 기본 배경, 대부분의 서피스 |
| Tint | `#f5f5f5`/`#f9fafb` 배경 전환 | 섹션 구분 |
| Hairline | 1px `#e5e5e5`/`#d1d6dc` 보더 | 카드 아웃라인, 구분선 |

그림자 대신 색과 헤어라인으로 위계를 표현한다.

## 7. Do's and Don'ts

### Do
- 오렌지는 핵심 액션(저장/추가/다음)에만 사용
- 헤드라인은 Pretendard 600, 본문은 400
- 섹션 구분은 틴트 배경 + 헤어라인
- 버튼 6px, 인풋 8px, 카드 12–16px, 칩/탭 999px 라운드 유지

### Don't
- 오렌지를 여러 요소에 분산시키지 말 것 — 액션 신호가 흐려짐
- 드롭섀도우로 입체감 주지 말 것
- 두 번째 채도색을 브랜드 컬러로 추가하지 말 것

## 8. Responsive Behavior

| Breakpoint | 범위 | 변화 |
|------|-------|------|
| Mobile (기준) | 360–639px | 단일 컬럼, 카드 가로 스크롤 |
| Tablet | 640–1023px | 2열 카드 그리드 |
| Desktop | 1024px+ | 넓은 컨테이너, 다열 레이아웃 |

- 탭 타겟은 44px 이상 유지 (버튼 48px, 칩 30px는 패딩으로 보완).
- 큰 화면에서는 여백을 늘리고 컬럼을 늘리되, 모바일 레이아웃을 단순히 늘리지 않는다.

## 9. Agent Prompt Guide

- "스팟 카드: 흰 배경, 1px #e5e5e5 보더, 12px radius, 그림자 없음. 타이틀 17px/600 #222222, 메타 15px/400 #737373."
- "카테고리 필터 칩: 미선택은 흰 배경 #333d4b 텍스트 1px #d1d6dc 보더 999px; 선택 시 #ff6000 배경 흰 텍스트."
- "저장 버튼: #ff6000 배경, 흰 텍스트, 6px radius, 48px height, 16px/600, hover #cc4d00."
- "스팟/플래너 세그먼트 탭: 40px height, 999px radius, 비활성 흰 배경, 활성 #191f28 배경 흰 텍스트."

---

## 10. Voice & Tone

올레스냅의 톤은 **친절하고 실용적인 여행 동반자**다. 관광 정보를 나열하기보다, "지금 이 근처에서 뭘 할 수 있는지"를 짧고 명확하게 알려준다. 공모전 성격상 관광데이터를 얼마나 유용하게 가공했는지가 핵심이므로, 카피는 데이터 기반의 신뢰감(거리, 소요 시간, 운영 시간 등 구체적 수치)과 여행의 설렘을 함께 전달한다.

| 상황 | 톤 |
|---|---|
| 스팟 추천 | 구체적 정보 우선 ("도보 12분", "현재 운영중") |
| 플래너 CTA | 가볍고 직관적 ("일정에 담기", "코스 만들기") |
| 빈 상태 | 부담 없는 안내, 다음 행동 제시 |
| 에러/제약 | 담백하게 원인과 대안 제시 |

**금지 톤**: 과장된 홍보 문구, 불필요한 이모지 남발, 근거 없는 추천 문구.

## 11. Brand Narrative

올레스냅은 제주 올레길이라는 국내 대표 도보 여행 콘텐츠와 공공 관광데이터를 결합해, 여행자가 코스 위 스팟을 발견하고 나만의 일정으로 엮을 수 있게 돕는 서비스다. "올레(길을 뜻하는 제주 방언) + 스냅(순간을 기록)"이라는 이름처럼, 거창한 여행 가이드가 아니라 지금 걷고 있는 길 위에서 바로 쓸 수 있는 가벼운 도구를 지향한다.

시각 테마는 LikeLion Design System에서 빌려왔지만, 이는 어디까지나 짧은 개발 기간 안에 일관된 UI 톤을 빠르게 확보하기 위한 실용적 선택이다. 서비스의 정체성은 색이 아니라 "제주 올레길 데이터를 얼마나 쓸모 있게 보여주는가"에 있다.

## 12. Principles

1. **길 위에서 바로 쓸 수 있을 것.** *UI 반영:* 로딩 빠르게, 터치 타겟 크게, 한 화면에 정보 과밀 금지.
2. **데이터는 구체적으로.** *UI 반영:* "가깝다" 대신 "도보 12분"처럼 실제 수치를 보여준다.
3. **하나의 액션, 하나의 색.** *UI 반영:* 오렌지는 저장/담기/다음 단계 전용.
4. **모바일이 먼저다.** *UI 반영:* 390px 기준으로 먼저 완성하고, 큰 화면은 레이아웃을 확장한다.

## 13. Personas

*아래는 관광데이터 공모전 심사 맥락과 올레길 이용자 특성을 바탕으로 만든 가상 페르소나다.*

**이수민, 29, 서울.** 주말에 제주로 짧은 여행을 온 직장인. 정해진 코스보다 "지금 위치에서 갈 만한 곳"을 즉흥적으로 찾고 싶어함. 지도 앱보다 올레길 맥락에 맞는 스팟 추천을 원한다.

**박도현, 41, 경기.** 가족과 함께 올레길 일부 구간을 걷는 여행자. 아이와 함께 갈 만한 식당/화장실/쉼터 정보를 빠르게 확인해야 해서, 정보 밀도보다 가독성을 중시한다.

**심사위원 페르소나.** 짧은 시간 안에 모바일 화면으로 앱을 훑어보며 관광데이터 활용도와 완성도를 평가한다. 첫 화면에서 핵심 가치(스팟 탐색 + 일정 플래너)가 바로 읽혀야 한다.

## 14. States

| State | 처리 |
|---|---|
| 빈 상태 (검색 결과 없음) | 흰 배경, `#222222` 한 줄 안내 + 오렌지 CTA로 필터 초기화 |
| 빈 상태 (저장한 스팟 없음) | `#737373` 안내 문구 + 스팟 탐색으로 이동하는 링크 |
| 로딩 (스팟 목록) | `#f5f5f5`/`#f9fafb` 톤의 스켈레톤 카드, 최종 카드와 동일한 radius |
| 에러 (데이터 로드 실패) | `#222222` 안내 + 재시도 버튼, 원인 대신 다음 행동 제시 |
| 성공 (일정에 담기) | 짧은 인라인 확인 (선택적으로 `#0da796`), 바로 다음 행동 링크 |
| 비활성 | bg `#f3f4f6`, fg `#b1b8c0` |

## 15. Motion & Easing

| Token | 값 | 용도 |
|---|---|---|
| `motion-fast` | 120ms | hover, 칩/탭 프레스 |
| `motion-standard` | 200ms | 카드 등장, 시트, 토스트 |
| `motion-slow` | 320ms | 페이지 전환 |

`ease-enter: cubic-bezier(0.2, 0.6, 0.25, 1)`로 카드/토스트가 자연스럽게 등장하고, `prefers-reduced-motion: reduce`에서는 모든 트랜지션이 즉시 적용된다.

---

**Note**: Section 1-9 (테마/컬러/타이포/컴포넌트/레이아웃)는 LikeLion Design System(`designsystem.likelion.net`)에서 차용. Section 10-15(보이스, 브랜드 서사, 원칙, 페르소나, 상태, 모션)는 ollesnap 자체 내용.
