import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env");
const envRaw = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx), line.slice(idx + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const countries = [
  { name: "Australia", iso_code: "AU", region: "Oceania" },
  { name: "United Kingdom", iso_code: "GB", region: "Europe" },
];
const providers = [
  {
    name: "Airalo",
    affiliate_base_url: "https://airalo.pxf.io/c/YOUR_ID/airalo",
    base_commission_pct: 7.0,
    affiliate_platform: "impact",
  },
  {
    name: "Holafly",
    affiliate_base_url: "https://holafly.pxf.io/c/YOUR_ID/holafly",
    base_commission_pct: 15.0,
    affiliate_platform: "impact",
  },
  {
    name: "Nomad",
    affiliate_base_url: "https://nomad.pxf.io/c/YOUR_ID/nomad",
    base_commission_pct: 10.0,
    affiliate_platform: "impact",
  },
];

const planSeeds = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    provider_name: "Airalo",
    country_iso: "AU",
    data_gb: 1,
    validity_days: 7,
    price_usd: 4.5,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    provider_name: "Airalo",
    country_iso: "AU",
    data_gb: 3,
    validity_days: 30,
    price_usd: 9,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
    provider_name: "Airalo",
    country_iso: "AU",
    data_gb: 5,
    validity_days: 30,
    price_usd: 12.5,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10",
    provider_name: "Airalo",
    country_iso: "AU",
    data_gb: 10,
    validity_days: 30,
    price_usd: 20,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
    provider_name: "Holafly",
    country_iso: "AU",
    data_gb: 999,
    validity_days: 5,
    price_usd: 19,
    network_type: "4G/5G",
    buy_url: "https://esim.holafly.com/",
    supports_voice: false,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb15",
    provider_name: "Holafly",
    country_iso: "AU",
    data_gb: 999,
    validity_days: 15,
    price_usd: 47,
    network_type: "4G/5G",
    buy_url: "https://esim.holafly.com/",
    supports_voice: false,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb30",
    provider_name: "Holafly",
    country_iso: "AU",
    data_gb: 999,
    validity_days: 30,
    price_usd: 75,
    network_type: "4G/5G",
    buy_url: "https://esim.holafly.com/",
    supports_voice: false,
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccc20",
    provider_name: "Nomad",
    country_iso: "AU",
    data_gb: 20,
    validity_days: 30,
    price_usd: 28,
    network_type: "5G",
    buy_url: "https://www.getnomad.app/",
    supports_voice: false,
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd1",
    provider_name: "Airalo",
    country_iso: "GB",
    data_gb: 1,
    validity_days: 7,
    price_usd: 5,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd3",
    provider_name: "Airalo",
    country_iso: "GB",
    data_gb: 3,
    validity_days: 30,
    price_usd: 10,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "dddddddd-dddd-dddd-dddd-ddddddddddd5",
    provider_name: "Airalo",
    country_iso: "GB",
    data_gb: 5,
    validity_days: 30,
    price_usd: 15,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddd10",
    provider_name: "Airalo",
    country_iso: "GB",
    data_gb: 10,
    validity_days: 30,
    price_usd: 22.5,
    network_type: "4G/5G",
    buy_url: "https://www.airalo.com/",
    supports_voice: false,
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeee15",
    provider_name: "Holafly",
    country_iso: "GB",
    data_gb: 999,
    validity_days: 15,
    price_usd: 47,
    network_type: "4G/5G",
    buy_url: "https://esim.holafly.com/",
    supports_voice: false,
  },
];

const upsert = async (table, rows, onConflict) => {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    throw new Error(`${table} upsert failed: ${error.message}`);
  }
};

await upsert("countries", countries, "iso_code");
await upsert("providers", providers, "name");

const { data: providerRows, error: providerReadError } = await supabase
  .from("providers")
  .select("id, name")
  .in(
    "name",
    providers.map((p) => p.name),
  );

if (providerReadError || !providerRows) {
  throw new Error(`providers read failed: ${providerReadError?.message ?? "empty response"}`);
}

const providerIdByName = new Map(providerRows.map((row) => [row.name, row.id]));
const plans = planSeeds.map(({ provider_name, ...plan }) => {
  const provider_id = providerIdByName.get(provider_name);
  if (!provider_id) {
    throw new Error(`Missing provider id for ${provider_name}`);
  }
  return { ...plan, provider_id };
});

await upsert("plans", plans, "id");

console.log(`Seed complete: ${countries.length} country, ${providers.length} providers, ${plans.length} plans.`);
