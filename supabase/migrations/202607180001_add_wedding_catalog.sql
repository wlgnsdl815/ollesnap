-- 스냅 작가·스드메 카탈로그. 공개 읽기 전용 데이터로,
-- 시드는 마이그레이션으로 주입하고 앱에서는 select만 한다.

create table public.snap_artists (
  id text primary key,
  studio_name text not null,
  artist_name text not null,
  introduction text not null,
  profile_image_url text not null,
  scenes text[] not null default '{}',
  tones text[] not null default '{}',
  keywords text[] not null default '{}',
  package_summary text not null,
  price_from integer not null,
  duration_hours numeric not null,
  delivery_days integer not null,
  reservation_lead_days integer not null,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.snap_packages (
  id text primary key,
  artist_id text not null references public.snap_artists(id) on delete cascade,
  name text not null,
  description text not null,
  price integer not null,
  duration_hours numeric not null,
  outfit_count_minimum integer not null,
  outfit_count_maximum integer not null,
  scene_count integer not null,
  color_corrected_count integer not null,
  basic_retouched_count integer not null,
  selected_retouched_count integer not null,
  included_services text[] not null default '{}',
  recommended_for text[] not null default '{}',
  add_ons jsonb not null default '[]',
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create index snap_packages_artist_id_idx on public.snap_packages(artist_id);

create table public.styling_shops (
  id text primary key,
  name text not null,
  introduction text not null,
  keywords text[] not null default '{}',
  inventory_description text not null,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

-- 상품 id(package-a 등)는 샵마다 반복되므로 샵과 묶어야 유일하다.
create table public.styling_products (
  shop_id text not null references public.styling_shops(id) on delete cascade,
  id text not null,
  kind text not null check (kind in ('single', 'package')),
  name text not null,
  description text not null,
  regular_price jsonb not null,
  partner_price jsonb,
  included_services text[] not null default '{}',
  add_ons jsonb not null default '[]',
  notice text,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  primary key (shop_id, id)
);

create table public.artist_styling_partners (
  artist_id text not null references public.snap_artists(id) on delete cascade,
  shop_id text not null references public.styling_shops(id) on delete cascade,
  primary key (artist_id, shop_id)
);

create index artist_styling_partners_shop_id_idx
  on public.artist_styling_partners(shop_id);

alter table public.snap_artists enable row level security;
alter table public.snap_packages enable row level security;
alter table public.styling_shops enable row level security;
alter table public.styling_products enable row level security;
alter table public.artist_styling_partners enable row level security;

create policy "Anyone can read snap artists"
on public.snap_artists for select using (true);

create policy "Anyone can read snap packages"
on public.snap_packages for select using (true);

create policy "Anyone can read styling shops"
on public.styling_shops for select using (true);

create policy "Anyone can read styling products"
on public.styling_products for select using (true);

create policy "Anyone can read artist styling partners"
on public.artist_styling_partners for select using (true);
