import Link from "next/link";

export const TrustBar = () => {
  return (
    <div className="border-t border-brand-navy/10 bg-white py-3">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-2 px-4 text-xs text-brand-navy/70">
        <span>Some links are affiliate links. This does not affect your price.</span>
        <Link href="/affiliate-disclosure" className="font-semibold text-brand-teal hover:underline">
          Learn more
        </Link>
      </div>
    </div>
  );
};
