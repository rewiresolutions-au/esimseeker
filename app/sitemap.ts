import type { MetadataRoute } from "next";
import { COUNTRIES, REGIONS } from "@/lib/data/countries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://esimseeker.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/destinations",
    "/faq",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    "/wizard",
  ];

  const countryDestinationRoutes = COUNTRIES.map((country) => `/destinations/${country.slug}`);
  const esimCountryRoutes = COUNTRIES.map((country) => `/esim/${country.slug}`);
  const esimRegionRoutes = REGIONS.map((region) => `/esim/region/${region.slug}`);

  const allRoutes = [...staticRoutes, ...countryDestinationRoutes, ...esimCountryRoutes, ...esimRegionRoutes];

  return allRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/wizard" || route === "/destinations" ? 0.9 : 0.7,
  }));
}
