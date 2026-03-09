import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gachimogo | 같이먹어",
  description: "Apple Developer Academy @ POSTECH 같이 먹을 사람 찾기",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-postech-silver sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/">
              <img src="/logo.png" alt="Gachimogo" className="h-16 object-contain" />
            </a>
            <a
              href="/create"
              className="bg-postech-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-postech-red-dark transition-colors"
            >
              + 약속 만들기
            </a>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
