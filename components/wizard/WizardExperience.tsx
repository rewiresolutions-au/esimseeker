"use client";

import { useState } from "react";
import { ChatPanel } from "@/components/wizard/ChatPanel";
import { ResultsPanel } from "@/components/wizard/ResultsPanel";
import type { Plan } from "@/lib/types/plans";

type WizardExperienceProps = {
  destination?: string;
};

export const WizardExperience = ({ destination }: WizardExperienceProps) => {
  const [results, setResults] = useState<Plan[]>([]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="space-y-3">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl lg:text-[2.5rem] lg:leading-tight">
          Your AI travel connectivity guide
        </h2>
        <p className="max-w-2xl text-sm text-brand-navy/70">
          The assistant speaks from the left; your messages sit on the right. When we have your trip details, plan cards
          appear right under the assistant reply.
        </p>
        <ChatPanel initialDestination={destination} onResultsChange={setResults} />
      </div>
      <div className="hidden lg:block">
        <ResultsPanel plans={results} />
      </div>
    </div>
  );
};
