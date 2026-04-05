-- Row level security: public catalogue reads for anon + authenticated.
-- Writes are intended for service_role (cron / server) only — no insert/update policies.

alter table public.countries enable row level security;
alter table public.providers enable row level security;
alter table public.plans enable row level security;
alter table public.plan_embeddings enable row level security;

-- Countries & providers: needed for marketing / plan cards with the anon key.
create policy countries_select_public
  on public.countries
  for select
  to anon, authenticated
  using (true);

create policy providers_select_public
  on public.providers
  for select
  to anon, authenticated
  using (true);

-- Plans: public read of active rows only.
create policy plans_select_public
  on public.plans
  for select
  to anon, authenticated
  using (is_active = true);

-- Embeddings: public read when parent plan is active (spec: public read on plan_embeddings).
create policy plan_embeddings_select_public
  on public.plan_embeddings
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.plans p
      where p.id = plan_embeddings.plan_id
        and p.is_active = true
    )
  );
