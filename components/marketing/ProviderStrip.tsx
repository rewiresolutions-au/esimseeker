import { AiraloMark, EsimGoMark, HolaflyMark, NomadMark } from "@/components/marketing/ProviderLogoMarks";

const rows = [
  { Mark: AiraloMark, key: "airalo" },
  { Mark: HolaflyMark, key: "holafly" },
  { Mark: NomadMark, key: "nomad" },
  { Mark: EsimGoMark, key: "esimgo" },
] as const;

export const ProviderStrip = () => {
  return (
    <div className="mt-8">
      <p className="text-center text-sm font-medium text-brand-navy/65">Comparing plans from</p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
        {rows.map(({ Mark, key }) => (
          <li key={key}>
            <Mark className="h-6 w-auto text-brand-navy opacity-55 grayscale transition duration-200 hover:opacity-90 hover:grayscale-0 md:h-7" />
          </li>
        ))}
      </ul>
    </div>
  );
};
