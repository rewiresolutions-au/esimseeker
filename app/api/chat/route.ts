import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { WIZARD_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { wizardTools } from "@/lib/ai/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: WIZARD_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: wizardTools,
    stopWhen: stepCountIs(8),
  });

  return result.toUIMessageStreamResponse();
}
