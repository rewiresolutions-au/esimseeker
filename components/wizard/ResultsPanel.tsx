import Link from "next/link";
import { PlanCard } from "@/components/wizard/PlanCard";
import type { Plan } from "@/lib/types/plans";

type ResultsPanelProps = {
  plans: Plan[];
};

export const ResultsPanel = ({ plans }: ResultsPanelProps) => {
  if (plans.length === 0) {
    return (
      <aside className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-2xl font-semibold text-brand-navy">Your top matches</h2>
        <p className="mt-2 text-sm text-brand-navy/70">
          Results appear after we collect destination, trip duration, and data usage.
        </p>
      </aside>
    );
  }

  const countrySlug = plans[0]?.countrySlug;

  return (
    <aside className="space-y-4 rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-2xl font-semibold text-brand-navy">Your top matches</h2>
      </div>
      {plans.slice(0, 3).map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
      <Link
        href={countrySlug ? `/destinations/${countrySlug}` : "/destinations"}
        className="inline-flex text-sm font-semibold text-brand-teal hover:underline"
      >
        See all plans for this destination
      </Link>
    </aside>
  );
};
