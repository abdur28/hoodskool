import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/navbar/ConditionalNavbar";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Footer from "@/components/footer/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hoodskool - Urban Streetwear",
  description: "Unique streetwear brand for the culture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${inter.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <ConditionalNavbar />
            <div className="fixed inset-0  z-30 flex items-center justify-center pointer-events-none">
            <h2 className="font-heading text-[24vw] md:text-[24vw] lg:text-[24rem] tracking-wider text-white/5 leading-none select-none pb-8">
              HOODSKOOL
            </h2>
          </div>
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}