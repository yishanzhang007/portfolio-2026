import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const denim = localFont({
  variable: "--font-pp-denim",
  display: "swap",
  src: [
    { path: "../public/fonts/Denim-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Denim-Medium.otf", weight: "500", style: "normal" },
  ],
});

const matterMono = localFont({
  src: "../public/fonts/MatterMono-TRIAL-Light.woff2",
  variable: "--font-pp-matter-mono",
  display: "swap",
  weight: "300",
});

const ntype = localFont({
  src: "../public/fonts/NType82-Regular.otf",
  variable: "--font-ntype",
  display: "swap",
  weight: "400",
});

const inProgress = localFont({
  src: "../public/fonts/In_progress-Medium.otf",
  variable: "--font-in-progress",
  display: "swap",
  weight: "500",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["300", "400", "500"],
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
      className={`${denim.variable} ${matterMono.variable} ${ntype.variable} ${inProgress.variable} ${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
