import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Playfair_Display } from "next/font/google";
import { Toaster } from '@/components/ui/sonner';
import PromoPopup from '@/components/client/PromoPopup';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: "--font-hind",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-poster",
});

export const metadata: Metadata = {
  title: "Crab & Khai - Authentic Seafood",
  description: "Best Crab and Seafood Restaurant in Dhaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${hindSiliguri.variable} ${playfair.variable} antialiased bg-sand text-ocean-blue font-body`}
        suppressHydrationWarning
      >
        {children}
        <PromoPopup />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
