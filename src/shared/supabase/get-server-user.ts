import "server-only";

import { cache } from "react";

import { createClient } from "./server";

// 한 요청 안에서 여러 데이터 로더가 각자 getUser()를 불러도
// Supabase Auth 왕복은 한 번만 일어나도록 요청 단위로 캐시한다.
export const getServerUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
