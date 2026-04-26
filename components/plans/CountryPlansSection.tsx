"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterBar } from "@/components/plans/FilterBar";
import { PlanTable } from "@/components/plans/PlanTable";
import type { Plan } from "@/lib/types/plans";

type CountryPlansSectionProps = {
  countrySlug: string;
  countryName: string;
  initialPlans: Plan[];
  initialLoadError?: boolean;
};

export const CountryPlansSection = ({
  countrySlug,
  countryName,
  initialPlans,
  initialLoadError = false,
}: CountryPlansSectionProps) => {
  const [filters, setFilters] = useState<{
    duration?: string;
    data?: string;
    provider?: string;
    sort?: string;
  }>({ sort: "price-asc" });

  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const skipFirstFetch = useRef(true);

  useEffect(() => {
    setPlans(initialPlans);
    setError(initialLoadError ? "server-load-failed" : null);
    setFilters({ sort: "price-asc" });
    skipFirstFetch.current = true;
  }, [countrySlug, initialPlans, initialLoadError]);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    const controller = new AbortController();
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchParams = new URLSearchParams({
          country: countrySlug,
          sortBy: filters.sort ?? "price-asc",
        });
        if (filters.duration) searchParams.set("durationDays", filters.duration);
        if (filters.data) searchParams.set("minDataGb", filters.data);
        if (filters.provider) searchParams.set("provider", filters.provider);

        const response = await fetch(`/api/plans?${searchParams.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setError(`http-${response.status}`);
          setPlans([]);
          return;
        }
        const payload = (await response.json()) as { plans: Plan[] };
        setPlans(payload.plans ?? []);
      } catch (err: unknown) {
        const e = err as { name?: string; message?: string; stack?: string };
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Unknown error");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
    return () => controller.abort();
  }, [countrySlug, filters]);

  const providers = useMemo(() => Array.from(new Set(plans.map((plan) => plan.provider))), [plans]);
  const hasFilters = Boolean(filters.duration || filters.data || filters.provider);

  return (
    <section className="space-y-4">
      <FilterBar
        duration={filters.duration}
        data={filters.data}
        provider={filters.provider}
        sort={filters.sort}
        providers={providers}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
      />
      {initialLoadError ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">We&apos;re having trouble loading plans right now.</p>
          <p className="mt-1">Try the AI Wizard or refresh in a moment.</p>
          <Link
            href={`/wizard?destination=${encodeURIComponent(countryName)}`}
            className="mt-3 inline-flex rounded-lg bg-brand-red px-3 py-2 text-xs font-semibold text-white"
          >
            Ask the AI Wizard
          </Link>
        </div>
      ) : null}
      {!initialLoadError && plans.length === 0 ? (
        <div className="rounded-xl border border-brand-navy/20 bg-brand-paper p-4 text-sm text-brand-navy">
          <p className="font-semibold">No plans match your filters.</p>
          <p className="mt-1">Reset filters or ask the AI Wizard for a recommendation.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilters({ sort: "price-asc" })}
              className="rounded-lg border border-brand-navy/20 bg-white px-3 py-2 text-xs font-semibold text-brand-navy"
            >
              Reset filters
            </button>
            <Link
              href={`/wizard?destination=${encodeURIComponent(countryName)}`}
              className="inline-flex rounded-lg bg-brand-red px-3 py-2 text-xs font-semibold text-white"
            >
              Ask the AI Wizard
            </Link>
          </div>
          {loading ? <p className="mt-2 text-xs text-brand-navy/70">Loading updated plans...</p> : null}
          {error && hasFilters ? <p className="mt-2 text-xs text-brand-navy/70">We could not refresh filtered results.</p> : null}
        </div>
      ) : null}
      {plans.length > 0 ? <PlanTable plans={plans} /> : null}
    </section>
  );
};
