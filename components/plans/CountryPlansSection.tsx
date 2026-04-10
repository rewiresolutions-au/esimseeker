"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "@/components/plans/FilterBar";
import { PlanTable } from "@/components/plans/PlanTable";
import type { Plan } from "@/lib/types/plans";

type CountryPlansSectionProps = {
  countrySlug: string;
};

export const CountryPlansSection = ({ countrySlug }: CountryPlansSectionProps) => {
  const [filters, setFilters] = useState<{
    duration?: string;
    data?: string;
    provider?: string;
    sort?: string;
  }>({ sort: "price-asc" });

  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const loadPlans = async () => {
      try {
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
        if (!response.ok) return;
        const payload = (await response.json()) as { plans: Plan[] };
        setPlans(payload.plans ?? []);
      } catch {
        setPlans([]);
      }
    };

    loadPlans();
    return () => controller.abort();
  }, [countrySlug, filters]);

  const providers = useMemo(() => Array.from(new Set(plans.map((plan) => plan.provider))), [plans]);

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
      <PlanTable plans={plans} />
    </section>
  );
};
