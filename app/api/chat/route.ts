import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { assignWizardBadges } from "@/lib/data/plan-badges";
import { getPlansForPersonaFromDb, resolveCountrySlugFromInput } from "@/lib/data/supabase-repository";
import type { DataPersona, Plan, WizardIntent } from "@/lib/types/plans";

export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(messageSchema).max(24).optional(),
});

const SYSTEM_PROMPT = `You are eSIMSeeker AI, a concise travel connectivity assistant.
Ask one question at a time until you have: destination, trip duration in days, and data persona.
Data persona must be one of: Budget, Balanced, Heavy, Unlimited.
When you have all fields, call get_plans immediately.
After results, summarize why the plans fit and offer next actions.
Never expose raw tool-call JSON or internal IDs to users.`;

type StreamPayload =
  | { type: "text"; delta: string }
  | { type: "done"; text: string; plans: Plan[]; intent: WizardIntent }
  | { type: "error"; message: string };

const writeNdjsonLine = (encoder: TextEncoder, controller: ReadableStreamDefaultController<Uint8Array>, payload: StreamPayload) => {
  controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it to your environment to enable AI chat.",
      },
      { status: 500 },
    );
  }

  let capturedPlans: Plan[] = [];
  let capturedIntent: WizardIntent = {};

  const getPlans = tool({
    description:
      "Retrieve eSIM plans for a destination based on trip duration and data usage persona.",
    inputSchema: z.object({
      destination: z.string().describe("Country name, slug, or ISO code."),
      durationDays: z.number().int().min(1).max(365),
      dataPersona: z.enum(["Budget", "Balanced", "Heavy", "Unlimited"]),
    }),
    execute: async ({ destination, durationDays, dataPersona }) => {
      const slug = await resolveCountrySlugFromInput(destination);
      if (!slug) {
        return {
          ok: false as const,
          error: "country_not_found",
          message: `No catalog match for "${destination}". Ask for a specific country.`,
        };
      }

      const rawPlans = await getPlansForPersonaFromDb(
        slug,
        durationDays,
        dataPersona as DataPersona,
      );
      const plans = assignWizardBadges(rawPlans);
      capturedPlans = plans;
      capturedIntent = {
        destination: slug,
        durationDays,
        dataPersona: dataPersona as DataPersona,
      };

      return {
        ok: true as const,
        countrySlug: slug,
        planCount: plans.length,
        summary: plans.map((plan) => ({
          provider: plan.provider,
          name: plan.name,
          dataGb: plan.dataGb,
          durationDays: plan.durationDays,
          priceUsd: plan.priceUsd,
        })),
      };
    },
  });

  const historyMessages = (parsed.data.history ?? []).map((message) => ({
    role: message.role as "user" | "assistant",
    content: message.content,
  }));

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o"),
    system: SYSTEM_PROMPT,
    temperature: 0.3,
    stopWhen: stepCountIs(8),
    messages: [
      ...historyMessages,
      { role: "user" as const, content: parsed.data.message },
    ],
    tools: { get_plans: getPlans },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let fullText = "";
        for await (const delta of result.textStream) {
          fullText += delta;
          writeNdjsonLine(encoder, controller, { type: "text", delta });
        }
        const text = fullText || (await result.text) || "";
        writeNdjsonLine(encoder, controller, {
          type: "done",
          text,
          plans: capturedPlans,
          intent: capturedIntent,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Stream failed.";
        writeNdjsonLine(encoder, controller, { type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
