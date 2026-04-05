import Link from "next/link";

export function Hero() {
  return (
    <section className="rounded-lg bg-brand-navy px-6 py-12 text-brand-paper shadow-sm sm:px-10 sm:py-16">
      <p className="mb-2 text-sm font-medium tracking-wide text-brand-teal">
        Compare eSIM data plans
      </p>
      <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Find the right eSIM before you fly
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-paper/90">
        eSIMSeeker helps you pick prepaid data for your destination—transparent
        pricing, fair comparisons, and a guided wizard when you want a
        recommendation.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/wizard"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-red px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Open plan wizard
        </Link>
        <a
          href="#destinations"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-paper/25 bg-transparent px-5 text-sm font-medium text-brand-paper hover:bg-white/5"
        >
          Browse destinations
        </a>
      </div>
    </section>
  );
}
