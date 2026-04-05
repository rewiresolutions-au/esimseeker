import Link from "next/link";
import { getCountriesSortedByTraffic } from "@/lib/marketing/countries";

export function CountryGrid() {
  const countries = getCountriesSortedByTraffic();

  return (
    <section id="destinations" className="scroll-mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
        Popular destinations
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
        Jump to a country guide with trip types and stay lengths, or start from
        the wizard for a tailored shortlist.
      </p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {countries.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/esim/${c.slug}`}
              className="flex items-center justify-between rounded-lg border border-foreground/10 bg-background px-3 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-brand-teal/40 hover:text-brand-teal"
            >
              <span>{c.name}</span>
              <span aria-hidden className="text-foreground/40">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
