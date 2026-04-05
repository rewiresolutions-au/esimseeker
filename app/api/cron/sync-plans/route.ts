import { NextResponse } from "next/server";
import {
  bundleToPlanRow,
  fetchAllCatalogue,
  EsimGoError,
} from "@/lib/esim-go";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BATCH = 200;

function authorizeCron(request: Request, secret: string): boolean {
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

/**
 * Expects a `plans` table with at least the columns produced by `bundleToPlanRow`
 * and a UNIQUE constraint on `bundle_name` for upsert.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (!authorizeCron(request, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bundles = await fetchAllCatalogue({ perPage: 100 });
    const rows = bundles.map(bundleToPlanRow);

    const supabase = createServiceRoleClient();
    let upserted = 0;

    for (let i = 0; i < rows.length; i += BATCH) {
      const chunk = rows.slice(i, i + BATCH);
      const { error } = await supabase.from("plans").upsert(chunk, {
        onConflict: "bundle_name",
      });
      if (error) {
        return NextResponse.json(
          { error: error.message, code: error.code, upserted },
          { status: 500 },
        );
      }
      upserted += chunk.length;
    }

    return NextResponse.json({
      ok: true,
      count: rows.length,
      upserted,
    });
  } catch (e) {
    if (e instanceof EsimGoError) {
      return NextResponse.json(
        {
          error: e.message,
          status: e.status,
          detail: e.body?.slice(0, 500),
        },
        { status: 502 },
      );
    }
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
