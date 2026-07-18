import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tong.visitkorea.or.kr" },
      // 작가 포트폴리오 사진 업로드용 Supabase Storage
      { protocol: "https", hostname: "nymeteolkytfwihvmigr.supabase.co" },
      { protocol: "http", hostname: "tong.visitkorea.or.kr" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
    ],
  },
};

export default nextConfig;
