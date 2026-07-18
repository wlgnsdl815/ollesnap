-- 이 프로젝트에는 public 테이블에 대한 기본 GRANT가 없어
-- RLS 정책과 별개로 롤 권한을 명시적으로 부여해야 PostgREST가 접근할 수 있다.

grant usage on schema public to anon, authenticated, service_role;

-- 카탈로그: 누구나 읽기 전용
grant select on table
  public.snap_artists,
  public.snap_packages,
  public.styling_shops,
  public.styling_products,
  public.artist_styling_partners
to anon, authenticated;

-- 유저 데이터: 로그인 사용자만 접근 (행 단위 제한은 RLS 정책이 담당)
grant select, insert, update, delete on table
  public.saved_artists,
  public.snap_plans,
  public.travel_plan_items
to authenticated;

grant all on table
  public.snap_artists,
  public.snap_packages,
  public.styling_shops,
  public.styling_products,
  public.artist_styling_partners,
  public.saved_artists,
  public.snap_plans,
  public.travel_plan_items
to service_role;
