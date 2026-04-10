import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Affiliate Disclosure - eSIMSeeker",
  description: "How affiliate relationships work on eSIMSeeker and how we preserve ranking integrity.",
  alternates: { canonical: "https://esimseeker.com/affiliate-disclosure" },
});

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <PageHero
          title="Affiliate Disclosure"
          description="We may earn a commission when you buy through some links. Your price remains the same."
          breadcrumb="Home / Affiliate Disclosure"
        />
        <article className="rounded-xl border border-brand-navy/10 bg-white p-5 text-sm text-brand-navy/80">
          <p>
            Rankings are based on pricing, network quality, plan structure, and user value. Affiliate
            availability does not override quality-based recommendation logic.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
