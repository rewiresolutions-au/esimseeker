export type DataPersona = "Budget" | "Balanced" | "Heavy" | "Unlimited";

export type Country = {
  slug: string;
  name: string;
  isoCode: string;
  region: RegionSlug;
  flagEmoji: string;
  planCount: number;
  trafficRank: number;
};

export type RegionSlug =
  | "asia"
  | "europe"
  | "americas"
  | "middle-east"
  | "africa"
  | "oceania";

export type Region = {
  slug: RegionSlug;
  name: string;
  description: string;
};

export type PlanBadge = "Best Value" | "Best Speed" | "Most Data";

export type Plan = {
  id: string;
  provider: string;
  providerLogoText: string;
  countryIso: string;
  countrySlug: string;
  name: string;
  dataGb: number;
  durationDays: number;
  priceUsd: number;
  networkType: "4G" | "5G" | "4G/5G";
  rating: number;
  speedScore: number;
  badge?: PlanBadge;
  buyUrl: string;
  supportsVoice: boolean;
};

export type WizardIntent = {
  destination?: string;
  durationDays?: number;
  dataPersona?: DataPersona;
};
