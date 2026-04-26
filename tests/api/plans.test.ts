import { describe, expect, it } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const COUNTRIES = ["japan", "thailand", "united-kingdom", "france", "italy", "indonesia"] as const;

describe("GET /api/plans", () => {
  it.each(COUNTRIES)("returns at least one plan for %s", async (country) => {
    const response = await fetch(`${BASE_URL}/api/plans?country=${country}`);
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { plans?: unknown[] };
    expect(payload.plans?.length ?? 0).toBeGreaterThan(0);
  });
});
