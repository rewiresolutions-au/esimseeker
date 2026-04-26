import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIBanner } from "@/components/marketing/AIBanner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { CountryPlansSection } from "@/components/plans/CountryPlansSection";
import { SEOContent } from "@/components/seo/SEOContent";
import {
  getCountriesFromDb,
  getCountryBySlugFromDb,
  getPlansByCountryFromDb,
  getTopPlansForCountryFromDb,
} from "@/lib/data/supabase-repository";

type DestinationCountryPageProps = {
  params: Promise<{ country: string }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

export const generateStaticParams = async () => {
  const countries = await getCountriesFromDb();
  return countries.slice(0, 60).map((c) => ({ country: c.slug }));
};

export const generateMetadata = async ({ params }: DestinationCountryPageProps): Promise<Metadata> => {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlugFromDb(countrySlug);
  if (!country) {
    return {
      title: "Destination Not Found - eSIMSeeker",
      description: "This destination is not currently available in our comparison catalog.",
      robots: { index: false, follow: true },
    };
  }

  let plans = [] as Awaited<ReturnType<typeof getPlansByCountryFromDb>>;
  try {
    plans = await getPlansByCountryFromDb(country.slug, { sortBy: "price-asc" });
  } catch {
    plans = [];
  }
  const lowestPrice = plans[0]?.priceUsd ?? 0;
  const year = new Date().getFullYear();
  const title = `Best eSIMs for ${country.name} in ${year} | Compare plans - eSIMSeeker`;
  const description = `Compare ${plans.length} travel eSIM plans for ${country.name} (${year}). Sort by price, data, and rating. From $${lowestPrice} USD.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `https://esimseeker.com/destinations/${country.slug}` },
  };
};

export default async function DestinationCountryPage({ params }: DestinationCountryPageProps) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlugFromDb(countrySlug);
  if (!country) notFound();

  let plans = [] as Awaited<ReturnType<typeof getPlansByCountryFromDb>>;
  let topPlans = [] as Awaited<ReturnType<typeof getTopPlansForCountryFromDb>>;
  let plansLoadFailed = false;
  try {
    plans = await getPlansByCountryFromDb(country.slug, { sortBy: "price-asc" });
    topPlans = (await getTopPlansForCountryFromDb(country.slug)).slice(0, 5);
  } catch {
    // Never 500 destination pages for crawlers; render with explicit empty/error state instead.
    plansLoadFailed = true;
    plans = [];
    topPlans = [];
  }
  const lowestPrice = plans[0]?.priceUsd ?? 0;
  const year = new Date().getFullYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best eSIMs for ${country.name} in ${year}`,
    description: `Comparison of travel eSIM data plans for ${country.name}.`,
    numberOfItems: topPlans.length,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best eSIM for ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best eSIM depends on your trip length and data needs. Use the comparison table to sort by price or rating, or ask the eSIMSeeker AI Wizard for a personalized shortlist for ${country.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does an eSIM for ${country.name} cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Plans change often; this page lists current options from about $${lowestPrice} USD and up. Always confirm price on the provider checkout page.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          breadcrumb={
            <>
              <Link href="/" className="hover:underline">
                Home
              </Link>
              {" / "}
              <Link href="/destinations" className="hover:underline">
                Destinations
              </Link>
              {" / "}
              {country.name}
            </>
          }
          title={`Best eSIMs for ${country.name} in ${year}`}
          titleClassName="font-heading text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight"
          description={
            plansLoadFailed
              ? "Compare plans from top providers. We are having trouble loading live plan rows right now."
              : `Compare ${plans.length} plans from top providers. From $${lowestPrice} USD. Updated regularly—verify final price before you buy.`
          }
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-brand-gray-light px-3 py-1 text-brand-navy ring-1 ring-brand-navy/10">
              {country.flagEmoji} {country.name}
            </span>
            {!plansLoadFailed ? (
              <>
                <span className="rounded-full bg-brand-gray-light px-3 py-1 text-brand-navy ring-1 ring-brand-navy/10">
                  {plans.length} plans
                </span>
                <span className="rounded-full bg-brand-gray-light px-3 py-1 text-brand-navy ring-1 ring-brand-navy/10">
                  From ${lowestPrice}
                </span>
              </>
            ) : null}
          </div>
          <Link
            href={`/wizard?destination=${encodeURIComponent(country.name)}`}
            className="mt-4 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-red/90"
          >
            Ask AI Wizard
          </Link>
        </PageHero>

        <section id="compare" aria-labelledby="compare-heading" className="scroll-mt-24 space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="compare-heading" className="font-heading text-2xl font-semibold text-brand-navy">
              Plan comparison
            </h2>
            <p className="text-sm text-brand-navy/65">Click a column header to sort. Filters refetch plans from our catalog.</p>
          </div>
          <CountryPlansSection
            countrySlug={country.slug}
            countryName={country.name}
            initialPlans={plans}
            initialLoadError={plansLoadFailed}
          />
        </section>

        <AIBanner destination={country.name} />

        <SEOContent countryName={country.name} />
      </main>
      <Footer />
    </div>
  );
}
