import type { UIMessage } from "ai";
import type { PlanRecord } from "@/lib/types/plan";

export function extractLatestPlansFromMessages(
  messages: UIMessage[],
): PlanRecord[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant") continue;
    const parts = msg.parts;
    if (!parts) continue;
    for (const part of parts) {
      if (
        part.type === "tool-getPlans" &&
        part.state === "output-available" &&
        part.output &&
        typeof part.output === "object" &&
        "plans" in part.output &&
        Array.isArray((part.output as { plans: unknown }).plans)
      ) {
        return (part.output as { plans: PlanRecord[] }).plans;
      }
    }
  }
  return [];
}
