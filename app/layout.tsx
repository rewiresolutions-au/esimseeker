import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "eSIMSeeker",
    template: "%s | eSIMSeeker",
  },
  description:
    "Compare prepaid eSIM data plans by destination. Wizard-assisted recommendations and fair comparisons.",
  applicationName: "eSIMSeeker",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "eSIMSeeker",
    title: "eSIMSeeker — Compare prepaid eSIM data plans",
    description:
      "Compare prepaid eSIM data plans by destination. Wizard-assisted recommendations and fair comparisons.",
  },
  twitter: {
    card: "summary_large_image",
    title: "eSIMSeeker — Compare prepaid eSIM data plans",
    description:
      "Compare prepaid eSIM data plans by destination. Wizard-assisted recommendations and fair comparisons.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A192F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
