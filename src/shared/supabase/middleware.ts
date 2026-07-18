import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 인증 쿠키가 아예 없는 비로그인 요청은 세션 갱신할 것도 없으므로
  // Auth 서버는 물론 로컬 검증조차 건너뛴다 (요청 속도 제한 예방).
  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"),
    );

  if (!hasAuthCookie) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 세션 갱신을 위해 반드시 호출 — 이 호출이 없으면 만료된 토큰이 갱신되지 않는다.
  // getUser()와 달리 getClaims()는 JWT를 로컬(JWKS)로 검증해
  // 요청마다 Supabase Auth 서버를 왕복하지 않는다.
  await supabase.auth.getClaims();

  return supabaseResponse;
}
