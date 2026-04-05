import { z } from "zod";
import { searchPlans } from "@/lib/plans/search-plans";

/**
 * Tool definitions for streamText. Plan lookup uses in-process `searchPlans`
 * (never a relative fetch to /api/plans). For HTTP access with an absolute URL,
 * see `fetchPlansViaHttp` in `lib/plans/fetch-plans-http.ts`.
 */
export const getPlansInputSchema = z.object({
  destination: z
    .string()
    .describe(
      "Country, region, or city the traveller needs coverage for (e.g. Japan, EU, Paris).",
    ),
  durationDays: z
    .number()
    .optional()
    .describe("Trip length in days when known."),
  persona: z
    .enum(["tourist", "business", "digital_nomad"])
    .optional()
    .describe("Travel style when inferable from the conversation."),
  device: z
    .enum(["iphone", "android", "other"])
    .optional()
    .describe("Primary handset platform when known."),
  voice: z
    .boolean()
    .optional()
    .describe("True if the user needs voice/SMS, not data-only."),
  limit: z
    .number()
    .min(1)
    .max(24)
    .optional()
    .describe("Cap on rows to return (catalog search); default 12."),
});

export type GetPlansInput = z.infer<typeof getPlansInputSchema>;

export const wizardTools = {
  getPlans: {
    description:
      "Search the eSIM plan catalogue for rows matching the user's destination and optional filters. Use whenever you need concrete plans to recommend or compare.",
    inputSchema: getPlansInputSchema,
    execute: async (input: GetPlansInput) =>
      searchPlans({
        destination: input.destination,
        durationDays: input.durationDays,
        persona: input.persona,
        device: input.device,
        voice:
          input.voice === undefined ? undefined : input.voice ? "yes" : "no",
        limit: input.limit,
      }),
  },
};
