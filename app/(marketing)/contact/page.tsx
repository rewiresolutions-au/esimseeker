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
          title="Contact Us"
          description="We typically respond within one business day."
          breadcrumb="Home / Contact"
        />
        <section className="grid gap-6 md:grid-cols-2">
          <form className="space-y-3 rounded-xl border border-brand-navy/10 bg-white p-5">
            <input className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm" placeholder="Name" />
            <input className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm" placeholder="Email" />
            <select className="h-10 w-full rounded-lg border border-brand-navy/20 px-3 text-sm">
              <option>General Question</option>
              <option>Support</option>
              <option>Partnership</option>
            </select>
            <textarea className="h-32 w-full rounded-lg border border-brand-navy/20 px-3 py-2 text-sm" placeholder="Message" />
            <button type="button" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white">
              Send Message
            </button>
          </form>
          <aside className="space-y-4 rounded-xl border border-brand-navy/10 bg-white p-5">
            <div>
              <p className="text-sm font-semibold text-brand-navy">Email</p>
              <p className="text-sm text-brand-navy/75">hello@esimseeker.com</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-navy">Response time</p>
              <p className="text-sm text-brand-navy/75">Within 24 hours on weekdays.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-navy">Coverage note</p>
              <p className="text-sm text-brand-navy/75">We can help with 200+ destinations.</p>
            </div>
            <Link href="/faq" className="inline-flex text-sm font-semibold text-brand-teal hover:underline">
              Visit FAQ
            </Link>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
