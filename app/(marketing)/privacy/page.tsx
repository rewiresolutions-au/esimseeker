import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { COMPANY } from "@/lib/content/company";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Privacy Policy - eSIMSeeker",
  description: "How eSIMSeeker handles analytics, cookies, and personal data.",
  alternates: { canonical: "https://esimseeker.com/privacy" },
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <PageHero
          title="Privacy Policy"
          description="We only collect data required to improve plan discovery and support."
          breadcrumb="Home / Privacy"
        />
        <article className="rounded-xl border border-brand-navy/10 bg-white p-5 text-sm text-brand-navy/80">
          <p>
            We use essential analytics and session data to improve search quality and understand which
            pages are most useful to travelers. We do not sell personal data.
          </p>
          <p className="mt-3">
            {`${COMPANY.tradingName} is operated by ${COMPANY.legalName} (ABN ${COMPANY.abn}) in ${COMPANY.registeredState}, ${COMPANY.registeredCountry}.`}
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
