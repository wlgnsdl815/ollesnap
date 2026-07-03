Project Guidelines

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

Use a clean architecture-inspired structure when the project grows.

- app: Next.js routes, layouts, pages, and API routes
- presentation: UI components and view logic
- domain: business logic, entities, and use cases
- data: repositories, API clients, and external data access
- shared: shared utilities, constants, and common components

Business logic should be placed in the domain layer, not directly inside UI components.

Styling

- Use Tailwind CSS.
- Prefer template literals for conditional Tailwind classes.
- Do not use class name join helpers unless necessary.

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
