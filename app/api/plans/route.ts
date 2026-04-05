import { searchPlans } from "@/lib/plans/search-plans";
import type { PlanSearchInput } from "@/lib/types/plan";
import { z } from "zod";

export const dynamic = "force-dynamic";

const planBodySchema = z.object({
  destination: z.string().min(1),
  durationDays: z.number().optional(),
  persona: z.string().optional(),
  device: z.string().optional(),
  voice: z.union([z.string(), z.boolean()]).optional(),
  limit: z.number().min(1).max(24).optional(),
});

function parseVoice(
  v: string | boolean | null | undefined,
): string | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  if (typeof v === "boolean") return v ? "yes" : "no";
  return v;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination")?.trim() ?? "";
  if (!destination) {
    return new Response(
      JSON.stringify({ error: "Query parameter `destination` is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const durationRaw = searchParams.get("durationDays");
  const durationDays =
    durationRaw != null && durationRaw !== ""
      ? Number.parseInt(durationRaw, 10)
      : undefined;

  const limitRaw = searchParams.get("limit");
  const limit =
    limitRaw != null && limitRaw !== ""
      ? Number.parseInt(limitRaw, 10)
      : undefined;

  const input: PlanSearchInput = {
    destination,
    durationDays:
      durationDays != null && !Number.isNaN(durationDays)
        ? durationDays
        : undefined,
    persona: searchParams.get("persona") ?? undefined,
    device: searchParams.get("device") ?? undefined,
    voice: parseVoice(searchParams.get("voice") ?? undefined),
    limit: limit != null && !Number.isNaN(limit) ? limit : undefined,
  };

  const result = await searchPlans(input);
  return Response.json(result);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = planBodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;
  const input: PlanSearchInput = {
    destination: body.destination.trim(),
    durationDays: body.durationDays,
    persona: body.persona,
    device: body.device,
    voice: parseVoice(body.voice),
    limit: body.limit,
  };

  const result = await searchPlans(input);
  return Response.json(result);
}
