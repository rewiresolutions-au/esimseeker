import Link from "next/link";

type AIBannerProps = {
  destination?: string;
};

export const AIBanner = ({ destination }: AIBannerProps) => {
  const href = destination
    ? `/wizard?destination=${encodeURIComponent(destination)}`
    : "/wizard";

  return (
    <section className="rounded-2xl border border-brand-red/20 bg-brand-red/5 p-6">
      <p className="text-sm font-semibold text-brand-red">Not sure which plan to pick?</p>
      <h2 className="mt-2 text-xl font-bold text-brand-navy">
        Let our AI recommend the best option for your trip.
      </h2>
      <p className="mt-2 text-brand-navy/70">
        We consider your destination, trip duration, and usage style in seconds.
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex h-10 items-center rounded-lg bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
      >
        Chat with AI
      </Link>
    </section>
  );
};
