"use client";

import type { Region } from "@/lib/types/plans";

type RegionTabsProps = {
  regions: Region[];
  value: string;
  onChange: (slug: string) => void;
};

export const RegionTabs = ({ regions, value, onChange }: RegionTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          value === "all"
            ? "bg-brand-navy text-white"
            : "border border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-paper"
        }`}
      >
        All
      </button>
      {regions.map((region) => (
        <button
          key={region.slug}
          onClick={() => onChange(region.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            value === region.slug
              ? "bg-brand-navy text-white"
              : "border border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-paper"
          }`}
        >
          {region.name}
        </button>
      ))}
    </div>
  );
};
