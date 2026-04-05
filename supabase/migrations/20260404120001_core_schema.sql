-- Core catalogue schema: countries, providers, plans, plan_embeddings.
-- traffic_rank: lower = higher traffic / priority for pSEO static generation
-- (e.g. generateStaticParams: order ascending by traffic_rank, limit top N).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- countries
-- ---------------------------------------------------------------------------
create table public.countries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  iso2 varchar(2) unique,
  -- Explicit column for generateStaticParams / top-N country pre-render ordering.
  traffic_rank integer not null default 10000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint countries_traffic_rank_positive check (traffic_rank >= 0)
);

comment on column public.countries.traffic_rank is
  'Lower values first in ascending sort (1 = highest priority for static pSEO routes).';

create index countries_traffic_rank_idx on public.countries (traffic_rank asc);

create trigger countries_set_updated_at
  before update on public.countries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- providers (eSIM brands / resellers)
-- ---------------------------------------------------------------------------
create table public.providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger providers_set_updated_at
  before update on public.providers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- plans
-- ---------------------------------------------------------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers (id) on delete cascade,
  country_id uuid not null references public.countries (id) on delete cascade,
  external_sku text,
  name text not null,
  description text,
  data_gb numeric(12, 4),
  is_unlimited_data boolean not null default false,
  duration_days integer,
  voice_included boolean not null default false,
  sms_included boolean not null default false,
  price_usd numeric(12, 2),
  currency text not null default 'USD',
  affiliate_path text,
  raw_payload jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_provider_sku_unique unique (provider_id, external_sku)
);

create index plans_country_id_idx on public.plans (country_id);
create index plans_provider_id_idx on public.plans (provider_id);
create index plans_active_country_idx on public.plans (country_id) where is_active = true;

create trigger plans_set_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- plan_embeddings (pgvector; OpenAI text-embedding-3-small / ada-002 = 1536 dims)
-- ---------------------------------------------------------------------------
create table public.plan_embeddings (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  embedding extensions.vector (1536) not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint plan_embeddings_plan_unique unique (plan_id)
);

create index plan_embeddings_embedding_hnsw_idx
  on public.plan_embeddings
  using hnsw (embedding extensions.vector_cosine_ops);
