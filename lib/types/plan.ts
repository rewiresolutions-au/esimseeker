export type PlanRecord = {
  id: string;
  name: string;
  countryCode: string | null;
  dataGb: number | null;
  validityDays: number | null;
  priceUsd: number | null;
  providerSlug: string | null;
  externalId: string | null;
};

export type PlanSearchInput = {
  destination: string;
  durationDays?: number;
  persona?: string;
  device?: string;
  voice?: string;
  /** Max plans to return (default 12). */
  limit?: number;
};

export type PlanSearchResult = {
  plans: PlanRecord[];
  source: "supabase" | "mock";
};
