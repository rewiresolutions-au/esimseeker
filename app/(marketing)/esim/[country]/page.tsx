import { permanentRedirect } from "next/navigation";

type LegacyEsimCountryProps = {
  params: Promise<{ country: string }>;
};

/** Legacy URLs: /esim/[country] → canonical /destinations/[country] (Phase 3 pSEO). */
export default async function LegacyEsimCountryRedirect({ params }: LegacyEsimCountryProps) {
  const { country } = await params;
  permanentRedirect(`/destinations/${country}`);
}
