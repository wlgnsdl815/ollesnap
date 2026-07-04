import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * RLS를 우회하는 관리자 클라이언트.
 * 서버 전용 트러스트 코드(시드 스크립트, 관리 작업 등)에서만 사용할 것 — 절대 브라우저로
 * 전달되는 코드 경로("use client" 컴포넌트 등)에서 import하지 않는다.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY가 설정되어 있지 않습니다.");
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
