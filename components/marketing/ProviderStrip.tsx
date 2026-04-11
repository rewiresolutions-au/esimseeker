const providers = ["Airalo", "Holafly", "Nomad", "eSIM Go", "Maya Mobile"];

export const ProviderStrip = () => {
  return (
    <div className="mt-6">
      <p className="text-center text-sm font-medium text-brand-slate/90">Comparing plans from:</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {providers.slice(0, 4).map((provider) => (
          <span
            key={provider}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-center text-sm font-semibold text-brand-slate"
          >
            {provider}
          </span>
        ))}
      </div>
    </div>
  );
};
