import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHero } from "@/components/layout/PageHero";

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Contact eSIMSeeker",
  description: "Reach our team for support questions, affiliate inquiries, or partnership opportunities.",
  alternates: { canonical: "https://esimseeker.com/contact" },
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageHero
          title="Get in Touch"
          description="We typically respond within 24 hours."
          breadcrumb="Home / Contact"
        />
        <section className="grid gap-6 md:grid-cols-2">
          <form className="space-y-3 rounded-xl border border-brand-navy/10 bg-white p-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-brand-navy/65">Your Name</label>
            <input className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm" />
            <label className="text-xs font-semibold uppercase tracking-wide text-brand-navy/65">
              Email Address
            </label>
            <input className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm" />
            <label className="text-xs font-semibold uppercase tracking-wide text-brand-navy/65">Subject</label>
            <select className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm">
              <option>General Inquiry</option>
              <option>Support</option>
              <option>Partnership</option>
            </select>
            <label className="text-xs font-semibold uppercase tracking-wide text-brand-navy/65">Message</label>
            <textarea className="h-32 w-full rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" />
            <button type="button" className="w-full rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white">
              Send Message
            </button>
          </form>
          <aside className="space-y-4">
            <div className="rounded-xl border border-brand-navy/10 bg-white p-5">
              <p className="text-sm font-semibold text-brand-navy">hello@esimseeker.com</p>
            </div>
            <div className="rounded-xl border border-brand-navy/10 bg-white p-5">
              <p className="text-sm font-semibold text-brand-navy">Response time</p>
              <p className="text-sm text-brand-navy/75">Within 24 hours</p>
            </div>
            <div className="rounded-xl border border-brand-navy/10 bg-white p-5">
              <p className="text-sm text-brand-navy/75">We support travellers worldwide.</p>
            </div>
          </aside>
        </section>
        <section className="rounded-2xl border border-brand-navy/10 bg-white px-6 py-8 text-center">
          <p className="text-3xl font-medium text-brand-navy">Looking for quick answers?</p>
          <p className="mt-2 text-3xl font-medium text-brand-navy">
            Check our{" "}
            <Link href="/faq" className="text-brand-red hover:underline">
              FAQ page.
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
