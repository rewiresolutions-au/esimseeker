/**
 * Build a tracked outbound URL for a plan CTA.
 */
export function buildAffiliateUrl(plan: {
  id: string;
  providerSlug?: string | null;
  externalId?: string | null;
}): string {
  const base = process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL ?? "/go";
  const q = new URLSearchParams();
  q.set("plan", plan.id);
  if (plan.providerSlug) q.set("p", plan.providerSlug);
  if (plan.externalId) q.set("e", plan.externalId);

  if (base.startsWith("http://") || base.startsWith("https://")) {
    const u = new URL(base.replace(/\/$/, ""));
    q.forEach((v, k) => u.searchParams.set(k, v));
    return u.toString();
  }

  const path = base.startsWith("/") ? base : `/${base}`;
  return `${path}?${q.toString()}`;
}
