import type { Plan } from "@/lib/types/plans";

export type SailyPlanSource = {
  id: string;
  countryIso: string;
  countrySlug: string;
  title: string;
  dataGb: number;
  validityDays: number;
  priceUsd: number;
  networkType?: "4G" | "5G" | "4G/5G";
  supportsVoice?: boolean;
};

type SailyAffiliateConfig = {
  baseUrl: string;
  partnerId: string;
  campaignId?: string;
  defaultCouponCode?: string;
  /**
   * Optional full TUNE click URL. If set, Saily links will route through TUNE click tracking
   * and carry plan/destination in aff_sub parameters.
   */
  tuneClickUrl?: string;
};

const getSailyAffiliateConfig = (): SailyAffiliateConfig => {
  return {
    baseUrl: process.env.SAILY_AFFILIATE_BASE_URL ?? "https://saily.com/esim-global/",
    partnerId: process.env.SAILY_AFFILIATE_PARTNER_ID ?? "",
    campaignId: process.env.SAILY_AFFILIATE_CAMPAIGN_ID,
    defaultCouponCode: process.env.SAILY_DEFAULT_COUPON_CODE,
    tuneClickUrl: process.env.SAILY_TUNE_CLICK_URL,
  };
};

export const buildSailyAffiliateUrl = (params?: {
  destination?: string;
  planId?: string;
  couponCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) => {
  const config = getSailyAffiliateConfig();
  const hasTuneClickUrl = Boolean(config.tuneClickUrl);
  const url = new URL(config.tuneClickUrl ?? config.baseUrl);

  if (hasTuneClickUrl) {
    // TUNE sub IDs allow us to segment conversions by destination and specific plan.
    if (params?.planId) {
      url.searchParams.set("aff_sub", params.planId);
    }
    if (params?.destination) {
      url.searchParams.set("aff_sub2", params.destination);
    }
    const coupon = params?.couponCode ?? config.defaultCouponCode;
    if (coupon) {
      url.searchParams.set("aff_sub3", coupon);
    }

    if (params?.utmSource) url.searchParams.set("utm_source", params.utmSource);
    if (params?.utmMedium) url.searchParams.set("utm_medium", params.utmMedium);
    if (params?.utmCampaign) url.searchParams.set("utm_campaign", params.utmCampaign);
    return url.toString();
  }

  if (config.partnerId) {
    url.searchParams.set("partner_id", config.partnerId);
  }
  if (config.campaignId) {
    url.searchParams.set("campaign_id", config.campaignId);
  }
  if (params?.destination) {
    url.searchParams.set("destination", params.destination);
  }
  if (params?.planId) {
    url.searchParams.set("plan_id", params.planId);
  }

  const coupon = params?.couponCode ?? config.defaultCouponCode;
  if (coupon) {
    url.searchParams.set("coupon", coupon);
  }

  if (params?.utmSource) url.searchParams.set("utm_source", params.utmSource);
  if (params?.utmMedium) url.searchParams.set("utm_medium", params.utmMedium);
  if (params?.utmCampaign) url.searchParams.set("utm_campaign", params.utmCampaign);

  return url.toString();
};

const inferSpeedScore = (networkType: "4G" | "5G" | "4G/5G", dataGb: number) => {
  const base = networkType === "5G" ? 88 : networkType === "4G/5G" ? 84 : 78;
  return Math.min(99, base + Math.floor(dataGb / 4));
};

export const mapSailyPlanToPlatformPlan = (source: SailyPlanSource): Plan => {
  const networkType = source.networkType ?? (source.dataGb >= 10 ? "4G/5G" : "4G");
  return {
    id: source.id,
    provider: "Saily",
    providerLogoText: "Saily",
    countryIso: source.countryIso.toUpperCase(),
    countrySlug: source.countrySlug,
    name: source.title,
    dataGb: source.dataGb,
    durationDays: source.validityDays,
    priceUsd: source.priceUsd,
    networkType,
    rating: 4.5,
    speedScore: inferSpeedScore(networkType, source.dataGb),
    buyUrl: buildSailyAffiliateUrl({
      destination: source.countrySlug,
      planId: source.id,
      utmSource: "esimseeker",
      utmMedium: "affiliate",
      utmCampaign: "saily-plan-card",
    }),
    supportsVoice: Boolean(source.supportsVoice),
  };
};

export const mapSailyPlansToPlatformPlans = (plans: SailyPlanSource[]) =>
  plans.map(mapSailyPlanToPlatformPlan);
