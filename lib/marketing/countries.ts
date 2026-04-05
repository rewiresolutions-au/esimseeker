/**
 * Marketing / pSEO country catalogue. Prefer Supabase `countries.traffic_rank` when wired;
 * this module keeps builds deterministic without DB.
 */
export type Country = {
  slug: string;
  name: string;
  /** Lower is higher priority for static generation */
  trafficRank: number;
};

/** Top destinations + long tail for validation (slug → display name) */
export const COUNTRIES: Country[] = [
  { slug: "united-states", name: "United States", trafficRank: 1 },
  { slug: "united-kingdom", name: "United Kingdom", trafficRank: 2 },
  { slug: "germany", name: "Germany", trafficRank: 3 },
  { slug: "france", name: "France", trafficRank: 4 },
  { slug: "spain", name: "Spain", trafficRank: 5 },
  { slug: "italy", name: "Italy", trafficRank: 6 },
  { slug: "japan", name: "Japan", trafficRank: 7 },
  { slug: "thailand", name: "Thailand", trafficRank: 8 },
  { slug: "mexico", name: "Mexico", trafficRank: 9 },
  { slug: "canada", name: "Canada", trafficRank: 10 },
  { slug: "australia", name: "Australia", trafficRank: 11 },
  { slug: "portugal", name: "Portugal", trafficRank: 12 },
  { slug: "netherlands", name: "Netherlands", trafficRank: 13 },
  { slug: "greece", name: "Greece", trafficRank: 14 },
  { slug: "turkey", name: "Türkiye", trafficRank: 15 },
  { slug: "uae", name: "United Arab Emirates", trafficRank: 16 },
  { slug: "india", name: "India", trafficRank: 17 },
  { slug: "brazil", name: "Brazil", trafficRank: 18 },
  { slug: "vietnam", name: "Vietnam", trafficRank: 19 },
  { slug: "indonesia", name: "Indonesia", trafficRank: 20 },
  { slug: "south-korea", name: "South Korea", trafficRank: 21 },
  { slug: "singapore", name: "Singapore", trafficRank: 22 },
  { slug: "switzerland", name: "Switzerland", trafficRank: 23 },
  { slug: "austria", name: "Austria", trafficRank: 24 },
  { slug: "poland", name: "Poland", trafficRank: 25 },
  { slug: "croatia", name: "Croatia", trafficRank: 26 },
  { slug: "ireland", name: "Ireland", trafficRank: 27 },
  { slug: "new-zealand", name: "New Zealand", trafficRank: 28 },
  { slug: "egypt", name: "Egypt", trafficRank: 29 },
  { slug: "morocco", name: "Morocco", trafficRank: 30 },
  { slug: "south-africa", name: "South Africa", trafficRank: 31 },
  { slug: "argentina", name: "Argentina", trafficRank: 32 },
  { slug: "colombia", name: "Colombia", trafficRank: 33 },
  { slug: "chile", name: "Chile", trafficRank: 34 },
  { slug: "peru", name: "Peru", trafficRank: 35 },
  { slug: "philippines", name: "Philippines", trafficRank: 36 },
  { slug: "malaysia", name: "Malaysia", trafficRank: 37 },
  { slug: "taiwan", name: "Taiwan", trafficRank: 38 },
  { slug: "hong-kong", name: "Hong Kong", trafficRank: 39 },
  { slug: "israel", name: "Israel", trafficRank: 40 },
  { slug: "saudi-arabia", name: "Saudi Arabia", trafficRank: 41 },
  { slug: "czech-republic", name: "Czech Republic", trafficRank: 42 },
  { slug: "hungary", name: "Hungary", trafficRank: 43 },
  { slug: "norway", name: "Norway", trafficRank: 44 },
  { slug: "sweden", name: "Sweden", trafficRank: 45 },
  { slug: "denmark", name: "Denmark", trafficRank: 46 },
  { slug: "finland", name: "Finland", trafficRank: 47 },
  { slug: "belgium", name: "Belgium", trafficRank: 48 },
  { slug: "romania", name: "Romania", trafficRank: 49 },
  { slug: "bulgaria", name: "Bulgaria", trafficRank: 50 },
  { slug: "iceland", name: "Iceland", trafficRank: 51 },
  { slug: "malta", name: "Malta", trafficRank: 52 },
  { slug: "cyprus", name: "Cyprus", trafficRank: 53 },
  { slug: "sri-lanka", name: "Sri Lanka", trafficRank: 54 },
  { slug: "nepal", name: "Nepal", trafficRank: 55 },
  { slug: "jordan", name: "Jordan", trafficRank: 56 },
  { slug: "qatar", name: "Qatar", trafficRank: 57 },
  { slug: "kenya", name: "Kenya", trafficRank: 58 },
  { slug: "tanzania", name: "Tanzania", trafficRank: 59 },
  { slug: "costa-rica", name: "Costa Rica", trafficRank: 60 },
];

const bySlug = new Map(COUNTRIES.map((c) => [c.slug, c]));

export function getCountryBySlug(slug: string): Country | undefined {
  return bySlug.get(slug);
}

export function getCountriesSortedByTraffic(): Country[] {
  return [...COUNTRIES].sort((a, b) => a.trafficRank - b.trafficRank);
}

export function getTopCountrySlugs(limit = 55): string[] {
  return getCountriesSortedByTraffic()
    .slice(0, limit)
    .map((c) => c.slug);
}
