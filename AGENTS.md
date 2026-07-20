# Ollesnap Repository Instructions

## Read before work

- UI work: read `docs/design.md`, the target feature, and relevant `src/shared/components/ui` components. For new screens or significant visual changes, also load the `frontend-design` skill if available — but `docs/design.md` tokens and the existing screens' visual language always override the skill's suggestions (no new palettes, typefaces, or "signature" elements).
- API/data work: read the relevant `docs/reference/api-manual` files and the target feature's `domain` and `data` layers.
- Route work: read the target `app/` route and its presentation page.
- Do not load unrelated reference PDFs or refactor unrelated code. Preserve existing user changes.

## Repo map (src/features/)

- `home`: 홈 화면 — `/` (오늘의 히어로 스팟, 진입점)
- `wedding`: 핵심 기능 — 작가 비교(`/artists`), 스드메(`/styling`), 준비 가이드(`/start`), 촬영팀 구성
- `photo-spot`: 관광데이터 기반 스팟 탐색 — `/spots`
- `planner`: 촬영 후 체류 일정 — `/planner`
- `account`: 프로필/로그인 — `/profile`, `/login`

## Non-negotiable product rules

- This is a 2026 관광데이터 활용 공모전 submission, reviewed primarily on mobile.
- Build and validate mobile first at 390px; support 360px and wider without horizontal overflow. Enhance larger viewports with `sm:`/`md:`/`lg:` utilities only.
- Keep interactive targets about 44px or larger. Do not rely on hover alone.
- Never expose photographers' private shooting spots or let users choose an exact shooting location.
- Use public tourism data only to support post-shoot stays and travel ideas, not as a shooting-location recommendation.

## Implementation

- Use Next.js App Router, React, TypeScript, Tailwind CSS, and pnpm.
- Use `interface` for object shapes; reserve `type` for unions, intersections, and utilities.
- Prefer Server Components. Add `"use client"` only for interaction, hooks, or browser APIs.
- Keep server state separate from UI state. Avoid unnecessary `useEffect` and duplicated state.
- Use async/await. Use template literals for conditional Tailwind classes; avoid class-name helpers unless needed.
- Reuse existing `src/shared/components/ui` components before adding shadcn/ui or hand-rolling a component. Prefer `lucide-react` icons.
- UI copy and commit messages are Korean. Commit subjects use `feat:`/`fix:`/`design:` prefixes.

## Architecture

- `app/` contains routing, route-level data fetching, metadata, and composition only.
- `features/<feature>/domain` contains entities and business rules and must not depend on `data` or `presentation`.
- `data` contains API/Supabase access, DTOs, mappers, and repository implementations.
- `presentation` contains pages, components, and non-trivial stateful hooks.
- Move code to `shared` only after it is used by two or more features.

## Design

- `docs/design.md` defines UI behavior and visual decisions. `src/app/globals.css` is the executable source of truth for semantic Tailwind tokens.
- Use semantic tokens such as `bg-primary`, `text-muted-foreground`, and `border-hairline`; do not add raw hex values in components.
- Use orange only for primary actions. Use tint surfaces and hairlines instead of drop shadows.

## Verify

- Run `pnpm lint` after code changes.
- Run `pnpm build` after route, configuration, or cross-feature contract changes.
- In the handoff, state changed files and any behavior that was not verified.
