import type { Plan, PlanBadge } from "@/lib/types/plans";

/** Assign up to three highlight badges across the wizard result set without duplicating a badge on the same plan. */
export const assignWizardBadges = (plans: Plan[]): Plan[] => {
  if (plans.length === 0) return [];
  const cheapest = [...plans].sort((a, b) => a.priceUsd - b.priceUsd)[0];
  const fastest = [...plans].sort((a, b) => b.speedScore - a.speedScore)[0];
  const mostData = [...plans].sort((a, b) => b.dataGb - a.dataGb)[0];
  const order: Array<{ plan: Plan; badge: PlanBadge }> = [
    { plan: cheapest, badge: "Best Value" },
    { plan: fastest, badge: "Best Speed" },
    { plan: mostData, badge: "Most Data" },
  ];
  const badgeById = new Map<string, PlanBadge>();
  for (const { plan, badge } of order) {
    if (!badgeById.has(plan.id)) {
      badgeById.set(plan.id, badge);
    }
  }
  return plans.map((plan) => ({
    ...plan,
    badge: badgeById.get(plan.id),
  }));
};
