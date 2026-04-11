import type { Plan } from "@/lib/types/plans";

type PlanCardProps = {
  plan: Plan;
  reason?: string;
};

const badgeClassName: Record<string, string> = {
  "Best Value": "bg-brand-navy text-white",
  "Best Speed": "bg-brand-teal text-white",
  "Most Data": "bg-brand-paper text-brand-navy",
};

export const PlanCard = ({ plan, reason }: PlanCardProps) => {
  const reasonText =
    reason ??
    `Strong fit for ${plan.durationDays} days in ${plan.countrySlug.replace("-", " ")} with ${plan.dataGb}GB.`;
  return (
    <article className="rounded-xl border border-brand-navy/12 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
            {plan.providerLogoText}
          </p>
          <h3 className="mt-1 text-base font-bold text-brand-navy">{plan.name}</h3>
        </div>
        {plan.badge ? (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClassName[plan.badge]}`}>
            {plan.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 border-y border-brand-navy/15 py-3">
        <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-brand-navy/70">Data</p>
          <p className="text-sm font-semibold text-brand-navy">{plan.dataGb} GB</p>
        </div>
        <div>
          <p className="text-xs text-brand-navy/70">Duration</p>
          <p className="text-sm font-semibold text-brand-navy">{plan.durationDays} days</p>
        </div>
        <div>
          <p className="text-xs text-brand-navy/70">Price</p>
          <p className="text-sm font-semibold text-brand-navy">${plan.priceUsd}</p>
        </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-brand-navy/75">Why this fits you: {reasonText}</p>

      <a
        href={plan.buyUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand-red text-sm font-semibold text-white transition hover:bg-brand-red/90"
      >
        Get This Plan
      </a>
    </article>
  );
};
