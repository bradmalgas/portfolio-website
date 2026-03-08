import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Brad Malgas — Senior Software Developer",
    template: "%s | Brad Malgas",
  },
  description:
    "Senior Software Developer specialising in cloud-native systems on Microsoft Azure — C#/.NET, infrastructure as code, and backend API architecture.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
  },
  openGraph: {
    title: "Brad Malgas — Senior Software Developer",
    description:
      "Senior Software Developer specialising in cloud-native systems on Microsoft Azure — C#/.NET, infrastructure as code, and backend API architecture.",
    url: "https://www.bradmalgas.com",
    siteName: "Brad Malgas",
    images: [
      {
        url: "https://storageazureblogify.blob.core.windows.net/files/OG-Brad-Malgas-(Themed).png",
        width: 1200,
        height: 630,
        alt: "Brad Malgas — Senior Software Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brad Malgas — Senior Software Developer",
    description:
      "Senior Software Developer specialising in cloud-native systems on Microsoft Azure — C#/.NET, infrastructure as code, and backend API architecture.",
    images: [
      "https://storageazureblogify.blob.core.windows.net/files/OG-Brad-Malgas-(Themed).png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Brad Malgas",
    "Senior Software Developer",
    "Azure Developer",
    "C# Developer",
    ".NET Developer",
    "Cloud Native",
    "Infrastructure as Code",
    "Azure Bicep",
    "Backend Developer",
    "Portfolio",
  ],
  alternates: {
    canonical: "https://www.bradmalgas.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brad Malgas",
  url: "https://www.bradmalgas.com",
  jobTitle: "Senior Software Developer",
  description:
    "Senior Software Developer specialising in cloud-native systems on Microsoft Azure — C#/.NET, infrastructure as code, and backend API architecture.",
  sameAs: [
    "https://www.linkedin.com/in/brad-malgas",
    "https://github.com/bradmalgas",
    "https://blog.bradmalgas.com",
  ],
  knowsAbout: [
    "C#",
    ".NET",
    "Microsoft Azure",
    "Azure Bicep",
    "Docker",
    "Software Development",
    "Cloud Architecture",
    "Infrastructure as Code",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip to main content — first focusable element for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                     focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent focus:text-white
                     focus:rounded focus:text-sm focus:font-medium focus:shadow-glow"
        >
          Skip to main content
        </a>

        <Navbar />
        <div className="flex flex-col min-h-screen w-full pt-16">
          <main id="main-content" className="flex-grow">
            {children}
            <ScrollToTop />
          </main>
        </div>
      </body>
    </html>
  );
}
