import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brad Malgas | Software Developer",
  description:
    "Welcome to my portfolio! Discover my projects, skills, and passion for crafting innovative software solutions.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Brad Malgas | Software Developer",
    description:
      "Welcome to my portfolio! Discover my projects, skills, and passion for crafting innovative software solutions.",
    url: "https://www.bradmalgas.com",
    siteName: "Brad Malgas Portfolio",
    images: [
      {
        url: "https://storageazureblogify.blob.core.windows.net/files/OG-Brad Malgas.png",
        width: 1200,
        height: 630,
        alt: "Brad Malgas | Software Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brad Malgas | Software Developer",
    description: "Explore my portfolio and skills in software development.",
    images: [
      "https://storageazureblogify.blob.core.windows.net/files/OG-Brad Malgas.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Brad Malgas",
    "Software Developer",
    "Portfolio",
    "API Development",
    "Next.js",
    "Web API",
    "Backend Developer",
    "C#",
    "TailwindCSS",
    "Azure Developer",
  ],
  alternates: {
    canonical: "https://www.bradmalgas.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
