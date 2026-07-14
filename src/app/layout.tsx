import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "올레스냅",
  description: "제주 웨딩 스냅부터 여행 코스까지 설계하는 통합 플랫폼",
  icons: {
    icon: "/logo_camera.svg",
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
      </body>
    </html>
  );
}
