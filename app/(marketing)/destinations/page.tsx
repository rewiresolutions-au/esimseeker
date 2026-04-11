import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/destinations/DestinationExplorer";
import { RegionCards } from "@/components/destinations/RegionCards";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { SailyWidgetBanner } from "@/components/marketing/SailyWidgetBanner";
import { REGIONS } from "@/lib/data/countries";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "eSIM Plans for Every Destination - eSIMSeeker",
    description: "Browse country and region pages to compare travel eSIM plans by destination.",
    alternates: { canonical: "https://esimseeker.com/destinations" },
  };
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          title="eSIM Plans for Every Destination"
          description="Search countries, filter by region, and open plan pages with live-style comparison tables."
          breadcrumb="Home / Destinations"
        />
        <DestinationExplorer />
        <SailyWidgetBanner variant="b" />
        <section>
          <h2 className="text-2xl font-bold text-brand-navy">Popular Regions</h2>
          <div className="mt-4">
            <RegionCards regions={REGIONS.slice(0, 3)} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
