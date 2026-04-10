const AFFILIATE_TOKENS: Record<string, string> = {
  airalo: "esimseeker_airalo_ref",
  nomad: "esimseeker_nomad_ref",
  holafly: "esimseeker_holafly_ref",
  "esim go": "esimseeker_esimgo_ref",
};

export const buildAffiliateUrl = (baseUrl: string, provider: string): string => {
  const token = AFFILIATE_TOKENS[provider.toLowerCase()];
  if (!token) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set("ref", token);
  return url.toString();
};
