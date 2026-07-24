-- 실제 드레스샵 촬영 사진 URL을 담는 자리.
-- 운영자가 이 배열을 채우면 스드메 샵 상세의 포트폴리오 갤러리에 바로 반영된다.
alter table public.styling_shops
  add column portfolio_image_urls text[] not null default '{}';
