import Link from "next/link";

export const WizardNav = () => {
  return (
    <header className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-base font-bold text-brand-navy">
          eSIMSeeker
        </Link>
        <Link href="/" className="text-sm font-medium text-brand-teal hover:underline">
          Back to Home
        </Link>
      </div>
    </header>
  );
};
