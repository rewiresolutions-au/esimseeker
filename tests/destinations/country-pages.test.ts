import { describe, expect, it } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const COUNTRIES = ["japan", "thailand", "united-kingdom", "france", "italy", "indonesia"] as const;

describe("SSR country destination pages", () => {
  it.each(COUNTRIES)("renders at least one SSR plan row for %s", async (slug) => {
    const response = await fetch(`${BASE_URL}/destinations/${slug}`);
    expect(response.status).toBe(200);
    const html = await response.text();
    const rowMatches = html.match(/<tr[^>]*data-plan-row[^>]*>/g) ?? [];
    expect(rowMatches.length).toBeGreaterThan(0);
  });

  it.each(COUNTRIES)("matches SSR header count with SSR row count for %s", async (slug) => {
    const response = await fetch(`${BASE_URL}/destinations/${slug}`);
    expect(response.status).toBe(200);
    const html = await response.text();
    const headerMatch = html.match(/Compare\s+(\d+)\s+plans/i);
    expect(headerMatch).not.toBeNull();

    const rowMatches = html.match(/<tr[^>]*data-plan-row[^>]*>/g) ?? [];
    const headerCount = Number.parseInt(headerMatch?.[1] ?? "0", 10);
    expect(rowMatches.length).toBe(headerCount);
  });
});
