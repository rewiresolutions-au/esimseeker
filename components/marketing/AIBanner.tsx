import Link from "next/link";

type AIBannerProps = {
  destination?: string;
};

export const AIBanner = ({ destination }: AIBannerProps) => {
  const href = destination
    ? `/wizard?destination=${encodeURIComponent(destination)}`
    : "/wizard";

  return (
    <section
      className="rounded-2xl border border-brand-red/25 bg-gradient-to-br from-brand-red/10 to-brand-red/5 p-6 md:p-8"
      aria-labelledby="ai-banner-heading"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">AI help</p>
      <h2 id="ai-banner-heading" className="font-heading mt-2 text-2xl font-semibold text-brand-navy md:text-3xl">
        Not sure which to pick? Ask our AI Wizard
      </h2>
      <p className="mt-2 max-w-2xl text-brand-navy/75">
        Tell us your destination, how long you are away, and how you use data—we will shortlist plans that fit, in one
        conversation.
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand-navy px-5 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
      >
        Open AI Wizard
      </Link>
    </section>
  );
};
