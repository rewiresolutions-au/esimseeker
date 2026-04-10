import "server-only";

import { buildAffiliateUrl } from "@/lib/affiliate";
import { COUNTRIES, REGIONS, getCountryBySlug } from "@/lib/data/countries";
import {
  getFilteredPlans as getMockFilteredPlans,
  getPlansByCountry as getMockPlansByCountry,
  getPlansForPersona as getMockPlansForPersona,
  getTopPlansForCountry as getMockTopPlansForCountry,
} from "@/lib/data/plans";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Country, DataPersona, Plan, Region, RegionSlug } from "@/lib/types/plans";

type CountryRow = {
  name: string;
  iso_code: string;
  region: string | null;
};

type ProviderRow = {
  id: string;
  name: string;
};

type PlanRow = {
  id: string;
  provider_id: string;
  country_iso: string;
  data_gb: number;
  validity_days: number;
  price_usd: number;
  supports_voice: boolean | null;
  network_type: string | null;
  buy_url: string | null;
};

const DEFAULT_PROVIDER_URL: Record<string, string> = {
  Airalo: "https://www.airalo.com/",
  Holafly: "https://esim.holafly.com/",
  Nomad: "https://www.getnomad.app/",
  "eSIM Go": "https://www.esimgo.com/",
};

const normalizeRegion = (value: string | null): RegionSlug => {
  if (!value) return "asia";
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("middle")) return "middle-east";
  if (normalized.includes("america")) return "americas";
  if (normalized === "europe") return "europe";
  if (normalized === "africa") return "africa";
  if (normalized === "oceania") return "oceania";
  return "asia";
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const isoToFlagEmoji = (isoCode: string) => {
  const iso = isoCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return "🌍";
  return iso
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

const providerRating = (provider: string) => {
  switch (provider.toLowerCase()) {
    case "airalo":
      return 4.6;
    case "holafly":
      return 4.5;
    case "nomad":
      return 4.4;
    case "esim go":
      return 4.3;
    default:
      return 4.2;
  }
};

const providerSpeedScore = (provider: string, dataGb: number) => {
  const base = provider.toLowerCase() === "holafly" ? 86 : provider.toLowerCase() === "airalo" ? 84 : 80;
  return Math.min(99, base + Math.floor(dataGb / 3));
};

const sortPlans = (plans: Plan[], sortBy: "price-asc" | "price-desc" | "rating-desc" = "price-asc") => {
  if (sortBy === "price-desc") {
    return [...plans].sort((a, b) => b.priceUsd - a.priceUsd);
  }
  if (sortBy === "rating-desc") {
    return [...plans].sort((a, b) => b.rating - a.rating);
  }
  return [...plans].sort((a, b) => a.priceUsd - b.priceUsd);
};

const fallbackCountries = () => [...COUNTRIES].sort((a, b) => a.trafficRank - b.trafficRank);

const fallbackCountryBySlug = (slug: string) => getCountryBySlug(slug);

const buildTopPlans = (plans: Plan[]) => {
  if (plans.length === 0) return [];
  const cheapest = [...plans].sort((a, b) => a.priceUsd - b.priceUsd)[0];
  const fastest = [...plans].sort((a, b) => b.speedScore - a.speedScore)[0];
  const mostData = [...plans].sort((a, b) => b.dataGb - a.dataGb)[0];
  const badges = ["Best Value", "Best Speed", "Most Data"] as const;
  return [cheapest, fastest, mostData].map((plan, idx) => ({
    ...plan,
    badge: badges[idx],
  }));
};

const mapPlanRow = (
  row: PlanRow,
  countrySlug: string,
  providerName: string,
): Plan => {
  const safeNetworkType: Plan["networkType"] =
    row.network_type === "5G" || row.network_type === "4G" || row.network_type === "4G/5G"
      ? row.network_type
      : row.data_gb >= 10
        ? "4G/5G"
        : "4G";
  const baseUrl = row.buy_url ?? DEFAULT_PROVIDER_URL[providerName] ?? "https://esimseeker.com/";
  return {
    id: row.id,
    provider: providerName,
    providerLogoText: providerName,
    countryIso: row.country_iso.toUpperCase(),
    countrySlug,
    name: `${providerName} ${row.data_gb}GB ${row.validity_days} Days`,
    dataGb: Number(row.data_gb),
    durationDays: Number(row.validity_days),
    priceUsd: Number(row.price_usd),
    networkType: safeNetworkType,
    rating: providerRating(providerName),
    speedScore: providerSpeedScore(providerName, Number(row.data_gb)),
    buyUrl: buildAffiliateUrl(baseUrl, providerName),
    supportsVoice: Boolean(row.supports_voice),
  };
};

export const getRegionsFromDb = async (): Promise<Region[]> => REGIONS;

export const getCountriesFromDb = async (): Promise<Country[]> => {
  if (!isSupabaseConfigured) return fallbackCountries();

  try {
    const supabase = createSupabaseServerClient();
    const { data: countries, error: countriesError } = await supabase
      .from("countries")
      .select("name, iso_code, region");

    if (countriesError || !countries) return fallbackCountries();

    const { data: plans, error: plansError } = await supabase
      .from("plans")
      .select("country_iso");

    if (plansError) return fallbackCountries();

    const countByIso = new Map<string, number>();
    for (const row of plans ?? []) {
      const key = String((row as { country_iso: string }).country_iso).toUpperCase();
      countByIso.set(key, (countByIso.get(key) ?? 0) + 1);
    }

    const mapped = (countries as CountryRow[]).map((row) => ({
      slug: slugify(row.name),
      name: row.name,
      isoCode: row.iso_code.toUpperCase(),
      region: normalizeRegion(row.region),
      flagEmoji: isoToFlagEmoji(row.iso_code),
      planCount: countByIso.get(row.iso_code.toUpperCase()) ?? 0,
      trafficRank: 0,
    }));

    const sorted = mapped.sort((a, b) => b.planCount - a.planCount || a.name.localeCompare(b.name));
    return sorted.map((country, index) => ({ ...country, trafficRank: index + 1 }));
  } catch {
    return fallbackCountries();
  }
};

export const getTopCountrySlugsFromDb = async (limit = 8) => {
  const countries = await getCountriesFromDb();
  return countries.slice(0, limit).map((country) => country.slug);
};

export const getCountryBySlugFromDb = async (slug: string): Promise<Country | undefined> => {
  const countries = await getCountriesFromDb();
  return countries.find((country) => country.slug === slug) ?? fallbackCountryBySlug(slug);
};

export const getCountriesByRegionFromDb = async (region: RegionSlug): Promise<Country[]> => {
  const countries = await getCountriesFromDb();
  return countries.filter((country) => country.region === region);
};

export const getPlansByCountryFromDb = async (
  countrySlug: string,
  options?: {
    durationDays?: number;
    minDataGb?: number;
    provider?: string;
    sortBy?: "price-asc" | "price-desc" | "rating-desc";
  },
): Promise<Plan[]> => {
  if (!isSupabaseConfigured) {
    return getMockFilteredPlans(countrySlug, options);
  }

  try {
    const country = await getCountryBySlugFromDb(countrySlug);
    if (!country) return getMockFilteredPlans(countrySlug, options);

    const supabase = createSupabaseServerClient();
    const { data: providerRows, error: providerError } = await supabase
      .from("providers")
      .select("id, name");
    if (providerError || !providerRows) {
      return getMockFilteredPlans(countrySlug, options);
    }

    const providers = providerRows as ProviderRow[];
    let providerIdFilter: string | undefined;
    if (options?.provider) {
      providerIdFilter = providers.find((item) => item.name === options.provider)?.id;
      if (!providerIdFilter) return [];
    }

    let query = supabase
      .from("plans")
      .select("id, provider_id, country_iso, data_gb, validity_days, price_usd, supports_voice, network_type, buy_url")
      .eq("country_iso", country.isoCode);

    if (options?.durationDays) {
      query = query.eq("validity_days", options.durationDays);
    }
    if (options?.minDataGb) {
      query = query.gte("data_gb", options.minDataGb);
    }
    if (providerIdFilter) {
      query = query.eq("provider_id", providerIdFilter);
    }

    const { data: planRows, error: plansError } = await query;
    if (plansError || !planRows) {
      return getMockFilteredPlans(countrySlug, options);
    }

    const providerNameById = new Map(providers.map((provider) => [provider.id, provider.name]));

    const mapped = (planRows as PlanRow[]).map((row) => {
      const providerName = providerNameById.get(row.provider_id) ?? "eSIM Go";
      return mapPlanRow(row, country.slug, providerName);
    });

    return sortPlans(mapped, options?.sortBy);
  } catch {
    return getMockFilteredPlans(countrySlug, options);
  }
};

export const getTopPlansForCountryFromDb = async (countrySlug: string): Promise<Plan[]> => {
  if (!isSupabaseConfigured) return getMockTopPlansForCountry(countrySlug);
  const plans = await getPlansByCountryFromDb(countrySlug, { sortBy: "price-asc" });
  return buildTopPlans(plans);
};

export const getPlansForPersonaFromDb = async (
  countrySlug: string,
  durationDays: number,
  dataPersona: DataPersona,
) => {
  if (!isSupabaseConfigured) {
    return getMockPlansForPersona(countrySlug, durationDays, dataPersona);
  }
  const minDataGbByPersona: Record<DataPersona, number> = {
    Budget: 3,
    Balanced: 5,
    Heavy: 10,
    Unlimited: 20,
  };
  return getPlansByCountryFromDb(countrySlug, {
    durationDays,
    minDataGb: minDataGbByPersona[dataPersona],
    sortBy: dataPersona === "Budget" ? "price-asc" : "rating-desc",
  }).then((plans) => plans.slice(0, 3));
};

export const resolveCountrySlugFromInput = async (destination: string) => {
  const normalized = destination.trim().toLowerCase();
  const countries = await getCountriesFromDb();
  const direct =
    countries.find((country) => country.slug === normalized) ??
    countries.find((country) => country.name.toLowerCase() === normalized) ??
    countries.find((country) => country.isoCode.toLowerCase() === normalized);

  if (direct) return direct.slug;
  return null;
};

export const getAnyPlansFallback = async (countrySlug: string) => {
  const plans = await getPlansByCountryFromDb(countrySlug, { sortBy: "price-asc" });
  return plans.length > 0 ? plans : getMockPlansByCountry(countrySlug);
};
