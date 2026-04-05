import type { PlanSearchInput, PlanSearchResult } from "@/lib/types/plan";

/**
 * Server-only HTTP fetch to `/api/plans` using an absolute origin from
 * NEXT_PUBLIC_SITE_URL (or VERCEL_URL). Use when in-process `searchPlans` is
 * unavailable (e.g. isolated worker). Prefer `searchPlans` from `search-plans.ts`
 * in Route Handlers and tool `execute` functions.
 */
export async function fetchPlansViaHttp(
  input: PlanSearchInput,
): Promise<PlanSearchResult> {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null);
  if (!site) {
    throw new Error(
      "fetchPlansViaHttp requires NEXT_PUBLIC_SITE_URL or VERCEL_URL",
    );
  }

  const base = site.replace(/\/$/, "");
  const u = new URL("/api/plans", `${base}/`);
  u.searchParams.set("destination", input.destination);
  if (input.durationDays != null) {
    u.searchParams.set("durationDays", String(input.durationDays));
  }
  if (input.persona) u.searchParams.set("persona", input.persona);
  if (input.device) u.searchParams.set("device", input.device);
  if (input.voice) u.searchParams.set("voice", input.voice);
  if (input.limit != null) u.searchParams.set("limit", String(input.limit));

  const res = await fetch(u.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Plans API error: ${res.status}`);
  }
  return (await res.json()) as PlanSearchResult;
}
