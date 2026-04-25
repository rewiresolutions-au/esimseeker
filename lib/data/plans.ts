import { COUNTRIES } from "@/lib/data/countries";
import { buildAffiliateUrl } from "@/lib/affiliate";
import type { DataPersona, Plan } from "@/lib/types/plans";

const providerBaseUrls = {
  Airalo: "https://www.airalo.com/",
  Holafly: "https://esim.holafly.com/",
  Nomad: "https://www.getnomad.app/",
  "eSIM Go": "https://www.esimgo.com/",
} as const;

const providers = ["Airalo", "Holafly", "Nomad", "eSIM Go"] as const;
const dataOptions = [3, 5, 10, 20, 50] as const;
const durationOptions = [7, 10, 14, 30] as const;

const mkPrice = (dataGb: number, days: number, providerIndex: number) => {
  const base = dataGb * 1.35 + days * 0.22;
  return Number((base + providerIndex * 1.3 + 2.99).toFixed(2));
};

const mkRating = (providerIndex: number) => Number((4.2 + providerIndex * 0.15).toFixed(1));

const mkNetworkType = (dataGb: number): "4G" | "5G" | "4G/5G" => {
  if (dataGb >= 20) return "5G";
  if (dataGb >= 10) return "4G/5G";
  return "4G";
};

const planRows: Plan[] = COUNTRIES.flatMap((country) => {
  return dataOptions.slice(0, 4).map((dataGb, idx) => {
    const provider = providers[(country.trafficRank + idx) % providers.length];
    const days = durationOptions[idx % durationOptions.length];
    const providerIndex = providers.indexOf(provider);
    const speedScore = 70 + providerIndex * 6 + idx * 4;
    const id = `${country.isoCode.toLowerCase()}-${provider.toLowerCase().replace(/\s+/g, "-")}-${dataGb}gb-${days}d`;
    return {
      id,
      provider,
      providerLogoText: provider,
      countryIso: country.isoCode,
      countrySlug: country.slug,
      name: `${country.name} ${dataGb}GB ${days} Days`,
      dataGb,
      durationDays: days,
      priceUsd: mkPrice(dataGb, days, providerIndex),
      networkType: mkNetworkType(dataGb),
      rating: mkRating(providerIndex),
      speedScore,
      buyUrl: buildAffiliateUrl(providerBaseUrls[provider], provider),
      supportsVoice: provider === "Holafly",
    };
  });
});

export const PLANS: Plan[] = planRows;

export const getPlansByCountry = (countrySlug: string): Plan[] =>
  PLANS.filter((plan) => plan.countrySlug === countrySlug).sort((a, b) => a.priceUsd - b.priceUsd);

export const getTopPlansForCountry = (countrySlug: string): Plan[] => {
  const plans = getPlansByCountry(countrySlug);
  if (plans.length === 0) return [];

  const cheapest = [...plans].sort((a, b) => a.priceUsd - b.priceUsd)[0];
  const fastest = [...plans].sort((a, b) => b.speedScore - a.speedScore)[0];
  const mostData = [...plans].sort((a, b) => b.dataGb - a.dataGb)[0];

  return [cheapest, fastest, mostData].map((plan, idx) => ({
    ...plan,
    badge: idx === 0 ? "Best Value" : idx === 1 ? "Best Speed" : "Most Data",
  }));
};

export const getFilteredPlans = (
  countrySlug: string,
  options?: {
    durationDays?: number;
    minDataGb?: number;
    provider?: string;
    sortBy?: "price-asc" | "price-desc" | "rating-desc";
  },
) => {
  let filtered = getPlansByCountry(countrySlug);

  if (options?.durationDays) {
    const durationDays = options.durationDays;
    filtered = filtered.filter((plan) => plan.durationDays >= durationDays);
  }
  if (options?.minDataGb) {
    const minDataGb = options.minDataGb;
    filtered = filtered.filter((plan) => plan.dataGb >= minDataGb);
  }
  if (options?.provider) {
    const provider = options.provider;
    filtered = filtered.filter((plan) => plan.provider === provider);
  }

  switch (options?.sortBy) {
    case "price-desc":
      return [...filtered].sort((a, b) => b.priceUsd - a.priceUsd);
    case "rating-desc":
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case "price-asc":
    default:
      return [...filtered].sort((a, b) => a.priceUsd - b.priceUsd);
  }
};

export const getPlansForPersona = (
  countrySlug: string,
  durationDays: number,
  dataPersona: DataPersona,
) => {
  const plans = getFilteredPlans(countrySlug, {
    durationDays,
    sortBy: dataPersona === "Budget" ? "price-asc" : "rating-desc",
  });
  const filtered = plans.filter((plan) => {
    if (dataPersona === "Budget") return plan.dataGb <= 5;
    if (dataPersona === "Balanced") return plan.dataGb > 5 && plan.dataGb <= 15;
    if (dataPersona === "Heavy") return plan.dataGb > 15 && plan.dataGb < 999;
    return plan.dataGb === 999;
  });
  return filtered.slice(0, 3);
};
