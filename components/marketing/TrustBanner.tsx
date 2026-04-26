import { ShieldCheck } from "lucide-react";

export const TrustBanner = () => {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-brand-navy/10 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
          <ShieldCheck className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">Trust & transparency</p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-brand-navy md:text-3xl">
            Independent comparisons, clear affiliate disclosure
          </h2>
          <p className="mt-3 text-brand-navy/75">
            eSIMSeeker helps you compare plans quickly. We may earn a commission when you buy through our links; you
            still pay the provider’s public price. We do not sell plans or handle checkout—your purchase is always with
            the provider you choose.
          </p>
        </div>
      </div>
    </section>
  );
};
