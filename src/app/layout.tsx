import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "위켈로 파트너",
  description: "제휴 매장을 위한 홈페이지형 파트너 포털 스캐폴드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
