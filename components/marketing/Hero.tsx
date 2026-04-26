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
    <section className="rounded-2xl border border-brand-navy/10 bg-white px-6 py-10 text-center md:px-10 md:py-14">
      <p className="text-sm font-semibold text-brand-teal">AI-powered eSIM comparison</p>
      <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-bold tracking-tight text-brand-navy md:text-6xl">
        Find the Perfect eSIM in 30 Seconds.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-brand-navy/70">
        Tell us where you are going and we will match plans from Airalo, Holafly, Nomad and
        more in one guided flow.
      </p>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 md:flex-row">
        <input
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") goToWizard(destination);
          }}
          placeholder="Where are you flying to?"
          className="h-12 flex-1 rounded-full border border-brand-red/60 bg-white px-5 text-brand-navy placeholder:text-brand-navy/45 outline-none ring-brand-teal focus:ring-2"
        />
        <button
          onClick={() => goToWizard(destination)}
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-red px-6 text-sm font-semibold text-white transition hover:bg-brand-red/90"
        >
          ➤
        </button>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {quickDestinations.map((item) => (
          <button
            key={item}
            onClick={() => goToWizard(item)}
            className="rounded-full border border-brand-red/40 bg-white px-3 py-1 text-sm text-brand-navy hover:bg-brand-paper"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};
