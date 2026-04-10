import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Terms of Use - eSIMSeeker",
  description: "Terms governing use of eSIMSeeker plan comparison and affiliate links.",
  alternates: { canonical: "https://esimseeker.com/terms" },
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <PageHero
          title="Terms of Use"
          description="Please read these terms before using our plan comparison pages."
          breadcrumb="Home / Terms"
        />
        <article className="rounded-xl border border-brand-navy/10 bg-white p-5 text-sm text-brand-navy/80">
          <p>
            Information on this website is provided for comparison purposes and may change without notice.
            Always verify provider terms before checkout.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
