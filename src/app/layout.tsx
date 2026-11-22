import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduLaw VN — Tra cứu & Hỏi đáp Thông tư Bộ Giáo dục và Đào tạo",
  description:
    "Nền tảng hỏi đáp và tra cứu thông tư mới nhất của Bộ Giáo dục và Đào tạo (2024–2026) tối ưu cho giáo viên và người có nguyện vọng trở thành giáo viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
