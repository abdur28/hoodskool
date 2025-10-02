import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/navbar/ConditionalNavbar";

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
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}