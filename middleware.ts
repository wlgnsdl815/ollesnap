import type { NextRequest } from "next/server";

import { updateSession } from "@/shared/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // api 라우트는 각 핸들러가 쿠키로 직접 인증을 확인하므로
  // 미들웨어의 세션 갱신 대상에서 제외해 인증 요청 수를 줄인다.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
