import { buildAffiliateUrl } from "@/lib/affiliate";
import type { PlanRecord } from "@/lib/types/plan";

type Props = { plan: PlanRecord };

export function PlanCard({ plan }: Props) {
  const href = buildAffiliateUrl({
    id: plan.id,
    providerSlug: plan.providerSlug,
    externalId: plan.externalId,
  });

  const dataLabel =
    plan.dataGb != null ? `${plan.dataGb} GB` : "Data (see details)";
  const daysLabel =
    plan.validityDays != null ? `${plan.validityDays} days` : "Validity TBC";
  const priceLabel =
    plan.priceUsd != null
      ? `$${plan.priceUsd.toFixed(2)}`
      : "Price on next step";

  return (
    <article className="rounded-lg border border-[#0A192F]/15 bg-[#F8F9FA] p-4 shadow-sm dark:border-white/10 dark:bg-[#0A192F]/80">
      <h3 className="text-base font-bold tracking-tight text-[#0A192F] dark:text-[#F8F9FA]">
        {plan.name}
      </h3>
      <dl className="mt-2 grid gap-1 text-sm text-[#0A192F]/80 dark:text-[#F8F9FA]/75">
        <div className="flex justify-between gap-2">
          <dt className="text-[#20B2AA]">Data</dt>
          <dd>{dataLabel}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-[#20B2AA]">Validity</dt>
          <dd>{daysLabel}</dd>
        </div>
        {plan.countryCode ? (
          <div className="flex justify-between gap-2">
            <dt className="text-[#20B2AA]">Region</dt>
            <dd>{plan.countryCode}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-[#20B2AA]">From</dt>
          <dd>{priceLabel}</dd>
        </div>
      </dl>
      <a
        href={href}
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#C0392B] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a33228]"
      >
        View deal
      </a>
    </article>
  );
}
