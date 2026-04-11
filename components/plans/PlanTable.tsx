import type { Plan } from "@/lib/types/plans";

type PlanTableProps = {
  plans: Plan[];
};

export const PlanTable = ({ plans }: PlanTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-navy/20 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-brand-paper text-left text-brand-navy/80">
            <tr>
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Data</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Network</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.id} className="border-t border-brand-navy/10">
                <td className="px-4 py-3 font-semibold text-brand-navy">
                  {plan.provider}{" "}
                  {index === 0 ? (
                    <span className="ml-2 rounded-full bg-brand-navy px-2 py-0.5 text-xs text-white">
                      Best Value
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.dataGb} GB</td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.durationDays} days</td>
                <td className="px-4 py-3 font-semibold text-brand-navy">${plan.priceUsd}</td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.networkType}</td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.rating}</td>
                <td className="px-4 py-3">
                  <a
                    href={plan.buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    View Plan
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-brand-navy/10 px-4 py-3 text-center">
        <a href="#" className="text-sm font-semibold text-brand-navy underline underline-offset-2">
          Load More Plans
        </a>
      </div>
    </div>
  );
};
