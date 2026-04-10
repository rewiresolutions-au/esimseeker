"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const quickDestinations = ["Japan", "Thailand", "Europe"];

export const Hero = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  const goToWizard = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    router.push(`/wizard?destination=${encodeURIComponent(normalized)}`);
  };

  return (
    <section className="rounded-2xl bg-brand-navy px-6 py-10 text-brand-paper md:px-10 md:py-14">
      <p className="text-sm font-semibold text-brand-teal">AI-powered eSIM comparison</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
        Find the Perfect eSIM in 30 Seconds.
      </h1>
      <p className="mt-4 max-w-2xl text-brand-slate">
        Tell us where you are going and we will match plans from Airalo, Holafly, Nomad and
        more in one guided flow.
      </p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <input
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") goToWizard(destination);
          }}
          placeholder="Where are you traveling?"
          className="h-12 flex-1 rounded-lg border border-white/15 bg-white/10 px-4 text-white placeholder:text-brand-slate/70 outline-none ring-brand-teal focus:ring-2"
        />
        <button
          onClick={() => goToWizard(destination)}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-red px-6 text-sm font-semibold text-white transition hover:bg-brand-red/90"
        >
          Find My eSIM
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {quickDestinations.map((item) => (
          <button
            key={item}
            onClick={() => goToWizard(item)}
            className="rounded-full border border-white/20 px-3 py-1 text-sm text-brand-paper hover:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};
