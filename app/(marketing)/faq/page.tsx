import type { Metadata } from "next";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "eSIM FAQ - eSIMSeeker",
  description: "Answers to common questions about compatibility, activation, billing, and travel usage.",
  alternates: { canonical: "https://esimseeker.com/faq" },
});

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          title="Frequently Asked Questions"
          description="Find quick answers about how eSIMs work before your trip."
          breadcrumb="Home / FAQ"
          childrenWrapperClassName="mt-2"
        >
          <input
            type="search"
            placeholder="Search FAQs..."
            className="h-11 w-full max-w-2xl rounded-lg border border-brand-navy/25 bg-white px-4 text-sm font-medium text-brand-navy placeholder:text-brand-navy/45"
          />
        </PageHero>
        <FAQAccordion />
        <section className="rounded-2xl border border-brand-navy/10 bg-white px-6 py-10 text-center">
          <h2 className="text-4xl font-bold text-brand-navy">Still have questions?</h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-brand-red px-6 py-3 text-lg font-semibold text-white"
          >
            Contact Us
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
