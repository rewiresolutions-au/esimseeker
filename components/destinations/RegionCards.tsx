import Link from "next/link";
import type { Region } from "@/lib/types/plans";

type RegionCardsProps = {
  regions: Region[];
};

export const RegionCards = ({ regions }: RegionCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {regions.map((region) => (
        <article
          key={region.slug}
          className="rounded-xl border border-brand-navy/10 bg-white p-5"
        >
          <h3 className="text-lg font-bold text-brand-navy">{region.name}</h3>
          <p className="mt-2 text-sm text-brand-navy/75">{region.description}</p>
          <Link
            href={`/esim/region/${region.slug}`}
            className="mt-4 inline-flex text-sm font-semibold text-brand-teal hover:underline"
          >
            Browse Plans
          </Link>
        </article>
      ))}
    </div>
  );
};
