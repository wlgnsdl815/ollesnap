Project Guidelines

Project Context

- This project is a submission for the 2026 관광데이터 활용 공모전.
- Judges are expected to review the application primarily on mobile devices.
- Treat mobile as the primary platform, not desktop.
- Design, implement, and test every screen mobile-first. Build and verify the mobile experience before adding tablet or desktop layouts.
- Design and validate the primary UI using a reference viewport of approximately 390px.
- The application must remain fully functional on any viewport width from 360px upward.
- Use responsive breakpoints only to enhance larger screens (`sm:`/`md:`/`lg:` and up) — never design for desktop first and scale down with `max-width` overrides.
- On larger viewports (foldables, tablets, desktops), the layout must adapt naturally to the available space — e.g. wider containers, multi-column arrangements, adjusted spacing — rather than simply stretching or centering the mobile layout with empty space on the sides.
- If a design or implementation tradeoff is required, always prioritize the mobile user experience, even if it results in a less-than-ideal desktop layout.
- UI components should provide touch-friendly interactions, including sufficiently large tap targets (approximately 44px) and spacing. Avoid hover-only interactions.
- The goal is a genuine mobile web app experience that also scales into a polished desktop experience — not a desktop site adapted for mobile, and not a mobile layout awkwardly stretched for desktop.

Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- pnpm

Code Style

- Use React with TypeScript.
- Prefer interface for object type definitions.
- Use type only for unions, intersections, or utility types.
- Keep components small and focused on a single responsibility.
- Avoid unnecessary abstraction.
- Prioritize readability and maintainability.

Architecture

Use a feature-first, clean architecture-inspired structure when the project grows.

- app: Next.js routes, layouts, pages, and API routes
- features/<feature>: one folder per feature, each containing its own
  - domain: business logic, entities, and use cases for that feature
  - data: repositories, API clients, and external data access for that feature
- shared: shared utilities, constants, and common components used across features

Business logic should be placed in a feature's domain layer, not directly inside UI components. Only lift code out of a feature folder into `shared` once it's actually needed by more than one feature.

Styling

- Use Tailwind CSS.
- Prefer template literals for conditional Tailwind classes.
- Do not use class name join helpers unless necessary.
- Prefer icons from `lucide-react` over custom SVGs or other icon sets.
- Before building a UI component from scratch, check whether a shadcn/ui component already covers it and use that first. Only hand-roll a component when shadcn has no equivalent.

Example:

const buttonClassName = `  rounded-md px-4 py-2
  ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`;

Next.js Rules

- Use the App Router.
- Prefer Server Components by default.
- Use Client Components only when interactivity, browser APIs, or React hooks are needed.
- Keep data fetching close to the route or server component when appropriate.
- Do not add unnecessary client-side state.

Commands

pnpm dev
pnpm build
pnpm lint

Reference Docs

- docs/reference: 참고용 PDF 등 문서를 두는 폴더. 여기에 있는 파일은 관련 작업 시 참고할 것.
- docs/reference/api-manual: API 명세/매뉴얼 문서를 두는 폴더 (PDF, CSV, MD 등). API 연동 작업 시 참고할 것. xlsx/docx는 csv/md/txt로 변환 후 넣을 것.
