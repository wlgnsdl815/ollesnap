import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { Toaster } from "@/shared/components/ui/sonner";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "올레스냅 — 제주 웨딩스냅, 취향대로 골라 떠나요",
    template: "%s | 올레스냅",
  },
  description:
    "제주 웨딩스냅 작가와 스드메를 취향으로 고르고, 혼잡도 예측으로 촬영하기 좋은 날까지 한 번에 계획하는 예비부부용 서비스",
  openGraph: {
    title: "올레스냅",
    description:
      "제주 웨딩스냅 작가 찾기부터 촬영 날짜, 여행 일정까지 한 흐름으로",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
