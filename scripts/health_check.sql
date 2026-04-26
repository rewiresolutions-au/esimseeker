-- eSIMSeeker production data health checks.
-- Run against Supabase SQL editor or psql connection.

-- Core row count sanity.
SELECT COUNT(*) FROM plans;

-- Top countries by number of plans.
SELECT country_iso, COUNT(*) FROM plans GROUP BY country_iso ORDER BY 2 DESC LIMIT 20;

-- Japan-specific availability check.
SELECT COUNT(*) FROM plans WHERE country_iso = 'JP';

-- Country lookup sanity for Japan.
-- Note: current schema stores iso_code/name; no dedicated slug column.
SELECT id, name, iso_code
FROM countries
WHERE LOWER(name) = 'japan' OR iso_code = 'JP';

-- Provider distribution.
SELECT provider_id, COUNT(*) FROM plans GROUP BY provider_id;
