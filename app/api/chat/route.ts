import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPlansForPersonaFromDb, resolveCountrySlugFromInput } from "@/lib/data/supabase-repository";
import type { DataPersona } from "@/lib/types/plans";

export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const requestSchema = z.object({
  message: z.string().min(1),
  history: z.array(messageSchema).max(20).optional(),
});

const toolArgumentsSchema = z.object({
  destination: z.string().min(1),
  durationDays: z.number().int().min(1).max(365),
  dataPersona: z.enum(["Budget", "Balanced", "Heavy", "Unlimited"]),
});

type OpenAIChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
};

const SYSTEM_PROMPT = `You are eSIMSeeker AI, a concise travel connectivity assistant.
Ask one question at a time until you have: destination, trip duration in days, and data persona.
Data persona must be one of: Budget, Balanced, Heavy, Unlimited.
When you have all fields, call get_plans immediately.
After results, summarize why the plans fit and offer next actions.
Never expose tool-call JSON to users.`;

const toolsDefinition = [
  {
    type: "function",
    function: {
      name: "get_plans",
      description:
        "Retrieve eSIM plans for a destination based on duration and data usage persona.",
      parameters: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "Country name, slug, or ISO code.",
          },
          durationDays: {
            type: "integer",
            minimum: 1,
            maximum: 365,
          },
          dataPersona: {
            type: "string",
            enum: ["Budget", "Balanced", "Heavy", "Unlimited"],
          },
        },
        required: ["destination", "durationDays", "dataPersona"],
      },
    },
  },
];

const fetchOpenAIChat = async (messages: OpenAIChatMessage[]) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      ok: false,
      error:
        "OPENAI_API_KEY is not configured. Add it to your environment to enable AI chat tool-calling.",
    } as const;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      tools: toolsDefinition,
      tool_choice: "auto",
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { ok: false, error: `OpenAI request failed: ${text}` } as const;
  }

  const data = await response.json();
  return { ok: true, data } as const;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const history: OpenAIChatMessage[] = (parsed.data.history ?? []).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const baseMessages: OpenAIChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: parsed.data.message },
  ];

  const firstPass = await fetchOpenAIChat(baseMessages);
  if (!firstPass.ok) {
    return NextResponse.json({ error: firstPass.error }, { status: 500 });
  }

  const choice = firstPass.data.choices?.[0]?.message;
  const toolCalls = (choice?.tool_calls ?? []) as OpenAIChatMessage["tool_calls"];

  if (!toolCalls || toolCalls.length === 0) {
    const reply = choice?.content ?? "Can you tell me your destination, trip length, and data needs?";
    return NextResponse.json({ reply, plans: [] });
  }

  const primaryToolCall = toolCalls.find((toolCall) => toolCall.function.name === "get_plans");
  if (!primaryToolCall) {
    const reply = choice?.content ?? "Tell me where you are traveling and for how long.";
    return NextResponse.json({ reply, plans: [] });
  }

  const parsedArguments = toolArgumentsSchema.safeParse(
    JSON.parse(primaryToolCall.function.arguments || "{}"),
  );

  if (!parsedArguments.success) {
    return NextResponse.json({
      reply: "I need your destination, duration, and data preference before I can fetch plans.",
      plans: [],
    });
  }

  const destinationSlug = await resolveCountrySlugFromInput(parsedArguments.data.destination);
  if (!destinationSlug) {
    return NextResponse.json({
      reply: `I could not find plans for "${parsedArguments.data.destination}" yet. Try a specific country name.`,
      plans: [],
      intent: parsedArguments.data,
    });
  }

  const plans = await getPlansForPersonaFromDb(
    destinationSlug,
    parsedArguments.data.durationDays,
    parsedArguments.data.dataPersona as DataPersona,
  );

  const toolResult = JSON.stringify({
    countrySlug: destinationSlug,
    planCount: plans.length,
    plans: plans.map((plan) => ({
      provider: plan.provider,
      name: plan.name,
      dataGb: plan.dataGb,
      durationDays: plan.durationDays,
      priceUsd: plan.priceUsd,
      networkType: plan.networkType,
    })),
  });

  const secondMessages: OpenAIChatMessage[] = [
    ...baseMessages,
    {
      role: "assistant",
      content: choice?.content ?? "",
      tool_calls: toolCalls,
    },
    {
      role: "tool",
      tool_call_id: primaryToolCall.id,
      content: toolResult,
    },
  ];

  const secondPass = await fetchOpenAIChat(secondMessages);
  if (!secondPass.ok) {
    return NextResponse.json({ error: secondPass.error }, { status: 500 });
  }

  const reply =
    secondPass.data.choices?.[0]?.message?.content ??
    "Here are your top matches. You can compare them or start a new search.";

  return NextResponse.json({
    reply,
    plans,
    intent: {
      destination: destinationSlug,
      durationDays: parsedArguments.data.durationDays,
      dataPersona: parsedArguments.data.dataPersona,
    },
  });
}
