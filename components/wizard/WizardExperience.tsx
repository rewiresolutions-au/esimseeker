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
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <ChatPanel initialDestination={destination} onResultsChange={setResults} />
      <div className="hidden lg:block">
        <ResultsPanel plans={results} />
      </div>
    </div>
  );
};
