import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { COMPANY } from "@/lib/content/company";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eSIMSeeker",
  description: "Stay Connected. Anywhere. Instantly.",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.tradingName,
  legalName: COMPANY.legalName,
  url: "https://esimseeker.app",
  logo: "https://esimseeker.app/brand/logo.svg",
  email: COMPANY.contactEmail,
  address: {
    "@type": "PostalAddress",
    addressCountry: COMPANY.registeredCountry,
    addressRegion: COMPANY.registeredState,
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ABN",
    value: COMPANY.abn,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
