import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "올레스냅",
  description: "제주 웨딩 스냅 작가와 스드메를 취향으로 고르는 플랫폼",
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
