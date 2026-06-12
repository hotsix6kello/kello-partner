import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Partner Wekello",
  description: "Homepage-style partner portal scaffold for salon and beauty operators.",
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
