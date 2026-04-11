import type { Metadata } from "next";
import Link from "next/link";
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
        <section className="grid gap-6 rounded-2xl border border-brand-navy/10 bg-white p-6 md:grid-cols-2">
          <div className="min-h-72 rounded-xl border border-brand-navy/20 bg-brand-paper" />
          <article>
            <h2 className="text-3xl font-bold text-brand-navy">Our Mission</h2>
            <p className="mt-4 text-brand-navy/80">
              eSIMSeeker exists to remove the stress of finding reliable mobile data when you travel.
              We focus on making plan comparison simple, transparent, and fast.
            </p>
            <p className="mt-3 text-brand-navy/80">
              We evaluate providers using current pricing, destination coverage, and quality signals
              so travelers can make confident decisions in minutes.
            </p>
            <p className="mt-3 text-brand-navy/80">
              Our recommendations prioritize user fit first. We maintain full transparency about how
              affiliate commissions work.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-brand-navy/10 bg-white p-6">
          <h2 className="text-3xl font-bold text-brand-navy">How We Make Money - Complete Transparency</h2>
          <p className="mt-3 max-w-4xl text-brand-navy/80">
            When you click a plan and purchase, we may earn a small commission from the provider.
            This comes at no extra cost to you. Our rankings are based on user value and plan fit.
          </p>
          <Link
            href="/affiliate-disclosure"
            className="mt-4 inline-flex rounded-full border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy"
          >
            Affiliate Disclosure
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Real-Time Pricing",
              description: "Based on current market rates from providers.",
            },
            {
              title: "Network Coverage Data",
              description: "Analyzing signal strength and partner networks.",
            },
            {
              title: "User Reviews",
              description: "Aggregated ratings and traveler experiences.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-brand-navy/10 bg-white p-5">
              <div className="h-9 w-9 rounded-md bg-brand-navy text-white" />
              <h3 className="mt-3 text-2xl font-bold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-navy/75">{item.description}</p>
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-4xl font-bold text-brand-navy">The Team</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {["Maya Ortiz", "Rohan Mehta", "Ava Chen"].map((name) => (
              <article key={name} className="rounded-xl border border-brand-navy/10 bg-white p-4">
                <div className="h-12 w-12 rounded-full border border-brand-navy/20 bg-brand-paper" />
                <p className="mt-3 text-xl font-bold text-brand-navy">{name}</p>
                <p className="text-sm text-brand-navy/70">Travel Connectivity Research</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
