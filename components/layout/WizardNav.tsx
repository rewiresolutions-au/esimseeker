import Link from "next/link";
import { EsimSeekerLogo } from "@/components/brand/EsimSeekerLogo";

export const WizardNav = () => {
  return (
    <header className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <EsimSeekerLogo variant="onLight" size="compact" />
        <Link href="/" className="text-sm font-medium text-brand-teal hover:underline">
          Back to Home
        </Link>
      </div>
    </header>
  );
};
