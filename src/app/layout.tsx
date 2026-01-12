import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

export const metadata: Metadata = {
  title: "Beauty Search Engine",
  description: "Find the best beauty deals in the GCC",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <body className={`${inter.variable} ${ibmPlexSansArabic.variable} antialiased font-sans`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
