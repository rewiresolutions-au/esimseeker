"use client";

type FilterBarProps = {
  duration?: string;
  data?: string;
  provider?: string;
  sort?: string;
  providers: string[];
  onChange: (filters: {
    duration?: string;
    data?: string;
    provider?: string;
    sort?: string;
  }) => void;
};

export const FilterBar = ({
  duration,
  data,
  provider,
  sort,
  providers,
  onChange,
}: FilterBarProps) => {
  return (
    <div className="grid gap-3 rounded-xl border border-brand-navy/10 bg-white p-4 md:grid-cols-5">
      <select
        value={duration ?? ""}
        onChange={(event) => onChange({ duration: event.target.value || undefined })}
        className="rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">Duration</option>
        <option value="7">7 days</option>
        <option value="10">10 days</option>
        <option value="14">14 days</option>
        <option value="30">30 days</option>
      </select>
      <select
        value={data ?? ""}
        onChange={(event) => onChange({ data: event.target.value || undefined })}
        className="rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">Data</option>
        <option value="3">3GB+</option>
        <option value="5">5GB+</option>
        <option value="10">10GB+</option>
        <option value="20">20GB+</option>
      </select>
      <select
        value={provider ?? ""}
        onChange={(event) => onChange({ provider: event.target.value || undefined })}
        className="rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">Provider</option>
        {providers.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={sort ?? "price-asc"}
        onChange={(event) => onChange({ sort: event.target.value })}
        className="rounded-lg border border-brand-navy/15 bg-white px-3 py-2 text-sm"
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Highest Rated</option>
      </select>
      <button
        onClick={() => onChange({ duration: undefined, data: undefined, provider: undefined, sort: "price-asc" })}
        className="rounded-lg border border-brand-navy/15 bg-brand-paper px-3 py-2 text-sm font-medium text-brand-navy"
      >
        Reset Filters
      </button>
    </div>
  );
};
