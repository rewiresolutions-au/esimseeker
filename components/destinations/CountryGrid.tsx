import Link from "next/link";
import type { Country } from "@/lib/types/plans";

type CountryGridProps = {
  countries: Country[];
};

export const CountryGrid = ({ countries }: CountryGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {countries.map((country) => (
        <Link
          key={country.slug}
          href={`/esim/${country.slug}`}
          className="rounded-xl border border-brand-navy/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-teal/40"
        >
          <p className="text-xl">{country.flagEmoji}</p>
          <p className="mt-2 font-semibold text-brand-navy">{country.name}</p>
          <p className="text-sm text-brand-navy/70">{country.planCount} plans</p>
        </Link>
      ))}
    </div>
  );
};
