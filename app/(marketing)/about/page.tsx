import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { LAST_UPDATED } from "@/lib/content/about-meta";
import { FOUNDER } from "@/lib/content/founder";
import { METHODOLOGY_CARDS } from "@/lib/content/methodology";

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
          title="About eSIMSeeker."
          description="eSIMSeeker helps people compare global connectivity options with transparency and speed."
          breadcrumb="Home / About"
        />

        <section className="rounded-2xl border border-brand-navy/10 bg-white p-6">
          <h2 className="text-3xl font-bold text-brand-navy">Founder</h2>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border border-brand-navy/20 sm:h-[200px] sm:w-[200px]">
              <Image
                src={FOUNDER.photoUrl}
                alt={FOUNDER.name}
                fill
                sizes="(max-width: 640px) 120px, 200px"
                className="object-cover"
              />
            </div>
            <article>
              <h3 className="text-2xl font-bold text-brand-navy">{FOUNDER.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-navy/75">
                {FOUNDER.role} - {FOUNDER.location}
              </p>
              <p className="mt-4 text-brand-navy/80">{FOUNDER.bio}</p>
              {FOUNDER.linkedinUrl ? (
                <a
                  href={FOUNDER.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy hover:bg-brand-paper"
                >
                  LinkedIn
                </a>
              ) : null}
            </article>
          </div>
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

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-brand-navy">How we evaluate plans</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {METHODOLOGY_CARDS.map((item) => (
              <article key={item.title} className="rounded-xl border border-brand-navy/10 bg-white p-5">
                <div className="h-9 w-9 rounded-md bg-brand-navy text-white" />
                <h3 className="mt-3 text-2xl font-bold text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-navy/75">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <p className="text-sm text-brand-navy/60">Last updated: {LAST_UPDATED}</p>
      </main>
      <Footer />
    </div>
  );
}
