import { CreditCard, ListFilter, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Chat",
    description: "Tell the AI where and when you are traveling.",
    Icon: MessageSquare,
  },
  {
    title: "Compare",
    description: "See side-by-side top matches from trusted providers.",
    Icon: ListFilter,
  },
  {
    title: "Connect",
    description: "Open affiliate checkout and activate in minutes.",
    Icon: CreditCard,
  },
] as const;

export const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <h2 className="font-heading text-2xl font-semibold text-brand-navy md:text-3xl">How it works</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-xl border border-brand-navy/10 bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-teal/15 text-brand-teal ring-1 ring-brand-teal/25">
              <step.Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-navy/45">Step {index + 1}</p>
            <h3 className="mt-1 text-xl font-bold text-brand-navy">{step.title}</h3>
            <p className="mt-2 text-sm text-brand-navy/75">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
