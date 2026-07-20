import type { Metadata } from "next";
import "./globals.css";

const title = "Stone Soup Cafe | Burleson Soup, Sandwiches & Catering";
const description =
  "A warm, handcrafted website for Stone Soup Cafe in Burleson, Texas with fresh soup, sandwiches, lunch, pickup, and catering.";

export const metadata: Metadata = {
  metadataBase: new URL("https://stonesouptexas.com"),
  title,
  description,
  keywords: [
    "Stone Soup Cafe",
    "restaurant in Burleson",
    "soup in Burleson",
    "lunch in Burleson",
    "sandwich shop Burleson",
    "healthy lunch Burleson",
    "Burleson catering",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    url: "https://stonesouptexas.com",
    siteName: "Stone Soup Cafe",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Soup, sandwich, cookie, and iced tea at Stone Soup Cafe.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
