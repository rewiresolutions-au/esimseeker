create extension if not exists pgcrypto;

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  iso_code char(2) unique not null,
  region text,
  created_at timestamptz default now()
);

create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  base_commission_pct numeric(5,2),
  affiliate_platform text,
  affiliate_base_url text,
  created_at timestamptz default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references providers(id),
  country_iso char(2) references countries(iso_code),
  data_gb numeric(6,2),
  validity_days int,
  price_usd numeric(8,2),
  supports_voice boolean default false,
  network_type text,
  buy_url text,
  last_synced_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_plans_country_iso on plans(country_iso);
create index if not exists idx_plans_provider_id on plans(provider_id);
create index if not exists idx_plans_price_usd on plans(price_usd);
