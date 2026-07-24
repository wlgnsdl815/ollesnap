-- 홈 화면 "인기 작가/샵" 노출용 찜 수. 현재는 실제 찜 집계가 아니라
-- 데모용으로 시드하는 값이며, 실제 saved_artists 집계로 교체 가능하도록 별도 컬럼으로 둔다.
alter table public.snap_artists
  add column saved_count integer not null default 0;

alter table public.styling_shops
  add column saved_count integer not null default 0;
