import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "About eSIMSeeker",
  description: "Built by travelers, for travelers. Learn how we rank plans and stay independent.",
  alternates: { canonical: "https://esimseeker.com/about" },
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          title="Built by Travelers, for Travelers."
          description="eSIMSeeker helps people compare global connectivity options with transparency and speed."
          breadcrumb="Home / About"
        />
        <section className="grid gap-4 md:grid-cols-3">
          {["Real-Time Pricing", "Network Coverage Data", "User Reviews"].map((item) => (
            <article key={item} className="rounded-xl border border-brand-navy/10 bg-white p-5">
              <h2 className="text-lg font-bold text-brand-navy">{item}</h2>
              <p className="mt-2 text-sm text-brand-navy/75">
                We include this signal in every recommendation so users can make confident choices.
              </p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
