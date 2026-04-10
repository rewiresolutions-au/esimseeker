import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryGrid } from "@/components/destinations/CountryGrid";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { REGIONS } from "@/lib/data/countries";
import { getCountriesByRegionFromDb } from "@/lib/data/supabase-repository";

type RegionPageProps = {
  params: Promise<{ region: string }>;
};

export const generateMetadata = async ({ params }: RegionPageProps): Promise<Metadata> => {
  const { region } = await params;
  const found = REGIONS.find((item) => item.slug === region);
  if (!found) return { title: "Region Not Found - eSIMSeeker" };
  return {
    title: `${found.name} eSIM Plans - eSIMSeeker`,
    description: `Browse multi-destination eSIM options for ${found.name}.`,
    alternates: { canonical: `https://esimseeker.com/esim/region/${found.slug}` },
  };
};

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  const found = REGIONS.find((item) => item.slug === region);
  if (!found) notFound();
  const countries = await getCountriesByRegionFromDb(found.slug);

  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          breadcrumb={`Destinations / ${found.name}`}
          title={`${found.name} eSIM Plans`}
          description={found.description}
        />
        <CountryGrid countries={countries} />
      </main>
      <Footer />
    </div>
  );
}
