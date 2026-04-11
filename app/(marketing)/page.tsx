import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DestinationGrid } from "@/components/marketing/DestinationGrid";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ProviderStrip } from "@/components/marketing/ProviderStrip";
import { AiraloPartnerBanner } from "@/components/marketing/AiraloPartnerBanner";
import { TrustBanner } from "@/components/marketing/TrustBanner";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Find the Perfect eSIM in 30 Seconds - eSIMSeeker",
    description:
      "Compare travel eSIM plans from top providers with an AI-guided wizard built for speed and trust.",
    alternates: { canonical: "https://esimseeker.com/" },
  };
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8">
        <section>
          <Hero />
          <ProviderStrip />
        </section>
        <HowItWorks />
        <AiraloPartnerBanner />
        <DestinationGrid />
        <TrustBanner />
      </main>
      <Footer />
    </div>
  );
}
