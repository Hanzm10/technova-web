import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "TechNova | Future of Retail",
  description: "A digital-first lifestyle brand for modern living.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://technova-web.vercel.app"),
  openGraph: {
    title: "TechNova | Future of Retail",
    description: "A digital-first lifestyle brand for modern living.",
    url: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://technova-web.vercel.app"),
    siteName: "TechNova",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNova | Future of Retail",
    description: "A digital-first lifestyle brand for modern living.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans antialiased text-slate-900 bg-[#E8ECEF] overflow-x-hidden w-full relative`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
