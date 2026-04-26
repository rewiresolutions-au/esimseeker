import { NextRequest, NextResponse } from "next/server";
import {
  getAnyPlansFallback,
  getPlansByCountryFromDb,
  getPlansForPersonaFromDb,
  getTopPlansForCountryFromDb,
  resolveCountrySlugFromInput,
} from "@/lib/data/supabase-repository";
import type { DataPersona } from "@/lib/types/plans";

export const dynamic = "force-dynamic";

const parsePositiveInteger = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country");
  const destination = searchParams.get("destination");
  const dataPersona = searchParams.get("dataPersona") as DataPersona | null;
  const durationDays = parsePositiveInteger(searchParams.get("durationDays"));
  const minDataGb = parsePositiveInteger(searchParams.get("minDataGb"));
  const provider = searchParams.get("provider") ?? undefined;
  const sortBy =
    (searchParams.get("sortBy") as "price-asc" | "price-desc" | "rating-desc" | null) ??
    "price-asc";
  const top = searchParams.get("top") === "true";

  let countrySlug = country ?? undefined;
  if (!countrySlug && destination) {
    countrySlug = (await resolveCountrySlugFromInput(destination)) ?? undefined;
  }

  if (!countrySlug) {
    return NextResponse.json({ plans: [], error: "Missing country or destination parameter." }, { status: 400 });
  }

  if (durationDays && dataPersona) {
    const plans = await getPlansForPersonaFromDb(countrySlug, durationDays, dataPersona);
    return NextResponse.json({ plans, countrySlug });
  }

  if (top) {
    const plans = await getTopPlansForCountryFromDb(countrySlug);
    return NextResponse.json({ plans, countrySlug });
  }

  const plans = await getPlansByCountryFromDb(countrySlug, {
    durationDays,
    minDataGb,
    provider,
    sortBy,
  });

  const shouldFallbackToAnyPlans = !provider && !durationDays && !minDataGb;
  const safePlans =
    plans.length > 0 || !shouldFallbackToAnyPlans
      ? plans
      : await getAnyPlansFallback(countrySlug);
  return NextResponse.json({ plans: safePlans, countrySlug });
}
