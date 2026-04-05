import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryBySlug, getTopCountrySlugs } from "@/lib/marketing/countries";
import {
  ACTIVITY_LABELS,
  ACTIVITY_SLUGS,
  DURATION_LABELS,
  DURATION_SLUGS,
} from "@/lib/marketing/pseo-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getTopCountrySlugs(55).map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) {
    return { title: "Destination" };
  }
  const title = `eSIM for ${c.name}`;
  const description = `Compare prepaid eSIM data plans for ${c.name}. See typical use cases and trip lengths, then open the wizard for a shortlist.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/esim/${c.slug}` },
  };
}

export default async function CountryEsimPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const c = getCountryBySlug(slug);
  if (!c) notFound();

  return (
    <article>
      <nav className="mb-6 text-sm text-foreground/70">
        <Link href="/" className="hover:text-brand-teal">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">eSIM</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-foreground">{c.name}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        eSIM data plans for {c.name}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/85">
        Prepaid eSIMs let you land with mobile data without hunting for a local
        SIM. Use our wizard to match plans to your device, trip length, and how
        much data you need—or narrow by scenario below.
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-bold tracking-tight text-brand-navy">
            By trip type
          </h2>
          <ul className="mt-3 space-y-2">
            {ACTIVITY_SLUGS.map((activity) => (
              <li key={activity}>
                <Link
                  href={`/esim/${c.slug}/activity/${activity}`}
                  className="text-brand-teal hover:underline"
                >
                  {ACTIVITY_LABELS[activity]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold tracking-tight text-brand-navy">
            By stay length
          </h2>
          <ul className="mt-3 space-y-2">
            {DURATION_SLUGS.map((duration) => (
              <li key={duration}>
                <Link
                  href={`/esim/${c.slug}/duration/${duration}`}
                  className="text-brand-teal hover:underline"
                >
                  {DURATION_LABELS[duration]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-10">
        <Link
          href="/wizard"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-red px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Get a tailored plan list
        </Link>
      </p>
    </article>
  );
}
