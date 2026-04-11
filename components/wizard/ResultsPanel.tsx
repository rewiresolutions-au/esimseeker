import { PlanCard } from "@/components/wizard/PlanCard";
import type { Plan } from "@/lib/types/plans";

type ResultsPanelProps = {
  plans: Plan[];
};

export const ResultsPanel = ({ plans }: ResultsPanelProps) => {
  if (plans.length === 0) {
    return (
      <aside className="rounded-2xl border border-brand-navy/10 bg-white p-5">
        <h2 className="text-3xl font-bold text-brand-navy">Your Top Matches</h2>
        <p className="mt-2 text-sm text-brand-navy/70">
          Results appear after we collect destination, trip duration, and data usage.
        </p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-2xl border border-brand-navy/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-brand-navy">Your Top Matches</h2>
        <span className="text-brand-muted">•••</span>
      </div>
      {plans.slice(0, 3).map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
      <a href="#" className="inline-flex text-sm font-semibold text-brand-teal hover:underline">
        See all {plans.length} plans
      </a>
    </aside>
  );
};
