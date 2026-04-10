type SEOContentProps = {
  countryName: string;
};

export const SEOContent = ({ countryName }: SEOContentProps) => {
  return (
    <section className="grid gap-6 rounded-2xl border border-brand-navy/10 bg-white p-6 md:grid-cols-2">
      <article>
        <h2 className="text-xl font-bold text-brand-navy">About eSIMs in {countryName}</h2>
        <p className="mt-3 text-sm leading-6 text-brand-navy/75">
          eSIM coverage in {countryName} has improved quickly in major cities and transport
          corridors. Most travelers can activate data in minutes without swapping physical SIM cards.
        </p>
        <p className="mt-3 text-sm leading-6 text-brand-navy/75">
          Comparing plans by validity period, included data, and provider network quality helps avoid
          overpaying for short trips.
        </p>
        <p className="mt-3 text-sm leading-6 text-brand-navy/75">
          eSIMSeeker updates this page daily with pricing snapshots and recommends plans that balance
          speed, budget, and reliability.
        </p>
      </article>
      <article>
        <h2 className="text-xl font-bold text-brand-navy">
          How to activate your eSIM in {countryName}
        </h2>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-brand-navy/75">
          <li>1. Choose a plan matching your trip length and expected data use.</li>
          <li>2. Purchase through the provider and copy the activation details.</li>
          <li>3. Open your device mobile settings and add an eSIM profile.</li>
          <li>4. Set the eSIM as the data line and enable data roaming if required.</li>
          <li>5. Test connection speed before leaving the airport or station.</li>
        </ol>
      </article>
    </section>
  );
};
