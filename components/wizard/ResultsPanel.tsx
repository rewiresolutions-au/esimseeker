import type { PlanRecord } from "@/lib/types/plan";
import { PlanCard } from "./PlanCard";

type Props = { plans: PlanRecord[] };

export function ResultsPanel({ plans }: Props) {
  return (
    <section
      className="flex min-h-0 flex-col rounded-lg border border-[#0A192F]/12 bg-white shadow-sm dark:border-white/10 dark:bg-[#0A192F]"
      aria-label="Matching plans"
    >
      <header className="border-b border-[#0A192F]/10 px-4 py-3 dark:border-white/10">
        <h2 className="text-lg font-bold tracking-tight text-[#0A192F] dark:text-[#F8F9FA]">
          Catalogue matches
        </h2>
        <p className="text-sm text-[#0A192F]/65 dark:text-[#F8F9FA]/60">
          Updated when the assistant runs a plan search.
        </p>
      </header>
      <div className="min-h-[200px] flex-1 overflow-y-auto p-4">
        {plans.length === 0 ? (
          <p className="text-sm text-[#0A192F]/60 dark:text-[#F8F9FA]/55">
            Ask for a destination or wait for the assistant to search — matching
            plans will show here.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
            {plans.map((plan) => (
              <li key={plan.id}>
                <PlanCard plan={plan} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
