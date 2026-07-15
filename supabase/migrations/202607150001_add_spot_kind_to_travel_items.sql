alter table public.travel_plan_items
  add column spot_kind text not null default 'sight';

alter table public.travel_plan_items
  add constraint travel_plan_items_spot_kind_check
  check (spot_kind in ('sight', 'food'));
