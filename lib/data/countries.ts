import type { Country, Region } from "@/lib/types/plans";

export const REGIONS: Region[] = [
  {
    slug: "asia",
    name: "Asia",
    description: "High-value plans for city breaks, island hopping, and long stays.",
  },
  {
    slug: "europe",
    name: "Europe",
    description: "Multi-country roaming picks with strong 5G footprint.",
  },
  {
    slug: "americas",
    name: "Americas",
    description: "Reliable data options for North and South America routes.",
  },
  {
    slug: "middle-east",
    name: "Middle East",
    description: "Travel-ready plans with broad GCC and transit coverage.",
  },
  {
    slug: "africa",
    name: "Africa",
    description: "Balanced coverage and value for business and leisure travel.",
  },
  {
    slug: "oceania",
    name: "Oceania",
    description: "Low-friction plans for Australia, New Zealand, and beyond.",
  },
];

export const COUNTRIES: Country[] = [
  { slug: "japan", name: "Japan", isoCode: "JP", region: "asia", flagEmoji: "🇯🇵", planCount: 38, trafficRank: 1 },
  { slug: "thailand", name: "Thailand", isoCode: "TH", region: "asia", flagEmoji: "🇹🇭", planCount: 34, trafficRank: 2 },
  { slug: "indonesia", name: "Indonesia", isoCode: "ID", region: "asia", flagEmoji: "🇮🇩", planCount: 29, trafficRank: 5 },
  { slug: "united-kingdom", name: "United Kingdom", isoCode: "GB", region: "europe", flagEmoji: "🇬🇧", planCount: 31, trafficRank: 4 },
  { slug: "france", name: "France", isoCode: "FR", region: "europe", flagEmoji: "🇫🇷", planCount: 28, trafficRank: 8 },
  { slug: "italy", name: "Italy", isoCode: "IT", region: "europe", flagEmoji: "🇮🇹", planCount: 26, trafficRank: 9 },
  { slug: "united-states", name: "United States", isoCode: "US", region: "americas", flagEmoji: "🇺🇸", planCount: 37, trafficRank: 3 },
  { slug: "canada", name: "Canada", isoCode: "CA", region: "americas", flagEmoji: "🇨🇦", planCount: 24, trafficRank: 11 },
  { slug: "mexico", name: "Mexico", isoCode: "MX", region: "americas", flagEmoji: "🇲🇽", planCount: 21, trafficRank: 12 },
  { slug: "united-arab-emirates", name: "United Arab Emirates", isoCode: "AE", region: "middle-east", flagEmoji: "🇦🇪", planCount: 19, trafficRank: 10 },
  { slug: "south-africa", name: "South Africa", isoCode: "ZA", region: "africa", flagEmoji: "🇿🇦", planCount: 16, trafficRank: 14 },
  { slug: "australia", name: "Australia", isoCode: "AU", region: "oceania", flagEmoji: "🇦🇺", planCount: 22, trafficRank: 6 },
  { slug: "new-zealand", name: "New Zealand", isoCode: "NZ", region: "oceania", flagEmoji: "🇳🇿", planCount: 14, trafficRank: 15 },
];

export const TOP_COUNTRY_SLUGS = [...COUNTRIES].sort(
  (a, b) => a.trafficRank - b.trafficRank,
)
  .slice(0, 8)
  .map((country) => country.slug);

export const getCountryBySlug = (slug: string) =>
  COUNTRIES.find((country) => country.slug === slug);

export const getCountryByName = (name: string) =>
  COUNTRIES.find((country) => country.name.toLowerCase() === name.toLowerCase());
