import type { Metadata } from "next";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";

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
        />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  );
}
