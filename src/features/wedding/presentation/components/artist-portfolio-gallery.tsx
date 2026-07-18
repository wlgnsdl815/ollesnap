import Image from "next/image";

interface ArtistPortfolioGalleryProps {
  imageUrls: string[];
  studioName: string;
}

// 실제 작가 포트폴리오 갤러리. snap_artists.portfolio_image_urls에
// 사진 URL이 채워지면 나타나고, 비어 있는 동안에는 렌더링되지 않는다.
export function ArtistPortfolioGallery({
  imageUrls,
  studioName,
}: ArtistPortfolioGalleryProps) {
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">포트폴리오</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {studioName}가 직접 촬영한 사진이에요.
        </p>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {imageUrls.map((imageUrl, index) => (
          <span
            key={imageUrl}
            className="relative aspect-4/5 w-44 shrink-0 overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={imageUrl}
              alt={`${studioName} 포트폴리오 ${index + 1}`}
              fill
              sizes="176px"
              className="object-cover"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
