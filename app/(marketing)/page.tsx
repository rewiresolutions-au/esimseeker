import { CountryGrid } from "@/components/marketing/CountryGrid";
import { Hero } from "@/components/marketing/Hero";
import type { Metadata } from "next";

/** Daily ISR for marketing home (copy and static country list refresh). */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare prepaid eSIM data plans",
  description:
    "Find prepaid eSIM plans by destination. Browse country guides, trip types, and stay lengths—or use the wizard for a tailored recommendation.",
};

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <CountryGrid />
    </div>
  );
}
