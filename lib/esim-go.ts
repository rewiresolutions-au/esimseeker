const DEFAULT_BASE = "https://api.esim-go.com/v2.1";

export type EsimGoCountry = {
  name?: string;
  region?: string;
  iso?: string;
};

export type EsimGoCatalogueBundle = {
  name: string;
  description?: string;
  countries?: EsimGoCountry[];
  dataAmount?: number;
  duration?: number;
  speed?: string[];
  autostart?: boolean;
  roamingEnabled?: EsimGoCountry[] | boolean;
  price?: number;
  [key: string]: unknown;
};

export class EsimGoError extends Error {
  readonly status: number;
  readonly body?: string;

  constructor(message: string, status: number, body?: string) {
    super(message);
    this.name = "EsimGoError";
    this.status = status;
    this.body = body;
  }
}

function getApiKey(): string {
  const key = process.env.ESIM_GO_API_KEY;
  if (!key) {
    throw new Error("ESIM_GO_API_KEY is not set");
  }
  return key;
}

function getBaseUrl(): string {
  return (process.env.ESIM_GO_API_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
}

export type FetchCataloguePageOptions = {
  page?: string;
  perPage?: number;
  direction?: string;
  orderBy?: string;
  filter?: string;
  filterBy?: string;
  signal?: AbortSignal;
};

/**
 * Single page from GET /catalogue (eSIM Go API v2.1).
 */
export async function fetchCataloguePage(
  options: FetchCataloguePageOptions = {},
): Promise<EsimGoCatalogueBundle[]> {
  const base = getBaseUrl();
  const url = new URL(`${base}/catalogue`);
  if (options.page != null) url.searchParams.set("page", String(options.page));
  if (options.perPage != null) {
    url.searchParams.set("perPage", String(options.perPage));
  }
  if (options.direction) url.searchParams.set("direction", options.direction);
  if (options.orderBy) url.searchParams.set("orderBy", options.orderBy);
  if (options.filter) url.searchParams.set("filter", options.filter);
  if (options.filterBy) url.searchParams.set("filterBy", options.filterBy);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-API-Key": getApiKey(),
    },
    signal: options.signal,
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new EsimGoError(
      `eSIM Go catalogue request failed: ${res.status}`,
      res.status,
      text,
    );
  }

  let data: unknown;
  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    throw new EsimGoError("Invalid JSON from eSIM Go catalogue", res.status, text);
  }

  if (!Array.isArray(data)) {
    throw new EsimGoError(
      "Unexpected catalogue response shape (expected array)",
      res.status,
      text,
    );
  }

  return data as EsimGoCatalogueBundle[];
}

export type FetchAllCatalogueOptions = Omit<
  FetchCataloguePageOptions,
  "page"
> & {
  /** Page size per request (default 100). */
  perPage?: number;
  /** Max pages as a safety cap (default 500). */
  maxPages?: number;
};

/**
 * Walks catalogue pages until an empty page or no next page.
 * Uses `page` query as string cursor per API docs.
 */
export async function fetchAllCatalogue(
  options: FetchAllCatalogueOptions = {},
): Promise<EsimGoCatalogueBundle[]> {
  const perPage = options.perPage ?? 100;
  const maxPages = options.maxPages ?? 500;
  const all: EsimGoCatalogueBundle[] = [];
  let pageNum = 1;
  let pagesFetched = 0;

  while (pagesFetched < maxPages) {
    const batch = await fetchCataloguePage({
      ...options,
      page: String(pageNum),
      perPage,
    });

    pagesFetched += 1;
    if (batch.length === 0) break;

    all.push(...batch);

    if (batch.length < perPage) break;
    pageNum += 1;
  }

  return all;
}

/** Row shape for Supabase `plans` upserts (see sync-plans cron). */
export type PlanUpsertFromBundle = {
  bundle_name: string;
  provider_slug: string;
  description: string | null;
  data_amount_mb: number | null;
  duration: number | null;
  price: number | null;
  countries: EsimGoCountry[] | null;
  speed: string[] | null;
  autostart: boolean | null;
  roaming_enabled: unknown;
  raw: EsimGoCatalogueBundle;
  updated_at: string;
};

export function bundleToPlanRow(
  bundle: EsimGoCatalogueBundle,
): PlanUpsertFromBundle {
  const roaming = bundle.roamingEnabled;
  return {
    bundle_name: bundle.name,
    provider_slug: "esim_go",
    description: bundle.description ?? null,
    data_amount_mb:
      typeof bundle.dataAmount === "number" ? bundle.dataAmount : null,
    duration: typeof bundle.duration === "number" ? bundle.duration : null,
    price: typeof bundle.price === "number" ? bundle.price : null,
    countries: Array.isArray(bundle.countries) ? bundle.countries : null,
    speed: Array.isArray(bundle.speed) ? bundle.speed : null,
    autostart: typeof bundle.autostart === "boolean" ? bundle.autostart : null,
    roaming_enabled:
      typeof roaming === "boolean" || Array.isArray(roaming) ? roaming : null,
    raw: bundle,
    updated_at: new Date().toISOString(),
  };
}
