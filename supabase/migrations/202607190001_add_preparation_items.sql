create table public.preparation_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.snap_plans(id) on delete cascade,
  item_id text not null,
  label text not null,
  is_checked boolean not null default false,
  is_custom boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (plan_id, item_id)
);

create index preparation_items_plan_id_idx on public.preparation_items(plan_id);

alter table public.preparation_items enable row level security;

create policy "Users manage preparation items in their snap plan"
on public.preparation_items
for all
using (
  exists (
    select 1
    from public.snap_plans
    where snap_plans.id = preparation_items.plan_id
      and snap_plans.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.snap_plans
    where snap_plans.id = preparation_items.plan_id
      and snap_plans.user_id = (select auth.uid())
  )
);

grant select, insert, update, delete on public.preparation_items to authenticated;
grant all on public.preparation_items to service_role;
