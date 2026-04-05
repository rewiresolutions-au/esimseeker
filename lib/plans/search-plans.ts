import type { PlanRecord, PlanSearchInput, PlanSearchResult } from "@/lib/types/plan";
import { getServiceSupabase } from "@/lib/supabase/server";

const MOCK: PlanRecord[] = [
  {
    id: "mock-jp-1",
    name: "Japan 10GB · 30 days",
    countryCode: "JP",
    dataGb: 10,
    validityDays: 30,
    priceUsd: 24.99,
    providerSlug: "demo",
    externalId: "ext-jp-1",
  },
  {
    id: "mock-jp-2",
    name: "Japan Unlimited Lite · 7 days",
    countryCode: "JP",
    dataGb: null,
    validityDays: 7,
    priceUsd: 19.5,
    providerSlug: "demo",
    externalId: "ext-jp-2",
  },
  {
    id: "mock-fr-1",
    name: "France 5GB · 14 days",
    countryCode: "FR",
    dataGb: 5,
    validityDays: 14,
    priceUsd: 14.0,
    providerSlug: "demo",
    externalId: "ext-fr-1",
  },
  {
    id: "mock-us-1",
    name: "USA 15GB · 30 days",
    countryCode: "US",
    dataGb: 15,
    validityDays: 30,
    priceUsd: 32.0,
    providerSlug: "demo",
    externalId: "ext-us-1",
  },
];

function normalizeRow(row: Record<string, unknown>): PlanRecord | null {
  const id = row.id ?? row.plan_id;
  if (typeof id !== "string") return null;
  return {
    id,
    name: typeof row.name === "string" ? row.name : "Plan",
    countryCode:
      typeof row.country_code === "string"
        ? row.country_code
        : typeof row.countryCode === "string"
          ? row.countryCode
          : null,
    dataGb:
      typeof row.data_gb === "number"
        ? row.data_gb
        : typeof row.dataGb === "number"
          ? row.dataGb
          : null,
    validityDays:
      typeof row.validity_days === "number"
        ? row.validity_days
        : typeof row.validityDays === "number"
          ? row.validityDays
          : null,
    priceUsd:
      typeof row.price_usd === "number"
        ? row.price_usd
        : typeof row.priceUsd === "number"
          ? row.priceUsd
          : null,
    providerSlug:
      typeof row.provider_slug === "string"
        ? row.provider_slug
        : typeof row.providerSlug === "string"
          ? row.providerSlug
          : null,
    externalId:
      typeof row.external_id === "string"
        ? row.external_id
        : typeof row.externalId === "string"
          ? row.externalId
          : null,
  };
}

function capLimit(limit?: number): number {
  const n = limit ?? 12;
  return Math.min(Math.max(n, 1), 24);
}

function mockSearch(input: PlanSearchInput): PlanSearchResult {
  const q = input.destination.trim().toLowerCase();
  const max = capLimit(input.limit);
  const plans = MOCK.filter((p) => {
    if (!q) return true;
    return (
      p.countryCode?.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (q.length === 2 && p.countryCode?.toLowerCase() === q)
    );
  }).slice(0, max);
  return { plans, source: "mock" };
}

/**
 * Shared server-side plan lookup used by `/api/plans` and AI tools.
 * Does not call `/api/plans` over HTTP (safe inside Route Handlers / tools).
 */
export async function searchPlans(input: PlanSearchInput): Promise<PlanSearchResult> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return mockSearch(input);
  }

  const term = input.destination.trim();
  if (!term) {
    return mockSearch(input);
  }

  const safe = term.replace(/[%*,()]/g, "").slice(0, 64);
  const like = `%${safe}%`;
  const perQuery = Math.min(capLimit(input.limit), 24);
  const select =
    "id, name, country_code, data_gb, validity_days, price_usd, provider_slug, external_id";

  const [byName, byCode] = await Promise.all([
    supabase.from("plans").select(select).ilike("name", like).limit(perQuery),
    supabase
      .from("plans")
      .select(select)
      .ilike("country_code", like)
      .limit(perQuery),
  ]);

  const merged = new Map<string, Record<string, unknown>>();
  for (const row of [...(byName.data ?? []), ...(byCode.data ?? [])]) {
    const id = (row as { id?: string }).id;
    if (id && !merged.has(id)) merged.set(id, row as Record<string, unknown>);
  }
  const data = [...merged.values()];

  if (byName.error && byCode.error) {
    return mockSearch(input);
  }

  if (!data.length) {
    return mockSearch(input);
  }

  const plans: PlanRecord[] = [];
  for (const row of data) {
    const rec = normalizeRow(row);
    if (rec) plans.push(rec);
  }

  const maxPlans = capLimit(input.limit);

  if (input.durationDays != null) {
    const d = input.durationDays;
    const filtered = plans.filter(
      (p) => p.validityDays == null || p.validityDays >= d,
    );
    if (filtered.length) {
      return { plans: filtered.slice(0, maxPlans), source: "supabase" };
    }
  }

  return { plans: plans.slice(0, maxPlans), source: "supabase" };
}
