import { Info } from "lucide-react";

export function CatalogDemoNotice() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>
        공모전 데모를 위한 목 데이터예요. 작가·드레스·메이크업 정보는 제휴
        입점 데이터로 교체될 예정입니다.
      </p>
    </div>
  );
}
