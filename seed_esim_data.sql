-- eSIMSeeker seed data for wizard QA flow
-- Adapted to the current schema (countries.iso_code, plans.country_iso, plans.validity_days).

-- 0) Ensure destinations exist
INSERT INTO countries (name, iso_code, region)
VALUES
  ('Australia', 'AU', 'Oceania'),
  ('United Kingdom', 'GB', 'Europe'),
  ('Japan', 'JP', 'Asia'),
  ('Thailand', 'TH', 'Asia')
ON CONFLICT (iso_code) DO UPDATE
SET name = EXCLUDED.name,
    region = EXCLUDED.region;

-- 1) Providers (stable UUIDs for deterministic plan references)
INSERT INTO providers (id, name, affiliate_base_url, base_commission_pct, affiliate_platform)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Airalo',  'https://airalo.pxf.io/c/YOUR_ID/airalo',  7.00,  'impact'),
  ('22222222-2222-2222-2222-222222222222', 'Holafly', 'https://holafly.pxf.io/c/YOUR_ID/holafly', 15.00, 'impact'),
  ('33333333-3333-3333-3333-333333333333', 'Nomad',   'https://nomad.pxf.io/c/YOUR_ID/nomad',   10.00, 'impact')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    affiliate_base_url = EXCLUDED.affiliate_base_url,
    base_commission_pct = EXCLUDED.base_commission_pct,
    affiliate_platform = EXCLUDED.affiliate_platform;

-- 2) Plans for AU + GB + JP + TH (including Unlimited coverage)
INSERT INTO plans (
  id, provider_id, country_iso, data_gb, validity_days, price_usd, network_type, buy_url, supports_voice
)
VALUES
  -- Budget / Balanced (Airalo)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'AU', 1,   7,  4.50, '4G/5G', 'https://www.airalo.com/', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', 'AU', 3,  30,  9.00, '4G/5G', 'https://www.airalo.com/', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111111', 'AU', 5,  30, 12.50, '4G/5G', 'https://www.airalo.com/', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', '11111111-1111-1111-1111-111111111111', 'AU', 10, 30, 20.00, '4G/5G', 'https://www.airalo.com/', false),

  -- Unlimited (Holafly; 999 == unlimited sentinel)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', '22222222-2222-2222-2222-222222222222', 'AU', 999,  5, 19.00, '4G/5G', 'https://esim.holafly.com/', false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb15', '22222222-2222-2222-2222-222222222222', 'AU', 999, 15, 47.00, '4G/5G', 'https://esim.holafly.com/', false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb30', '22222222-2222-2222-2222-222222222222', 'AU', 999, 30, 75.00, '4G/5G', 'https://esim.holafly.com/', false),

  -- Heavy (Nomad)
  ('cccccccc-cccc-cccc-cccc-cccccccccc20', '33333333-3333-3333-3333-333333333333', 'AU', 20, 30, 28.00, '5G', 'https://www.getnomad.app/', false),

  -- UK Budget / Balanced (Airalo)
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '11111111-1111-1111-1111-111111111111', 'GB', 1, 7, 5.00, '4G/5G', 'https://www.airalo.com/', false),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', '11111111-1111-1111-1111-111111111111', 'GB', 3, 30, 10.00, '4G/5G', 'https://www.airalo.com/', false),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd5', '11111111-1111-1111-1111-111111111111', 'GB', 5, 30, 15.00, '4G/5G', 'https://www.airalo.com/', false),
  ('dddddddd-dddd-dddd-dddd-dddddddddd10', '11111111-1111-1111-1111-111111111111', 'GB', 10, 30, 22.50, '4G/5G', 'https://www.airalo.com/', false),

  -- UK Unlimited (Holafly)
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee15', '22222222-2222-2222-2222-222222222222', 'GB', 999, 15, 47.00, '4G/5G', 'https://esim.holafly.com/', false),

  -- Japan Unlimited (Holafly)
  ('ffffffff-ffff-ffff-ffff-ffffffff0015', '22222222-2222-2222-2222-222222222222', 'JP', 999, 15, 47.00, '4G/5G', 'https://esim.holafly.com/', false),
  ('ffffffff-ffff-ffff-ffff-ffffffff0030', '22222222-2222-2222-2222-222222222222', 'JP', 999, 30, 75.00, '4G/5G', 'https://esim.holafly.com/', false),

  -- Thailand Unlimited (Holafly)
  ('99999999-9999-9999-9999-999999990015', '22222222-2222-2222-2222-222222222222', 'TH', 999, 15, 47.00, '4G/5G', 'https://esim.holafly.com/', false),
  ('99999999-9999-9999-9999-999999990030', '22222222-2222-2222-2222-222222222222', 'TH', 999, 30, 75.00, '4G/5G', 'https://esim.holafly.com/', false)
ON CONFLICT (id) DO UPDATE
SET provider_id = EXCLUDED.provider_id,
    country_iso = EXCLUDED.country_iso,
    data_gb = EXCLUDED.data_gb,
    validity_days = EXCLUDED.validity_days,
    price_usd = EXCLUDED.price_usd,
    network_type = EXCLUDED.network_type,
    buy_url = EXCLUDED.buy_url,
    supports_voice = EXCLUDED.supports_voice;
