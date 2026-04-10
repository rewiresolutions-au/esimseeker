import type { Metadata } from "next";
import { WizardNav } from "@/components/layout/WizardNav";
import { TrustBar } from "@/components/wizard/TrustBar";
import { WizardExperience } from "@/components/wizard/WizardExperience";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "AI eSIM Wizard - eSIMSeeker",
    description: "Chat with our AI assistant and compare your top eSIM plans in under 60 seconds.",
    alternates: { canonical: "https://esimseeker.com/wizard" },
  };
};

type WizardPageProps = {
  searchParams: Promise<{ destination?: string }>;
};

export default async function WizardPage({ searchParams }: WizardPageProps) {
  const params = await searchParams;
  const destination = params.destination;

  return (
    <div className="flex min-h-screen flex-col bg-brand-paper">
      <WizardNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <WizardExperience destination={destination} />
      </main>
      <TrustBar />
    </div>
  );
}
