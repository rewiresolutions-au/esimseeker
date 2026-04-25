import Link from "next/link";
import { buildAffiliateUrl } from "@/lib/affiliate";

const AIRALO_HOME = "https://www.airalo.com/";

/**
 * Static partner strip: Airalo promo + affiliate link.
 * Set NEXT_PUBLIC_AIRALO_PROMO_CODE in env to show a code (e.g. partner-supplied).
 */
export const AiraloPartnerBanner = ({ className = "" }: { className?: string }) => {
  const promo = process.env.NEXT_PUBLIC_AIRALO_PROMO_CODE?.trim();
  const href = buildAffiliateUrl(AIRALO_HOME, "Airalo");

  return (
    <section
      className={`rounded-2xl border border-brand-navy/10 bg-gradient-to-br from-white to-brand-gray-light p-5 shadow-sm md:p-6 ${className}`}
      aria-labelledby="partner-offer-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">Partner offer</p>
      <h2 id="partner-offer-heading" className="font-heading mt-2 text-xl font-semibold text-brand-navy md:text-2xl">
        Save on Airalo eSIMs
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-brand-navy/75">
        Airalo runs frequent promos on regional and global plans. Use our link so your price stays the same and we earn
        a small commission that keeps eSIMSeeker free.
        {promo ? (
          <>
            {" "}
            If you have a code from Airalo, enter <span className="font-mono font-semibold text-brand-navy">{promo}</span>{" "}
            at checkout when applicable.
          </>
        ) : null}
      </p>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-11 items-center rounded-lg bg-brand-red px-5 text-sm font-semibold text-white transition hover:bg-brand-red/90"
      >
        Shop Airalo deals
      </Link>
    </section>
  );
};
