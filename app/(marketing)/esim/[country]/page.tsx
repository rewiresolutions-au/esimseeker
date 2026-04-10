import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIBanner } from "@/components/marketing/AIBanner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { CountryPlansSection } from "@/components/plans/CountryPlansSection";
import { SEOContent } from "@/components/seo/SEOContent";
import {
  getCountryBySlugFromDb,
  getPlansByCountryFromDb,
  getTopCountrySlugsFromDb,
  getTopPlansForCountryFromDb,
} from "@/lib/data/supabase-repository";

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

export const generateStaticParams = async () => {
  const countrySlugs = await getTopCountrySlugsFromDb(8);
  return countrySlugs.map((country) => ({ country }));
};

export const generateMetadata = async ({ params }: CountryPageProps): Promise<Metadata> => {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlugFromDb(countrySlug);
  if (!country) {
    return {
      title: "Destination Not Found - eSIMSeeker",
      description: "This destination is not currently available.",
    };
  }
  const plans = await getPlansByCountryFromDb(country.slug, { sortBy: "price-asc" });
  const lowestPrice = plans[0]?.priceUsd ?? 0;
  const year = new Date().getFullYear();
  return {
    title: `Best eSIM Plans for ${country.name} (${year}) - eSIMSeeker`,
    description: `Compare ${plans.length} eSIM plans for ${country.name} from top providers. Plans from $${lowestPrice}.`,
    alternates: { canonical: `https://esimseeker.com/esim/${country.slug}` },
  };
};

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlugFromDb(countrySlug);
  if (!country) notFound();

  const plans = await getPlansByCountryFromDb(country.slug, { sortBy: "price-asc" });
  const topPlans = (await getTopPlansForCountryFromDb(country.slug)).slice(0, 5);
  const lowestPrice = plans[0]?.priceUsd ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top eSIM Plans for ${country.name}`,
    itemListElement: topPlans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: plan.name,
        brand: { "@type": "Brand", name: plan.provider },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: plan.priceUsd,
          url: plan.buyUrl,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-brand-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          breadcrumb={`Destinations / ${country.name}`}
          title={`Best eSIM Plans for ${country.name} (${new Date().getFullYear()})`}
          description={`Compare ${plans.length} plans from $${lowestPrice}. Updated daily for price and network quality.`}
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-brand-paper px-3 py-1 text-brand-navy">
              {plans.length} plans
            </span>
            <span className="rounded-full bg-brand-paper px-3 py-1 text-brand-navy">
              From ${lowestPrice}
            </span>
            <span className="rounded-full bg-brand-paper px-3 py-1 text-brand-navy">
              4G/5G coverage
            </span>
          </div>
        </PageHero>

        <CountryPlansSection countrySlug={country.slug} />
        <AIBanner destination={country.name} />
        <SEOContent countryName={country.name} />
      </main>
      <Footer />
    </div>
  );
}
