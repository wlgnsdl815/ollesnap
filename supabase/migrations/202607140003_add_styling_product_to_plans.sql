alter table public.snap_plans
add column styling_shop_id text,
add column styling_product_id text,
add column styling_option_ids text[] not null default '{}';
