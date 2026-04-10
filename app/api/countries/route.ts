import { NextResponse } from "next/server";
import { getCountriesFromDb, getRegionsFromDb } from "@/lib/data/supabase-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const [countries, regions] = await Promise.all([getCountriesFromDb(), getRegionsFromDb()]);
  return NextResponse.json({ countries, regions });
}
