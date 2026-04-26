type TuneAffiliateConfig = {
  /** e.g. "demo" -> https://demo.api.hasoffers.com/Apiv3/json */
  networkId: string;
  apiKey: string;
  apiBaseUrl: string;
};

type TuneApiEnvelope<T> = {
  response: {
    status: number;
    httpStatus: number;
    data: T;
    errorMessage: string | null;
    errors: unknown[];
  };
};

const getTuneAffiliateConfig = (): TuneAffiliateConfig | null => {
  const networkId = process.env.TUNE_NETWORK_ID ?? "";
  const apiKey = process.env.TUNE_API_KEY ?? "";
  const apiBaseUrl = process.env.TUNE_API_BASE_URL ?? "";

  if (!networkId || !apiKey) return null;

  return {
    networkId,
    apiKey,
    apiBaseUrl: apiBaseUrl || `https://${networkId}.api.hasoffers.com/Apiv3/json`,
  };
};

const buildTuneApiUrl = (
  config: TuneAffiliateConfig,
  target: string,
  method: string,
  extraParams: Record<string, string | number | undefined> = {},
) => {
  const url = new URL(config.apiBaseUrl);
  url.searchParams.set("Target", target);
  url.searchParams.set("Method", method);
  url.searchParams.set("api_key", config.apiKey);

  for (const [key, value] of Object.entries(extraParams)) {
    if (value === undefined) continue;
    url.searchParams.set(key, String(value));
  }

  return url;
};

export const tuneAffiliateRequest = async <T>(
  target: string,
  method: string,
  extraParams: Record<string, string | number | undefined> = {},
): Promise<T> => {
  const config = getTuneAffiliateConfig();
  if (!config) {
    throw new Error("Missing TUNE_NETWORK_ID or TUNE_API_KEY.");
  }

  const url = buildTuneApiUrl(config, target, method, extraParams);
  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TUNE API request failed (${response.status}).`);
  }

  const payload = (await response.json()) as TuneApiEnvelope<T>;
  if (payload.response.status !== 1) {
    throw new Error(payload.response.errorMessage ?? "TUNE API returned an error.");
  }

  return payload.response.data;
};

/**
 * Optional helper for pulling available offers from TUNE affiliate API.
 * Callers can override target/method if their network uses different endpoints.
 */
export const getTuneOffers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  target?: string;
  method?: string;
}) =>
  tuneAffiliateRequest<unknown>(
    params?.target ?? "Affiliate_Offer",
    params?.method ?? "findAll",
    {
      page: params?.page,
      limit: params?.limit,
      q: params?.search,
    },
  );
