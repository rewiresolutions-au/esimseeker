const providers = ["Airalo", "Holafly", "Nomad", "eSIM Go", "Maya Mobile"];

export const ProviderStrip = () => {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-brand-slate">
      <span className="text-brand-slate/80">Compare providers:</span>
      {providers.map((provider) => (
        <span key={provider} className="rounded-full border border-white/20 px-3 py-1">
          {provider}
        </span>
      ))}
    </div>
  );
};
