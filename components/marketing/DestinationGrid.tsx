import { COUNTRIES } from "@/lib/data/countries";
import { CountryGrid } from "@/components/destinations/CountryGrid";

export const DestinationGrid = () => {
  const featured = COUNTRIES.slice(0, 6);
  return (
    <section>
      <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">Popular Destinations</h2>
      <p className="mt-2 text-brand-navy/70">Compare ready-to-buy options in seconds.</p>
      <div className="mt-5">
        <CountryGrid countries={featured} />
      </div>
    </section>
  );
};
