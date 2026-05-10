import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const denim = localFont({
  variable: "--font-pp-denim",
  display: "swap",
  src: [
    { path: "../public/fonts/Denim-TRIAL-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Denim-TRIAL-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Denim-TRIAL-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Denim-TRIAL-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const denimInk = localFont({
  variable: "--font-pp-denim-ink",
  display: "swap",
  src: [
    { path: "../public/fonts/DenimINK-TRIAL-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/DenimINK-TRIAL-Medium.woff2", weight: "500", style: "normal" },
  ],
});

const matterMono = localFont({
  src: "../public/fonts/MatterMono-TRIAL-Light.woff2",
  variable: "--font-pp-matter-mono",
  display: "swap",
  weight: "300",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yishan Zhang — Product designer",
  description: "Selected work, 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${denim.variable} ${denimInk.variable} ${matterMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
