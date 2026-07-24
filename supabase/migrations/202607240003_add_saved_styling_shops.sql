-- 작가 찜(saved_artists)과 동일한 패턴으로 스드메 샵 찜 기능을 추가한다.
create table public.saved_styling_shops (
  user_id uuid not null references auth.users(id) on delete cascade,
  shop_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, shop_id)
);

alter table public.saved_styling_shops enable row level security;

create policy "Users manage their saved styling shops"
on public.saved_styling_shops
for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;

grant select, insert, update, delete on table
  public.saved_styling_shops
to authenticated;
