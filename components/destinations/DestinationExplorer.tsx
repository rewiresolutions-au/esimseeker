"use client";

import { useEffect, useMemo, useState } from "react";
import { CountryGrid } from "@/components/destinations/CountryGrid";
import { RegionTabs } from "@/components/destinations/RegionTabs";
import type { Country, Region } from "@/lib/types/plans";

export const DestinationExplorer = () => {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch("/api/countries", { signal: controller.signal });
        if (!response.ok) return;
        const payload = (await response.json()) as { countries: Country[]; regions: Region[] };
        setCountries(payload.countries ?? []);
        setRegions(payload.regions ?? []);
      } catch {
        setCountries([]);
        setRegions([]);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return countries.filter((country) => {
      const regionMatch = region === "all" || country.region === region;
      const queryMatch = country.name.toLowerCase().includes(query.toLowerCase());
      return regionMatch && queryMatch;
    });
  }, [countries, query, region]);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section className="space-y-4">
      <div className="relative">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a country..."
          className="h-12 w-full rounded-full border border-brand-navy/20 bg-white px-5 pr-14 text-sm"
        />
        <span className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red text-white">
          ⌕
        </span>
      </div>
      <RegionTabs regions={regions} value={region} onChange={setRegion} />
      <CountryGrid countries={visible} />
      {!showAll && filtered.length > visible.length ? (
        <button
          onClick={() => setShowAll(true)}
          className="w-full rounded-full bg-brand-red px-4 py-3 text-sm font-semibold text-white"
        >
          Load All Countries
        </button>
      ) : null}
    </section>
  );
};
