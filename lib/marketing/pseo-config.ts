/** Activity slugs for `/esim/[country]/activity/[activity]` */
export const ACTIVITY_SLUGS = [
  "travel",
  "business",
  "remote-work",
  "study-abroad",
  "layover",
] as const;

export type ActivitySlug = (typeof ACTIVITY_SLUGS)[number];

export const ACTIVITY_LABELS: Record<ActivitySlug, string> = {
  travel: "Travel",
  business: "Business",
  "remote-work": "Remote work",
  "study-abroad": "Study abroad",
  layover: "Layover & short trips",
};

/** Duration slugs for `/esim/[country]/duration/[duration]` */
export const DURATION_SLUGS = [
  "3-days",
  "7-days",
  "14-days",
  "30-days",
  "90-days",
] as const;

export type DurationSlug = (typeof DURATION_SLUGS)[number];

export const DURATION_LABELS: Record<DurationSlug, string> = {
  "3-days": "3 days",
  "7-days": "1 week",
  "14-days": "2 weeks",
  "30-days": "30 days",
  "90-days": "90 days",
};

export function isActivitySlug(s: string): s is ActivitySlug {
  return (ACTIVITY_SLUGS as readonly string[]).includes(s);
}

export function isDurationSlug(s: string): s is DurationSlug {
  return (DURATION_SLUGS as readonly string[]).includes(s);
}
