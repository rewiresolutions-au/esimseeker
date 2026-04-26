"use client";

import { useMemo, useState } from "react";
import type { Plan } from "@/lib/types/plans";

type PlanTableProps = {
  plans: Plan[];
};

type SortKey = "provider" | "dataGb" | "durationDays" | "priceUsd" | "networkType" | "rating";
type SortDir = "asc" | "desc";

const sortLabel = (key: SortKey, dir: SortDir): string => {
  const arrow = dir === "asc" ? "↑" : "↓";
  return `${arrow}`;
};

const compare = (a: Plan, b: Plan, key: SortKey, dir: SortDir): number => {
  const mul = dir === "asc" ? 1 : -1;
  const va = a[key];
  const vb = b[key];
  if (typeof va === "number" && typeof vb === "number") {
    return (va - vb) * mul;
  }
  return String(va).localeCompare(String(vb), undefined, { sensitivity: "base" }) * mul;
};

export const PlanTable = ({ plans }: PlanTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("priceUsd");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () => [...plans].sort((a, b) => compare(a, b, sortKey, sortDir)),
    [plans, sortKey, sortDir],
  );

  const cheapestId = useMemo(() => {
    if (plans.length === 0) return null;
    return [...plans].reduce((best, p) => (p.priceUsd < best.priceUsd ? p : best), plans[0]).id;
  }, [plans]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const headerButton = (key: SortKey, label: string) => {
    const active = sortKey === key;
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className="inline-flex items-center gap-1 font-semibold text-brand-navy hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
        aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      >
        {label}
        {active ? <span className="text-xs text-brand-teal">{sortLabel(key, sortDir)}</span> : null}
      </button>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-brand-navy/20 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <caption className="sr-only">eSIM plans comparison; column headers sort the table.</caption>
          <thead className="bg-brand-gray-light text-left text-brand-navy/90">
            <tr>
              <th className="px-4 py-3" scope="col">
                {headerButton("provider", "Provider")}
              </th>
              <th className="px-4 py-3" scope="col">
                {headerButton("dataGb", "Data")}
              </th>
              <th className="px-4 py-3" scope="col">
                {headerButton("durationDays", "Duration")}
              </th>
              <th className="px-4 py-3" scope="col">
                {headerButton("priceUsd", "Price")}
              </th>
              <th className="px-4 py-3" scope="col">
                {headerButton("networkType", "Network")}
              </th>
              <th className="px-4 py-3" scope="col">
                {headerButton("rating", "Rating")}
              </th>
              <th className="px-4 py-3 font-semibold text-brand-navy/80" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((plan) => (
              <tr key={plan.id} data-plan-row className="border-t border-brand-navy/10">
                <td className="px-4 py-3 font-semibold text-brand-navy">
                  {plan.provider}{" "}
                  {plan.id === cheapestId ? (
                    <span className="ml-2 rounded-full bg-brand-navy px-2 py-0.5 text-xs text-white">
                      Best value
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-brand-navy/80">
                  {plan.dataGb >= 999 ? "Unlimited" : `${plan.dataGb} GB`}
                </td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.durationDays} days</td>
                <td className="px-4 py-3 font-semibold text-brand-navy">${plan.priceUsd}</td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.networkType}</td>
                <td className="px-4 py-3 text-brand-navy/80">{plan.rating}</td>
                <td className="px-4 py-3">
                  <a
                    href={plan.buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-red/90"
                  >
                    View plan
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {plans.length > 0 ? (
        <p className="border-t border-brand-navy/10 px-4 py-3 text-center text-xs text-brand-navy/60">
          Showing {plans.length} plan{plans.length === 1 ? "" : "s"}. Use filters above to narrow results.
        </p>
      ) : null}
    </div>
  );
};
