create table public.saved_artists (
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

create table public.snap_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  artist_id text,
  dress_id text,
  makeup_id text,
  shooting_date date,
  stay_start_date date,
  stay_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.travel_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.snap_plans(id) on delete cascade,
  spot_id text not null,
  spot_title text not null,
  spot_location text,
  spot_image_url text,
  planned_date date,
  created_at timestamptz not null default now(),
  unique (plan_id, spot_id)
);

create index travel_plan_items_plan_id_idx on public.travel_plan_items(plan_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger snap_plans_set_updated_at
before update on public.snap_plans
for each row execute function public.set_updated_at();

alter table public.saved_artists enable row level security;
alter table public.snap_plans enable row level security;
alter table public.travel_plan_items enable row level security;

create policy "Users manage their saved artists"
on public.saved_artists
for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their snap plan"
on public.snap_plans
for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage travel items in their snap plan"
on public.travel_plan_items
for all
using (
  exists (
    select 1
    from public.snap_plans
    where snap_plans.id = travel_plan_items.plan_id
      and snap_plans.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.snap_plans
    where snap_plans.id = travel_plan_items.plan_id
      and snap_plans.user_id = (select auth.uid())
  )
);
