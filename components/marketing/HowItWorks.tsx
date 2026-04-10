const steps = [
  { title: "Chat", description: "Tell the AI where and when you are traveling." },
  { title: "Compare", description: "See side-by-side top matches from trusted providers." },
  { title: "Connect", description: "Open affiliate checkout and activate in minutes." },
];

export const HowItWorks = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">How It Works</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-xl border border-brand-navy/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
              Step {index + 1}
            </p>
            <h3 className="mt-1 text-lg font-bold text-brand-navy">{step.title}</h3>
            <p className="mt-2 text-sm text-brand-navy/75">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
